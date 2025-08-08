const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Estatísticas do dashboard admin
router.get('/dashboard', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    // Filtros de período para pedidos
    const dateFilter = startDate && endDate ? ' AND created_at BETWEEN $1 AND $2' : '';
    const dateParams = startDate && endDate ? [startDate, endDate] : [];

    const queries = [];
    // Produtos ativos (não depende de período)
    queries.push(pool.query('SELECT COUNT(*)::INT AS total FROM produtos WHERE ativo = true'));
    // Clientes no período: distintos com pedido no período. Se sem período, retorna total de usuários.
    if (startDate && endDate) {
      queries.push(
        pool.query(
          `SELECT COUNT(DISTINCT usuario_id)::INT AS total FROM pedidos WHERE status != 'cancelado'${dateFilter}`,
          dateParams
        )
      );
      queries.push(
        pool.query(
          `SELECT COALESCE(SUM(total), 0)::DECIMAL AS total FROM pedidos WHERE status != 'cancelado'${dateFilter}`,
          dateParams
        )
      );
      queries.push(
        pool.query(
          `SELECT COUNT(*)::INT AS total FROM pedidos WHERE status != 'cancelado'${dateFilter}`,
          dateParams
        )
      );
    } else {
      // Clientes: considerar apenas clientes que fizeram pedidos (consistência com pedidos/receita)
      queries.push(pool.query("SELECT COUNT(DISTINCT usuario_id)::INT AS total FROM pedidos WHERE status != 'cancelado'"));
      queries.push(pool.query("SELECT COALESCE(SUM(total), 0)::DECIMAL AS total FROM pedidos WHERE status != 'cancelado'"));
      queries.push(pool.query("SELECT COUNT(*)::INT AS total FROM pedidos WHERE status != 'cancelado'"));
    }

    const [produtosCount, clientesCount, receitaSum, pedidosCount] = await Promise.all(queries);

    res.json({
      success: true,
      data: {
        totalProducts: produtosCount.rows[0].total,
        totalCustomers: clientesCount.rows[0].total,
        totalRevenue: receitaSum.rows[0].total,
        totalOrders: pedidosCount.rows[0].total,
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

module.exports = router;

// Receita mensal (últimos 12 meses)
router.get('/revenue-monthly', async (req, res) => {
  try {
    const query = `
      SELECT 
        to_char(date_trunc('month', created_at), 'Mon') AS month_label,
        date_trunc('month', created_at) AS month_key,
        COALESCE(SUM(total), 0)::DECIMAL AS revenue
      FROM pedidos
      WHERE status != 'cancelado'
        AND created_at >= (NOW() - INTERVAL '12 months')
      GROUP BY 1, 2
      ORDER BY month_key
    `;
    const result = await pool.query(query);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Erro ao buscar receita mensal', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});


