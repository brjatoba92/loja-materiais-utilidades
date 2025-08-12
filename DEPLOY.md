# 🚀 Guia de Deploy e Produção - Loja de Utilidades

Este documento contém todas as informações necessárias para fazer o deploy da aplicação em produção.

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Setup do Servidor](#setup-do-servidor)
3. [Configuração de Domínio e SSL](#configuração-de-domínio-e-ssl)
4. [Deploy da Aplicação](#deploy-da-aplicação)
5. [Monitoramento](#monitoramento)
6. [Backup e Recuperação](#backup-e-recuperação)
7. [Manutenção](#manutenção)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 Pré-requisitos

### Servidor
- **Sistema Operacional**: Ubuntu 20.04 LTS ou superior
- **CPU**: 2 cores mínimo, 4 cores recomendado
- **RAM**: 4GB mínimo, 8GB recomendado
- **Disco**: 20GB mínimo, SSD recomendado
- **Rede**: Conexão estável com IP público

### Domínio
- Domínio registrado (ex: `seudominio.com`)
- Acesso ao painel de DNS do provedor

### Contas e Serviços
- Conta GitHub para CI/CD
- Conta no provedor de hospedagem (DigitalOcean, AWS, etc.)

---

## 🖥️ Setup do Servidor

### 1. Acesso Inicial
```bash
# Conectar via SSH
ssh root@seu-ip-do-servidor

# Atualizar sistema
apt update && apt upgrade -y
```

### 2. Executar Script de Setup
```bash
# Baixar e executar script de setup
wget https://raw.githubusercontent.com/seu-usuario/loja-materiais-utilidades/main/deploy/setup-server.sh
chmod +x setup-server.sh
sudo bash setup-server.sh
```

### 3. Verificar Instalação
```bash
# Verificar Node.js
node --version  # Deve ser v18.x

# Verificar PostgreSQL
sudo -u postgres psql -c "\l"  # Listar bancos

# Verificar Nginx
nginx -v

# Verificar PM2
pm2 --version
```

---

## 🌐 Configuração de Domínio e SSL

### 1. Configurar DNS
No painel do seu provedor de domínio, configure:

```
Tipo: A
Nome: @
Valor: [IP_DO_SEU_SERVIDOR]

Tipo: A  
Nome: www
Valor: [IP_DO_SEU_SERVIDOR]
```

### 2. Configurar Nginx
```bash
# Copiar configuração do Nginx
sudo cp deploy/nginx.conf /etc/nginx/sites-available/loja-utilidades

# Editar domínio na configuração
sudo nano /etc/nginx/sites-available/loja-utilidades
# Substituir "seudominio.com" pelo seu domínio real

# Ativar site
sudo ln -s /etc/nginx/sites-available/loja-utilidades /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remover site padrão

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### 3. Obter Certificado SSL
```bash
# Obter certificado Let's Encrypt
sudo certbot --nginx -d seudominio.com -d www.seudominio.com

# Configurar renovação automática
sudo crontab -e
# Adicionar linha: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🚀 Deploy da Aplicação

### 1. Configurar Variáveis de Ambiente

#### Backend (.env)
```bash
# Criar arquivo de ambiente
sudo nano /var/www/loja-utilidades/backend/.env

# Conteúdo:
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=loja_utilidades_prod
DB_USER=loja_user
DB_PASSWORD=senha_segura_producao
JWT_SECRET=seu_jwt_secret_super_seguro_para_producao_2025
CORS_ORIGIN=https://seudominio.com
```

#### Frontend (.env)
```bash
# Criar arquivo de ambiente
sudo nano /var/www/loja-utilidades/frontend/.env

# Conteúdo:
VITE_API_URL=https://seudominio.com/api
VITE_APP_NAME=Loja de Utilidades
VITE_ENVIRONMENT=production
```

### 2. Configurar Systemd Service
```bash
# Copiar arquivo de serviço
sudo cp deploy/loja-utilidades.service /etc/systemd/system/

# Recarregar systemd
sudo systemctl daemon-reload

# Habilitar serviço
sudo systemctl enable loja-utilidades
```

### 3. Executar Deploy
```bash
# Navegar para diretório da aplicação
cd /var/www/loja-utilidades

# Executar script de deploy
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

### 4. Verificar Deploy
```bash
# Verificar status do serviço
sudo systemctl status loja-utilidades

# Verificar logs
sudo journalctl -u loja-utilidades -f

# Testar API
curl https://seudominio.com/api/health

# Testar frontend
curl https://seudominio.com/
```

---

## 📊 Monitoramento

### 1. Logs
```bash
# Logs do sistema
sudo journalctl -u loja-utilidades -f

# Logs da aplicação
tail -f /var/www/loja-utilidades/backend/logs/combined.log

# Logs de erro
tail -f /var/www/loja-utilidades/backend/logs/error.log

# Logs do Nginx
sudo tail -f /var/log/nginx/loja-utilidades.access.log
sudo tail -f /var/log/nginx/loja-utilidades.error.log
```

### 2. Monitoramento de Recursos
```bash
# Uso de CPU e memória
htop

# Uso de disco
df -h

# Uso de rede
nethogs

# Processos
ps aux | grep node
```

### 3. Health Check
```bash
# Executar health check manual
/usr/local/bin/health-check.sh

# Verificar logs do health check
tail -f /var/log/health-check.log
```

---

## 💾 Backup e Recuperação

### 1. Backup Automático
O sistema já está configurado para fazer backup automático diário:
- **Localização**: `/backups/`
- **Frequência**: Diário às 2:00 AM
- **Retenção**: 7 dias

### 2. Backup Manual
```bash
# Backup do banco
pg_dump -h localhost -U postgres loja_utilidades_prod > backup_manual_$(date +%Y%m%d_%H%M%S).sql

# Backup dos arquivos
tar -czf app_backup_$(date +%Y%m%d_%H%M%S).tar.gz /var/www/loja-utilidades --exclude=node_modules --exclude=dist
```

### 3. Restauração
```bash
# Restaurar banco
psql -h localhost -U postgres loja_utilidades_prod < backup_arquivo.sql

# Restaurar arquivos
tar -xzf app_backup_arquivo.tar.gz -C /
```

---

## 🔧 Manutenção

### 1. Atualizações
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Atualizar aplicação
cd /var/www/loja-utilidades
git pull origin main
./deploy/deploy.sh
```

### 2. Limpeza
```bash
# Limpar logs antigos
sudo find /var/log -name "*.log" -mtime +30 -delete

# Limpar cache do Nginx
sudo rm -rf /var/cache/nginx/*

# Limpar backups antigos
sudo find /backups -name "*.sql.gz" -mtime +30 -delete
```

### 3. Reinicialização
```bash
# Reiniciar aplicação
sudo systemctl restart loja-utilidades

# Reiniciar Nginx
sudo systemctl restart nginx

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```

---

## 🛠️ Troubleshooting

### Problemas Comuns

#### 1. Aplicação não inicia
```bash
# Verificar logs
sudo journalctl -u loja-utilidades -f

# Verificar variáveis de ambiente
sudo systemctl show loja-utilidades --property=Environment

# Verificar permissões
ls -la /var/www/loja-utilidades/
```

#### 2. Banco de dados não conecta
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Testar conexão
psql -h localhost -U loja_user -d loja_utilidades_prod

# Verificar logs do PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-*.log
```

#### 3. SSL não funciona
```bash
# Verificar certificado
sudo certbot certificates

# Renovar certificado
sudo certbot renew

# Verificar configuração Nginx
sudo nginx -t
```

#### 4. Performance lenta
```bash
# Verificar uso de recursos
htop
df -h
free -h

# Verificar logs de performance
tail -f /var/www/loja-utilidades/backend/logs/combined.log | grep "slow_request"

# Verificar queries lentas
sudo tail -f /var/log/postgresql/postgresql-*.log | grep "duration"
```

### Comandos Úteis

```bash
# Verificar status de todos os serviços
sudo systemctl status loja-utilidades nginx postgresql

# Verificar portas em uso
sudo netstat -tlnp

# Verificar espaço em disco
df -h

# Verificar uso de memória
free -h

# Verificar processos Node.js
ps aux | grep node

# Reiniciar tudo
sudo systemctl restart loja-utilidades nginx postgresql
```

---

## 📞 Suporte

### Logs Importantes
- **Aplicação**: `/var/www/loja-utilidades/backend/logs/`
- **Sistema**: `journalctl -u loja-utilidades`
- **Nginx**: `/var/log/nginx/`
- **PostgreSQL**: `/var/log/postgresql/`

### Contatos
- **Desenvolvedor**: [seu-email@exemplo.com]
- **Documentação**: [link-para-docs]
- **Repositório**: [link-para-github]

---

## ✅ Checklist de Deploy

- [ ] Servidor configurado e atualizado
- [ ] Node.js 18.x instalado
- [ ] PostgreSQL configurado
- [ ] Nginx configurado
- [ ] Domínio apontando para servidor
- [ ] SSL configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Aplicação deployada
- [ ] Health check funcionando
- [ ] Backup automático configurado
- [ ] Monitoramento ativo
- [ ] Testes realizados

---

*Última atualização: Agosto 2025*
*Versão: 2.0 - Deploy Completo* 