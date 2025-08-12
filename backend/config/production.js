// Configurações de Produção
module.exports = {
  // Configurações do servidor
  port: process.env.PORT || 5000,
  nodeEnv: 'production',
  
  // Banco de dados
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'loja_utilidades_prod',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'senha_segura_producao',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20, // Pool de conexões
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'seu_jwt_secret_super_seguro_para_producao_2025',
    expiresIn: '24h',
    refreshExpiresIn: '7d'
  },
  
  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'https://seudominio.com',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Muitas requisições deste IP, tente novamente mais tarde.'
  },
  
  // Upload
  upload: {
    path: process.env.UPLOAD_PATH || 'uploads/',
    maxSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  },
  
  // Logs
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
    maxSize: '10m',
    maxFiles: '5'
  },
  
  // Cache
  cache: {
    ttl: parseInt(process.env.CACHE_TTL) || 3600, // 1 hora
    checkPeriod: 600 // 10 minutos
  },
  
  // Performance
  performance: {
    compression: true,
    helmet: true,
    trustProxy: true
  }
}; 