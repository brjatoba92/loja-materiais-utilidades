# Backend - Sistema de Loja de Utilidades Domésticas
## Documentação da API v2.0

---

## 📋 Visão Geral do Backend

### Objetivo
API RESTful completa para sistema de e-commerce de loja de utilidades domésticas, com sistema de cashback automático, autenticação JWT e painel administrativo.

### Tecnologias Utilizadas
- **Backend**: Node.js com Express.js
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT (JSON Web Tokens)
- **Segurança**: Helmet, CORS, Rate Limiting
- **Validação**: express-validator, Joi

---

## 🏗️ Arquitetura Técnica

### Arquitetura do Backend
```
┌──────────────────┐    ┌─────────────────┐
│     Backend      │    │  Banco de Dados │
│   Node.js        │◄──►│   PostgreSQL    │
│   - Express      │    │   - Relacional  │
│   - JWT Auth     │    │   - ACID        │
│   - RESTful API  │    │   - Escalável   │
│   - Helmet       │    │   - Indexes     │
│   - Rate Limit   │    │   - Triggers    │
│   ✅ CONCLUÍDO   │    │   ✅ CONCLUÍDO  │
└──────────────────┘    └─────────────────┘
```

### Dependências do Backend
```json
{
  "principais": {
    "express": "^4.18.2",
    "pg": "^8.11.1",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^6.0.0",
    "helmet": "^7.0.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^6.8.1",
    "express-validator": "^7.0.1",
    "joi": "^17.9.2",
    "dotenv": "^16.3.1"
  },
  "desenvolvimento": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.1"
  }
}
```

### Funcionalidades da API

#### 🔐 Autenticação e Autorização
- ✅ Login de administradores com JWT
- ✅ Middleware de autenticação
- ✅ Controle de permissões (admin/público)
- ✅ Verificação de tokens
- ✅ Logout seguro

#### 🛍️ Gestão de Produtos
- ✅ CRUD completo de produtos
- ✅ Listagem com filtros e paginação
- ✅ Busca por nome/descrição/categoria
- ✅ Controle de estoque
- ✅ Produtos com estoque baixo
- ✅ Categorias dinâmicas

#### 👤 Gestão de Usuários
- ✅ Cadastro de clientes
- ✅ Perfil de usuários
- ✅ Sistema de pontos de cashback
- ✅ Histórico de pedidos
- ✅ Listagem com busca e ordenação

#### 📦 Sistema de Pedidos
- ✅ Checkout com cashback automático
- ✅ Criação de clientes na compra
- ✅ Controle de estoque em tempo real
- ✅ Transações atomicas
- ✅ Listagem e gestão de pedidos

#### 📊 Relatórios e Estatísticas
- ✅ Dashboard administrativo
- ✅ Estatísticas com filtros de período
- ✅ Receita mensal
- ✅ Métricas de clientes e produtos

---

## 📊 Modelo de Dados

### Entidades Principais

#### 🏪 Produtos
```sql
produtos {
  id: SERIAL PRIMARY KEY
  nome: VARCHAR(255) NOT NULL
  descricao: TEXT
  preco: DECIMAL(10,2) NOT NULL
  categoria: VARCHAR(100)
  estoque: INTEGER DEFAULT 0
  imagem_url: VARCHAR(500)
  ativo: BOOLEAN DEFAULT true
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
}
```

#### 👤 Usuários (Clientes)
```sql
usuarios {
  id: SERIAL PRIMARY KEY
  nome: VARCHAR(255) NOT NULL
  email: VARCHAR(255) UNIQUE NOT NULL
  telefone: VARCHAR(20)
  pontos_cashback: INTEGER DEFAULT 0
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
}
```

#### 🔐 Administradores
```sql
administradores {
  id: SERIAL PRIMARY KEY
  usuario: VARCHAR(100) UNIQUE NOT NULL
  senha_hash: VARCHAR(255) NOT NULL
  nome: VARCHAR(255) NOT NULL
  ultimo_acesso: TIMESTAMP
  created_at: TIMESTAMP DEFAULT NOW()
}
```

#### 🛍️ Pedidos
```sql
pedidos {
  id: SERIAL PRIMARY KEY
  usuario_id: INTEGER REFERENCES usuarios(id)
  total: DECIMAL(10,2) NOT NULL
  pontos_utilizados: INTEGER DEFAULT 0
  pontos_gerados: INTEGER DEFAULT 0
  status: VARCHAR(50) DEFAULT 'pendente'
  created_at: TIMESTAMP DEFAULT NOW()
}
```

