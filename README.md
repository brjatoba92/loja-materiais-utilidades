# 🏪 Loja de Utilidades Domésticas - Sistema E-commerce Completo

Sistema de e-commerce totalmente funcional com painel administrativo avançado, área do cliente responsiva, sistema de cashback automático e dashboard analytics. Desenvolvido com React (frontend) + Node.js/Express + PostgreSQL (backend).

## 🎯 **Status do Projeto: SISTEMA COMPLETO E FUNCIONAL**

✅ **Backend API**: 20+ endpoints implementados
✅ **Frontend SPA**: Interface completa e responsiva  
✅ **Dashboard Admin**: Métricas em tempo real + gráficos
✅ **E-commerce**: Catálogo + carrinho + checkout + cashback
✅ **Banco de Dados**: PostgreSQL com 5 tabelas relacionadas
✅ **Segurança**: JWT + validações + rate limiting

## 📂 Estrutura do Projeto

```
loja-materiais-utilidades/
├─ backend/              # API RESTful completa
│  ├─ routes/           # 5 módulos de rotas (auth, produtos, pedidos, usuários, stats)
│  ├─ middleware/       # Autenticação JWT + validações
│  ├─ database/         # Schema PostgreSQL + seeds
│  ├─ scripts/          # Utilitários (criar admin, etc)
│  └─ README.md         # Documentação da API
│
└─ frontend/            # SPA React responsiva
   ├─ src/pages/        # 14 páginas (público + admin)
   ├─ src/components/   # Componentes reutilizáveis
   ├─ src/services/     # Integração com API
   ├─ src/contexts/     # Estado global (Auth + Cart)
   └─ README.md         # Documentação do frontend
```

## 🛠️ Tecnologias Implementadas

### Backend
- **Node.js** + Express.js
- **PostgreSQL** com relacionamentos
- **JWT** para autenticação
- **Helmet** + CORS + Rate Limiting
- **bcrypt** para senhas
- **express-validator** + Joi

### Frontend  
- **React 18** + Vite
- **Tailwind CSS** (design system)
- **React Router DOM** (SPA)
- **Axios** (HTTP client)
- **React Hook Form** (formulários)
- **React Hot Toast** (notificações)

## ⚙️ Requisitos

- Node.js 18+
- PostgreSQL 14+

## 🗄️ Banco de Dados

1) Crie o banco e aplique o script (DDL/funcionalidades) em `backend/database/database.sql`.
2) Configure as variáveis de ambiente do backend (arquivo `.env` na pasta `backend/`):

```
DB_USER=postgres
DB_PASSWORD=senha
DB_HOST=localhost
DB_NAME=loja_utilidades
DB_PORT=5432
NODE_ENV=development
PORT=5000
```

## ▶️ Como rodar

Backend (porta 5000):
```
cd backend
npm install
npm run dev
```

Frontend (porta 5173 em dev / 5174 em preview):
```
cd frontend
npm install
npm run dev
```

Base URL do frontend para a API está em `frontend/src/services/api.js` (`http://localhost:5000/api`).

## 🔐 Autenticação (Admin)

- Login via `POST /api/auth/login` e verificação via `GET /api/auth/verify`.
- O token é salvo em `localStorage` como `admin_token` e habilita as rotas protegidas do painel.

---

## ✨ Funcionalidades Principais Implementadas

### 🛒 **E-commerce Completo**
- **Catálogo de Produtos**: Listagem com filtros, busca e paginação
- **Detalhes do Produto**: Página individual com informações completas
- **Carrinho de Compras**: Gestão de itens, quantidades e totais
- **Checkout Inteligente**: Finalização com cashback automático
- **Sistema de Pontos**: 1 ponto = R$ 1,00 a cada R$ 50,00 gastos

### 📊 **Dashboard Administrativo**
- **Métricas em Tempo Real**: Pedidos, receita, clientes
- **Gráficos Interativos**: Receita mensal dos últimos 12 meses
- **Comparação de Períodos**: Variação percentual (30/90 dias)
- **Filtros Avançados**: Análise por período customizado

### 🏪 **Gestão de Produtos**
- **CRUD Completo**: Criar, editar, visualizar e excluir
- **Controle de Estoque**: Atualização em tempo real
- **Categorias Dinâmicas**: Gestão automática de categorias
- **Upload de Imagens**: Interface para fotos dos produtos

### 📦 **Sistema de Pedidos**
- **Processamento Automático**: Checkout com validações
- **Gestão de Status**: Acompanhamento completo
- **Histórico Detalhado**: Por cliente e produto
- **Exclusão Segura**: Com confirmação administrativa

### 👥 **Gestão de Clientes**
- **Cadastro Automático**: Durante o checkout
- **Sistema de Cashback**: Pontos de fidelidade
- **Histórico de Compras**: Acompanhamento completo
- **Busca e Filtros**: Ordenação por pontos/nome

---

## 🧭 Rotas da Aplicação

### 🌐 **Área Pública (Cliente)**
```
/                     # Home com produtos em destaque
/produtos             # Catálogo com filtros e busca  
/produto/:id          # Detalhes + adicionar ao carrinho
/carrinho             # Carrinho de compras
/checkout             # Finalização com cashback
```

