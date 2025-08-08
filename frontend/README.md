# Frontend - Loja de Utilidades Domésticas
## Sistema E-commerce Completo (React + Vite + Tailwind)

SPA responsiva em React com painel administrativo completo, área do cliente, sistema de carrinho, checkout com cashback e dashboard analytics. Totalmente integrada ao backend Node.js/Express.

---

## 🏗️ Tecnologias e Arquitetura

### Stack Principal
- **React 18**: Interface moderna com hooks
- **Vite**: Build tool e dev server rápido
- **Tailwind CSS**: Framework CSS utility-first
- **React Router DOM**: Roteamento SPA
- **Axios**: Cliente HTTP para API

### Bibliotecas e Ferramentas
- **Lucide React**: Ícones SVG modernos
- **React Hook Form**: Formulários performáticos
- **React Hot Toast**: Notificações elegantes
- **Headless UI**: Componentes acessíveis

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js (v16+)
- Backend rodando em `http://localhost:5000`

### Instalação e Execução
```bash
# 1. Instalar dependências
npm install

# 2. Configurar variável de ambiente
# Criar arquivo .env:
VITE_API_URL=http://localhost:5000/api

# 3. Modo desenvolvimento
npm run dev

# 4. Build para produção
npm run build

# 5. Preview do build
npm run preview

# 6. Linting
npm run lint
```

### Acessos
- **Frontend**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **Credenciais padrão**: admin / 123456

---

## 🧭 Estrutura de Rotas Implementadas

### 🌐 Área Pública (Cliente)
```
/                           # Home - Hero section + produtos em destaque
/produtos                   # Catálogo completo com filtros e busca
/produto/:id               # Detalhes do produto + adicionar ao carrinho
/carrinho                  # Carrinho de compras + gestão de itens
/checkout                  # Finalização com cashback automático
```

### 🔐 Área Administrativa (Protegida por JWT)
```
/admin/login               # Login administrativo
/admin                     # Dashboard com estatísticas e gráficos
/admin/produtos            # Gerenciar produtos (CRUD)
/admin/produtos/novo       # Criar novo produto
/admin/produtos/editar/:id # Editar produto existente
/admin/pedidos             # Listar e gerenciar pedidos
/admin/pedidos/:id         # Detalhes do pedido + exclusão
/admin/clientes            # Gestão de clientes e pontos
/admin/relatorios          # Relatórios e analytics
```

---

## ✨ Funcionalidades Implementadas

### 🛒 E-commerce Completo
- **Catálogo de Produtos**: Listagem paginada com filtros por categoria e busca
- **Detalhes do Produto**: Página individual com informações completas
- **Carrinho de Compras**: Gestão de itens, quantidades e totais
- **Checkout Inteligente**: Finalização com sistema de cashback automático
- **Sistema de Pontos**: 1 ponto = R$ 1,00 a cada R$ 50,00 gastos

### 📊 Dashboard Administrativo Avançado
- **Estatísticas em Tempo Real**: Cards com métricas de pedidos, receita e clientes
- **Variação Percentual**: Comparação com períodos anteriores (30/90 dias)
- **Gráfico de Receita**: Visualização mensal dos últimos 12 meses
- **Filtros de Período**: Seletor para análise customizada (Tudo, 30d, 90d)
- **Tooltips Informativos**: Valores absolutos e comparativos

### 🏪 Gestão de Produtos
- **CRUD Completo**: Criar, editar, visualizar e excluir produtos
- **Paginação Real**: Navegação correta com total de registros
- **Categorias Dinâmicas**: Seleção de categorias existentes + criação de novas
- **Controle de Estoque**: Gestão em tempo real
- **Upload de Imagens**: Interface para fotos dos produtos

### 📦 Gestão de Pedidos
- **Listagem Paginada**: Filtros por status e busca
- **Detalhes Completos**: Visualização de itens, totais e metadados
- **Exclusão Segura**: Confirmação para remoção de pedidos
- **Status Tracking**: Acompanhamento do estado dos pedidos

### 👥 Gestão de Clientes
- **Listagem de Usuários**: Busca e ordenação por pontos/nome
- **Sistema de Pontos**: Visualização do cashback acumulado
- **Histórico de Compras**: Acompanhamento por cliente

### 📈 Relatórios e Analytics
- **Métricas de Vendas**: Análise de performance
- **Dados Comparativos**: Períodos customizáveis
- **Visualizações Gráficas**: Charts responsivos

---

## 🏗️ Arquitetura de Componentes

