# 🚀 Guia de Deploy no Railway

## 📋 **Passo a Passo Completo**

### **1. Configurar Banco de Dados (Supabase)**

#### **1.1 Criar Conta no Supabase**
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub
4. Clique em "New Project"

#### **1.2 Configurar Projeto**
1. **Nome**: `loja-utilidades-db`
2. **Database Password**: Crie uma senha forte
3. **Region**: Escolha a mais próxima (ex: São Paulo)
4. Clique em "Create new project"

#### **1.3 Executar Script SQL**
1. No painel do Supabase, vá em "SQL Editor"
2. Clique em "New query"
3. Cole o conteúdo do arquivo `supabase-setup.sql`
4. Clique em "Run"

#### **1.4 Obter Credenciais**
1. Vá em "Settings" → "Database"
2. Copie as informações:
   - **Host**: `db.xxxxxxxxxxxxx.supabase.co`
   - **Database**: `postgres`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Password**: (a senha que você criou)

### **2. Deploy do Backend no Railway**

#### **2.1 Acessar Railway**
1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique em "New Project"

#### **2.2 Conectar Repositório**
1. Selecione "Deploy from GitHub repo"
2. Escolha seu repositório: `loja-materiais-utilidades`
3. Clique em "Deploy Now"

#### **2.3 Configurar Pasta**
1. No Railway, vá em "Settings"
2. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

#### **2.4 Configurar Variáveis de Ambiente**
1. Vá em "Variables"
2. Adicione as seguintes variáveis:

```env
NODE_ENV=production
PORT=5000
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=sua_senha_do_supabase
DB_PORT=5432
JWT_SECRET=sua_chave_secreta_muito_segura_aqui
```

#### **2.5 Obter URL do Backend**
1. Após o deploy, o Railway fornecerá uma URL
2. Exemplo: `https://seu-backend.railway.app`
3. Teste a API: `https://seu-backend.railway.app/api/health`

### **3. Atualizar Frontend**

#### **3.1 Atualizar URL da API**
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

#### **3.2 Fazer Novo Deploy do Frontend**
```bash
cd frontend
npm run build
npx vercel --prod
```

### **4. Testar Aplicação**

#### **4.1 Testar Backend**
```bash
curl https://seu-backend.railway.app/api/health
```

Resposta esperada:
```json
{
  "status": "OK",
  "message": "API da Loja de Utilidades Funcionando !!!",
  "timestamp": "2025-01-XX...",
  "environment": "production",
  "version": "2.0.0"
}
```

#### **4.2 Testar Frontend**
1. Acesse: `https://loja-utilidades.vercel.app`
2. Teste login admin: `admin` / `admin123`
3. Teste funcionalidades principais

### **5. URLs Finais**

Após o deploy completo:
- **Frontend**: `https://loja-utilidades.vercel.app`
- **Backend**: `https://seu-backend.railway.app`
- **API Health**: `https://seu-backend.railway.app/api/health`

## 🐛 **Troubleshooting**

### **Erro de Conexão com Banco**
1. Verificar variáveis de ambiente no Railway
2. Testar conexão com Supabase
3. Verificar logs no Railway

### **Erro de CORS**
1. Verificar configuração no `backend/server.js`
2. Atualizar URLs permitidas

### **Erro de Build**
1. Verificar logs no Railway
2. Testar localmente primeiro

## 📞 **Suporte**

Se encontrar problemas:
1. Verificar logs no Railway
2. Testar endpoints da API
3. Verificar variáveis de ambiente
4. Consultar documentação do Supabase/Railway

---

**🚀 Sua aplicação estará 100% funcional em produção!**