### 🔐 **Área Administrativa (JWT)**
```
/admin/login          # Autenticação de administradores
/admin                # Dashboard com métricas e gráficos
/admin/produtos       # Gerenciar produtos (CRUD)
/admin/produtos/novo  # Criar novo produto
/admin/produtos/editar/:id # Editar produto existente
/admin/pedidos        # Gestão de pedidos
/admin/pedidos/:id    # Detalhes do pedido
/admin/clientes       # Gestão de clientes e pontos
/admin/relatorios     # Relatórios e analytics
```

---

## 🔗 API Endpoints Implementados (20+)

### 🔐 **Autenticação**
```
POST /api/auth/login              # Login administrativo
GET  /api/auth/verify             # Verificar token JWT
POST /api/auth/logout             # Logout seguro
```

### 🛍️ **Produtos**
```
GET    /api/produtos                    # Listar (público, com filtros)
GET    /api/produtos/:id                # Produto específico
GET    /api/produtos/low-stock          # Estoque baixo (admin)
GET    /api/produtos/categorias/distinct # Categorias existentes
POST   /api/produtos                    # Criar produto (admin)
PUT    /api/produtos/:id                # Atualizar produto (admin)
DELETE /api/produtos/:id                # Deletar produto (admin)
```

### 📦 **Pedidos**
```
POST   /api/pedidos                     # Checkout com cashback
GET    /api/pedidos                     # Listar pedidos (admin)
GET    /api/pedidos/:id                 # Detalhes do pedido
DELETE /api/pedidos/:id                 # Deletar pedido (admin)
```

### 👤 **Usuários**
```
GET  /api/usuarios                      # Listar usuários (admin)
POST /api/usuarios                      # Cadastrar cliente
GET  /api/usuarios/:id                  # Perfil do cliente
GET  /api/usuarios/:id/pontos           # Consultar cashback
GET  /api/usuarios/:id/pedidos          # Histórico de compras
```

### 📊 **Estatísticas**
```
GET /api/stats/dashboard                # Métricas com filtros opcionais
GET /api/stats/revenue-monthly          # Receita mensal (12 meses)
```

### 🏥 **Sistema**
```
GET /api/health                         # Status da API
```

---

## 🚀 Destaques da Implementação Completa

### 📊 **Dashboard Analytics Avançado**
- **Métricas Comparativas**: Variação percentual real vs período anterior
- **Gráficos Interativos**: Receita mensal com valores rotulados
- **Filtros Inteligentes**: Períodos customizáveis (Tudo, 30d, 90d)
- **Tooltips Informativos**: Valores absolutos e comparativos

### 🏪 **Gestão Administrativa Completa**
- **Produtos**: CRUD com categorias dinâmicas e controle de estoque
- **Pedidos**: Listagem paginada + detalhes + exclusão segura
- **Clientes**: Gestão de usuários com sistema de pontos
- **Relatórios**: Analytics e métricas de performance

### 🛒 **E-commerce Funcional**
- **Catálogo Responsivo**: Filtros, busca e paginação
- **Carrinho Inteligente**: Persistência e cálculo automático
- **Checkout Avançado**: Cashback automático + cadastro de clientes
- **Sistema de Pontos**: 1 ponto = R$ 1,00 a cada R$ 50,00

### 🔒 **Segurança e Performance**
- **Autenticação JWT**: Tokens seguros com expiração
- **Rate Limiting**: Proteção contra ataques
- **Validações**: Client-side e server-side
- **Responsividade**: Mobile-first design

## 🛠️ Scripts úteis

Backend:
```
npm run dev   # nodemon
npm start     # produção simples (node server.js)
```

Frontend:
```
npm run dev      # Vite dev server
npm run build    # build de produção
npm run preview  # servir build local na porta 5174
```

---

## 📋 Primeiros Passos

### 1. **Clone e Configuração**
```bash
git clone <repositorio>
cd loja-materiais-utilidades
```

### 2. **Banco de Dados**
```bash
# Criar banco PostgreSQL
createdb loja_utilidades

# Aplicar schema
psql -d loja_utilidades -f backend/database/database.sql
```

### 3. **Backend**
```bash
cd backend
npm install
# Configurar .env (veja seção anterior)
node scripts/createAdmin.js  # Criar admin padrão
npm run dev                  # Iniciar API
```

### 4. **Frontend**
```bash
cd frontend
npm install
# Criar .env: VITE_API_URL=http://localhost:5000/api
npm run dev                  # Iniciar aplicação
```

### 5. **Acessar Sistema**
- **Frontend**: http://localhost:3000
- **Admin**: http://localhost:3000/admin/login (admin/123456)
- **API**: http://localhost:5000/api/health

---

## 📚 Documentação Adicional

- **Backend**: `backend/README.md` - Documentação completa da API
- **Frontend**: `frontend/README.md` - Componentes e arquitetura
- **Banco**: `backend/database/database.sql` - Schema e estruturas

---

## ❗️ Observações Importantes

- ✅ **Sistema Completo**: Todas as funcionalidades implementadas
- 🔧 **Pronto para Produção**: Configurações e otimizações aplicadas
- 📱 **Totalmente Responsivo**: Funciona em desktop, tablet e mobile
- 🛡️ **Seguro**: Autenticação, validações e proteções implementadas

---

*Sistema de E-commerce Completo e Funcional*
*Última atualização: Janeiro 2025*
*Versão: 2.0 - Implementação Completa*

