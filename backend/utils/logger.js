const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Criar diretório de logs se não existir
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Configuração de formatos
const logFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
        
        if (stack) {
            log += `\n${stack}`;
        }
        
        if (Object.keys(meta).length > 0) {
            log += `\n${JSON.stringify(meta, null, 2)}`;
        }
        
        return log;
    })
);

// Configuração de cores para console
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
        format: 'HH:mm:ss'
    }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        let log = `${timestamp} [${level}]: ${message}`;
        
        if (stack) {
            log += `\n${stack}`;
        }
        
        if (Object.keys(meta).length > 0) {
            log += `\n${JSON.stringify(meta, null, 2)}`;
        }
        
        return log;
    })
);

// Configuração do logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { 
        service: 'loja-utilidades-backend',
        version: '2.0.0'
    },
    transports: [
        // Log de erros
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            tailable: true
        }),
        
        // Log geral
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            tailable: true
        }),
        
        // Log de acesso (para requests)
        new winston.transports.File({
            filename: path.join(logDir, 'access.log'),
            level: 'info',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            tailable: true
        })
    ]
});

// Adicionar console em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: consoleFormat
    }));
}

// Middleware para logging de requests
const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    // Log do request
    logger.info('Request received', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        referer: req.get('Referer'),
        requestId: req.headers['x-request-id'] || generateRequestId()
    });
    
    // Interceptar o final da resposta
    res.on('finish', () => {
        const duration = Date.now() - start;
        
        logger.info('Request completed', {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            contentLength: res.get('Content-Length'),
            requestId: req.headers['x-request-id'] || generateRequestId()
        });
    });
    
    next();
};

// Função para gerar ID único de request
function generateRequestId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Função para logging de performance
const performanceLogger = (operation, duration, metadata = {}) => {
    logger.info('Performance metric', {
        operation,
        duration: `${duration}ms`,
        ...metadata
    });
};

// Função para logging de erros de negócio
const businessLogger = (event, data = {}) => {
    logger.info('Business event', {
        event,
        ...data
    });
};

// Função para logging de segurança
const securityLogger = (event, data = {}) => {
    logger.warn('Security event', {
        event,
        ...data
    });
};

// Função para logging de banco de dados
const dbLogger = (operation, duration, query = '', params = []) => {
    logger.info('Database operation', {
        operation,
        duration: `${duration}ms`,
        query: query.substring(0, 200), // Limitar tamanho do log
        paramsCount: params.length
    });
};

module.exports = {
    logger,
    requestLogger,
    performanceLogger,
    businessLogger,
    securityLogger,
    dbLogger
}; 