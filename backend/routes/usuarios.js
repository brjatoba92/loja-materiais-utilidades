const express = require('express');
const pool = require('../config/database');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// LISTAR USUÁRIOS (ADMIN) com paginação e ordenação, incluindo pontos
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, busca = '' } = req.query;
    const sortParamRaw = String(req.query.sort || req.query.ordenar || 'pontos_desc').toLowerCase();

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    // Ordenação suportada
    let orderBy = 'pontos_cashback DESC, nome ASC';
    switch (sortParamRaw) {
      case 'nome_asc':
        orderBy = 'nome ASC';
        break;
      case 'nome_desc':
        orderBy = 'nome DESC';
        break;
      case 'pontos_asc':
        orderBy = 'pontos_cashback ASC, nome ASC';
        break;
      case 'pontos_desc':
      default:
        orderBy = 'pontos_cashback DESC, nome ASC';
    }

    const where = [];
    const params = [];
    if (busca) {
      params.push(`%${busca}%`);
      params.push(`%${busca}%`);
      where.push(`(nome ILIKE $${params.length - 1} OR email ILIKE $${params.length})`);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const query = `
      SELECT id, nome, email, telefone, pontos_cashback, created_at
      FROM usuarios
      ${whereSql}
      ORDER BY ${orderBy}
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    const usersRes = await pool.query(query, [...params, limitNum, offset]);

    const countRes = await pool.query(
      `SELECT COUNT(*)::INT AS total FROM usuarios ${whereSql}`,
      params
    );

    res.json({
      success: true,
      usuarios: usersRes.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: countRes.rows[0].total,
        pages: Math.ceil(countRes.rows[0].total / limitNum)
      }
    });
  } catch (error) {
    console.error('Erro ao listar usuários', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// CADASTRAR USUARIO
router.post('/', [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('telefone').optional().isMobilePhone('pt-BR').withMessage('Telefone inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Dados inválidos', 
        errors: errors.array() 
      });
    }

    const { nome, email, telefone } = req.body;

    // Verificar se email já existe
    const emailExists = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (emailExists.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email já cadastrado' 
      });
    }

    const query = `
      INSERT INTO usuarios (nome, email, telefone)
      VALUES ($1, $2, $3)
      RETURNING id, nome, email, telefone, pontos_cashback, created_at
    `;

    const result = await pool.query(query, [nome, email, telefone]);

    res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso',
      usuario: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// BUSCAR USUÁRIO POR ID

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'SELECT id, nome, email, telefone, pontos_cashback, created_at FROM usuarios WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuário nao encontrado' 
      });
    }
    res.json({ 
      success: true, 
      usuario: result.rows[0] 
    });
  } catch (error) {
    console.error('Erro ao buscar usuário', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// CONSULTAR PONTOS DO USUARIO
router.get('/:id/pontos', async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'SELECT pontos_cashback FROM usuarios WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuário nao encontrado' 
      });
    }
    res.json({ 
      success: true, 
      pontos: result.rows[0].pontos_cashback 
    });
  } catch (error) {
    console.error('Erro ao buscar pontos do usuário', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// HISTORICO DE PEDIDOS DO USUARIO
router.get('/:id/pedidos', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const query = `
      SELECT p.*, 
             json_agg(
               json_build_object(
                 'produto_nome', pr.nome,
                 'quantidade', ip.quantidade,
                 'preco_unitario', ip.preco_unitario,
                 'subtotal', ip.subtotal
               )
             ) as itens
      FROM pedidos p
      LEFT JOIN itens_pedido ip ON p.id = ip.pedido_id
      LEFT JOIN produtos pr ON ip.produto_id = pr.id
      WHERE p.usuario_id = $1
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [id, limit, offset]);

    // Contar total
    const countQuery = 'SELECT COUNT(*) FROM pedidos WHERE usuario_id = $1';
    const countResult = await pool.query(countQuery, [id]);
    const total = parseInt(countResult.rows[0].count);

    res.json({ 
      success: true,
      pedidos: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Erro ao buscar histórico de pedidos do usuário', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

module.exports = router;