#### 📦 Itens do Pedido
```sql
itens_pedido {
  id: SERIAL PRIMARY KEY
  pedido_id: INTEGER REFERENCES pedidos(id)
  produto_id: INTEGER REFERENCES produtos(id)
  quantidade: INTEGER NOT NULL
  preco_unitario: DECIMAL(10,2) NOT NULL
  subtotal: DECIMAL(10,2) NOT NULL
}
```

---

## 🎯 Fases de Desenvolvimento

### Fase 1: Backend ✅ **CONCLUÍDO**
- [x] Estrutura do projeto Node.js com Express
- [x] Configuração completa do servidor
- [x] Middlewares de segurança (Helmet, CORS, Rate Limiting)
- [x] **5 módulos de rotas implementados**:
  - [x] `/api/auth` - Autenticação JWT
  - [x] `/api/produtos` - CRUD completo + categorias + estoque baixo
  - [x] `/api/usuarios` - Gestão de clientes + pontos
  - [x] `/api/pedidos` - Checkout + cashback automático
  - [x] `/api/stats` - Dashboard + relatórios
- [x] Sistema de autenticação JWT com middleware
- [x] Validações rigorosas (express-validator + Joi)
- [x] **Sistema de cashback automatizado**
- [x] Transações de banco para consistência
- [x] **Paginação em todas as listagens**
- [x] Filtros e busca avançada
- [x] Gestão de estoque em tempo real
- [x] **20+ endpoints funcionais**

### Fase 2: Banco de Dados ✅ **CONCLUÍDO**
- [x] Setup PostgreSQL
- [x] Criação das tabelas com relacionamentos
- [x] Seeds iniciais (admin + produtos exemplo)
- [x] Stored procedures para cashback
- [x] Índices de performance otimizados
- [x] Triggers automáticos
- [x] Views de relatórios
- [x] Sistema de logs e auditoria
- [x] Funções de busca avançada
- [x] Validações de integridade

### Fase 3: Integração com Frontend
- [x] API totalmente compatível com frontend React
- [x] CORS configurado para desenvolvimento e produção
- [x] Headers apropriados para SPAs
- [x] Endpoints testados e funcionais
- [x] Documentação completa para integração

### Fase 4: Hospedagem e Deploy
- [x] Configuração de produção preparada
- [x] Variáveis de ambiente configuradas
- [x] Scripts de deploy
- [ ] CI/CD Pipeline
- [ ] Monitoramento em produção
- [ ] SSL/HTTPS
- [ ] Performance optimization avançada

---

## 🔐 Sistema de Cashback

### Regras de Negócio
```javascript
// Exemplo de cálculo
const valorCompra = 150.00;
const pontosGerados = Math.floor(valorCompra / 50); // 3 pontos
const valorPontos = pontosGerados * 1.00; // R$ 3,00 em cashback
```

### Fluxo do Cashback
1. Cliente finaliza compra
2. Sistema calcula pontos (R$ 50,00 = 1 ponto)
3. Pontos são creditados na conta
4. Cliente pode usar em compras futuras (1 ponto = R$ 1,00)

---

## 📡 API Endpoints Implementados

### 🔐 Autenticação (`/api/auth`)
```
POST /api/auth/login          # Login de administrador
POST /api/auth/logout         # Logout (requer token)
GET  /api/auth/verify         # Verificar validade do token JWT
```

### 🛍️ Produtos (`/api/produtos`)
```
GET    /api/produtos                    # Listar produtos (público, com filtros)
GET    /api/produtos/:id                # Buscar produto específico
GET    /api/produtos/low-stock          # Produtos com estoque baixo (admin)
GET    /api/produtos/categorias/distinct # Listar categorias distintas
POST   /api/produtos                    # Criar produto (admin)
PUT    /api/produtos/:id                # Atualizar produto (admin)
DELETE /api/produtos/:id                # Deletar produto (admin)
```

### 📦 Pedidos (`/api/pedidos`)
```
POST   /api/pedidos             # Criar pedido (checkout com cashback)
GET    /api/pedidos/:id         # Buscar pedido específico
GET    /api/pedidos             # Listar pedidos (admin, com filtros)
DELETE /api/pedidos/:id         # Deletar pedido (admin)
```

### 👤 Usuários (`/api/usuarios`)
```
GET  /api/usuarios              # Listar usuários (admin, com busca e ordenação)
POST /api/usuarios              # Cadastrar cliente
GET  /api/usuarios/:id          # Perfil do cliente
GET  /api/usuarios/:id/pontos   # Consultar pontos de cashback
GET  /api/usuarios/:id/pedidos  # Histórico de pedidos do cliente
```

