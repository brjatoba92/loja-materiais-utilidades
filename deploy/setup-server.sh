#!/bin/bash

# Script de Setup do Servidor - Loja de Utilidades
# Execute como root: sudo bash setup-server.sh

set -e

echo "🚀 Iniciando setup do servidor para Loja de Utilidades..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Verificar se está rodando como root
if [[ $EUID -ne 0 ]]; then
   error "Este script deve ser executado como root (sudo)"
fi

# Atualizar sistema
log "Atualizando sistema..."
apt update && apt upgrade -y

# Instalar dependências básicas
log "Instalando dependências básicas..."
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Instalar Node.js 18.x
log "Instalando Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verificar versão do Node.js
NODE_VERSION=$(node --version)
log "Node.js instalado: $NODE_VERSION"

# Instalar PostgreSQL
log "Instalando PostgreSQL..."
apt install -y postgresql postgresql-contrib

# Configurar PostgreSQL
log "Configurando PostgreSQL..."
sudo -u postgres psql -c "CREATE DATABASE loja_utilidades_prod;"
sudo -u postgres psql -c "CREATE USER loja_user WITH ENCRYPTED PASSWORD 'senha_segura_producao';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE loja_utilidades_prod TO loja_user;"
sudo -u postgres psql -c "ALTER USER loja_user CREATEDB;"

# Instalar Nginx
log "Instalando Nginx..."
apt install -y nginx

# Instalar Certbot para SSL
log "Instalando Certbot..."
apt install -y certbot python3-certbot-nginx

# Criar usuário para aplicação
log "Criando usuário da aplicação..."
useradd -m -s /bin/bash www-data || true
usermod -aG www-data www-data

# Criar diretórios da aplicação
log "Criando diretórios da aplicação..."
mkdir -p /var/www/loja-utilidades
mkdir -p /var/www/loja-utilidades/backend
mkdir -p /var/www/loja-utilidades/frontend
mkdir -p /var/www/loja-utilidades/backend/logs
mkdir -p /var/www/loja-utilidades/backend/uploads
mkdir -p /backups
mkdir -p /var/cache/nginx

# Definir permissões
chown -R www-data:www-data /var/www/loja-utilidades
chown -R www-data:www-data /backups
chmod -R 755 /var/www/loja-utilidades

# Configurar firewall
log "Configurando firewall..."
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 5000
ufw --force enable

# Instalar PM2 para gerenciamento de processos
log "Instalando PM2..."
npm install -g pm2

# Configurar logrotate
log "Configurando logrotate..."
cat > /etc/logrotate.d/loja-utilidades << EOF
/var/www/loja-utilidades/backend/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload loja-utilidades
    endscript
}
EOF

# Configurar backup automático
log "Configurando backup automático..."
cat > /etc/cron.daily/backup-loja-utilidades << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="loja_utilidades_prod"

# Criar backup do banco
pg_dump -h localhost -U postgres $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Comprimir backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Manter apenas os últimos 7 backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

# Log do backup
echo "Backup criado: backup_$DATE.sql.gz" >> /var/log/backup-loja-utilidades.log
EOF

chmod +x /etc/cron.daily/backup-loja-utilidades

# Configurar monitoramento básico
log "Configurando monitoramento..."
apt install -y htop iotop nethogs

# Criar script de health check
cat > /usr/local/bin/health-check.sh << 'EOF'
#!/bin/bash
# Health check para a aplicação

# Verificar se o backend está rodando
if ! curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "Backend não está respondendo"
    systemctl restart loja-utilidades
    exit 1
fi

# Verificar se o Nginx está rodando
if ! systemctl is-active --quiet nginx; then
    echo "Nginx não está rodando"
    systemctl restart nginx
    exit 1
fi

# Verificar espaço em disco
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 90 ]; then
    echo "Disco com mais de 90% de uso: ${DISK_USAGE}%"
    exit 1
fi

echo "Health check OK"
exit 0
EOF

chmod +x /usr/local/bin/health-check.sh

# Adicionar health check ao cron
echo "*/5 * * * * /usr/local/bin/health-check.sh >> /var/log/health-check.log 2>&1" | crontab -

log "✅ Setup do servidor concluído com sucesso!"
log ""
log "📋 Próximos passos:"
log "1. Clone o repositório: git clone <url> /var/www/loja-utilidades"
log "2. Configure as variáveis de ambiente"
log "3. Execute o script de deploy: ./deploy/deploy.sh"
log "4. Configure o domínio no Nginx"
log "5. Obtenha certificado SSL: certbot --nginx -d seudominio.com"
log ""
log "🔧 Comandos úteis:"
log "- Verificar status: systemctl status loja-utilidades"
log "- Ver logs: journalctl -u loja-utilidades -f"
log "- Reiniciar: systemctl restart loja-utilidades"
log "- Health check: /usr/local/bin/health-check.sh" 