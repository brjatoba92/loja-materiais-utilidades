#!/bin/bash

# 🚀 Script de Deploy Automatizado - Render Backend
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
echo "🚀 DEPLOY AUTOMATIZADO - RENDER BACKEND"
echo "=========================================="
echo -e "${NC}"

# Verificar se está no diretório correto
if [ ! -d "backend" ]; then
    print_error "Diretório 'backend' não encontrado!"
    print_status "Certifique-se de estar no diretório raiz do projeto"
    exit 1
fi

print_success "Diretório correto detectado"

# Verificar se os arquivos necessários existem
print_status "Verificando arquivos necessários..."

if [ ! -f "backend/package.json" ]; then
    print_error "package.json não encontrado no backend!"
    exit 1
fi

if [ ! -f "backend/server.js" ]; then
    print_error "server.js não encontrado no backend!"
    exit 1
fi

if [ ! -f "backend/render.yaml" ]; then
    print_error "render.yaml não encontrado no backend!"
    exit 1
fi

if [ ! -f "backend/database/database-render.sql" ]; then
    print_error "database-render.sql não encontrado!"
    exit 1
fi

print_success "Todos os arquivos necessários encontrados"

# Verificar se o git está configurado
print_status "Verificando configuração do Git..."
if ! git status &> /dev/null; then
    print_error "Git não está configurado neste diretório!"
    exit 1
fi

print_success "Git configurado"

# Verificar se há mudanças para commitar
print_status "Verificando mudanças no Git..."
if ! git diff-index --quiet HEAD --; then
    print_warning "Há mudanças não commitadas!"
    print_status "Fazendo commit das mudanças..."
    
    git add .
    git commit -m "Deploy: Preparação para Render $(date)"
    print_success "Mudanças commitadas"
else
    print_success "Não há mudanças pendentes"
fi

# Verificar se o repositório está no GitHub
print_status "Verificando repositório remoto..."
if ! git remote get-url origin &> /dev/null; then
    print_error "Repositório remoto não configurado!"
    print_status "Configure o repositório no GitHub primeiro"
    exit 1
fi

print_success "Repositório remoto configurado"

# Fazer push para o GitHub
print_status "Fazendo push para o GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    print_success "Push realizado com sucesso!"
else
    print_error "Erro ao fazer push!"
    exit 1
fi

echo -e "${BLUE}"
echo "=========================================="
echo "✅ PREPARAÇÃO CONCLUÍDA!"
echo "=========================================="
echo -e "${NC}"

print_success "Código enviado para o GitHub!"
print_status "Agora siga os passos no Render:"

echo ""
echo "1. Acesse: https://render.com"
echo "2. Faça login com GitHub"
echo "3. Clique em 'New' → 'Web Service'"
echo "4. Conecte seu repositório: loja-materiais-utilidades"
echo "5. Configure:"
echo "   - Name: loja-utilidades-backend"
echo "   - Environment: Node"
echo "   - Root Directory: backend"
echo "   - Build Command: npm install"
echo "   - Start Command: node server.js"
echo "6. Clique em 'Create Web Service'"

print_status "Após o deploy, configure o banco de dados:"
echo "1. Crie um PostgreSQL no Render"
echo "2. Execute o script: backend/database/database-render.sql"
echo "3. Configure as variáveis de ambiente"

print_status "Comandos úteis após o deploy:"
echo "- Testar API: curl https://seu-app.onrender.com/api/health"
echo "- Ver logs: Render Dashboard → Logs"
echo "- Ver métricas: Render Dashboard → Metrics"

print_success "Deploy automatizado concluído! 🎉"
print_warning "Lembre-se de configurar o banco de dados no Render Dashboard"
