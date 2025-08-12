# 🏪 Loja de Utilidades Domésticas - Sistema E-commerce Completo

Sistema de e-commerce totalmente funcional com painel administrativo avançado, área do cliente responsiva, sistema de cashback automático e dashboard analytics. Desenvolvido com React (frontend) + Node.js/Express + PostgreSQL (backend).

## 🎯 **Status do Projeto: SISTEMA COMPLETO E FUNCIONAL**

✅ **Backend API**: 20+ endpoints implementados  
✅ **Frontend SPA**: Interface completa e responsiva  
✅ **Dashboard Admin**: Métricas em tempo real + gráficos  
✅ **E-commerce**: Catálogo + carrinho + checkout + cashback  
✅ **Banco de Dados**: PostgreSQL com 5 tabelas relacionadas  
✅ **Segurança**: JWT + validações + rate limiting  
✅ **CI/CD**: Pipeline automatizado com GitHub Actions  
✅ **Deploy**: Scripts completos para produção  

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [Como Usar](#como-usar)
- [API Endpoints](#api-endpoints)
- [Deploy](#deploy)
- [Documentação](#documentação)

## 🚀 Visão Geral

Sistema completo de e-commerce para loja de utilidades domésticas, desenvolvido com arquitetura moderna e boas práticas. O projeto inclui:

### 🏗️ **Arquitetura**
- **Frontend**: SPA React com Vite e Tailwind CSS
- **Backend**: API RESTful com Node.js/Express
- **Banco**: PostgreSQL com relacionamentos otimizados
- **Deploy**: CI/CD automatizado com GitHub Actions

### 🎯 **Objetivos Alcançados**
- Interface responsiva e moderna
- Sistema de autenticação seguro
- Gestão completa de produtos e pedidos
- Dashboard administrativo com analytics
- Sistema de cashback automático
- Deploy automatizado em produção

## ✨ Funcionalidades

### 🛒 **E-commerce Completo**
- **Catálogo de Produtos**: Listagem com filtros, busca e paginação
- **Detalhes do Produto**: Página individual com galeria de imagens
- **Carrinho de Compras**: Gestão de itens, quantidades e totais
- **Checkout Inteligente**: Finalização com cashback automático
- **Sistema de Pontos**: 1 ponto = R$ 1,00 a cada R$ 50,00 gastos
- **Cadastro Automático**: Clientes criados durante checkout

### 📊 **Dashboard Administrativo**
- **Métricas em Tempo Real**: Produtos, pedidos, receita, clientes
- **Gráficos Interativos**: Receita mensal dos últimos 12 meses
- **Comparação de Períodos**: Variação percentual (30/90 dias)
- **Filtros Avançados**: Análise por período customizado
- **Produtos com Baixo Estoque**: Alertas automáticos

### 🏪 **Gestão de Produtos**
- **CRUD Completo**: Criar, editar, visualizar e excluir
- **Controle de Estoque**: Atualização em tempo real
- **Categorias Dinâmicas**: Gestão automática de categorias
- **Upload de Imagens**: Interface para fotos dos produtos
- **Busca e Filtros**: Por nome, categoria, preço

### 📦 **Sistema de Pedidos**
- **Processamento Automático**: Checkout com validações
- **Gestão de Status**: Acompanhamento completo (pendente → entregue)
- **Histórico Detalhado**: Por cliente e produto
- **Exclusão Segura**: Com confirmação administrativa
- **Itens do Pedido**: Quantidades, preços e subtotais

### 👥 **Gestão de Clientes**
- **Cadastro Automático**: Durante o checkout
- **Sistema de Cashback**: Pontos de fidelidade
- **Histórico de Compras**: Acompanhamento completo
- **Busca e Filtros**: Ordenação por pontos/nome
- **Perfis Detalhados**: Dados pessoais e contato

### 🔐 **Sistema de Autenticação**
- **Login Administrativo**: JWT com expiração
- **Proteção de Rotas**: Middleware de autenticação
- **Verificação de Token**: Validação automática
- **Logout Seguro**: Limpeza de sessão

## 🛠️ Tecnologias

### **Frontend**
- **React 18** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool e dev server ultra-rápido
- **Tailwind CSS** - Framework CSS utilitário
- **React Router DOM** - Roteamento da aplicação
- **Axios** - Cliente HTTP com interceptors
- **React Hook Form** - Formulários performáticos
- **React Hot Toast** - Notificações elegantes
- **Headless UI** - Componentes acessíveis
- **Lucide React** - Ícones modernos

### **Backend**
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação e autorização
- **bcrypt** - Hash de senhas
- **helmet** - Headers de segurança
- **express-rate-limit** - Proteção contra ataques
- **express-validator** - Validação de dados
- **winston** - Sistema de logs
- **compression** - Compressão de respostas

### **DevOps & Deploy**
- **GitHub Actions** - CI/CD Pipeline
- **Nginx** - Servidor web e proxy reverso
- **PM2** - Process manager para Node.js
- **Let's Encrypt** - Certificados SSL gratuitos
- **Docker** - Containerização (opcional)

## 📁 Estrutura do Projeto

```
loja-materiais-utilidades/
├── 📁 backend/                    # API RESTful completa
│   ├── 📁 routes/                # 5 módulos de rotas
│   │   ├── auth.js              # Autenticação JWT
│   │   ├── product.js           # Gestão de produtos
│   │   ├── pedidos.js           # Sistema de pedidos
│   │   ├── usuarios.js          # Gestão de usuários
│   │   └── stats.js             # Estatísticas e dashboard
│   ├── 📁 middleware/           # Middlewares customizados
│   │   ├── auth.js             # Autenticação JWT
│   │   └── performance.js      # Otimizações de performance
│   ├── 📁 database/            # Scripts do banco
│   │   └── database.sql        # Schema completo PostgreSQL
│   ├── 📁 scripts/             # Utilitários
│   │   ├── createAdmin.js      # Criação de administradores
│   │   └── adminManager.js     # Gerenciador completo
│   ├── 📁 utils/               # Utilitários
│   │   ├── logger.js           # Sistema de logs
│   │   └── cashback.js         # Cálculos de cashback
│   ├── 📁 config/              # Configurações
│   │   ├── database.js         # Conexão PostgreSQL
│   │   └── production.js       # Configurações de produção
│   ├── server.js               # Servidor principal
│   └── README.md               # Documentação da API
│
├── 📁 frontend/                 # SPA React responsiva
│   ├── 📁 src/
│   │   ├── 📁 pages/           # 14 páginas (público + admin)
│   │   │   ├── Home.jsx        # Página inicial
│   │   │   ├── Products.jsx    # Catálogo de produtos
│   │   │   ├── ProductDetails.jsx # Detalhes do produto
│   │   │   ├── Cart.jsx        # Carrinho de compras
│   │   │   ├── Checkout.jsx    # Finalização de compra
│   │   │   ├── AdminLogin.jsx  # Login administrativo
│   │   │   ├── AdminDashboard.jsx # Dashboard admin
│   │   │   ├── AdminProducts.jsx # Gestão de produtos
│   │   │   ├── AdminOrders.jsx # Gestão de pedidos
│   │   │   ├── AdminCustomers.jsx # Gestão de clientes
│   │   │   └── AdminRelatorios.jsx # Relatórios
│   │   ├── 📁 components/      # Componentes reutilizáveis
│   │   │   ├── Navbar.jsx      # Navegação principal
│   │   │   ├── Footer.jsx      # Rodapé da aplicação
│   │   │   ├── PrivateRoute.jsx # Proteção de rotas
│   │   │   └── LoadingSpinner.jsx # Componente de loading
│   │   ├── 📁 contexts/        # Contextos React
│   │   │   ├── AuthContext.jsx # Autenticação
│   │   │   └── CartContext.jsx # Carrinho de compras
│   │   ├── 📁 services/        # Serviços de API
│   │   │   ├── api.js          # Configuração do Axios
│   │   │   ├── productService.js # Serviços de produtos
│   │   │   ├── orderService.js # Serviços de pedidos
│   │   │   ├── userService.js  # Serviços de usuários
│   │   │   └── statsService.js # Serviços de estatísticas
│   │   ├── 📁 hooks/           # Custom hooks
│   │   │   └── useDebounce.js  # Hook para debounce
│   │   ├── App.jsx             # Componente principal
│   │   ├── main.jsx            # Ponto de entrada
│   │   └── index.css           # Estilos globais
│   ├── vite.config.js          # Configuração do Vite
│   ├── tailwind.config.js      # Configuração do Tailwind
│   └── README.md               # Documentação do frontend
│
├── 📁 deploy/                   # Scripts de deploy
│   ├── setup-server.sh         # Setup inicial do servidor
│   ├── deploy.sh               # Script de deploy
│   ├── nginx.conf              # Configuração do Nginx
│   └── ecosystem.config.js     # Configuração do PM2
│
├── 📁 .github/                  # CI/CD Pipeline
│   └── 📁 workflows/
│       └── ci-cd.yml           # GitHub Actions
│
├── DEPLOY.md                    # Guia completo de deploy
└── README.md                    # Esta documentação
```

## ⚙️ Instalação e Configuração

### **Pré-requisitos**
- Node.js 18+ 
- PostgreSQL 14+
- Git

### **1. Clone do Repositório**
```bash
git clone <repositorio>
cd loja-materiais-utilidades
```

### **2. Configuração do Banco de Dados**
```bash
# Criar banco PostgreSQL
createdb loja_utilidades

# Aplicar schema completo
psql -d loja_utilidades -f backend/database/database.sql
```

### **3. Configuração do Backend**
```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações:
```

```env
# Servidor
PORT=5000
NODE_ENV=development

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=loja_utilidades
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

# JWT
JWT_SECRET=sua_chave_secreta_muito_segura

# Logs
LOG_LEVEL=info
```

```bash
# Criar administrador inicial
node scripts/createAdmin.js

# Iniciar servidor de desenvolvimento
npm run dev
```

### **4. Configuração do Frontend**
```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente (opcional)
cp .env.example .env
# Editar .env:
```

```env
# API Backend
VITE_API_URL=http://localhost:5000/api

# Ambiente
VITE_NODE_ENV=development
```

```bash
# Iniciar servidor de desenvolvimento
npm run dev
```

## 🚀 Como Usar

### **Acessos do Sistema**
- **Frontend**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **API Health**: http://localhost:5000/api/health

### **Credenciais Padrão**
- **Usuário**: `admin`
- **Senha**: `admin123`

### **Funcionalidades Principais**

#### **🛒 Área do Cliente**
1. **Navegar pelo Catálogo**: Filtros por categoria, busca por nome
2. **Adicionar ao Carrinho**: Controle de quantidade e estoque
3. **Finalizar Compra**: Checkout com sistema de cashback
4. **Ganhar Pontos**: 1 ponto por cada R$ 50 gastos

#### **🔐 Área Administrativa**
1. **Dashboard**: Visualizar métricas e gráficos
2. **Gestão de Produtos**: CRUD completo com imagens
3. **Gestão de Pedidos**: Acompanhar status e histórico
4. **Gestão de Clientes**: Ver pontos e histórico de compras
5. **Relatórios**: Análises de vendas e performance

## 🔌 API Endpoints

### **🔐 Autenticação**
```
POST /api/auth/login              # Login administrativo
GET  /api/auth/verify             # Verificar token JWT
POST /api/auth/logout             # Logout seguro
```

### **🛍️ Produtos**
```
GET    /api/produtos                    # Listar (público, com filtros)
GET    /api/produtos/:id                # Produto específico
GET    /api/produtos/low-stock          # Estoque baixo (admin)
GET    /api/produtos/categorias/distinct # Categorias existentes
POST   /api/produtos                    # Criar produto (admin)
PUT    /api/produtos/:id                # Atualizar produto (admin)
DELETE /api/produtos/:id                # Deletar produto (admin)
```

### **📦 Pedidos**
```
POST   /api/pedidos                     # Checkout com cashback
GET    /api/pedidos                     # Listar pedidos (admin)
GET    /api/pedidos/:id                 # Detalhes do pedido
DELETE /api/pedidos/:id                 # Deletar pedido (admin)
```

### **👤 Usuários**
```
GET  /api/usuarios                      # Listar usuários (admin)
POST /api/usuarios                      # Cadastrar cliente
GET  /api/usuarios/:id                  # Perfil do cliente
GET  /api/usuarios/:id/pontos           # Consultar cashback
GET  /api/usuarios/:id/pedidos          # Histórico de compras
```

### **📊 Estatísticas**
```
GET /api/stats/dashboard                # Métricas com filtros opcionais
GET /api/stats/revenue-monthly          # Receita mensal (12 meses)
```

### **🏥 Sistema**
```
GET /api/health                         # Status da API
```

## 🚀 Deploy

### **Deploy Automatizado**
O projeto inclui pipeline CI/CD completo com GitHub Actions:

```yaml
# .github/workflows/ci-cd.yml
- Testes automatizados
- Build de produção
- Deploy para staging/produção
- Monitoramento de qualidade
```

### **Deploy Manual**

#### **Setup Rápido**
```bash
# 1. Setup do servidor
sudo bash deploy/setup-server.sh

# 2. Configurar domínio e SSL
# Editar deploy/nginx.conf com seu domínio
sudo certbot --nginx -d seudominio.com

# 3. Deploy da aplicação
./deploy/deploy.sh
```

#### **Configurações de Produção**
- **Nginx**: Proxy reverso e SSL
- **PM2**: Process manager para Node.js
- **PostgreSQL**: Banco de dados otimizado
- **Backup**: Automático diário
- **Monitoramento**: Logs estruturados

### **Documentação Completa de Deploy**
- 📖 [Guia de Deploy Completo](DEPLOY.md)
- 🔧 [Configurações de Produção](backend/config/production.js)
- 📊 [Monitoramento e Logs](backend/utils/logger.js)
- 🔄 [CI/CD Pipeline](.github/workflows/ci-cd.yml)

## 📚 Documentação

### **Documentação Detalhada**
- **Backend**: [backend/README.md](backend/README.md) - API completa e endpoints
- **Frontend**: [frontend/README.md](frontend/README.md) - Componentes e arquitetura
- **Deploy**: [DEPLOY.md](DEPLOY.md) - Guia completo de produção

### **Scripts Úteis**

#### **Backend**
```bash
npm run dev          # Desenvolvimento com nodemon
npm start            # Produção
npm test             # Testes (se configurados)
node scripts/createAdmin.js  # Criar administrador
```

#### **Frontend**
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Linting de código
```

## 🎯 Destaques da Implementação

### **📊 Dashboard Analytics Avançado**
- Métricas comparativas com períodos anteriores
- Gráficos interativos de receita mensal
- Filtros inteligentes por período
- Tooltips informativos com valores absolutos

### **🛒 E-commerce Funcional**
- Catálogo responsivo com filtros avançados
- Carrinho inteligente com persistência
- Checkout avançado com cashback automático
- Sistema de pontos de fidelidade

### **🔒 Segurança e Performance**
- Autenticação JWT com expiração
- Rate limiting contra ataques
- Validações client-side e server-side
- Design responsivo mobile-first

### **🚀 Deploy e Produção**
- CI/CD Pipeline automatizado
- SSL/HTTPS com Let's Encrypt
- Monitoramento e logs estruturados
- Backup automático do banco
- Performance otimizada

## 🐛 Troubleshooting

### **Problemas Comuns**

#### **Erro de Conexão com Banco**
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Testar conexão
psql -h localhost -U usuario -d loja_utilidades
```

#### **Erro de CORS no Frontend**
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

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs em `backend/logs/`
2. Consultar documentação específica
3. Verificar configurações do `.env`
4. Testar endpoints da API

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e comerciais.

---

**Sistema de E-commerce Completo e Funcional**  
**Desenvolvido com ❤️ para Loja de Utilidades Domésticas**  
**Última atualização: Agosto 2025**  
**Versão: 2.0 - Implementação Completa**

