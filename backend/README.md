# 🏪 Backend - Loja de Utilidades Domésticas

Backend completo para sistema de loja de utilidades domésticas com autenticação, gestão de produtos, pedidos, sistema de cashback e dashboard administrativo.

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Banco de Dados](#-banco-de-dados)
- [API Endpoints](#-api-endpoints)
- [Autenticação e Segurança](#-autenticação-e-segurança)
- [Sistema de Cashback](#-sistema-de-cashback)
- [Logs e Monitoramento](#-logs-e-monitoramento)
- [Scripts de Gerenciamento](#-scripts-de-gerenciamento)


## 🚀 Funcionalidades

### 🔐 Autenticação e Autorização
- **Login de Administradores**: Sistema de autenticação JWT
- **Middleware de Proteção**: Rotas protegidas por token
- **Controle de Acesso**: Diferenciação entre admin e usuários

### 📦 Gestão de Produtos
- **CRUD Completo**: Criar, listar, atualizar e deletar produtos
- **Busca e Filtros**: Por categoria, nome e descrição
- **Controle de Estoque**: Verificação automática de disponibilidade
- **Paginação**: Listagem paginada com limite configurável
- **Produtos com Baixo Estoque**: Alertas para administradores

### 👥 Gestão de Usuários
- **Cadastro de Clientes**: Sistema de registro de usuários
- **Perfis de Usuário**: Dados pessoais e histórico
- **Sistema de Pontos**: Cashback automático por compras

### 🛒 Sistema de Pedidos
- **Checkout Completo**: Processamento de pedidos com validações
- **Sistema de Cashback**: Pontos ganhos e utilizados
- **Controle de Estoque**: Atualização automática do estoque
- **Status de Pedidos**: Acompanhamento do ciclo de vida
- **Histórico de Compras**: Pedidos por usuário

### 📊 Dashboard e Estatísticas
- **Métricas Gerais**: Total de produtos, clientes, receita e pedidos
- **Receita Mensal**: Gráficos dos últimos 12 meses
- **Filtros por Período**: Análise temporal dos dados
- **Relatórios**: Dados para tomada de decisão

### 🔧 Ferramentas Administrativas
- **Scripts de Gerenciamento**: Criação e gestão de administradores
- **Logs Detalhados**: Monitoramento de performance e erros
- **Backup e Restore**: Scripts para manutenção do banco

## 🛠️ Tecnologias Utilizadas

### Core
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação e autorização

### Segurança
- **bcrypt** - Hash de senhas
- **helmet** - Headers de segurança
- **express-rate-limit** - Proteção contra ataques
- **express-validator** - Validação de dados

### Performance
- **compression** - Compressão de respostas
- **winston** - Sistema de logs
- **connection pooling** - Otimização de conexões

### Desenvolvimento
- **nodemon** - Hot reload
- **dotenv** - Variáveis de ambiente
- **jest** - Testes unitários

## 📁 Estrutura do Projeto

```
backend/
├── config/                 # Configurações
│   ├── database.js        # Conexão PostgreSQL

├── database/              # Scripts do banco
│   └── database.sql       # Schema completo
├── middleware/            # Middlewares customizados
│   ├── auth.js           # Autenticação JWT
│   └── performance.js    # Otimizações de performance
├── routes/               # Rotas da API
│   ├── auth.js          # Autenticação
│   ├── product.js       # Gestão de produtos
│   ├── usuarios.js      # Gestão de usuários
│   ├── pedidos.js       # Sistema de pedidos
│   └── stats.js         # Estatísticas e dashboard
├── scripts/              # Scripts utilitários
│   ├── createAdmin.js   # Criação de administradores
│   ├── adminManager.js  # Gerenciador completo
│   └── README.md        # Documentação dos scripts
├── utils/               # Utilitários
│   ├── logger.js        # Sistema de logs
│   └── cashback.js      # Cálculos de cashback
├── server.js            # Servidor principal
├── package.json         # Dependências
└── README.md           # Esta documentação
```

## ⚙️ Instalação e Configuração

### 1. Pré-requisitos
- Node.js (v16 ou superior)
- PostgreSQL (v12 ou superior)
- npm ou yarn

### 2. Clone e Instalação
```bash
# Navegar para o diretório backend
cd backend

# Instalar dependências
npm install
```

### 3. Configuração do Ambiente
Criar arquivo `.env` na raiz do backend:

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

### 4. Configuração do Banco
```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar banco de dados
CREATE DATABASE loja_utilidades;

# Executar script de criação das tabelas
\i database/database.sql
```

### 5. Criar Administrador Inicial
```bash
# Criar admin padrão
node scripts/createAdmin.js

# Ou criar admin personalizado
node scripts/createAdmin.js usuario senha "Nome Completo"
```

### 6. Iniciar Servidor
```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm start
```

## 🗄️ Banco de Dados

### Tabelas Principais

#### `administradores`
- Gestão de usuários administrativos
- Autenticação JWT
- Controle de acesso

#### `usuarios`
- Clientes do sistema
- Sistema de pontos (cashback)
- Dados pessoais

#### `produtos`
- Catálogo de produtos
- Controle de estoque
- Categorização

#### `pedidos`
- Histórico de compras
- Status de entrega
- Integração com cashback

#### `itens_pedido`
- Itens de cada pedido
- Quantidades e preços
- Relacionamento com produtos

### Índices de Performance
- Busca por categoria de produtos
- Filtros por nome e descrição
- Otimização de consultas por usuário
- Índices para sistema de cashback

## 🔌 API Endpoints

### Autenticação (`/api/auth`)
```
POST   /login          # Login de administrador
GET    /verify         # Verificar token
POST   /logout         # Logout
```

### Produtos (`/api/produtos`)
```
GET    /               # Listar produtos (público)
GET    /low-stock      # Produtos com baixo estoque (admin)
POST   /               # Criar produto (admin)
PUT    /:id            # Atualizar produto (admin)
DELETE /:id            # Deletar produto (admin)
GET    /:id            # Buscar produto por ID (público)
```

### Usuários (`/api/usuarios`)
```
GET    /               # Listar usuários (admin)
POST   /               # Criar usuário
GET    /:id            # Buscar usuário por ID
PUT    /:id            # Atualizar usuário
DELETE /:id            # Deletar usuário (admin)
GET    /:id/pedidos    # Pedidos do usuário
```

### Pedidos (`/api/pedidos`)
```
GET    /               # Listar pedidos (admin)
POST   /               # Criar pedido (checkout)
GET    /:id            # Buscar pedido por ID
PUT    /:id/status     # Atualizar status (admin)
DELETE /:id            # Cancelar pedido
```

### Estatísticas (`/api/stats`)
```
GET    /dashboard      # Métricas do dashboard
GET    /revenue-monthly # Receita mensal
```

### Health Check
```
GET    /api/health     # Status da API
```

## 🔐 Autenticação e Segurança

### JWT (JSON Web Tokens)
- **Expiração**: 1 hora
- **Algoritmo**: HS256
- **Payload**: ID, usuário e tipo de acesso

### Middleware de Segurança
- **Helmet**: Headers de segurança
- **Rate Limiting**: 100 requests por 15 minutos
- **CORS**: Configuração de origens permitidas
- **Validação**: Sanitização de dados de entrada

### Controle de Acesso
- **Admin**: Acesso total ao sistema
- **Público**: Apenas leitura de produtos
- **Usuários**: Gestão de próprios dados

## 💰 Sistema de Cashback

### Cálculo de Pontos
- **1 ponto** por cada **R$ 50** em compras
- **1 ponto = R$ 1** de desconto
- **Acumulação automática** por pedido

### Funcionalidades
- **Geração automática** de pontos por compra
- **Utilização** de pontos como desconto
- **Validação** de pontos disponíveis
- **Histórico** de pontos ganhos/utilizados

### Exemplo de Uso
```javascript
// Compra de R$ 150 = 3 pontos
// Desconto máximo = R$ 3
// Total final = R$ 147
```

## 📊 Logs e Monitoramento

### Sistema de Logs (Winston)
- **Logs de Erro**: Arquivo `error.log`
- **Logs Gerais**: Arquivo `combined.log`
- **Logs de Acesso**: Arquivo `access.log`
- **Rotação**: Máximo 5MB por arquivo

### Monitoramento de Performance
- **Requests Lentos**: > 1 segundo
- **Requests Muito Lentos**: > 5 segundos
- **Métricas**: Tempo de resposta, status codes
- **Alertas**: Logs automáticos para problemas

### Middleware de Performance
- **Compressão**: Respostas otimizadas
- **Cache**: Headers de cache apropriados
- **Otimização**: Queries e conexões

## 🔧 Scripts de Gerenciamento

### Criação de Administradores
```bash
# Script simples
node scripts/createAdmin.js

# Com parâmetros
node scripts/createAdmin.js usuario senha "Nome"

# Gerenciador completo
node scripts/adminManager.js
```

### Funcionalidades dos Scripts
- **Criar administradores** com validação
- **Listar** todos os administradores
- **Atualizar** dados de administradores
- **Deletar** administradores
- **Buscar** por ID ou usuário

### Exemplo de Saída
```
📋 Listando administradores...

┌─────┬──────────────┬──────────────────────┬──────────────────────┐
│ ID  │   Usuário    │         Nome         │    Último Acesso     │
├─────┼──────────────┼──────────────────────┼──────────────────────┤
│ 1   │ admin        │ Administrador        │ Nunca                │
│ 2   │ joao         │ João Silva           │ 03/08/2025 22:01:56 │
└─────┴──────────────┴──────────────────────┴──────────────────────┘
```



## 📝 Exemplos de Uso

### Login de Administrador
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario": "admin", "senha": "admin123"}'
```

### Listar Produtos
```bash
curl http://localhost:5000/api/produtos?categoria=cozinha&page=1&limit=10
```

### Criar Pedido
```bash
curl -X POST http://localhost:5000/api/pedidos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "usuario_id": 1,
    "itens": [{"produto_id": 1, "quantidade": 2}],
    "pontos_utilizados": 5
  }'
```

### Dashboard Stats
```bash
curl http://localhost:5000/api/stats/dashboard?startDate=2024-01-01&endDate=2024-12-31
```

## 🐛 Troubleshooting

### Problemas Comuns

#### Erro de Conexão com Banco
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Testar conexão
psql -h localhost -U usuario -d loja_utilidades
```

#### Erro de Porta em Uso
```bash
# Verificar processos na porta
lsof -i :5000

# Matar processo se necessário
kill -9 PID
```

#### Problemas de Permissão
```bash
# Verificar permissões do diretório
ls -la

# Ajustar permissões se necessário
chmod 755 .
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs em `logs/`
2. Consultar documentação da API
3. Verificar configurações do `.env`
4. Testar conexão com banco de dados

---

**Desenvolvido com ❤️ para Loja de Utilidades Domésticas**