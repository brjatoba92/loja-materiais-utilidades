-- ============================================
-- SISTEMA LOJA DE UTILIDADES DOMÉSTICAS
-- Scripts PostgreSQL - Banco de Dados
-- ============================================

-- ============================================
-- 1. CRIAÇÃO DO BANCO DE DADOS
-- ============================================,
-- Criar banco de dados (executar como superuser)

CREATE DATABASE loja_utilidades
    WITH 
    OWNER = brunodev;

-- CONECTAR AO BANCO DE DADOS
\c loja_utilidades;

-- ============================================
-- 2. EXTENSÕES NECESSÁRIAS
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ============================================
-- 3. CRIAÇÃO DAS TABELAS
-- ============================================

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

-- TABELA: itens_pedido
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
-- 4. ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX idx_produtos_categoria ON produtos (categoria); -- Índice para busca por categoria
CREATE INDEX idx_produtos_ativos ON produtos (ativo); -- Índice para produtos ativos
CREATE INDEX idx_produtos_nome ON produtos USING gin(to_tsvector('portuguese', nome)); -- Índice de texto completo para busca por nome
CREATE INDEX idx_produtos_preco ON produtos (preco); -- Índice para busca por preço

-- Indices para usuario
CREATE INDEX idx_usuarios_email ON usuarios (email); -- Índice para busca por email
CREATE INDEX idx_usuarios_pontos ON usuarios (pontos_cashback); -- Índice para busca por pontos de cashback

-- Indices para pedidos
CREATE INDEX idx_pedidos_usuario ON pedidos (usuario_id); -- Índice para busca por usuário
CREATE INDEX idx_pedidos_status ON pedidos (status); -- Índice para busca por
CREATE INDEX idx_pedidos_data ON pedidos (created_at); -- Índice para busca por data de criação

-- Indices para itens_pedido
CREATE INDEX idx_itens_pedido_pedido ON itens_pedido (pedido_id); -- Índice para busca por pedido
CREATE INDEX idx_itens_pedido_produto ON itens_pedido (produto_id); -- Índice para busca por produto

-- ============================================
-- 5. TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- ============================================

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_administradores_updated_at 
    BEFORE UPDATE ON administradores 
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_usuarios_updated_at 
    BEFORE UPDATE ON usuarios 
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_produtos_updated_at 
    BEFORE UPDATE ON produtos 
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_pedidos_updated_at 
    BEFORE UPDATE ON pedidos 
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================
-- 6. STORED PROCEDURES PARA CASHBACK
-- ============================================

-- Função para calcular pontos de cashback
CREATE OR REPLACE FUNCTION calcular_pontos_cashback(valor_compra DECIMAL)
RETURNS INTEGER AS $$
BEGIN
    RETURN FLOOR(valor_compra / 50)::INTEGER; -- 1 ponto para cada R$50,00 gastos
END;
$$ language plpgsql;

-- Função para aplicar cashback
CREATE OR REPLACE FUNCTION aplicar_cashback(
    p_usuario_id INTEGER, 
    p_valor_compra DECIMAL,
    p_pontos_utilizados INTEGER DEFAULT 0
)
RETURNS TABLE(
    pontos_gerados INTEGER,
    novos_pontos_total INTEGER,
    desconto_aplicado DECIMAL
) AS $$
DECLARE
    pontos_atuais INTEGER;
    pontos_novos INTEGER;
    desconto DECIMAL;
BEGIN
    -- Obtenha os pontos atuais do usuário
    SELECT pontos_cashback INTO pontos_atuais 
    FROM usuarios 
    WHERE id = p_usuario_id;

