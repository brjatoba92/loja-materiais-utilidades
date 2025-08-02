const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// LOGIN ADMIN
router.post('/login', [
    body('usuario').notEmpty().withMessage('Campo obrigatório'),
    body('senha').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                message: errors.array()
            });
        }
        const {usuario, senha} = req.body;

        //BUSCAR ADMIN
        const query = 'SELECT * FROM admin WHERE usuario = $1';
        const result = await pool.query(query, [usuario]);

        if (result.rows.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Credenciais inválidas' 
            });
        }
        const admin = result.rows[0];

        //VERIFICAR SENHA
        const senhaValida = await bcrypt.compare(senha, admin.senha_hash);
        if (!senhaValida) {
            return res.status(401).json({ 
                success: false, 
                message: 'Credenciais inválidas' 
            });
        }

        // Gerar token jwt
        const token = jwt.sign(
            { 
                id: admin.id,
                usuario: admin.usuario,
                tipo: 'admin'
            }, 
            process.env.JWT_SECRET || 'secret_key', 
            { expiresIn: '1h' }
        );

        // Atualizar último acesso
        await pool.query(
            'UPDATE admin SET ultimo_acesso = NOW() WHERE id = $1',
            [admin.id]
        );

        res.json({ 
            success: true, 
            message: 'Autenticado com sucesso', 
            token,
            admin: {
                id: admin.id,
                usuario: admin.usuario,
                tipo: admin.tipo
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor' 
        });
    }
});

// VERIFICAR TOKEN
router.get('/verify', authenticateToken, (req, res) => {
    res.json({ 
        success: true, 
        message: 'Token válido', 
        user: req.user
    });
});

// LOGOUT
router.post('/logout', authenticateToken, (req, res) => {
    res.json({ 
        success: true, 
        message: 'Deslogado com sucesso' 
    });
});

module.exports = router;

