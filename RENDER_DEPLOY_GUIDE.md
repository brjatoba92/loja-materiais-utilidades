# 🚀 Guia de Deploy - Render (Alternativa Gratuita)

## 📋 **Por que Render?**

- ✅ **Totalmente gratuito** para sempre
- ✅ **PostgreSQL gratuito** incluído
- ✅ **Deploy automático** do GitHub
- ✅ **SSL/HTTPS** automático
- ✅ **Muito confiável** e estável
- ✅ **Interface simples** e intuitiva

## 🎯 **Passo a Passo - Deploy no Render**

### **1. Preparação**

```bash
# Verificar se está no diretório correto
cd /home/brunojatoba92/loja-materiais-utilidades

# Verificar arquivos criados
ls -la backend/render.yaml
ls -la backend/database/database-render.sql
```

### **2. Criar Conta no Render**

1. **Acesse** [render.com](https://render.com)
2. **Clique** em "Get Started for Free"
3. **Faça login** com GitHub
4. **Complete** o cadastro

### **3. Conectar Repositório**

1. **No Dashboard Render**:
   - Clique em "New" → "Web Service"
   - Selecione "Connect a repository"
   - Escolha seu repositório: `loja-materiais-utilidades`

### **4. Configurar Web Service**

#### **4.1. Configurações Básicas**
- **Name**: `loja-utilidades-backend`
- **Environment**: `Node`
- **Region**: `Oregon (US West)` (mais próximo)
- **Branch**: `main`
- **Root Directory**: `backend`

#### **4.2. Configurações de Build**
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

#### **4.3. Configurações Avançadas**
- **Plan**: `Free`
- **Auto-Deploy**: `Yes`

### **5. Configurar Banco de Dados**

#### **5.1. Criar PostgreSQL**
1. **No Dashboard Render**:
   - Clique em "New" → "PostgreSQL"
   - **Name**: `loja-utilidades-db`
   - **Database**: `loja_utilidades`
   - **User**: `loja_user`
   - **Plan**: `Free`

#### **5.2. Conectar ao Web Service**
1. **Vá** no seu Web Service
2. **Clique** em "Environment"
3. **Adicione** as variáveis do banco:
   - `DB_HOST` = `${DATABASE_HOST}`
   - `DB_NAME` = `${DATABASE_NAME}`
   - `DB_USER` = `${DATABASE_USER}`
   - `DB_PASSWORD` = `${DATABASE_PASSWORD}`
   - `DB_PORT` = `${DATABASE_PORT}`

### **6. Configurar Variáveis de Ambiente**

No seu Web Service → "Environment":

```env
NODE_ENV=production
PORT=10000
JWT_SECRET=sua_chave_secreta_muito_segura_aqui_2024
ALLOWED_ORIGINS=https://loja-utilidades.vercel.app,https://frontend-dun-omega-57.vercel.app
```

### **7. Executar Script SQL**

#### **7.1. Via Render Dashboard**
1. **Vá** no seu PostgreSQL
2. **Clique** em "Connect" → "External Database"
3. **Copie** a URL de conexão
4. **Use** um cliente PostgreSQL (pgAdmin, DBeaver, etc.)
5. **Execute** o script: `backend/database/database-render.sql`

#### **7.2. Via Terminal (se tiver acesso)**
```bash
# Conectar ao banco
psql "postgresql://loja_user:senha@host:port/loja_utilidades"

# Executar script
\i backend/database/database-render.sql
```

### **8. Fazer Deploy**

1. **Clique** em "Create Web Service"
2. **Aguarde** o build (2-3 minutos)
3. **Verifique** os logs

### **9. Verificar Deploy**

#### **9.1. Health Check**
```bash
# Testar endpoint de saúde
curl https://seu-app.onrender.com/api/health

# Resposta esperada:
{
  "status": "OK",
  "message": "API da Loja de Utilidades Funcionando !!!",
  "environment": "production"
}
```

#### **9.2. Testar Endpoints**
```bash
# Listar produtos
curl https://seu-app.onrender.com/api/produtos

# Login admin
curl -X POST https://seu-app.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@admin.com","senha":"admin123"}'
```

## 🔧 **Configurações Técnicas**

### **Arquivo render.yaml**
```yaml
services:
  - type: web
    name: loja-utilidades-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: JWT_SECRET
        generateValue: true
      - key: ALLOWED_ORIGINS
        value: https://loja-utilidades.vercel.app,https://frontend-dun-omega-57.vercel.app

databases:
  - name: loja-utilidades-db
    databaseName: loja_utilidades
    user: loja_user
```

### **CORS Configurado**
O `server.js` já está configurado para aceitar as URLs do frontend.

## 🐛 **Troubleshooting**

### **Erro: "Build failed"**
- Verificar se `package.json` está no diretório `backend`
- Verificar se todas as dependências estão listadas

### **Erro: "Database connection failed"**
- Verificar variáveis de ambiente do banco
- Verificar se o PostgreSQL foi criado
- Verificar se as credenciais estão corretas

### **Erro: "Port already in use"**
- Render usa porta 10000 por padrão
- Verificar se `PORT=10000` está configurado

### **Erro: "CORS"**
- Verificar se `ALLOWED_ORIGINS` está configurado
- Adicionar URL do frontend se necessário

## 📊 **Monitoramento**

### **Logs**
- **Render Dashboard** → Seu Web Service → "Logs"
- **Verificar** erros e warnings

### **Métricas**
- **Render Dashboard** → Seu Web Service → "Metrics"
- **Monitorar**: CPU, Memory, Requests

## 🎉 **Vantagens do Render**

### **Gratuito para Sempre**
- ✅ Web Service gratuito
- ✅ PostgreSQL gratuito
- ✅ SSL/HTTPS gratuito
- ✅ Deploy automático gratuito

### **Confiável**
- ✅ 99.9% uptime
- ✅ Suporte 24/7
- ✅ Backup automático
- ✅ Escalabilidade

### **Fácil de Usar**
- ✅ Interface intuitiva
- ✅ Deploy automático
- ✅ Logs em tempo real
- ✅ Métricas detalhadas

## 🔄 **Próximos Passos**

1. ✅ **Backend**: Deployado no Render
2. 🔄 **Frontend**: Deployar no Vercel
3. 🔄 **Integração**: Conectar frontend com backend
4. 🔄 **Testes**: Verificar todas as funcionalidades

## 📞 **Suporte**

### **Recursos Úteis**
- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- [GitHub Issues](https://github.com/seu-usuario/loja-materiais-utilidades/issues)

---

**🚀 Seu backend estará no ar no Render de forma gratuita e confiável!**

**Status**: ✅ Configuração pronta | 🔄 Deploy pendente
