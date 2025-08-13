const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// ============================================
// MIDDLEWARES GLOBAIS
// ============================================

// Segurança
app.use(helmet());

// CORS - Configuração para produção
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://loja-utilidades.vercel.app',
    'https://frontend-dun-omega-57.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // Permitir requests sem origin (como mobile apps ou curl)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // Em desenvolvimento, aceitar todas as origens
            if (process.env.NODE_ENV === 'development') {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    },
    credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por IP
    message: 'Muitas requisições, tente novamente em 15 minutos'
});
app.use('/api/', limiter);

// Parsing
app.use(express.json({ limit: '10mb'}));
app.use(express.urlencoded({ extended: true, limit: '10mb'}));

// ============================================
// IMPORTAR ROTAS
// ============================================
const authRoutes = require('./routes/auth');
const produtoRoutes = require('./routes/product');
const usuarioRoutes = require('./routes/usuarios');
const pedidoRoutes = require('./routes/pedidos');
const statsRoutes = require('./routes/stats');

// ============================================
// USAR ROTAS
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/stats', statsRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'API da Loja de Utilidades Funcionando !!!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: '2.0.0'
    });
});

// ============================================
// MIDDLEWARE DE ERRO GLOBAL
// ============================================

app.use((err, req, res, next) => {
    console.error('Erro:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
});

// Rota não encontrada
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
    });
});

// ============================================
// INICIAR SERVIDOR
// ============================================
const PORT = process.env.PORT || 5000;

// Iniciar servidor sempre (para Railway)
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 URL: http://localhost:${PORT}/api/health`);
});

// Exportar para deploy (Railway/Render)
module.exports = app;