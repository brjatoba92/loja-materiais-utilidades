# 🚀 Guia de Deploy - Loja de Utilidades

## 📋 **Modificações Realizadas**

### ✅ **Arquivos Modificados/Criados:**

1. **`backend/server.js`** - Configurado para produção
2. **`vercel.json`** - Configuração para Vercel
3. **`railway.json`** - Configuração para Railway
4. **`deploy.sh`** - Script de deploy automatizado
5. **`DEPLOY_INSTRUCTIONS.md`** - Este guia

## 🚀 **Deploy Rápido**

### **Opção 1: Deploy Separado (Recomendado)**

#### **1. Backend no Railway**

1. **Acesse** [railway.app](https://railway.app)
2. **Faça login** com GitHub
3. **Clique** em "New Project"
4. **Selecione** "Deploy from GitHub repo"
5. **Escolha** seu repositório
6. **Configure**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

#### **2. Configurar Banco de Dados**

**Opção A: Railway PostgreSQL**
1. No Railway, clique em "New"
2. Selecione "Database" → "PostgreSQL"
3. Conecte ao seu projeto

**Opção B: Supabase (Gratuito)**
1. Acesse [supabase.com](https://supabase.com)
2. Crie projeto
3. Vá em SQL Editor
4. Execute: `backend/database/database.sql`

#### **3. Variáveis de Ambiente no Railway**

```env
NODE_ENV=production
PORT=5000
DB_HOST=seu_host
DB_NAME=seu_banco
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_PORT=5432
JWT_SECRET=sua_chave_secreta_muito_segura
```

#### **4. Frontend no Vercel**

1. **Acesse** [vercel.com](https://vercel.com)
2. **Faça login** com GitHub
3. **Clique** em "New Project"
4. **Importe** seu repositório
5. **Configure**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### **5. Atualizar URL da API**

No arquivo `frontend/src/services/api.js`:

```javascript
const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production' 
        ? 'https://seu-backend.railway.app/api'  // URL do Railway
        : 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    }
});
```

#### **6. Variáveis de Ambiente no Vercel**

```env
VITE_API_URL=https://seu-backend.railway.app/api
```

## 🛠️ **Deploy Automatizado**

### **Usar o Script de Deploy**

```bash
# Executar script de deploy
./deploy.sh
```

### **Deploy Manual**

```bash
# Backend
cd backend
git add .
git commit -m "Deploy backend"
git push origin main

# Frontend
cd frontend
npm run build
vercel --prod
```

## 🔧 **Configurações Específicas**

### **CORS Configurado**

O `server.js` já está configurado com CORS para produção. Atualize as URLs permitidas:

```javascript
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://seu-frontend.vercel.app', // SUA URL DO VERCEL
];
```

### **Health Check**

A API já tem endpoint de health check:
```
GET https://seu-backend.railway.app/api/health
```

## 📊 **Verificação do Deploy**

### **1. Testar Backend**

```bash
# Testar API
curl https://seu-backend.railway.app/api/health

# Resposta esperada:
{
  "status": "OK",
  "message": "API da Loja de Utilidades Funcionando !!!",
  "timestamp": "2025-01-XX...",
  "environment": "production",
  "version": "2.0.0"
}
```

### **2. Testar Frontend**

1. Acesse a URL do Vercel
2. Teste login admin (admin/admin123)
3. Teste funcionalidades principais

### **3. Testar Integração**

1. Navegar pelo catálogo
2. Adicionar produtos ao carrinho
3. Fazer checkout
4. Acessar área administrativa

## 🐛 **Troubleshooting**

### **Erro de CORS**

```javascript
// Temporariamente, no backend/server.js
app.use(cors({
    origin: true, // Aceitar todas as origens
    credentials: true
}));
```

### **Erro de Banco**

1. Verificar variáveis de ambiente
2. Testar conexão com banco
3. Verificar logs no Railway

### **Erro de Build**

```bash
# Limpar cache
rm -rf node_modules package-lock.json
npm install
```

## 📱 **URLs Finais**

Após o deploy, você terá:

- **Backend**: `https://seu-backend.railway.app`
- **Frontend**: `https://seu-frontend.vercel.app`
- **API Health**: `https://seu-backend.railway.app/api/health`

## 🎉 **Próximos Passos**

1. ✅ Configurar domínio personalizado (opcional)
2. ✅ Configurar SSL/HTTPS (automático)
3. ✅ Configurar monitoramento
4. ✅ Configurar backup do banco
5. ✅ Testar todas as funcionalidades

## 📞 **Suporte**

Se encontrar problemas:

1. Verificar logs no Railway/Vercel
2. Testar endpoints da API
3. Verificar variáveis de ambiente
4. Consultar documentação específica

---

**🚀 Sua aplicação está pronta para produção!**
