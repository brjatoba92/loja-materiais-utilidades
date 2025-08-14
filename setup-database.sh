#!/bin/bash

# 🗄️ Script de Configuração do Banco de Dados - Railway
# Autor: Sistema de Deploy
# Data: $(date)

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Banner
echo -e "${BLUE}"
echo "=========================================="
echo "🗄️ CONFIGURAÇÃO DO BANCO DE DADOS"
echo "=========================================="
echo -e "${NC}"

# Verificar se o Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    print_error "Railway CLI não encontrado!"
    print_status "Instale com: npm install -g @railway/cli"
    exit 1
fi

# Verificar se está logado no Railway
print_status "Verificando login no Railway..."
if ! railway whoami &> /dev/null; then
    print_warning "Não está logado no Railway. Faça login..."
    railway login
else
    print_success "Já está logado no Railway"
fi

# Verificar se o projeto está linkado
print_status "Verificando se o projeto está linkado..."
if [ ! -f ".railway" ]; then
    print_warning "Projeto não está linkado. Linkando..."
    railway link
else
    print_success "Projeto já está linkado"
fi

# Verificar se existe o arquivo SQL
if [ ! -f "backend/database/database-railway.sql" ]; then
    print_error "Arquivo database-railway.sql não encontrado!"
    exit 1
fi

print_success "Arquivo SQL encontrado"

# Verificar se o banco PostgreSQL existe
print_status "Verificando banco de dados PostgreSQL..."
if ! railway variables | grep -q "DATABASE_URL"; then
    print_warning "Banco PostgreSQL não encontrado!"
    print_status "Crie um banco PostgreSQL no Railway Dashboard primeiro"
    print_status "1. Vá em 'New' → 'Database' → 'PostgreSQL'"
    print_status "2. Aguarde a criação"
    print_status "3. Execute este script novamente"
    exit 1
fi

print_success "Banco PostgreSQL encontrado"

# Executar script SQL
print_status "Executando script SQL no banco..."
print_warning "Isso irá criar todas as tabelas e dados iniciais"

# Perguntar confirmação
read -p "Deseja continuar? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Operação cancelada"
    exit 1
fi

# Executar o script SQL
print_status "Executando database-railway.sql..."
railway run -- cat backend/database/database-railway.sql | psql $DATABASE_URL

if [ $? -eq 0 ]; then
    print_success "Script SQL executado com sucesso!"
else
    print_error "Erro ao executar script SQL"
    exit 1
fi

# Verificar se as tabelas foram criadas
print_status "Verificando tabelas criadas..."
railway run -- psql $DATABASE_URL -c "\dt"

# Inserir dados de exemplo (se existir)
if [ -f "backend/database/sample-data.sql" ]; then
    print_status "Inserindo dados de exemplo..."
    railway run -- cat backend/database/sample-data.sql | psql $DATABASE_URL
    print_success "Dados de exemplo inseridos"
fi

# Testar conexão
print_status "Testando conexão com o banco..."
railway run -- psql $DATABASE_URL -c "SELECT COUNT(*) as total_produtos FROM produtos;"

echo -e "${BLUE}"
echo "=========================================="
echo "✅ BANCO DE DADOS CONFIGURADO!"
echo "=========================================="
echo -e "${NC}"

print_success "Banco de dados configurado com sucesso!"
print_status "Próximos passos:"
echo "1. Verificar se o backend está funcionando"
echo "2. Testar endpoints da API"
echo "3. Configurar frontend"

print_status "Comandos úteis:"
echo "- Ver logs do backend: railway logs --tail"
echo "- Testar API: curl https://seu-projeto.railway.app/api/health"
echo "- Conectar ao banco: railway run -- psql \$DATABASE_URL"

print_success "Configuração do banco concluída! 🎉"
