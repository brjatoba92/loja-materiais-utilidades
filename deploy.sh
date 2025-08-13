#!/bin/bash

echo "🚀 Iniciando deploy da Loja de Utilidades..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se está no diretório correto
if [ ! -f "README.md" ]; then
    print_error "Execute este script na raiz do projeto!"
    exit 1
fi

print_status "Verificando estrutura do projeto..."

# Verificar se backend e frontend existem
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Estrutura do projeto não encontrada!"
    exit 1
fi

# 1. Deploy do Backend (Railway)
print_status "Iniciando deploy do backend no Railway..."

cd backend

# Verificar se package.json existe
if [ ! -f "package.json" ]; then
    print_error "package.json não encontrado no backend!"
    exit 1
fi

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    print_status "Instalando dependências do backend..."
    npm install
fi

# Verificar se há mudanças para commit
if git diff --quiet; then
    print_warning "Nenhuma mudança detectada no backend"
else
    print_status "Commitando mudanças do backend..."
    git add .
    git commit -m "Deploy backend - $(date)"
fi

cd ..

# 2. Deploy do Frontend (Vercel)
print_status "Iniciando deploy do frontend no Vercel..."

cd frontend

# Verificar se package.json existe
if [ ! -f "package.json" ]; then
    print_error "package.json não encontrado no frontend!"
    exit 1
fi

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    print_status "Instalando dependências do frontend..."
    npm install
fi

# Build do projeto
print_status "Fazendo build do frontend..."
npm run build

# Verificar se build foi bem-sucedido
if [ ! -d "dist" ]; then
    print_error "Build falhou! Pasta dist não encontrada."
    exit 1
fi

cd ..

print_status "Deploy concluído com sucesso!"
print_status ""
print_status "Próximos passos:"
print_status "1. Configure as variáveis de ambiente no Railway"
print_status "2. Configure as variáveis de ambiente no Vercel"
print_status "3. Atualize a URL da API no frontend"
print_status "4. Teste a aplicação"
print_status ""
print_status "URLs esperadas:"
print_status "- Backend: https://seu-backend.railway.app"
print_status "- Frontend: https://seu-frontend.vercel.app"