### 📊 Estatísticas (`/api/stats`)
```
GET /api/stats/dashboard        # Estatísticas do dashboard (admin)
                               # Suporta filtros ?startDate= e ?endDate=
GET /api/stats/revenue-monthly  # Receita mensal dos últimos 12 meses
```

### 🏥 Saúde do Sistema
```
GET /api/health                 # Status da API
```

---

## 🛡️ Segurança e Middlewares

### Medidas de Segurança Implementadas
- ✅ **Hash de senhas**: bcrypt para criptografia
- ✅ **Autenticação JWT**: Tokens com expiração de 1h
- ✅ **Middleware de autenticação**: `authenticateToken` e `isAdmin`
- ✅ **Validação rigorosa**: express-validator e Joi
- ✅ **Rate limiting**: 100 requests/15min por IP
- ✅ **Headers de segurança**: Helmet.js
- ✅ **CORS configurado**: Origens controladas
- ✅ **Sanitização de inputs**: Prevenção de SQL injection
- ✅ **Transações de banco**: Atomicidade em operações críticas

### Estrutura de Middleware
```javascript
// Middleware global (server.js)
1. helmet() - Headers de segurança
2. cors() - Controle de origem
3. rateLimit() - Limitação de taxa
4. express.json() - Parse JSON com limite 10mb

// Middleware de autenticação (middleware/auth.js)
- authenticateToken: Verificação JWT
- isAdmin: Verificação de permissão admin

// Middleware de validação (por rota)
- express-validator: Validação de entrada
- Joi: Schemas de validação complexos
```

---

## 🚀 Próximos Passos

### ✅ **FASES CONCLUÍDAS**

#### Etapa 1: Backend Node.js - **FINALIZADO**
- ✅ API RESTful completa
- ✅ Sistema de autenticação JWT
- ✅ CRUD de produtos com validações
- ✅ Sistema de usuários e pontos
- ✅ Checkout com cashback automático
- ✅ Middlewares de segurança
- ✅ Rate limiting implementado
- ✅ Documentação completa

#### Etapa 2: Banco PostgreSQL - **FINALIZADO**
- ✅ Estrutura completa das tabelas
- ✅ Relacionamentos e constraints
- ✅ Índices para performance
- ✅ Triggers automáticos
- ✅ Stored procedures de cashback
- ✅ Views de relatórios
- ✅ Sistema de logs
- ✅ Dados iniciais (seeds)
- ✅ Admin padrão criado
- ✅ Produtos exemplo inseridos

### 🔄 **PRÓXIMA ETAPA: Frontend React**

**Status**: 🎯 **PRONTO PARA INÍCIO**

**Deliverables da Fase 3:**
1. Setup do projeto React + Vite
2. Estrutura de componentes
3. Sistema de roteamento
4. Gerenciamento de estado (Context API)
5. Interface responsiva com Tailwind CSS
6. Integração completa com a API
7. Painel administrativo
8. Área do cliente
9. Sistema de carrinho
10. Checkout com cashback
11. Autenticação no frontend
12. Validações de formulário

### 📋 **CHECKLIST TÉCNICO**

#### Backend ✅
- [x] Server Express configurado
- [x] Banco PostgreSQL estruturado  
- [x] APIs funcionais testadas
- [x] Sistema de segurança implementado
- [x] Cashback automatizado
- [x] Documentação completa

#### Próximo: Frontend 🔄
- [ ] Configuração inicial React
- [ ] Componentização
- [ ] Roteamento (React Router)
- [ ] Estado global
- [ ] Integração API
- [ ] UI/UX responsiva
- [ ] Testes de integração

---

## 💡 Observações Técnicas

### Performance
- Índices otimizados no PostgreSQL
- Cache de consultas frequentes
- Lazy loading no frontend
- Compressão de assets

### Escalabilidade
- Arquitetura modular
- Separação de responsabilidades
- API RESTful
- Banco relacional normalizado

### Manutenibilidade
- Código bem documentado
- Padrões de projeto
- Testes automatizados
- Logs estruturados

---

*Documentação atualizada em: Julho 2025*
*Versão: 1.0*
*Autor: Sistema de Desenvolvimento*

---

---

## 🚀 Implementações Completas do Sistema

### 🎯 **STATUS ATUAL: API BACKEND COMPLETA E FUNCIONAL**

