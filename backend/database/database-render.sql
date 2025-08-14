-- ============================================
-- SISTEMA LOJA DE UTILIDADES DOMÉSTICAS
-- Scripts PostgreSQL - Render (Adaptado)
-- ============================================

-- ============================================
-- 1. EXTENSÕES NECESSÁRIAS
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ============================================
-- 2. CRIAÇÃO DAS TABELAS
-- ============================================

CREATE TABLE IF NOT EXISTS administradores (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    ultimo_acesso TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- TABELA: USUARIOS (CLIENTES)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    pontos_cashback INTEGER DEFAULT 0 CHECK (pontos_cashback >= 0),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- TABELA: PRODUTOS
CREATE TABLE IF NOT EXISTS produtos (
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
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    pontos_utilizados INTEGER DEFAULT 0 CHECK (pontos_utilizados >= 0),
    pontos_gerados INTEGER DEFAULT 0 CHECK (pontos_gerados >= 0),
    status VARCHAR(50) DEFAULT 'PENDENTE' CHECK (status IN ('pendente', 'confirmado', 'processando', 'enviado', 'entregue', 'cancelado')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- TABELA: itens_pedido
CREATE TABLE IF NOT EXISTS itens_pedido (
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
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos (categoria);
CREATE INDEX IF NOT EXISTS idx_produtos_ativos ON produtos (ativo);
CREATE INDEX IF NOT EXISTS idx_produtos_nome ON produtos USING gin(to_tsvector('portuguese', nome));
CREATE INDEX IF NOT EXISTS idx_produtos_preco ON produtos (preco);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios (email);
CREATE INDEX IF NOT EXISTS idx_usuarios_pontos ON usuarios (pontos_cashback);
CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON pedidos (usuario_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos (status);
CREATE INDEX IF NOT EXISTS idx_itens_pedido_pedido ON itens_pedido (pedido_id);
CREATE INDEX IF NOT EXISTS idx_itens_pedido_produto ON itens_pedido (produto_id);

-- ============================================
-- 4. DADOS INICIAIS (apenas se não existirem)
-- ============================================

-- Inserir administrador padrão (se não existir)
INSERT INTO administradores (usuario, senha_hash, nome) 
SELECT 'admin', '$2b$10$rQZ8K9mN2pL5vX7wY1sT3uI6oP9qR2sE4fG7hJ8kL1mN3oP6qR9sT2uI5oP8', 'Administrador'
WHERE NOT EXISTS (SELECT 1 FROM administradores WHERE usuario = 'admin');

-- Inserir produtos de exemplo (se não existirem)
INSERT INTO produtos (nome, descricao, preco, categoria, estoque, imagem_url) 
SELECT 'Vassoura Multiuso', 'Vassoura resistente para limpeza geral', 25.90, 'Limpeza', 50, 'https://exemplo.com/vassoura.jpg'
WHERE NOT EXISTS (SELECT 1 FROM produtos WHERE nome = 'Vassoura Multiuso');

INSERT INTO produtos (nome, descricao, preco, categoria, estoque, imagem_url) 
SELECT 'Detergente Líquido', 'Detergente concentrado 500ml', 8.50, 'Limpeza', 100, 'https://exemplo.com/detergente.jpg'
WHERE NOT EXISTS (SELECT 1 FROM produtos WHERE nome = 'Detergente Líquido');

INSERT INTO produtos (nome, descricao, preco, categoria, estoque, imagem_url) 
SELECT 'Panela de Pressão', 'Panela de pressão 5L inox', 89.90, 'Cozinha', 20, 'https://exemplo.com/panela.jpg'
WHERE NOT EXISTS (SELECT 1 FROM produtos WHERE nome = 'Panela de Pressão');

INSERT INTO produtos (nome, descricao, preco, categoria, estoque, imagem_url) 
SELECT 'Lixeira 30L', 'Lixeira com pedal 30 litros', 45.00, 'Organização', 30, 'https://exemplo.com/lixeira.jpg'
WHERE NOT EXISTS (SELECT 1 FROM produtos WHERE nome = 'Lixeira 30L');

INSERT INTO produtos (nome, descricao, preco, categoria, estoque, imagem_url) 
SELECT 'Escada Portátil', 'Escada de alumínio 4 degraus', 120.00, 'Ferramentas', 15, 'https://exemplo.com/escada.jpg'
WHERE NOT EXISTS (SELECT 1 FROM produtos WHERE nome = 'Escada Portátil');

-- Inserir usuário de exemplo (se não existir)
INSERT INTO usuarios (nome, email, telefone, pontos_cashback) 
SELECT 'João Silva', 'joao@exemplo.com', '(11) 99999-9999', 150
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'joao@exemplo.com');

INSERT INTO usuarios (nome, email, telefone, pontos_cashback) 
SELECT 'Maria Santos', 'maria@exemplo.com', '(11) 88888-8888', 75
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'maria@exemplo.com');

-- ============================================
-- 5. VERIFICAÇÃO
-- ============================================

-- Verificar tabelas criadas
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Verificar dados inseridos
SELECT COUNT(*) as total_produtos FROM produtos;
SELECT COUNT(*) as total_usuarios FROM usuarios;
SELECT COUNT(*) as total_administradores FROM administradores;