### 📱 Layout Principal
- **`App.jsx`**: Roteamento principal e estrutura da aplicação
- **`Navbar.jsx`**: Navegação responsiva com menu admin dinâmico
- **`Footer.jsx`**: Rodapé com informações da empresa
- **`PrivateRoute.jsx`**: Proteção de rotas administrativas

### 📄 Páginas Públicas
- **`Home.jsx`**: Landing page com hero section e produtos destaque
- **`Products.jsx`**: Catálogo com filtros, busca e paginação
- **`ProductDetails.jsx`**: Detalhes do produto e adicionar ao carrinho
- **`Cart.jsx`**: Carrinho de compras com gestão de itens
- **`Checkout.jsx`**: Finalização com cashback e cadastro

### 🔐 Páginas Administrativas
- **`AdminLogin.jsx`**: Autenticação de administradores
- **`AdminDashboard.jsx`**: Dashboard com métricas e gráficos
- **`AdminProducts.jsx`**: Gerenciamento CRUD de produtos
- **`AdminProductNew.jsx`**: Criação de novos produtos
- **`AdminProductEdit.jsx`**: Edição de produtos existentes
- **`AdminOrders.jsx`**: Listagem e gestão de pedidos
- **`AdminOrderDetails.jsx`**: Detalhes e ações de pedidos
- **`AdminCustomers.jsx`**: Gestão de clientes e pontos
- **`AdminRelatorios.jsx`**: Relatórios e analytics

### 🔧 Serviços e Integrações
- **`services/api.js`**: Cliente HTTP configurado (Axios)
- **`services/productService.js`**: CRUD de produtos e categorias
- **`services/orderService.js`**: Gestão de pedidos
- **`services/userService.js`**: Operações de usuários
- **`services/statsService.js`**: Estatísticas e dashboard

### 🎯 Gerenciamento de Estado
- **`contexts/AuthContext.jsx`**: Autenticação de administradores
- **`contexts/CartContext.jsx`**: Estado global do carrinho
- **`components/LoadingSpinner.jsx`**: Componente de loading

---

## 🛡️ Segurança e Proteção

### Autenticação JWT
- **Armazenamento**: Token em `localStorage` (`admin_token`)
- **Proteção de Rotas**: Middleware `PrivateRoute` para área admin
- **Verificação**: Validação automática de tokens expirados
- **Logout**: Limpeza segura de sessão

### Validação de Formulários
- **React Hook Form**: Validação client-side
- **Feedback Visual**: Mensagens de erro em tempo real
- **Sanitização**: Prevenção de inputs maliciosos

---

## 📱 Design Responsivo

### Mobile-First
- **Breakpoints**: Tailwind CSS padrão (sm, md, lg, xl)
- **Navegação Mobile**: Menu hamburger colapsível
- **Cards Adaptáveis**: Layout flexível para todos os tamanhos
- **Touch-Friendly**: Botões e elementos otimizados para toque

### Componentes Responsivos
- **Grid de Produtos**: Adapta colunas conforme tela
- **Dashboard**: Cards reorganizam em telas menores
- **Tabelas**: Scroll horizontal em mobile
- **Formulários**: Layout vertical otimizado

---

## 🔄 Integração com Backend

### APIs Consumidas
```javascript
// Autenticação
POST /api/auth/login            // Login admin
GET  /api/auth/verify           // Verificação de token

// Produtos
GET  /api/produtos              // Listagem com filtros
GET  /api/produtos/:id          // Produto específico
POST /api/produtos              // Criar produto
PUT  /api/produtos/:id          // Atualizar produto
DELETE /api/produtos/:id        // Deletar produto
GET  /api/produtos/categorias/distinct // Categorias

// Pedidos
POST /api/pedidos               // Checkout
GET  /api/pedidos               // Listagem admin
GET  /api/pedidos/:id           // Detalhes
DELETE /api/pedidos/:id         // Exclusão

// Usuários
GET  /api/usuarios              // Listagem admin
POST /api/usuarios              // Cadastro
GET  /api/usuarios/:id/pontos   // Consultar cashback

// Estatísticas
GET  /api/stats/dashboard       // Métricas
GET  /api/stats/revenue-monthly // Receita mensal
```

### Tratamento de Erros
- **Toast Notifications**: Feedback visual com react-hot-toast
- **Estados de Loading**: LoadingSpinner durante requisições
- **Fallbacks**: Tratamento gracioso de falhas
- **Retry Logic**: Re-tentativas automáticas em alguns casos

---

*Frontend totalmente implementado e funcional*
*Última atualização: Janeiro 2025*
*Versão: 2.0 - Sistema Completo*
