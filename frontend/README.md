# Frontend – Loja de Utilidades (React + Vite)

SPA em React com painel administrativo e área do cliente, integrada ao backend Node/Express.

## 🚀 Como rodar

1. Instale deps
```bash
npm install
```
2. Desenvolvimento
```bash
npm run dev
```
3. Build e Preview
```bash
npm run build
npm run preview
```

## 🧭 Rotas Principais

- Público
  - `/` Home
  - `/produtos` Lista com busca/filtros/paginação
  - `/produto/:id` Detalhes do produto
  - `/carrinho` Carrinho
  - `/checkout` Finalização

- Admin (protegidas)
  - `/admin` Dashboard
  - `/admin/produtos` Gerenciar produtos
  - `/admin/produtos/novo` Criar produto
  - `/admin/produtos/editar/:id` Editar produto
  - `/admin/pedidos` Listar pedidos
  - `/admin/pedidos/:id` Detalhes do pedido

## 🆕 Atualizações Recentes (2025-08)

### Dashboard
- Cards de Pedidos, Receita e Clientes com variação percentual real vs. período anterior (30/90 dias), com cores e setas.
- Tooltip nos cards com valores absolutos (período atual e anterior).
- Gráfico de Receita Mensal consumindo `/api/stats/revenue-monthly`, exibe valores em cada barra.
- Seletor de período (Tudo, 30d, 90d) que filtra stats via `/api/stats/dashboard?startDate&endDate`.

### Pedidos
- Listagem paginada com filtro por status e link para detalhes.
- Página de detalhes com itens, totais e metadados.
- Exclusão de pedidos (lista e detalhe) com confirmação; integra `DELETE /api/pedidos/:id`.

### Produtos
- Gerenciar Produtos usa paginação real da API (mostra total e páginas corretamente).
- “Novo Produto”: campo Categoria agora lista categorias existentes (via `/api/produtos/categorias/distinct`) e permite cadastrar uma nova.
- “Editar Produto”: formulário com dados carregados e persistência via API.

### Navbar
- Quando admin logado, exibe atalho “Dashboard” (desktop e mobile) para `/admin`.

## 🔧 Services relevantes

- `services/statsService.js`: `getDashboardStats`, `getMonthlyRevenue`
- `services/orderService.js`: `getOrders`, `getOrderById`, `deleteOrder`
- `services/productService.js`: `getProducts`, `getProductById`, `createProduct`, `updateProduct`, `deleteProduct`, `getDistinctCategories`

## 🛡️ Proteção de Rotas

- `components/PrivateRoute.jsx` protege rotas admin via token JWT armazenado em `localStorage` (`admin_token`).

## 🧪 Notas

- API base configurada em `services/api.js` (`http://localhost:5000/api`).
- Para usar rotas admin, faça login em `/admin/login` e o link “Dashboard” aparecerá na navbar.

Última atualização: 2025-08-08
