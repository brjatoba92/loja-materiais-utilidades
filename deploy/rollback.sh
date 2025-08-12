#!/bin/bash

# Script de Rollback - Loja de Utilidades
# Uso: ./rollback.sh [TIMESTAMP_DO_BACKUP]

set -e

echo "🔄 Iniciando rollback da Loja de Utilidades..."

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

# Verificar se foi fornecido timestamp
if [ -z "$1" ]; then
    error "Uso: $0 [TIMESTAMP_DO_BACKUP]"
    echo ""
    echo "Backups disponíveis:"
    ls -la /backups/ | grep -E "(app_backup_|pre_deploy_backup_)" | head -10
    exit 1
fi

TIMESTAMP=$1
APP_DIR="/var/www/loja-utilidades"
BACKUP_DIR="/backups"

# Verificar se o backup existe
BACKUP_FILE="$BACKUP_DIR/app_backup_$TIMESTAMP.tar.gz"
DB_BACKUP_FILE="$BACKUP_DIR/pre_deploy_backup_$TIMESTAMP.sql.gz"

if [ ! -f "$BACKUP_FILE" ]; then
    error "Backup não encontrado: $BACKUP_FILE"
fi

log "Iniciando rollback para timestamp: $TIMESTAMP"

# Parar aplicação
log "Parando aplicação..."
sudo systemctl stop loja-utilidades || true

# Fazer backup do estado atual antes do rollback
CURRENT_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
log "Criando backup do estado atual..."
tar -czf $BACKUP_DIR/pre_rollback_backup_$CURRENT_TIMESTAMP.tar.gz $APP_DIR/backend $APP_DIR/frontend --exclude=node_modules --exclude=dist

# Restaurar arquivos
log "Restaurando arquivos do backup..."
cd $APP_DIR
sudo rm -rf backend frontend
sudo tar -xzf $BACKUP_FILE -C /

# Restaurar banco de dados se backup existir
if [ -f "$DB_BACKUP_FILE" ]; then
    log "Restaurando banco de dados..."
    gunzip -c $DB_BACKUP_FILE | psql -h localhost -U postgres loja_utilidades_prod
else
    warn "Backup do banco não encontrado, mantendo dados atuais"
fi

# Configurar permissões
log "Configurando permissões..."
sudo chown -R www-data:www-data $APP_DIR
sudo chmod -R 755 $APP_DIR

# Instalar dependências
log "Instalando dependências..."

# Backend
cd $APP_DIR/backend
npm ci --only=production

# Frontend
cd $APP_DIR/frontend
npm ci
npm run build

# Reiniciar aplicação
log "Reiniciando aplicação..."
sudo systemctl start loja-utilidades

# Aguardar aplicação estar pronta
log "Aguardando aplicação estar pronta..."
for i in {1..30}; do
    if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
        log "Aplicação está respondendo!"
        break
    fi
    if [ $i -eq 30 ]; then
        error "Aplicação não respondeu após 30 tentativas"
    fi
    sleep 2
done

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

# Testar frontend
if curl -f http://localhost/ > /dev/null 2>&1; then
    log "✅ Frontend está funcionando"
else
    warn "⚠️ Frontend pode não estar configurado no Nginx"
fi

log "✅ Rollback concluído com sucesso!"
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
log ""
log "📝 Backup do estado anterior criado: pre_rollback_backup_$CURRENT_TIMESTAMP.tar.gz" 