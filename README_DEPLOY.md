# 🚀 Guia Completo de Deploy - Loja de Utilidades

## 📋 **Visão Geral**

Este projeto é uma aplicação full-stack de loja de utilidades domésticas com:
- **Backend**: Node.js + Express + PostgreSQL (deploy no Railway)
- **Frontend**: React + Vite (deploy no Vercel)

## 🎯 **Estrutura do Projeto**

```
loja-materiais-utilidades/
├── backend/                 # 🎯 Backend Node.js
│   ├── server.js           # Servidor principal
│   ├── package.json        # Dependências
│   ├── config/             # Configurações
│   ├── routes/             # Rotas da API
│   └── database/           # Scripts SQL
├── frontend/               # 🎯 Frontend React
├── deploy-railway.sh       # Script de deploy automatizado
├── setup-database.sh       # Script de configuração do banco
└── DEPLOY_INSTRUCTIONS.md  # Guia detalhado
```

## ⚡ **Deploy Rápido (5 minutos)**

### **1. Backend no Railway**

```bash
# Executar deploy automatizado
./deploy-railway.sh
```

### **2. Configurar Banco de Dados**

```bash
# Configurar banco PostgreSQL
./setup-database.sh
```

### **3. Verificar Deploy**

```bash
# Testar se está funcionando
curl https://seu-projeto.railway.app/api/health
```

## 📚 **Guias Detalhados**

### **📖 Guia Completo**
- [DEPLOY_INSTRUCTIONS.md](DEPLOY_INSTRUCTIONS.md) - Instruções detalhadas

### **⚡ Guia Rápido**
- [RAILWAY_QUICK_DEPLOY.md](RAILWAY_QUICK_DEPLOY.md) - Deploy em 5 minutos

## 🛠️ **Scripts Disponíveis**

### **deploy-railway.sh**
Script automatizado para deploy no Railway:
- ✅ Instala Railway CLI
- ✅ Faz login automático
- ✅ Linka projeto
- ✅ Verifica dependências
- ✅ Faz deploy
- ✅ Testa health check

```bash
chmod +x deploy-railway.sh
./deploy-railway.sh
```

### **setup-database.sh**
Script para configurar banco de dados:
- ✅ Verifica conexão com Railway
- ✅ Executa scripts SQL
- ✅ Cria tabelas
- ✅ Insere dados iniciais
- ✅ Testa conexão

```bash
chmod +x setup-database.sh
./setup-database.sh
```

## 🔧 **Configurações**

### **Variáveis de Ambiente (Railway)**

```env
# Ambiente
NODE_ENV=production
PORT=5000

# Banco de Dados (automático no Railway)
DB_HOST=${DATABASE_HOST}
DB_NAME=${DATABASE_NAME}
DB_USER=${DATABASE_USER}
DB_PASSWORD=${DATABASE_PASSWORD}
DB_PORT=${DATABASE_PORT}

# Segurança
JWT_SECRET=sua_chave_secreta_muito_segura_aqui_2024

# CORS
ALLOWED_ORIGINS=https://seu-frontend.vercel.app
```

### **Arquivo railway.json**

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server.js",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## 🧪 **Testes de Funcionalidade**

### **Health Check**
```bash
curl https://seu-projeto.railway.app/api/health
```

### **Listar Produtos**
```bash
curl https://seu-projeto.railway.app/api/produtos
```

### **Login Admin**
```bash
curl -X POST https://seu-projeto.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@admin.com","senha":"admin123"}'
```

## 📊 **Endpoints da API**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/health` | Health check |
| GET | `/api/produtos` | Listar produtos |
| POST | `/api/auth/login` | Login |
| GET | `/api/usuarios` | Listar usuários |
| GET | `/api/pedidos` | Listar pedidos |
| GET | `/api/stats` | Estatísticas |

## 🐛 **Troubleshooting**

### **Erro: "Cannot find module"**
```bash
cd backend
npm install
railway up
```

### **Erro: "Connection refused" (Banco)**
1. Verificar se PostgreSQL foi criado no Railway
2. Verificar variáveis de ambiente
3. Executar `./setup-database.sh`

### **Erro: "CORS"**
- Adicionar URL do frontend em `ALLOWED_ORIGINS`
- Verificar configuração no `server.js`

### **Erro: "Port already in use"**
- Railway gerencia a porta automaticamente
- Verificar se não há conflito no `server.js`

## 📞 **Comandos Úteis**

### **Railway CLI**
```bash
# Login
railway login

# Linkar projeto
railway link

# Ver status
railway status

# Ver logs
railway logs --tail

# Fazer deploy
railway up

# Abrir dashboard
railway open
```

### **Banco de Dados**
```bash
# Conectar ao banco
railway run -- psql $DATABASE_URL

# Ver tabelas
railway run -- psql $DATABASE_URL -c "\dt"

# Executar SQL
railway run -- psql $DATABASE_URL -f arquivo.sql
```

## 🎉 **Checklist de Deploy**

- [ ] ✅ Backend deployado no Railway
- [ ] ✅ Banco PostgreSQL configurado
- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ Scripts SQL executados
- [ ] ✅ Health check funcionando
- [ ] ✅ API respondendo corretamente
- [ ] ✅ CORS configurado
- [ ] ✅ Logs sem erros críticos

## 🔄 **Próximos Passos**

1. ✅ **Backend**: Deployado no Railway
2. 🔄 **Frontend**: Deployar no Vercel
3. 🔄 **Integração**: Conectar frontend com backend
4. 🔄 **Testes**: Verificar todas as funcionalidades
5. 🔄 **Monitoramento**: Configurar alertas
6. 🔄 **Backup**: Configurar backup automático

## 📞 **Suporte**

### **Recursos Úteis**
- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [GitHub Issues](https://github.com/seu-usuario/loja-materiais-utilidades/issues)

### **Contato**
- **Email**: seu-email@exemplo.com
- **GitHub**: [@seu-usuario](https://github.com/seu-usuario)

---

**🚀 Sua aplicação está pronta para produção!**

**Status**: ✅ Backend configurado | �� Frontend pendente
