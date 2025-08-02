# Sistema de Loja de Utilidades Domésticas
## Documentação Técnica v1.0

---

## 📋 Visão Geral do Projeto

### Objetivo
Desenvolver um sistema completo de e-commerce para loja de utilidades domésticas com interface web responsiva, sistema de cashback e painel administrativo.

### Arquitetura do Sistema
- **Frontend**: React.js (SPA responsiva)
- **Backend**: Node.js com Express
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT (JSON Web Tokens)
- **Hospedagem**: Pronto para produção

---

## 🏗️ Arquitetura Técnica

### Stack Tecnológica
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Backend      │    │  Banco de Dados │
│   React.js      │◄──►│   Node.js        │◄──►│   PostgreSQL    │
│   - Responsivo  │    │   - Express      │    │   - Relacional  │
│   - SPA         │    │   - JWT Auth     │    │   - ACID        │
│   - Modern UI   │    │   - RESTful API  │    │   - Escalável   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Funcionalidades Principais

#### 👨‍💼 Painel Administrativo
- ✅ Autenticação segura (usuário/senha)
- ✅ Cadastro de produtos
- ✅ Edição de produtos
- ✅ Remoção de produtos
- ✅ Gestão de estoque
- ✅ Relatórios de vendas

#### 🛒 Área do Cliente
- ✅ Catálogo de produtos
- ✅ Carrinho de compras
- ✅ Checkout seguro
- ✅ Sistema de cashback (1 ponto = R$ 1,00 a cada R$ 50,00)
- ✅ Histórico de compras
- ✅ Gestão de pontos

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
- [x] Estrutura do projeto Node.js
- [x] Configuração do Express
- [x] Middlewares de segurança
- [x] Rotas da API (auth, produtos, usuários, pedidos)
- [x] Controllers completos
- [x] Sistema de autenticação JWT
- [x] Validações de dados com Joi
- [x] Sistema de cashback implementado
- [x] Rate limiting e segurança
- [x] Documentação completa dos endpoints

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

### Fase 3: Frontend
- [ ] Setup React + Vite
- [ ] Componentização
- [ ] Roteamento
- [ ] Estado global (Context/Redux)
- [ ] Interface responsiva
- [ ] Integração com API

### Fase 4: Hospedagem e Deploy
- [ ] Configuração de produção
- [ ] CI/CD Pipeline
- [ ] Monitoramento
- [ ] SSL/HTTPS
- [ ] Performance optimization

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

## 📡 API Endpoints

### Autenticação
```
POST /api/auth/login          # Login admin
POST /api/auth/logout         # Logout
GET  /api/auth/verify         # Verificar token
```

### Produtos
```
GET    /api/produtos          # Listar produtos
GET    /api/produtos/:id      # Buscar produto
POST   /api/produtos          # Criar produto (admin)
PUT    /api/produtos/:id      # Atualizar produto (admin)
DELETE /api/produtos/:id      # Deletar produto (admin)
```

### Pedidos
```
POST /api/pedidos             # Criar pedido
GET  /api/pedidos/:id         # Buscar pedido
GET  /api/usuarios/:id/pedidos # Histórico cliente
```

### Usuários
```
POST /api/usuarios            # Cadastrar cliente
GET  /api/usuarios/:id        # Perfil cliente
PUT  /api/usuarios/:id        # Atualizar perfil
GET  /api/usuarios/:id/pontos # Consultar pontos
```

---

## 🛡️ Segurança

### Medidas Implementadas
- ✅ Hash de senhas (bcrypt)
- ✅ Autenticação JWT
- ✅ Validação de dados de entrada
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Headers de segurança
- ✅ Sanitização de inputs

---

## 📱 Responsividade

### Breakpoints
```css
/* Mobile First */
Mobile:    0px - 768px
Tablet:    769px - 1024px
Desktop:   1025px+
```

### Componentes Responsivos
- ✅ Grid flexível
- ✅ Imagens adaptáveis
- ✅ Navegação mobile
- ✅ Cards de produto
- ✅ Formulários otimizados

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