-- Verificar se tem pontos suficientes para aplicar o cashback
    IF pontos_atuais <= p_pontos_utilizados THEN
        RAISE EXCEPTION 'Usuário não possui pontos suficientes para aplicar o cashback';
    END IF;

    -- Calcular desconto aplicado
    desconto := p_pontos_utilizados * 1.00; -- Cada ponto vale R$1,00

    -- Calcular pontos novos gerados
    pontos_novos := calcular_pontos_cashback(p_valor_compra - desconto);

    -- Atualizar pontos do usuário
    UPDATE usuarios
    SET pontos_cashback = pontos_atuais - p_pontos_utilizados + pontos_novos
    WHERE id = p_usuario_id;

    RETURN QUERY SELECT 
        pontos_novos, 
        pontos_atuais - p_pontos_utilizados + pontos_novos, 
        desconto;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. VIEWS UTEIS
-- ============================================

-- View de produtos com informações resumidas
CREATE VIEW view_produtos_resumo AS
SELECT
    id,
    nome,
    preco,
    categoria,
    estoque,
    ativo,
    CASE
        WHEN estoque = 0 THEN 'Sem estoque'
        WHEN estoque < 10 THEN 'Estoque baixo'
        ELSE 'Disponivel'
    END AS status_estoque
FROM produtos
WHERE ativo = true;

-- View de relatório de vendas
CREATE VIEW view_relatorio_vendas AS
SELECT
    DATE(p.created_at) AS data_venda,
    COUNT(p.id) AS total_pedidos,
    SUM(p.total) AS total_vendido,
    SUM(p.pontos_gerados) AS pontos_gerados_total,
    AVG(p.total) AS ticket_medio
FROM pedidos p
WHERE p.status != 'cancelado'
GROUP BY DATE(p.created_at)
ORDER BY data_venda DESC;

-- View de produtos mais vendidos
CREATE VIEW view_produtos_mais_vendidos AS
SELECT
    pr.id,
    pr.nome,
    pr.categoria,
    SUM(ip.quantidade) AS total_vendido,
    SUM(ip.subtotal) AS receita_total,
    COUNT(DISTINCT ip.pedido_id) AS pedidos_count
FROM produtos pr
JOIN itens_pedido ip ON pr.id = ip.produto_id
JOIN pedidos p ON ip.pedido_id = p.id
WHERE p.status != 'cancelado'
GROUP BY pr.id, pr.nome, pr.categoria
ORDER BY total_vendido DESC;

-- ============================================
-- 8. FUNÇÕES DE RELATÓRIO
-- ============================================

