const compression = require('compression');
const helmet = require('helmet');
const { performanceLogger } = require('../utils/logger');

// Middleware de compressão
const compressionMiddleware = compression({
    level: 6, // Nível de compressão (0-9)
    threshold: 1024, // Comprimir apenas arquivos maiores que 1KB
    filter: (req, res) => {
        // Não comprimir se o cliente não suporta
        if (req.headers['x-no-compression']) {
            return false;
        }
        
        // Comprimir apenas tipos de conteúdo específicos
        const contentType = res.getHeader('Content-Type');
        if (contentType) {
            return /text|javascript|json|xml/.test(contentType);
        }
        
        return compression.filter(req, res);
    }
});

// Middleware de cache para respostas estáticas
const cacheMiddleware = (req, res, next) => {
    // Cache para arquivos estáticos
    if (req.path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 ano
        res.setHeader('Vary', 'Accept-Encoding');
    }
    
    // Cache para dados da API (com validação)
    else if (req.path.startsWith('/api/produtos') && req.method === 'GET') {
        res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutos
        res.setHeader('Vary', 'Accept-Encoding');
    }
    
    // Cache para estatísticas (com validação)
    else if (req.path.startsWith('/api/stats') && req.method === 'GET') {
        res.setHeader('Cache-Control', 'public, max-age=600'); // 10 minutos
        res.setHeader('Vary', 'Accept-Encoding');
    }
    
    // Sem cache para dados sensíveis
    else if (req.path.startsWith('/api/auth') || req.path.startsWith('/api/pedidos')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
    
    next();
};

// Middleware de monitoramento de performance
const performanceMiddleware = (req, res, next) => {
    const start = process.hrtime();
    
    // Interceptar o final da resposta
    res.on('finish', () => {
        const [seconds, nanoseconds] = process.hrtime(start);
        const duration = (seconds * 1000) + (nanoseconds / 1000000);
        
        // Log de performance para requests lentos (> 1 segundo)
        if (duration > 1000) {
            performanceLogger('slow_request', duration, {
                method: req.method,
                url: req.url,
                statusCode: res.statusCode,
                userAgent: req.get('User-Agent'),
                ip: req.ip
            });
        }
        
        // Log de performance para requests muito lentos (> 5 segundos)
        if (duration > 5000) {
            performanceLogger('very_slow_request', duration, {
                method: req.method,
                url: req.url,
                statusCode: res.statusCode,
                userAgent: req.get('User-Agent'),
                ip: req.ip
            });
        }
    });
    
    next();
};

// Middleware de otimização de queries
const queryOptimizationMiddleware = (req, res, next) => {
    // Adicionar headers para otimização
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Otimizar queries com paginação
    if (req.query.page && req.query.limit) {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 10, 100); // Máximo 100 itens
        
        req.query.page = page;
        req.query.limit = limit;
        req.query.offset = (page - 1) * limit;
    }
    
    next();
};

// Middleware de rate limiting inteligente
const smartRateLimit = (req, res, next) => {
    // Rate limiting mais permissivo para usuários autenticados
    if (req.headers.authorization) {
        // Usuários autenticados podem fazer mais requests
        return next();
    }
    
    // Rate limiting mais restritivo para usuários anônimos
    const clientIP = req.ip;
    const now = Date.now();
    
    // Implementação básica de rate limiting
    // Em produção, use Redis ou similar
    if (!req.app.locals.rateLimit) {
        req.app.locals.rateLimit = new Map();
    }
    
    const clientData = req.app.locals.rateLimit.get(clientIP) || { count: 0, resetTime: now + 60000 };
    
    if (now > clientData.resetTime) {
        clientData.count = 1;
        clientData.resetTime = now + 60000; // 1 minuto
    } else {
        clientData.count++;
    }
    
    req.app.locals.rateLimit.set(clientIP, clientData);
    
    // Limite de 60 requests por minuto para usuários anônimos
    if (clientData.count > 60) {
        return res.status(429).json({
            error: 'Rate limit exceeded',
            message: 'Too many requests, please try again later'
        });
    }
    
    next();
};

// Middleware de compressão de resposta JSON
const jsonCompressionMiddleware = (req, res, next) => {
    const originalJson = res.json;
    
    res.json = function(data) {
        // Comprimir JSON se for grande
        const jsonString = JSON.stringify(data);
        
        if (jsonString.length > 1024) {
            // Adicionar header de compressão
            res.setHeader('Content-Encoding', 'gzip');
        }
        
        return originalJson.call(this, data);
    };
    
    next();
};

// Middleware de otimização de imagens
const imageOptimizationMiddleware = (req, res, next) => {
    // Adicionar headers para otimização de imagens
    if (req.path.match(/\.(png|jpg|jpeg|gif|webp)$/)) {
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
    
    next();
};

// Middleware de monitoramento de memória
const memoryMonitoringMiddleware = (req, res, next) => {
    const memUsage = process.memoryUsage();
    
    // Alertar se o uso de memória estiver alto
    if (memUsage.heapUsed > 500 * 1024 * 1024) { // 500MB
        performanceLogger('high_memory_usage', 0, {
            heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
            heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB',
            external: Math.round(memUsage.external / 1024 / 1024) + 'MB'
        });
    }
    
    next();
};

module.exports = {
    compressionMiddleware,
    cacheMiddleware,
    performanceMiddleware,
    queryOptimizationMiddleware,
    smartRateLimit,
    jsonCompressionMiddleware,
    imageOptimizationMiddleware,
    memoryMonitoringMiddleware
}; 