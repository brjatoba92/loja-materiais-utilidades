-- ============================================
-- 17. INSTRUÇÕES DE EXECUÇÃO
-- ============================================

/*
COMO EXECUTAR ESTE SCRIPT:

1. Instalar PostgreSQL (versão 12 ou superior)

2. Conectar como superuser:
   psql -U postgres

3. Executar este script completo:
   \i caminho/para/database.sql

4. Verificar se tudo foi criado corretamente observando as mensagens de sucesso

5. Configurar as variáveis de ambiente no backend:
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=loja_utilidades
   DB_USER=postgres (ou app_loja se criou usuário específico)
   DB_PASSWORD=sua_senha

6. Testar conexão rodando o backend

ESTRUTURA FINAL DO BANCO:
- ✅ 5 tabelas principais
- ✅ Índices otimizados
- ✅ Triggers automáticos
- ✅ Funções de cashback
- ✅ Views de relatório
- ✅ Dados iniciais
- ✅ Logs de auditoria
- ✅ Validações de integridade

STATUS: 🎉 BANCO DE DADOS COMPLETO E PRONTO PARA PRODUÇÃO!
*/