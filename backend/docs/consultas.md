-- ============================================
-- 13. CONSULTAS ÚTEIS PARA ADMINISTRAÇÃO
-- ============================================

-- Consulta para verificar produtos com estoque baixo
-- SELECT nome, estoque, categoria 
-- FROM produtos 
-- WHERE estoque <= 10 AND ativo = true 
-- ORDER BY estoque ASC;

-- Consulta para relatório diário de vendas
-- SELECT 
--     DATE(created_at) as data,
--     COUNT(*) as total_pedidos,
--     SUM(total) as faturamento,
--     SUM(pontos_gerados) as pontos_gerados
-- FROM pedidos 
-- WHERE status != 'cancelado' 
--   AND DATE(created_at) = CURRENT_DATE
-- GROUP BY DATE(created_at);

-- Consulta para top 10 produtos mais vendidos
-- SELECT 
--     p.nome,
--     SUM(ip.quantidade) as total_vendido,
--     SUM(ip.subtotal) as receita
-- FROM produtos p
-- JOIN itens_pedido ip ON p.id = ip.produto_id
-- JOIN pedidos ped ON ip.pedido_id = ped.id
-- WHERE ped.status != 'cancelado'
-- GROUP BY p.id, p.nome
-- ORDER BY total_vendido DESC
-- LIMIT 10;

-- ============================================
-- 14. COMANDOS DE MANUTENÇÃO
-- ============================================

-- Limpeza de dados antigos (executar periodicamente)
-- DELETE FROM log_alteracoes WHERE timestamp < NOW() - INTERVAL '1 year';

-- Reindexação (executar quando necessário)
-- REINDEX DATABASE loja_utilidades;

-- Atualização de estatísticas
-- ANALYZE;

-- Vacuum para limpeza
-- VACUUM ANALYZE;

-- ============================================
-- 15. GRANTS E SEGURANÇA
-- ============================================

-- Criar usuário específico para a aplicação
-- CREATE USER app_loja WITH PASSWORD 'senha_super_segura';

-- Conceder permissões necessárias
-- GRANT CONNECT ON DATABASE loja_utilidades TO app_loja;
-- GRANT USAGE ON SCHEMA public TO app_loja;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_loja;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_loja;