### Backend API (Node.js + Express) ✅
- **API RESTful**: 20+ endpoints funcionais
- **Autenticação**: JWT com middleware de segurança
- **CRUD Completo**: Produtos, usuários, pedidos
- **Sistema de Cashback**: Automático com regras de negócio
- **Dashboard Admin**: Estatísticas e relatórios via API
- **Segurança**: Rate limiting, validações, transações
- **Paginação**: Em todas as listagens
- **Filtros**: Busca avançada por categoria, nome, status

### Banco de Dados (PostgreSQL) ✅
- **5 Tabelas**: produtos, usuarios, administradores, pedidos, itens_pedido
- **Relacionamentos**: Foreign keys e constraints
- **Índices**: Otimização de performance
- **Triggers**: Atualizações automáticas
- **Seeds**: Dados iniciais para testes

### Funcionalidades da API Implementadas
- ✅ **API E-commerce Completa**: Endpoints para catálogo, carrinho e checkout
- ✅ **Sistema de Cashback**: Cálculo automático (1 ponto = R$ 1,00 a cada R$ 50,00)
- ✅ **Endpoints Admin**: Gestão completa de produtos/pedidos/clientes
- ✅ **API de Analytics**: Endpoints para dashboard e relatórios
- ✅ **Controle de Estoque**: Atualização em tempo real via API
- ✅ **Segurança Total**: Autenticação, validações, rate limiting
- ✅ **Performance**: Paginação, filtros e consultas otimizadas

### Detalhes Técnicos de Implementação

#### Endpoints Críticos do Sistema
```
// Dashboard e Relatórios
GET  /api/stats/dashboard              # Estatísticas com filtros de período
GET  /api/stats/revenue-monthly        # Receita dos últimos 12 meses

// Gestão de Produtos
GET  /api/produtos/categorias/distinct # Categorias para formulários
GET  /api/produtos/low-stock          # Produtos com estoque baixo

// Sistema de Pedidos
POST /api/pedidos                     # Checkout com cashback automático
DELETE /api/pedidos/:id               # Exclusão de pedidos (admin)

// Gestão de Clientes
GET  /api/usuarios/:id/pontos         # Consulta de pontos de cashback
GET  /api/usuarios/:id/pedidos        # Histórico completo
```

#### Principais Funcionalidades por Módulo

**API de Produtos**:
- CRUD completo com validações
- Endpoints para categorias
- Controle de estoque via API
- Filtros e busca por parâmetros
- Listagem paginada

**API de Pedidos**:
- Endpoint de checkout integrado
- Cálculo automático de cashback
- Criação de usuários na compra
- Transações atomicas no banco
- APIs de listagem e gestão

**API de Usuários**:
- Endpoints de cadastro e perfil
- API de pontos de fidelidade
- Histórico via API
- Busca e ordenação para admin

**API de Administração**:
- Endpoints de autenticação
- APIs de dashboard e métricas
- Estatísticas em tempo real
- Relatórios com filtros de período

---

## 🏃‍♂️ Como Executar o Projeto

### Pré-requisitos
- Node.js (v16+)
- PostgreSQL (v12+)
- npm ou yarn

### 1. Configuração do Banco de Dados
```bash
# 1. Criar banco PostgreSQL
createdb loja_utilidades

# 2. Executar script de criação das tabelas
psql -d loja_utilidades -f database/database.sql
```

### 2. Configuração do Backend
```bash
# 1. Navegar para o diretório backend
cd backend

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
# Criar arquivo .env com:
PORT=5000
JWT_SECRET=sua_chave_secreta_aqui
DB_HOST=localhost
DB_PORT=5432
DB_NAME=loja_utilidades
DB_USER=seu_usuario
DB_PASS=sua_senha

# 4. Criar administrador padrão
node scripts/createAdmin.js

# 5. Iniciar servidor
npm run dev  # Modo desenvolvimento
# ou
npm start    # Modo produção
```

### 3. Testar a API
```bash
# Verificar se a API está funcionando
curl http://localhost:5000/api/health

# Fazer login admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","senha":"123456"}'

# Listar produtos
curl http://localhost:5000/api/produtos
```

### 4. Acessos da API
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health
- **Documentação**: Endpoints listados neste README
- **Admin padrão**: 
  - Usuário: `admin`
  - Senha: `123456` (alterar após primeiro login)

### 5. Scripts do Backend
```bash
npm run dev        # Servidor com nodemon (desenvolvimento)
npm start          # Servidor produção
npm test           # Executar testes
node scripts/createAdmin.js  # Criar administrador
```

---

*API Backend totalmente implementada e funcional*
*Última atualização: Janeiro 2025*
*Versão: 2.0 - Backend Completo*