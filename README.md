# Loja de Utilidades Domésticas – Monorepo

Aplicação completa de e‑commerce com React (frontend) e Node.js/Express + PostgreSQL (backend). Inclui painel administrativo com métricas, gestão de produtos e pedidos, e área do cliente com catálogo, carrinho e checkout.

## 📂 Estrutura

```
loja-materiais-utilidades/
├─ backend/    # API Node.js + Express + PostgreSQL
└─ frontend/   # SPA React + Vite (painel admin + loja)
```

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

## 🧭 Rotas principais (SPA)

- Público: `/`, `/produtos`, `/produto/:id`, `/carrinho`, `/checkout`
- Admin: `/admin`, `/admin/produtos`, `/admin/produtos/novo`, `/admin/produtos/editar/:id`, `/admin/pedidos`, `/admin/pedidos/:id`

## 🧪 Endpoints (resumo)

```
Auth
  POST /api/auth/login
  GET  /api/auth/verify

Produtos
  GET    /api/produtos
  GET    /api/produtos/:id
  POST   /api/produtos              # admin
  PUT    /api/produtos/:id          # admin
  DELETE /api/produtos/:id          # admin (soft delete)
  GET    /api/produtos/categorias/distinct

Pedidos
  POST   /api/pedidos
  GET    /api/pedidos               # admin (lista + paginação)
  GET    /api/pedidos/:id           # admin
  DELETE /api/pedidos/:id           # admin
  GET    /api/usuarios/:id/pedidos  # histórico do cliente

Stats
  GET /api/stats/dashboard          # ?startDate=&endDate=
  GET /api/stats/revenue-monthly
```

## 🆕 Destaques recentes (2025‑08)

- Dashboard admin
  - Percentuais reais por período (30/90 dias) com variação vs. período anterior e tooltips com valores absolutos.
  - Gráfico de receita mensal com rótulos de valores.
  - Filtro de período (Tudo, 30d, 90d).
- Pedidos admin
  - Lista paginada com filtro de status, detalhe do pedido e exclusão (com confirmação).
- Produtos admin
  - Paginação correta (total e páginas) na lista.
  - "Novo Produto" com select de categorias existentes e opção de criar nova.
  - Edição de produto.
- Navbar
  - Link de acesso rápido ao Dashboard quando o admin estiver logado (desktop e mobile).

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

## ❗️Observações

- Certifique‑se de que o backend esteja rodando antes do frontend.
- Ajuste as variáveis `.env` conforme seu ambiente de banco de dados.

---

Última atualização: 2025‑08‑08

