# 🚀 Deploy Rápido - Railway Backend

## ⚡ **Deploy em 5 Minutos**

### **1. Preparação (1 minuto)**
```bash
# Verificar se está no diretório correto
cd /home/brunojatoba92/loja-materiais-utilidades

# Tornar script executável (se necessário)
chmod +x deploy-railway.sh
```

### **2. Executar Deploy Automatizado (2 minutos)**
```bash
# Executar script de deploy
./deploy-railway.sh
```

### **3. Configurar Banco de Dados (1 minuto)**
1. **Acesse** [railway.app](https://railway.app)
2. **Vá** no seu projeto
3. **Clique** em "New" → "Database" → "PostgreSQL"
4. **Aguarde** a criação

### **4. Configurar Variáveis (1 minuto)**
No Railway Dashboard → "Variables":

```env
NODE_ENV=production
JWT_SECRET=sua_chave_secreta_muito_segura_aqui_2024
ALLOWED_ORIGINS=https://seu-frontend.vercel.app
```

## ✅ **Verificação Rápida**

```bash
# Testar se está funcionando
curl https://seu-projeto.railway.app/api/health
```

**Resposta esperada:**
```json
{
  "status": "OK",
  "message": "API da Loja de Utilidades Funcionando !!!",
  "environment": "production"
}
```

## 🎯 **Próximos Passos**

1. ✅ **Backend**: Deployado no Railway
2. 🔄 **Frontend**: Deployar no Vercel
3. 🔄 **Integração**: Conectar frontend com backend
4. 🔄 **Testes**: Verificar todas as funcionalidades

## 🆘 **Problemas Comuns**

### **Erro: "Cannot find module"**
```bash
cd backend
npm install
railway up
```

### **Erro: "Connection refused"**
- Verificar se o banco PostgreSQL foi criado no Railway
- Verificar variáveis de ambiente

### **Erro: "CORS"**
- Adicionar URL do frontend em `ALLOWED_ORIGINS`

## 📞 **Comandos Úteis**

```bash
# Ver logs
railway logs --tail

# Ver status
railway status

# Abrir dashboard
railway open

# Novo deploy
railway up
```

---

**🚀 Seu backend está no ar! Próximo: Frontend no Vercel.**
