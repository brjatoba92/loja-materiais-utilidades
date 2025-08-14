const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'loja_utilidades',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT) || 5432,
    ssl: false
});

// Teste de conexão
pool.on('connect', () => {
    console.log('✅ Conectado ao PostgreSQL')
});

pool.on('error', (err) => {
    console.error('❌ Erro na conexão PostgreSQL:', err);
})

module.exports = pool;