-- Função para relatório de vendas por período
CREATE OR REPLACE FUNCTION relatorio_vendas_por_periodo(
    p_data_inicio DATE, 
    p_data_fim DATE
)
RETURNS TABLE(
    data_venda DATE,
    total_pedidos BIGINT,
    total_vendido DECIMAL,
    pontos_gerados_total BIGINT,
    ticket_medio DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        DATE(p.created_at) :: DATE,
        COUNT(p.id),
        SUM(p.total)::DECIMAL,
        SUM(p.pontos_gerados),
        AVG(p.total)::DECIMAL
    FROM pedidos p
    WHERE DATE(p.created_at) BETWEEN p_data_inicio AND p_data_fim
        AND p.status != 'cancelado'
    GROUP BY DATE(p.created_at)
    ORDER BY DATE(p.created_at) DESC;
END;
$$ LANGUAGE plpgsql;

-- Função para busca de produtos com texto
CREATE OR REPLACE FUNCTION buscar_produtos(
    termo_busca TEXT
)
RETURNS TABLE(
    id INTEGER,
    nome VARCHAR,
    descricao TEXT,
    preco DECIMAL,
    categoria VARCHAR,
    estoque INTEGER,
    imagem_url VARCHAR,
    relevancia REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.nome,
        p.descricao,
        p.preco,
        p.categoria,
        p.estoque,
        p.imagem_url,
        ts_rank(to_tsvector('portuguese', p.nome || ' ' || COALESCE(p.descricao, '')),
                plainto_tsquery('portuguese', termo_busca)) AS relevancia
    FROM produtos p
    
    WHERE p.ativo = true
        AND (
        to_tsvector('portuguese', p.nome || ' ' || COALESCE(p.descricao, '')) 
        @@ plainto_tsquery('portuguese', termo_busca)
        OR p.nome ILIKE '%' || termo_busca || '%'
        OR p.categoria ILIKE '%' || termo_busca || '%'
      )
    ORDER BY relevancia DESC, p.nome;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 9. DADOS INICIAIS (SEEDS)
-- ============================================
-- Inserir admin padrão (senha: admin123)
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- Necessário para usar a função crypt
-- Inserir administrador padrão
-- A senha será criptografada usando bcrypt
-- (gen_salt('bf') gera um salt para bcrypt)
-- (crypt('senha', gen_salt('bf')) criptografa a senha)
-- O ON CONFLICT (usuario) DO NOTHING evita duplicação
-- Caso o usuário já exista, não insere novamente
-- (isso é útil para evitar erros ao rodar o script várias vezes)
INSERT INTO administradores (usuario, senha_hash, nome) VALUES
('admin', crypt('admin123', gen_salt('bf')), 'Administrador') -- Senha: admin123 (criptografada)
ON CONFLICT (usuario) DO NOTHING;

-- Inserir categorias de produtos (através de produtos exemplo)
INSERT INTO produtos (nome, descricao, preco, categoria, estoque, imagem_url) VALUES
-- Cozinha
('Fogão', 'Fogão de 4 bocas com controle de temperatura.', 200.00, 'Eletrodomésticos', 10, 'https://example.com/fogao.jpg'),
('Panela de Pressão', 'Panela de pressão de alumínio com capacidade para 4 litros.', 150.00, 'Cozinha', 10, 'https://example.com/panela_pressao.jpg'),
('Liquidificador', 'Liquidificador de alta potência com 5 velocidades.', 200.00, 'Eletrodomésticos', 15, 'https://example.com/liquidificador.jpg'),
('Jogo de Facas', 'Conjunto de facas de cozinha em aço inoxidável.', 80.00, 'Cozinha', 20, 'https://example.com/jogo_de_facas.jpg'),
('Ferro de Passar', 'Ferro a vapor com base antiaderente.', 120.00, 'Eletrodomésticos', 5, 'https://example.com/ferro_de_passar.jpg'),
('Escorredor de Louça', 'Escorredor de louça em plástico resistente.', 30.00, 'Cozinha', 25, 'https://example.com/escorredor_louca.jpg'),

-- Limpeza
('Vassoura', 'Vassoura de piaçava com cabo de madeira.', 20.00, 'Limpeza', 50, 'https://example.com/vassoura.jpg'),
('Rodo', 'Rodo de borracha com cabo telescópico.', 15.00, 'Limpeza', 40, 'https://example.com/rodo.jpg'),
('Balde', 'Balde de plástico com capacidade para 10 litros.', 25.00, 'Limpeza', 30, 'https://example.com/balde.jpg'),
('Esponja de Aço', 'Esponja de aço inoxidável para limpeza pesada.', 5.00, 'Limpeza', 100, 'https://example.com/esponja_aco.jpg'),
('Detergente', 'Detergente líquido concentrado para lavar louças.', 10.00, 'Limpeza', 200, 'https://example.com/detergente.jpg'),

-- Organização
('Caixa Organizadora', 'Caixa plástica empilhável para organização.', 40.00, 'Organização', 60, 'https://example.com/caixa_organizadora.jpg'),
('Cabideiro', 'Cabideiro de parede em metal com 5 ganchos.', 35.00, 'Organização', 70, 'https://example.com/cabideiro.jpg'),
('Cesto de Roupa', 'Cesto de roupa suja em tecido resistente.', 50.00, 'Organização', 20, 'https://example.com/cesto_roupa.jpg'),
('Prateleira de Parede', 'Prateleira de madeira para livros e objetos decorativos.', 80.00, 'Organização', 15, 'https://example.com/prateleira_parede.jpg'),
('Gaveteiro', 'Gaveteiro plástico com 3 gavetas para escritório.', 60.00, 'Organização', 25, 'https://example.com/gaveteiro.jpg'),

-- Banheiro
('Toalha de Banho', 'Toalha de banho felpuda em algodão.', 30.00, 'Banheiro', 100, 'https://example.com/toalha_banho.jpg'),
('Escova de Dentes', 'Escova de dentes macia com cerdas antibacterianas.', 5.00, 'Banheiro', 200, 'https://example.com/escova_dentes.jpg'),
('Saboneteira', 'Saboneteira de cerâmica com design moderno.', 15.00, 'Banheiro', 150, 'https://example.com/saboneteira.jpg'),
('Cesto de Lixo', 'Cesto de lixo com pedal e tampa.', 40.00, 'Banheiro', 80, 'https://example.com/cesto_lixo.jpg'),
('Espelho de Banheiro', 'Espelho de parede com iluminação LED.', 100.00, 'Banheiro', 30, 'https://example.com/espelho_banheiro.jpg'),

-- Quarto
('Cama de Casal', 'Cama de casal com 2 camas e 1 mesa.', 300.00, 'Quarto', 5, 'https://example.com/cama_casal.jpg'),
('Cama de Solteiro', 'Cama de solteiro com 1 camas e 1 mesa.', 250.00, 'Quarto', 10, 'https://example.com/cama_solteiro.jpg'),
('Edredom Casal', 'Edredom macio e quentinho para cama de casal', 159.90, 'Quarto', 25, 'https://exemplo.com/edredom-casal.jpg'),
('Travesseiro Memory', 'Travesseiro de espuma viscoelástica com capa removível', 119.90, 'Quarto', 40, 'https://exemplo.com/travesseiro-memory.jpg'),
('Cortina Blackout', 'Cortina blackout que bloqueia 99% da luz externa', 179.90, 'Quarto', 30, 'https://exemplo.com/cortina-blackout.jpg'),
('Abajur LED', 'Abajur de mesa com luz LED regulável e USB', 99.90, 'Quarto', 35, 'https://exemplo.com/abajur-led.jpg'),
('Criado Mudo', 'Criado mudo compacto com gaveta e prateleira', 199.90, 'Quarto', 20, 'https://exemplo.com/criado-mudo.jpg');

-- Inserir usuarios de exemplo
INSERT INTO usuarios (nome, email, telefone, pontos_cashback) VALUES
('João Silva', 'joaosilva@gmail.com', '(12) 93456-7890', 15),
('Maria Souza', 'marysouza@gmail.com', '(98) 97654-3210', 26),
('Pedro Santos', 'petersantos@gmail.com', '(55) 98795-5555', 120),
('Ana Oliveira', 'aninhaoliveira@gmail.com', '(11) 99190-1214', 50),
('Luisa Ferreira', 'devluizaback@gmail.com', '(11) 99490-2129', 6),
('Rafael Almeida', 'rafa_devops@yahoo.com', '(11) 99691-4845', 96),
('Fernanda Costa', 'fe2401@hotmail.com', '(11) 97723-3734', 25);

-- ============================================
-- 10. TRIGGERS PARA REGRAS DE NEGÓCIO
-- ============================================

-- Trigger para validar estoque antes de criar item do pedido
CREATE OR REPLACE FUNCTION validar_estoque_item_pedido()
RETURNS TRIGGER AS $$
BEGIN
    -- Verifica se o produto está ativo
    IF (SELECT estoque FROM produtos WHERE id = NEW.produto_id) < NEW.quantidade THEN
        RAISE EXCEPTION 'Produto com ID % não está disponível em estoque', NEW.produto_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_estoque
    BEFORE INSERT ON itens_pedido
    FOR EACH ROW EXECUTE FUNCTION validar_estoque_item_pedido();

-- Trigger para calcular subtotal automaticamente
CREATE OR REPLACE FUNCTION calcular_subtotal_item_pedido()
RETURNS TRIGGER AS $$
BEGIN
    -- Calcular subtotal baseado no preço atual do produto
    SELECT preco INTO NEW.preco_unitario FROM produtos WHERE id = NEW.produto_id;
    NEW.subtotal := NEW.preco_unitario * NEW.quantidade;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calcular_subtotal
    BEFORE INSERT ON itens_pedido
    FOR EACH ROW EXECUTE FUNCTION calcular_subtotal_item_pedido();

-- ============================================
-- 11. FUNÇÃO PARA BACKUP AUTOMÁTICO
-- ============================================

-- Função para criar log de alterações importantes
CREATE TABLE log_alteracoes (
    id SERIAL PRIMARY KEY,
    tabela VARCHAR(100) NOT NULL,
    operacao VARCHAR(10) NOT NULL,
    registro_id INTEGER,
    dados_antigos JSONB,
    dados_novos JSONB,
    usuario_id INTEGER,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Função genérica de log
CREATE OR REPLACE FUNCTION log_alteracao()
RETURNS TRIGGER AS $log_alteracao$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO log_alteracoes (
            tabela, operacao, registro_id, dados_antigos, timestamp
        ) VALUES (
            TG_TABLE_NAME, TG_OP, OLD.id, to_jsonb(OLD), NOW()
        );
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO log_alteracoes (
            tabela, operacao, registro_id, dados_antigos, dados_novos, timestamp
        ) VALUES (
            TG_TABLE_NAME, TG_OP, NEW.id, to_jsonb(OLD), to_jsonb(NEW), NOW()
        );
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO log_alteracoes (
            tabela, operacao, registro_id, dados_novos, timestamp
        ) VALUES (
            TG_TABLE_NAME, TG_OP, NEW.id, to_jsonb(NEW), NOW()
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$log_alteracao$ LANGUAGE plpgsql;

-- Aplicar log em tabelas importantes
CREATE TRIGGER trigger_log_produtos
    AFTER INSERT OR UPDATE OR DELETE ON produtos
    FOR EACH ROW EXECUTE FUNCTION log_alteracao();

CREATE TRIGGER trigger_log_pedidos
    AFTER INSERT OR UPDATE OR DELETE ON pedidos
    FOR EACH ROW EXECUTE FUNCTION log_alteracao();

-- ============================================
-- 12. OTIMIZAÇÕES DE PERFORMANCE
-- ============================================
-- Estatísticas das tabelas
ANALYZE administradores;
ANALYZE usuarios;
ANALYZE produtos;
ANALYZE pedidos;
ANALYZE itens_pedido;

-- Configurações para otimização (aplicar conforme necessário)
-- SET work_mem = '256MB';
-- SET maintenance_work_mem = '512MB';
-- SET effective_cache_size = '2GB';


-- ============================================
-- 16. SCRIPT DE VERIFICAÇÃO DA INSTALAÇÃO
-- ============================================

-- Verificar se todas as tabelas foram criadas

DO $$
DECLARE
    tabela_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO tabela_count 
    FROM information_schema.tables
    WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE';
    
    RAISE NOTICE 'Total de tabelas criadas: %', tabela_count;
    IF tabela_count >= 5  THEN
        RAISE NOTICE '✅ Instalação do banco concluída com sucesso!';
    ELSE
        RAISE EXCEPTION '❌ Erro na instalação - tabelas faltando';
    END IF;
END
$$ LANGUAGE plpgsql;

-- Verificar se os produtos de exemplo foram inseridos

DO $$
DECLARE
    produto_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO produto_count FROM produtos;
    RAISE NOTICE 'Total de produtos inseridos: %', produto_count;
END
$$ LANGUAGE plpgsql;