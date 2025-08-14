# 🛒 Frontend - Loja de Utilidades Domésticas

Frontend moderno e responsivo para sistema de loja de utilidades domésticas, desenvolvido com React, Vite e Tailwind CSS. Interface completa com área pública para clientes e painel administrativo.

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Páginas e Componentes](#-páginas-e-componentes)
- [Sistema de Autenticação](#-sistema-de-autenticação)
- [Gerenciamento de Estado](#-gerenciamento-de-estado)
- [Sistema de Carrinho](#-sistema-de-carrinho)
- [API e Serviços](#-api-e-serviços)
- [Estilização e UI/UX](#-estilização-e-uiux)


## 🚀 Funcionalidades

### 🏠 **Área Pública (Cliente)**
- **Página Inicial**: Banner hero, categorias, produtos em destaque
- **Catálogo de Produtos**: Busca, filtros, paginação e ordenação
- **Detalhes do Produto**: Galeria, informações, avaliações
- **Carrinho de Compras**: Gestão de itens e quantidades
- **Checkout**: Finalização de compra com múltiplos pagamentos
- **Sistema de Cashback**: Pontos ganhos e utilizados

### 🔐 **Área Administrativa**
- **Login Seguro**: Autenticação JWT com proteção de rotas
- **Dashboard**: Métricas, gráficos e estatísticas em tempo real
- **Gestão de Produtos**: CRUD completo com upload de imagens
- **Gestão de Pedidos**: Acompanhamento e atualização de status
- **Gestão de Clientes**: Listagem e detalhes dos usuários
- **Relatórios**: Análises de vendas e performance

### 🛠️ **Funcionalidades Avançadas**
- **Responsividade**: Design mobile-first com Tailwind CSS
- **Performance**: Lazy loading, code splitting e otimizações
- **UX/UI**: Loading states, notificações e feedback visual
- **Validação**: Formulários com validação em tempo real
- **Segurança**: Proteção de rotas e interceptors de API

## 🛠️ Tecnologias Utilizadas

### **Core Framework**
- **React 18** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool e dev server ultra-rápido
- **React Router DOM** - Roteamento da aplicação

### **Estilização**
- **Tailwind CSS** - Framework CSS utilitário
- **Headless UI** - Componentes acessíveis
- **Lucide React** - Ícones modernos

### **Gerenciamento de Estado**
- **React Context API** - Estado global da aplicação
- **React Hook Form** - Formulários performáticos

### **Comunicação com API**
- **Axios** - Cliente HTTP com interceptors
- **React Hot Toast** - Notificações elegantes

### **Desenvolvimento**
- **ESLint** - Linting de código
- **PostCSS** - Processamento de CSS
- **Autoprefixer** - Compatibilidade de navegadores

## 📁 Estrutura do Projeto

```
frontend/
├── public/                 # Arquivos estáticos
├── src/
│   ├── assets/            # Imagens e recursos
│   ├── components/        # Componentes reutilizáveis
│   │   ├── Navbar.jsx     # Navegação principal
│   │   ├── Footer.jsx     # Rodapé da aplicação
│   │   ├── PrivateRoute.jsx # Proteção de rotas
│   │   └── LoadingSpinner.jsx # Componente de loading
│   ├── contexts/          # Contextos React
│   │   ├── AuthContext.jsx # Autenticação
│   │   └── CartContext.jsx # Carrinho de compras
│   ├── hooks/             # Custom hooks
│   │   └── useDebounce.js # Hook para debounce
│   ├── pages/             # Páginas da aplicação
│   │   ├── Home.jsx       # Página inicial
│   │   ├── Products.jsx   # Listagem de produtos
│   │   ├── ProductDetails.jsx # Detalhes do produto
│   │   ├── Cart.jsx       # Carrinho de compras
│   │   ├── Checkout.jsx   # Finalização de compra
│   │   ├── AdminLogin.jsx # Login administrativo
│   │   ├── AdminDashboard.jsx # Dashboard admin
│   │   ├── AdminProducts.jsx # Gestão de produtos
│   │   ├── AdminOrders.jsx # Gestão de pedidos
│   │   ├── AdminCustomers.jsx # Gestão de clientes
│   │   └── AdminRelatorios.jsx # Relatórios
│   ├── services/          # Serviços de API
│   │   ├── api.js         # Configuração do Axios
│   │   ├── productService.js # Serviços de produtos
│   │   ├── orderService.js # Serviços de pedidos
│   │   ├── userService.js # Serviços de usuários
│   │   └── statsService.js # Serviços de estatísticas
│   ├── App.jsx            # Componente principal
│   ├── main.jsx           # Ponto de entrada
│   ├── index.css          # Estilos globais
│   └── App.css            # Estilos do App
├── package.json           # Dependências e scripts
├── vite.config.js         # Configuração do Vite
├── tailwind.config.js     # Configuração do Tailwind
└── README.md             # Esta documentação
```

## ⚙️ Instalação e Configuração

### 1. Pré-requisitos
- Node.js (v16 ou superior)
- npm ou yarn
- Backend rodando na porta 5000

### 2. Clone e Instalação
```bash
# Navegar para o diretório frontend
cd frontend

# Instalar dependências
npm install
```

### 3. Configuração do Ambiente
Criar arquivo `.env` na raiz do frontend (opcional):

```env
# API Backend
VITE_API_URL=http://localhost:5000/api

# Ambiente
VITE_NODE_ENV=development
```

### 4. Iniciar Desenvolvimento
```bash
# Servidor de desenvolvimento
npm run dev

# Acessar em: http://localhost:3000
```

### 5. Build de Produção
```bash
# Gerar build otimizado
npm run build

# Preview do build
npm run preview
```

## 📄 Páginas e Componentes

### 🏠 **Páginas Públicas**

#### **Home.jsx** - Página Inicial
- **Hero Section**: Banner principal com call-to-action
- **Categorias**: Grid de categorias com ícones
- **Produtos em Destaque**: Carrossel de produtos populares
- **Benefícios**: Seção de vantagens da loja
- **Responsivo**: Design adaptável para mobile

#### **Products.jsx** - Catálogo
- **Sistema de Busca**: Busca por nome e descrição
- **Filtros Avançados**: Categoria, preço, disponibilidade
- **Ordenação**: Por preço, nome, popularidade
- **Paginação**: Navegação entre páginas
- **Visualização**: Grid e lista alternáveis

#### **ProductDetails.jsx** - Detalhes do Produto
- **Galeria de Imagens**: Múltiplas fotos do produto
- **Informações Detalhadas**: Descrição, especificações
- **Controles de Quantidade**: Adicionar ao carrinho
- **Produtos Relacionados**: Sugestões de compra
- **Avaliações**: Sistema de reviews (estrutura)

#### **Cart.jsx** - Carrinho de Compras
- **Lista de Itens**: Produtos selecionados
- **Controles de Quantidade**: Aumentar/diminuir
- **Cálculo Automático**: Subtotal, frete, desconto
- **Sistema de Cashback**: Pontos ganhos na compra
- **Ações**: Remover itens, limpar carrinho

#### **Checkout.jsx** - Finalização
- **Formulário de Dados**: Nome, email, telefone
- **Endereço de Entrega**: Campos de localização
- **Métodos de Pagamento**: Cartão, PIX, Boleto
- **Resumo do Pedido**: Validação final
- **Processamento**: Integração com API

### 🔐 **Páginas Administrativas**

#### **AdminLogin.jsx** - Autenticação
- **Formulário Seguro**: Usuário e senha
- **Validação**: Campos obrigatórios
- **Feedback Visual**: Estados de loading e erro
- **Redirecionamento**: Para dashboard após login

#### **AdminDashboard.jsx** - Painel Principal
- **Métricas em Tempo Real**: Produtos, pedidos, receita
- **Gráficos Interativos**: Receita mensal, tendências
- **Pedidos Recentes**: Lista dos últimos pedidos
- **Produtos Populares**: Ranking de vendas
- **Ações Rápidas**: Links para funcionalidades

#### **AdminProducts.jsx** - Gestão de Produtos
- **Tabela Completa**: Lista com paginação
- **CRUD Completo**: Criar, editar, deletar
- **Upload de Imagens**: Interface drag & drop
- **Filtros e Busca**: Encontrar produtos rapidamente
- **Ações em Lote**: Operações múltiplas

#### **AdminOrders.jsx** - Gestão de Pedidos
- **Lista de Pedidos**: Status, cliente, valor
- **Filtros por Status**: Pendente, confirmado, enviado
- **Detalhes do Pedido**: Itens, endereço, pagamento
- **Atualização de Status**: Mudança de estado
- **Histórico**: Timeline de mudanças

#### **AdminCustomers.jsx** - Gestão de Clientes
- **Lista de Usuários**: Dados pessoais e contato
- **Sistema de Pontos**: Cashback acumulado
- **Histórico de Compras**: Pedidos por cliente
- **Estatísticas**: Cliente mais ativo, valor médio

#### **AdminRelatorios.jsx** - Relatórios
- **Dashboard Avançado**: Métricas detalhadas
- **Filtros por Período**: Análise temporal
- **Exportação**: Dados para análise externa
- **Gráficos**: Visualizações interativas

### 🧩 **Componentes Reutilizáveis**

#### **Navbar.jsx** - Navegação
- **Menu Responsivo**: Adaptável para mobile
- **Carrinho**: Contador de itens
- **Área Admin**: Link para painel administrativo
- **Busca Rápida**: Campo de pesquisa

#### **Footer.jsx** - Rodapé
- **Links Organizados**: Categorias e páginas
- **Informações de Contato**: Email, telefone
- **Redes Sociais**: Links para mídias sociais
- **Newsletter**: Inscrição para novidades

#### **PrivateRoute.jsx** - Proteção
- **Verificação de Token**: Autenticação JWT
- **Redirecionamento**: Para login se não autenticado
- **Loading State**: Feedback durante verificação

#### **LoadingSpinner.jsx** - Loading
- **Spinner Animado**: Indicador de carregamento
- **Reutilizável**: Usado em toda aplicação
- **Customizável**: Tamanhos e cores

## 🔐 Sistema de Autenticação

### **Contexto de Autenticação**
```javascript
// AuthContext.jsx
const AuthContext = createContext();

// Funcionalidades
- login(usuario, senha)     // Autenticação
- logout()                  // Deslogar
- verifyToken()            // Verificar token
- admin                    // Dados do admin
```

### **Proteção de Rotas**
```javascript
// PrivateRoute.jsx
<PrivateRoute>
  <AdminDashboard />
</PrivateRoute>
```

### **Interceptors de API**
- **Request**: Adiciona token automaticamente
- **Response**: Trata erros 401 (não autorizado)
- **Redirecionamento**: Para login quando necessário

## 🛒 Sistema de Carrinho

### **Contexto do Carrinho**
```javascript
// CartContext.jsx
const CartContext = createContext();

// Funcionalidades
- addToCart(produto, quantidade)
- removeFromCart(produtoId)
- updateQuantity(produtoId, quantidade)
- clearCart()
- getTotal()
- getItemsCount()
- getCashbackPoints(total)
```

### **Funcionalidades Avançadas**
- **Validação de Estoque**: Verifica disponibilidade
- **Cálculo Automático**: Subtotal, frete, desconto
- **Persistência**: Mantém dados durante sessão
- **Notificações**: Feedback visual com toast

### **Sistema de Cashback**
- **1 ponto por R$ 50**: Cálculo automático
- **1 ponto = R$ 1**: Valor do desconto
- **Acumulação**: Pontos ganhos por compra
- **Utilização**: Desconto em compras futuras

## 🔌 API e Serviços

### **Configuração Base**
```javascript
// api.js
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' }
});
```

### **Serviços Implementados**

#### **productService.js**
```javascript
- getProducts(params)        // Listar produtos
- getProductById(id)         // Buscar por ID
- createProduct(product)     // Criar produto
- updateProduct(id, product) // Atualizar
- deleteProduct(id)          // Deletar
- getLowStockProducts()      // Baixo estoque
```

#### **orderService.js**
```javascript
- getOrders(params)          // Listar pedidos
- getOrderById(id)           // Buscar pedido
- createOrder(order)         // Criar pedido
- updateOrderStatus(id, status) // Atualizar status
```

#### **userService.js**
```javascript
- getUsers(params)           // Listar usuários
- getUserById(id)            // Buscar usuário
- updateUser(id, user)       // Atualizar
```

#### **statsService.js**
```javascript
- getDashboardStats(params)  // Estatísticas gerais
- getMonthlyRevenue()        // Receita mensal
```

## 🎨 Estilização e UI/UX

### **Tailwind CSS**
```javascript
// tailwind.config.js
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  }
}
```

### **Design System**
- **Cores Primárias**: Azul (#3b82f6)
- **Cores Secundárias**: Cinza (#6b7280)
- **Tipografia**: Inter (Google Fonts)
- **Espaçamento**: Sistema consistente
- **Bordas**: Border radius padronizado

### **Componentes UI**
- **Botões**: Primário, secundário, outline
- **Cards**: Produtos, estatísticas, informações
- **Formulários**: Inputs, selects, textareas
- **Tabelas**: Dados organizados e responsivos
- **Modais**: Confirmações e detalhes

### **Responsividade**
- **Mobile First**: Design para dispositivos móveis
- **Breakpoints**: sm, md, lg, xl
- **Grid System**: Flexbox e CSS Grid
- **Navegação**: Menu hambúrguer em mobile

### **Estados de Interface**
- **Loading**: Spinners e skeletons
- **Error**: Mensagens de erro claras
- **Success**: Confirmações positivas
- **Empty**: Estados vazios informativos



## 📱 Funcionalidades Mobile

### **PWA Ready**
- **Service Worker**: Cache offline
- **Manifest**: Configuração de app
- **Ícones**: Múltiplos tamanhos
- **Splash Screen**: Tela de carregamento

### **Touch Interactions**
- **Swipe**: Navegação por gestos
- **Tap**: Botões otimizados para toque
- **Pinch**: Zoom em imagens
- **Pull to Refresh**: Atualização de dados

## 🔧 Desenvolvimento

### **Scripts Disponíveis**
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Linting de código
```

### **Estrutura de Commits**
```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação de código
refactor: refatoração
test: testes
chore: tarefas de manutenção
```

### **Padrões de Código**
- **ESLint**: Regras de qualidade
- **Prettier**: Formatação automática
- **Conventional Commits**: Padrão de commits
- **Component Naming**: PascalCase para componentes

## 🐛 Troubleshooting

### **Problemas Comuns**

#### **Erro de CORS**
```bash
# Verificar se backend está rodando
curl http://localhost:5000/api/health

# Configurar proxy no vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true
  }
}
```

#### **Erro de Build**
```bash
# Limpar cache
rm -rf node_modules package-lock.json
npm install

# Verificar dependências
npm audit fix
```

#### **Problemas de Performance**
```bash
# Analisar bundle
npm run build -- --analyze

# Verificar imports desnecessários
npm run lint
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar console do navegador
2. Consultar logs do backend
3. Verificar configurações de API
4. Testar em modo incógnito

---

**Desenvolvido com ❤️ para Loja de Utilidades Domésticas**
