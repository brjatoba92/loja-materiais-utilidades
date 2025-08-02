const express = require('express');
const pool = require('../config/database');
const { body, validationResult } = require('express-validator');
const { Client } = require('pg');

const router = express.Router();

// CRIAR PEDIDO (cHECKOUT)
router.post('/', [
    body('usuario_id').isInt().withMessage('ID de usuário inválido'),
    body('itens').isArray({ min: 1 }).withMessage('Pelo menos um item é obrigatorio'),
    body('itens.*.produto_id').isInt().withMessage('ID de produto inválido'),
    body('itens.*.quantidade').isInt({ min: 1 }).withMessage('Quantidade deve ser maior que 0'),
    body('pontos_utilizados').optional().isInt({ min: 0 }).withMessage('Pontos utilizados inválidos')   
], async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Dados inválidos', 
                errors: errors.array() 
            });
        }
        const { usuario_id, itens, pontos_utilizados = 0} = req.body;

        // Verificar se usuario existe e tem pontos suficinetes
        const usuarioQuery = 'SELECT pontos_cashback FROM usuarios WHERE id = $1';
        const usuarioResult = await client.query(usuarioQuery, [usuario_id]);

        if (usuarioResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ 
                success: false, 
                message: 'Usuário nao encontrado' 
            });
        }

        const pontosDisponiveis = usuarioResult.rows[0].pontos_cashback;

        if (pontos_utilizados > pontosDisponiveis) {
            await client.query('ROLLBACK');
            return res.status(400).json({ 
                success: false, 
                message: 'Pontos insuficientes' 
            });
        }

        // Calcular total e verificar estoque
        let totalPedido = 0;
        const itensValidados = [];

        for (const item of itens) {
            const produtoQuery = 'SELECT * FROM produtos WHERE id = $1 AND ativo = true';
            const produtoResult = await client.query(produtoQuery, [item.produto_id]);

            if (produtoResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ 
                    success: false, 
                    message: `Produto com ID ${item.produto_id} não encontrado ou inativo`
                });
            }

            const produto = produtoResult.rows[0];

            if (produto.estoque < item.quantidade) {
                await client.query('ROLLBACK');
                return res.status(400).json({ 
                    success: false, 
                    message: `Estoque insuficiente para o produto ${produto.nome}` 
                });
            }

            const subtotal = produto.preco * item.quantidade;
            totalPedido += subtotal;

            itensValidados.push({
                produto_id: item.produto_id,
                quantidade: item.quantidade,
                preco_unitario: produto.preco,
                subtotal: subtotal
            });
        }

        // Aplicar desconto de pontos
        const descontoPontos = pontos_utilizados * 1.00;
        const totalFinal = Math.max(0, totalPedido - descontoPontos);

        // Calcular pontos gerados (a cada R$ 50 = 1 ponto)

        const pontosGerados = Math.floor(totalFinal / 50);

        // Criar pedido
        const pedidoQuery = `
            INSERT INTO pedidos (usuario_id, total, pontos_utilizados, pontos_gerados, status)
            VALUES ($1, $2, $3, $4, 'confirmado')
            RETURNING *
        `;
        const pedidoResult = await client.query(pedidoQuery, [
            usuario_id, totalFinal, pontos_utilizados, pontosGerados
        ]);

        const pedido = pedidoResult.rows[0];

        // Criar itens do pedido e atualizar estoque

        for (const item of  itensValidados) {
            // Inserir item no pedido
            const itemQuery = `
                INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario, subtotal)
                VALUES ($1, $2, $3, $4, $5)
            `;
            await client.query(itemQuery, [
                pedido.id, 
                item.produto_id, 
                item.quantidade, 
                item.preco_unitario,
                item.subtotal
            ]);

            // Atualizar estoque
            const estoqueQuery = 'UPDATE produtos SET estoque = estoque - $1 WHERE id = $2';
            await client.query(estoqueQuery, [item.quantidade, item.produto_id]);
        }

        // Atualizar pontos do usuário
        const novosPontos = pontosDisponiveis - pontos_utilizados + pontosGerados;
        const pontosQuery = 'UPDATE usuarios SET pontos_cashback = $1 WHERE id = $2';
        await client.query(pontosQuery, [novosPontos, usuario_id]);

        await client.query('COMMIT');
        
        res.status(201).json({
            success: true,
            message: 'Pedido criado com sucesso',
            pedido: {
                ...pedido,
                pontos_gerados: pontosGerados,
                desconto_aplicado: descontoPontos,
                total_original: totalPedido,
                novos_pontos_usuario: novosPontos,
            }
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao criar pedido:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    } finally {
        client.release();
    }
});

// BUSCAR PEDIDO POR ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT p.*, u.nome AS usuario_nome, u.email AS usuario_email,
                   json_agg(
                     json_build_object(
                       'id', ip.id,
                       'produto_id', ip.produto_id,
                       'produto_nome', pr.nome,
                       'quantidade', ip.quantidade,
                       'preco_unitario', ip.preco_unitario,
                       'subtotal', ip.subtotal
                     )
                   ) as itens
            FROM pedidos p
            LEFT JOIN itens_pedido ip ON p.id = ip.pedido_id
            LEFT JOIN produtos pr ON ip.produto_id = pr.id
            LEFT JOIN usuarios u ON p.usuario_id = u.id
            WHERE p.id = $1
            GROUP BY p.id, u.nome, u.email
            `;
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Pedido nao encontrado' 
            });
        }
        res.json({ 
            success: true, 
            pedido: result.rows[0] 
        });
    } catch (error) {
        console.error('Erro ao buscar pedido', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor' 
        });
    }
});

// LISTAR TODOS OS PEDIDOS (apenas admin)
router.get('/', async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        let query = `
            SELECT p.*, u.nome as usuario_nome, u.email as usuario_email
            FROM pedidos p
            LEFT JOIN usuarios u ON p.usuario_id = u.id
        `;

        let params = [];
        let paramCount = 0;

        if (status) {
            paramCount++;
            query += ` WHERE p.status = $${paramCount}`;
            params.push(status);
        }

        query += ` ORDER BY p.created_at DESC`;

        const offset = (page - 1) * limit;
        query += ` LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);

        // Contar total
        const countQuery = 'SELECT COUNT(*) FROM pedidos';
        const countParams = [];
        if (status) {
            countQuery += ' WHERE p.status = $1';
            countParams.push(status);
        }
        const countResult = await pool.query(countQuery, countParams);
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
        console.error('Erro ao listar pedidos', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor' 
        });
    }
});

module.exports = router;