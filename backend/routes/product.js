const express = require('express');
const pool = require('../config/database');
const { body, validationResult } = require('express-validator');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// ROTA DE TESTE - Verificar conexão com banco
router.get('/test', async (req, res) => {
    try {
        console.log('🔍 Testando conexão com banco...');
        
        // Testar conexão simples
        const client = await pool.connect();
        console.log('✅ Conexão estabelecida!');
        
        // Verificar se tabela produtos existe
        const tablesResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'produtos'
        `);
        
        const produtosExists = tablesResult.rows.length > 0;
        
        if (produtosExists) {
            console.log('✅ Tabela produtos encontrada!');
            
            // Contar produtos
            const countResult = await client.query('SELECT COUNT(*) FROM produtos');
            const total = countResult.rows[0].count;
            
            res.json({
                success: true,
                message: 'Conexão OK - Tabela produtos existe',
                total_produtos: total
            });
        } else {
            console.log('❌ Tabela produtos NÃO encontrada!');
            
            // Listar todas as tabelas
            const allTablesResult = await client.query(`
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            `);
            
            res.json({
                success: false,
                message: 'Tabela produtos não encontrada',
                tabelas_existentes: allTablesResult.rows.map(row => row.table_name)
            });
        }
        
        client.release();
        
    } catch (error) {
        console.error('❌ Erro ao testar banco:', error.message);
        res.status(500).json({
            success: false,
            message: 'Erro de conexão com banco',
            error: error.message
        });
    }
});

// LISTAR PRODUTOS (publico)
router.get('/', async (req, res) => {
    try {
        const { categoria, busca, page = 1, limit = 12 } = req.query;
        let query = 'SELECT * FROM produtos WHERE ativo = true';
        let params = [];
        let paramCount = 0;

        // Filtro por categoria
        if (categoria) {
            paramCount++;
            query += ` AND categoria ILIKE $${paramCount}`;
            params.push(`%${categoria}%`);
        }

        // BUSCA POR NOME/DESCRIÇÃO
        if (busca) {
            paramCount++;
            query += ` AND (nome ILIKE $${paramCount} OR descricao ILIKE $${paramCount})`;
            params.push(`%${busca}%`);
        }

        // Ordenação
        query += ' ORDER BY created_at DESC';

        // Paginação
        const offset = (page - 1) * limit;
        query += ` LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);

        // Contar total
        let countQuery = 'SELECT COUNT(*) FROM produtos WHERE ativo = true';
        let countParams = [];
        let countParamCount = 0;

        if (categoria) {
            countParamCount++;
            countQuery += ` AND categoria ILIKE $${countParamCount}`;
            countParams.push(`%${categoria}%`);
        }

        if (busca) {
            countParamCount++;
            countQuery += ` AND (nome ILIKE $${countParamCount} OR descricao ILIKE $${countParamCount})`;
            countParams.push(`%${busca}%`);
        }

        const countResult = await pool.query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].count);

        res.json({ 
            success: true,
            produtos: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
            }
        });

    } catch (error) {
        console.error('Erro ao listar produtos', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor'
        });
    }
});

// PRODUTOS COM BAIXO ESTOQUE (apenas admin)
router.get('/low-stock', authenticateToken, isAdmin, async (req, res) => {
  try {
    const threshold = Math.max(0, parseInt(req.query.threshold ?? '10', 10));
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit ?? '10', 10)));

    const query = `
      SELECT id, nome, estoque, categoria
      FROM produtos
      WHERE ativo = true AND estoque <= $1
      ORDER BY estoque ASC, nome ASC
      LIMIT $2
    `;
    const result = await pool.query(query, [threshold, limit]);
    res.json({ success: true, produtos: result.rows, threshold, count: result.rowCount });
  } catch (error) {
    console.error('Erro ao listar produtos com baixo estoque', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});


// BUSCAR PRODUTO POR ID (público)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = 'SELECT * FROM produtos WHERE id = $1 AND ativo = true';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Produto não encontrado' 
            });
        }
        res.json({ 
            success: true, 
            produto: result.rows[0] 
        });
    } catch (error) {
        console.error('Erro ao buscar produto', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor' 
        });
    }
});

// CRIAR PRODUTO (ADMIN)
router.post('/', [
  authenticateToken,
  isAdmin,
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('preco').isFloat({ gt: 0 }).withMessage('Preço deve ser maior que 0'),
  body('categoria').notEmpty().withMessage('Categoria é obrigatória'),
  body('estoque').isInt({ min: 0 }).withMessage('Estoque deve ser um número inteiro positivo')
], async (req, res) => {
  try {
    // Validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Dados inválidos', 
        errors: errors.array() 
      });
    }

    const { nome, descricao, preco, categoria, estoque, imagem_url } = req.body;

    const query = `
      INSERT INTO produtos (nome, descricao, preco, categoria, estoque, imagem_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const result = await pool.query(query, [
      nome, descricao, preco, categoria, estoque, imagem_url
    ]);

    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      produto: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// ATUALIZAR PRODUTO (apenas admin)
router.put('/:id', [
  authenticateToken,
  isAdmin,
  body('nome').optional().notEmpty().withMessage('Nome é obrigatório'),
  body('preco').optional().isFloat({ gt: 0 }).withMessage('Preço deve ser maior que 0'),
  body('estoque').optional().isInt({ min: 0 }).withMessage('Estoque deve ser um número inteiro positivo')
], async (req, res) => {
  try {
    // Validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Dados inválidos', 
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const { nome, descricao, preco, categoria, estoque, imagem_url, ativo } = req.body;

    const query = `
      UPDATE produtos
      SET nome = COALESCE($1, nome),
          descricao = COALESCE($2, descricao),
          preco = COALESCE($3, preco),
          categoria = COALESCE($4, categoria),
          estoque = COALESCE($5, estoque),
          imagem_url = COALESCE($6, imagem_url),
          ativo = COALESCE($7, ativo),
          updated_at = NOW()
      WHERE id = $8
      RETURNING *
    `;

    const result = await pool.query(query, [
      nome, descricao, preco, categoria, estoque, imagem_url, ativo, id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Produto nao encontrado' 
      });
    }

    res.json({
      success: true,
      message: 'Produto atualizado com sucesso',
      produto: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// DELETAR PRODUTO (apenas admin) - Soft delete
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const query = 'UPDATE produtos SET ativo = false WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Produto nao encontrado' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Produto deletado com sucesso' 
        });
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor' 
        });
    }
});

module.exports = router;

// LISTAR CATEGORIAS (distintas)
router.get('/categorias/distinct', async (req, res) => {
  try {
    const result = await pool.query("SELECT DISTINCT categoria FROM produtos WHERE categoria IS NOT NULL AND categoria <> '' ORDER BY categoria ASC");
    res.json({ success: true, categorias: result.rows.map(r => r.categoria) });
  } catch (error) {
    console.error('Erro ao listar categorias', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});