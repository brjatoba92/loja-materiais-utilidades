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

// CORS
app.use(cors({
    origin: true, // Aceitar todas as origens temporariamente
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
        timestamp: new Date().toISOString()
    });
});


// ============================================
// MIDDLEWARE DE ERRO GLOBAL
// ============================================

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
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

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 URL: http://localhost:${PORT}/api/health`);
})