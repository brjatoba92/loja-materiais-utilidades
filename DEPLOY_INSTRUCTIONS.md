# 🚀 Guia Completo de Deploy - Backend no Railway

## 📋 **Pré-requisitos**

- ✅ Conta no [Railway](https://railway.app)
- ✅ Conta no [GitHub](https://github.com)
- ✅ Repositório do projeto no GitHub
- ✅ Node.js instalado localmente (para testes)

## 🎯 **Estrutura do Projeto**

```
loja-materiais-utilidades/
├── backend/                 # 🎯 Foco do deploy
│   ├── server.js           # Servidor principal
│   ├── package.json        # Dependências
│   ├── config/
│   │   ├── database.js     # Configuração do banco
│   │   └── production.js   # Configurações de produção
│   ├── routes/             # Rotas da API
│   └── database/           # Scripts SQL
├── frontend/               # Deploy separado (Vercel)
└── railway.json           # Configuração Railway
```

## 🚀 **Passo a Passo - Deploy no Railway**

### **1. Preparação do Repositório**

```bash
# Verificar se está no diretório correto
cd /home/brunojatoba92/loja-materiais-utilidades

# Verificar se o backend está pronto
ls -la backend/
```

### **2. Acessar Railway**

1. **Acesse** [railway.app](https://railway.app)
2. **Faça login** com sua conta GitHub
3. **Clique** em "Start a New Project"

### **3. Conectar Repositório**

1. **Selecione** "Deploy from GitHub repo"
2. **Escolha** seu repositório: `loja-materiais-utilidades`
3. **Clique** em "Deploy Now"

### **4. Configurar Projeto**

Após o deploy inicial, configure:

#### **4.1. Root Directory**
- **Vá** em "Settings" → "General"
- **Configure** "Root Directory": `backend`

#### **4.2. Build Command**
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

#### **4.3. Porta**
- **Port**: `5000` (será configurado automaticamente)

### **5. Configurar Banco de Dados**

#### **Opção A: PostgreSQL no Railway (Recomendado)**

1. **No Railway Dashboard**:
   - Clique em "New"
   - Selecione "Database" → "PostgreSQL"
   - Aguarde a criação

2. **Conectar ao Projeto**:
   - Vá em "Variables" no seu projeto backend
   - As variáveis do banco serão adicionadas automaticamente

#### **Opção B: Supabase (Alternativa Gratuita)**

1. **Acesse** [supabase.com](https://supabase.com)
2. **Crie** um novo projeto
3. **Vá** em "SQL Editor"
4. **Execute** o script: `backend/database/database.sql`

### **6. Configurar Variáveis de Ambiente**

No Railway Dashboard → "Variables":

```env
# Ambiente
NODE_ENV=production
PORT=5000

# Banco de Dados (Railway PostgreSQL)
DB_HOST=${DATABASE_HOST}
DB_NAME=${DATABASE_NAME}
DB_USER=${DATABASE_USER}
DB_PASSWORD=${DATABASE_PASSWORD}
DB_PORT=${DATABASE_PORT}

# JWT
JWT_SECRET=sua_chave_secreta_muito_segura_aqui_2024

# CORS (URLs permitidas)
ALLOWED_ORIGINS=https://seu-frontend.vercel.app,https://outro-dominio.com
```

### **7. Executar Scripts de Banco**

#### **7.1. Via Railway CLI**

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Conectar ao projeto
railway link

# Executar script SQL
railway run -- cat database/database.sql | psql $DATABASE_URL
```

#### **7.2. Via Dashboard Railway**

1. **Vá** em "Deployments"
2. **Clique** no deployment mais recente
3. **Acesse** "Logs"
4. **Verifique** se não há erros de conexão com banco

### **8. Verificar Deploy**

#### **8.1. Health Check**

```bash
# Testar endpoint de saúde
curl https://seu-projeto.railway.app/api/health

# Resposta esperada:
{
  "status": "OK",
  "message": "API da Loja de Utilidades Funcionando !!!",
  "timestamp": "2024-01-XX...",
  "environment": "production",
  "version": "2.0.0"
}
```

#### **8.2. Testar Conexão com Banco**

```bash
# Testar endpoint de produtos
curl https://seu-projeto.railway.app/api/produtos

# Deve retornar lista de produtos ou array vazio
```

### **9. Configurar Domínio Personalizado (Opcional)**

1. **No Railway Dashboard**:
   - Vá em "Settings" → "Domains"
   - Clique em "Generate Domain"
   - Ou adicione seu domínio personalizado

2. **Atualizar CORS**:
   - Adicione o novo domínio em `server.js`
   - Faça novo deploy

### **10. Monitoramento e Logs**

#### **10.1. Verificar Logs**

```bash
# Via Railway CLI
railway logs

# Ou no Dashboard → "Deployments" → "Logs"
```

#### **10.2. Métricas**

- **Railway Dashboard** → "Metrics"
- **Monitorar**: CPU, Memory, Requests

## 🔧 **Configurações Técnicas**

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

### **CORS Configurado**

O `server.js` já está configurado para produção:

```javascript
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://loja-utilidades.vercel.app',
    'https://frontend-dun-omega-57.vercel.app'
];
```

### **SSL/HTTPS**

- ✅ **Automático** no Railway
- ✅ **Certificados** gerenciados automaticamente

## 🐛 **Troubleshooting**

### **Erro: "Cannot find module"**

```bash
# Verificar se todas as dependências estão no package.json
cd backend
npm install
```

### **Erro: "Connection refused" (Banco)**

1. **Verificar** variáveis de ambiente
2. **Testar** conexão com banco
3. **Verificar** se o banco está ativo no Railway

### **Erro: "CORS"**

```javascript
// Temporariamente, no server.js
app.use(cors({
    origin: true, // Aceitar todas as origens
    credentials: true
}));
```

### **Erro: "Port already in use"**

- ✅ **Railway** gerencia a porta automaticamente
- ✅ **Verificar** se não há conflito no `server.js`

## 📊 **Verificação Final**

### **Checklist de Deploy**

- [ ] ✅ Backend deployado no Railway
- [ ] ✅ Banco de dados configurado
- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ Health check funcionando
- [ ] ✅ API respondendo corretamente
- [ ] ✅ CORS configurado
- [ ] ✅ Logs sem erros críticos

### **Testes de Funcionalidade**

```bash
# 1. Health Check
curl https://seu-projeto.railway.app/api/health

# 2. Listar Produtos
curl https://seu-projeto.railway.app/api/produtos

# 3. Login (se houver dados)
curl -X POST https://seu-projeto.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@admin.com","senha":"admin123"}'
```

## 🔄 **Deploy Automatizado**

### **GitHub Actions (Opcional)**

Crie `.github/workflows/railway-deploy.yml`:

```yaml
name: Deploy to Railway
on:
  push:
    branches: [main]
    paths: ['backend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: railway/deploy@v1
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
```

## 📱 **URLs Finais**

Após o deploy bem-sucedido:

- **Backend API**: `https://seu-projeto.railway.app`
- **Health Check**: `https://seu-projeto.railway.app/api/health`
- **Documentação**: `https://seu-projeto.railway.app/api/docs` (se configurado)

## 🎉 **Próximos Passos**

1. ✅ **Configurar** frontend no Vercel
2. ✅ **Atualizar** URLs da API no frontend
3. ✅ **Testar** integração completa
4. ✅ **Configurar** monitoramento
5. ✅ **Configurar** backup automático do banco

## 📞 **Suporte**

### **Recursos Úteis**

- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [GitHub Issues](https://github.com/seu-usuario/loja-materiais-utilidades/issues)

### **Comandos Úteis**

```bash
# Railway CLI
railway login
railway link
railway logs
railway status
railway up

# Verificar deploy
railway logs --tail
```

---

**🚀 Seu backend está pronto para produção no Railway!**

**Próximo passo**: Configurar o frontend no Vercel e integrar as aplicações.
