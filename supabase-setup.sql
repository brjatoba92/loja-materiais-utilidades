-- ============================================
-- SISTEMA LOJA DE UTILIDADES DOMÉSTICAS
-- Script para Supabase
-- ============================================

-- ============================================
-- 1. EXTENSÕES NECESSÁRIAS
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ============================================
-- 2. CRIAÇÃO DAS TABELAS
-- ============================================

-- TABELA: ADMINISTRADORES
CREATE TABLE administradores (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    ultimo_acesso TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- TABELA: USUARIOS (CLIENTES)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    pontos_cashback INTEGER DEFAULT 0 CHECK (pontos_cashback >= 0),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- TABELA: PRODUTOS
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL CHECK (preco > 0),
    categoria VARCHAR(100) NOT NULL,
    estoque INTEGER DEFAULT 0 CHECK (estoque >= 0),
    imagem_url VARCHAR(500),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- TABELA: PEDIDOS
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    pontos_utilizados INTEGER DEFAULT 0 CHECK (pontos_utilizados >= 0),
    pontos_gerados INTEGER DEFAULT 0 CHECK (pontos_gerados >= 0),
    status VARCHAR(50) DEFAULT 'PENDENTE' CHECK (status IN ('pendente', 'confirmado', 'processando', 'enviado', 'entregue', 'cancelado')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- TABELA: ITENS_PEDIDO
CREATE TABLE itens_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id INTEGER NOT NULL REFERENCES produtos(id) ON DELETE RESTRICT,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario DECIMAL(10, 2) NOT NULL CHECK (preco_unitario > 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 3. ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX idx_produtos_categoria ON produtos (categoria);
CREATE INDEX idx_produtos_ativos ON produtos (ativo);
CREATE INDEX idx_produtos_nome ON produtos USING gin(to_tsvector('portuguese', nome));
CREATE INDEX idx_produtos_preco ON produtos (preco);
CREATE INDEX idx_usuarios_email ON usuarios (email);
CREATE INDEX idx_usuarios_pontos ON usuarios (pontos_cashback);
CREATE INDEX idx_pedidos_usuario ON pedidos (usuario_id);
CREATE INDEX idx_pedidos_status ON pedidos (status);
CREATE INDEX idx_itens_pedido_pedido ON itens_pedido (pedido_id);
CREATE INDEX idx_itens_pedido_produto ON itens_pedido (produto_id);

-- ============================================
-- 4. DADOS INICIAIS
-- ============================================

-- Inserir administrador padrão (senha: admin123)
INSERT INTO administradores (usuario, senha_hash, nome) VALUES 
('admin', '$2a$10$rQZ8K9mN2pL1vX3yW4uJ5eF6gH7iI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0hI1jJ2kL3mN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ', 'Administrador');

-- Inserir categorias de produtos
INSERT INTO produtos (nome, descricao, preco, categoria, estoque, imagem_url) VALUES 
('Vassoura Multiuso', 'Vassoura resistente para limpeza geral', 25.90, 'Limpeza', 50, 'https://via.placeholder.com/300x300?text=Vassoura'),
('Panela Antiaderente', 'Panela de 24cm com revestimento antiaderente', 89.90, 'Cozinha', 30, 'https://via.placeholder.com/300x300?text=Panela'),
('Organizador de Gaveta', 'Organizador plástico para gavetas', 15.50, 'Organização', 100, 'https://via.placeholder.com/300x300?text=Organizador'),
('Lixeira com Pedal', 'Lixeira 10L com pedal e tampa', 45.00, 'Limpeza', 25, 'https://via.placeholder.com/300x300?text=Lixeira'),
('Jogo de Talheres', 'Jogo completo de talheres inox', 120.00, 'Cozinha', 20, 'https://via.placeholder.com/300x300?text=Talheres');

-- ============================================
-- 5. CONFIGURAÇÕES DE SEGURANÇA
-- ============================================

-- Habilitar RLS (Row Level Security) se necessário
-- ALTER TABLE administradores ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE itens_pedido ENABLE ROW LEVEL SECURITY;
