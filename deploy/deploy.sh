#!/bin/bash

# Script de Deploy - Loja de Utilidades
# Execute como usuário com permissões adequadas

set -e

echo "🚀 Iniciando deploy da Loja de Utilidades..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Variáveis
APP_DIR="/var/www/loja-utilidades"
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Verificar se o diretório da aplicação existe
if [ ! -d "$APP_DIR" ]; then
    error "Diretório da aplicação não encontrado: $APP_DIR"
fi

# Fazer backup do banco antes do deploy
log "Criando backup do banco de dados..."
pg_dump -h localhost -U postgres loja_utilidades_prod > $BACKUP_DIR/pre_deploy_backup_$TIMESTAMP.sql
gzip $BACKUP_DIR/pre_deploy_backup_$TIMESTAMP.sql
log "Backup criado: pre_deploy_backup_$TIMESTAMP.sql.gz"

# Navegar para o diretório da aplicação
cd $APP_DIR

# Fazer backup dos arquivos atuais
log "Fazendo backup dos arquivos atuais..."
tar -czf $BACKUP_DIR/app_backup_$TIMESTAMP.tar.gz backend/ frontend/ --exclude=node_modules --exclude=dist

# Atualizar código do repositório
log "Atualizando código do repositório..."
git fetch origin
git reset --hard origin/main

# Deploy do Backend
log "Iniciando deploy do backend..."
cd $APP_DIR/backend

# Instalar dependências
log "Instalando dependências do backend..."
npm ci --only=production

# Criar diretórios necessários
mkdir -p logs uploads

# Aplicar migrações do banco (se houver)
if [ -f "database/migrations.sql" ]; then
    log "Aplicando migrações do banco..."
    psql -h localhost -U postgres -d loja_utilidades_prod -f database/migrations.sql
fi

# Verificar se o serviço systemd existe
if systemctl list-unit-files | grep -q "loja-utilidades.service"; then
    log "Reiniciando serviço do backend..."
    sudo systemctl restart loja-utilidades
else
    warn "Serviço systemd não encontrado. Iniciando com PM2..."
    pm2 delete loja-utilidades || true
    pm2 start server.js --name "loja-utilidades" --env production
    pm2 save
fi

# Aguardar backend estar pronto
log "Aguardando backend estar pronto..."
for i in {1..30}; do
    if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
        log "Backend está respondendo!"
        break
    fi
    if [ $i -eq 30 ]; then
        error "Backend não respondeu após 30 tentativas"
    fi
    sleep 2
done

# Deploy do Frontend
log "Iniciando deploy do frontend..."
cd $APP_DIR/frontend

# Instalar dependências
log "Instalando dependências do frontend..."
npm ci

# Build de produção
log "Fazendo build de produção..."
npm run build

# Verificar se o build foi bem-sucedido
if [ ! -d "dist" ]; then
    error "Build do frontend falhou - diretório dist não encontrado"
fi

# Configurar permissões
log "Configurando permissões..."
sudo chown -R www-data:www-data $APP_DIR
sudo chmod -R 755 $APP_DIR

# Reiniciar Nginx
log "Reiniciando Nginx..."
sudo systemctl reload nginx

# Verificar se tudo está funcionando
log "Verificando se a aplicação está funcionando..."

# Testar backend
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    log "✅ Backend está funcionando"
else
    error "❌ Backend não está respondendo"
fi

# Testar frontend (se configurado)
if curl -f http://localhost/ > /dev/null 2>&1; then
    log "✅ Frontend está funcionando"
else
    warn "⚠️ Frontend pode não estar configurado no Nginx"
fi

# Limpar backups antigos (manter apenas os últimos 5)
log "Limpando backups antigos..."
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

# Log do deploy
echo "$(date): Deploy concluído com sucesso" >> $APP_DIR/deploy.log

log "✅ Deploy concluído com sucesso!"
log ""
log "📊 Status da aplicação:"
log "- Backend: http://localhost:5000/api/health"
log "- Frontend: http://localhost/"
log "- Logs: journalctl -u loja-utilidades -f"
log ""
log "🔧 Comandos úteis:"
log "- Verificar status: systemctl status loja-utilidades"
log "- Ver logs: tail -f $APP_DIR/backend/logs/combined.log"
log "- Reiniciar: systemctl restart loja-utilidades"
log "- Rollback: ./deploy/rollback.sh $TIMESTAMP" 