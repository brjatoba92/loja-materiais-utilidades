#!/bin/bash

# 🚀 Script de Deploy Automatizado - Railway Backend
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
echo "🚀 DEPLOY AUTOMATIZADO - RAILWAY BACKEND"
echo "=========================================="
echo -e "${NC}"

# Verificar se está no diretório correto
if [ ! -d "backend" ]; then
    print_error "Diretório 'backend' não encontrado!"
    print_status "Certifique-se de estar no diretório raiz do projeto"
    exit 1
fi

print_success "Diretório correto detectado"

# Verificar se o Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    print_warning "Railway CLI não encontrado. Instalando..."
    npm install -g @railway/cli
    print_success "Railway CLI instalado"
else
    print_success "Railway CLI já está instalado"
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

# Verificar dependências do backend
print_status "Verificando dependências do backend..."
cd backend

if [ ! -f "package.json" ]; then
    print_error "package.json não encontrado no backend!"
    exit 1
fi

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    print_status "Instalando dependências..."
    npm install
    print_success "Dependências instaladas"
else
    print_success "Dependências já estão instaladas"
fi

# Verificar se o arquivo server.js existe
if [ ! -f "server.js" ]; then
    print_error "server.js não encontrado!"
    exit 1
fi

print_success "Arquivos do backend verificados"

# Voltar ao diretório raiz
cd ..

# Verificar variáveis de ambiente
print_status "Verificando variáveis de ambiente..."
if ! railway variables &> /dev/null; then
    print_warning "Não foi possível verificar variáveis de ambiente"
    print_status "Configure as variáveis manualmente no Railway Dashboard"
else
    print_success "Variáveis de ambiente verificadas"
fi

# Fazer deploy
print_status "Iniciando deploy no Railway..."
railway up

print_success "Deploy iniciado!"

# Aguardar um pouco para o deploy processar
print_status "Aguardando processamento do deploy..."
sleep 10

# Verificar status do deploy
print_status "Verificando status do deploy..."
railway status

# Verificar logs
print_status "Últimos logs do deploy:"
railway logs --tail 10

# Verificar health check
print_status "Verificando health check..."
DEPLOY_URL=$(railway status --json | grep -o '"url":"[^"]*"' | cut -d'"' -f4)

if [ -n "$DEPLOY_URL" ]; then
    print_success "URL do deploy: $DEPLOY_URL"
    
    # Testar health check
    print_status "Testando health check..."
    if curl -s "$DEPLOY_URL/api/health" > /dev/null; then
        print_success "Health check funcionando!"
        print_status "Testando endpoint de produtos..."
        curl -s "$DEPLOY_URL/api/produtos" > /dev/null && print_success "API de produtos funcionando!" || print_warning "API de produtos pode ter problemas"
    else
        print_warning "Health check não respondeu. Verifique os logs."
    fi
else
    print_warning "Não foi possível obter a URL do deploy"
fi

echo -e "${BLUE}"
echo "=========================================="
echo "✅ DEPLOY CONCLUÍDO!"
echo "=========================================="
echo -e "${NC}"

print_status "Próximos passos:"
echo "1. Configure o banco de dados no Railway Dashboard"
echo "2. Configure as variáveis de ambiente"
echo "3. Execute os scripts SQL do banco"
echo "4. Configure o frontend no Vercel"
echo "5. Atualize as URLs da API no frontend"

print_status "Comandos úteis:"
echo "- Ver logs: railway logs --tail"
echo "- Ver status: railway status"
echo "- Abrir dashboard: railway open"
echo "- Fazer novo deploy: railway up"

print_success "Deploy automatizado concluído com sucesso! 🎉"
