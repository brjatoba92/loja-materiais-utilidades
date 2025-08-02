// ============================================
// DOCUMENTAÇÃO DOS ENDPOINTS
// ============================================

/*

ENDPOINTS DA API:

📍 AUTENTICAÇÃO
POST   /api/auth/login          - Login do administrador
GET    /api/auth/verify         - Verificar token JWT
POST   /api/auth/logout         - Logout

📍 PRODUTOS  
GET    /api/produtos            - Listar produtos (público)
GET    /api/produtos/:id        - Buscar produto por ID (público)
POST   /api/produtos            - Criar produto (admin)
PUT    /api/produtos/:id        - Atualizar produto (admin)
DELETE /api/produtos/:id        - Remover produto (admin)

📍 USUÁRIOS
POST   /api/usuarios            - Cadastrar usuário
GET    /api/usuarios/:id        - Buscar usuário por ID
GET    /api/usuarios/:id/pontos - Consultar pontos de cashback
GET    /api/usuarios/:id/pedidos - Histórico de pedidos

📍 PEDIDOS
POST   /api/pedidos             - Criar pedido (checkout)
GET    /api/pedidos/:id         - Buscar pedido por ID
GET    /api/pedidos             - Listar todos os pedidos (admin)

📍 SAÚDE
GET    /api/health              - Status da API

EXEMPLOS DE USO:

1. LOGIN ADMIN:
POST /api/auth/login
{
  "usuario": "admin",
  "senha": "admin123"
}

2. CRIAR PRODUTO:
POST /api/produtos
Headers: Authorization: Bearer <token>
{
  "nome": "Panela Antiaderente",
  "descricao": "Panela antiaderente 24cm",
  "preco": 89.90,
  "categoria": "Cozinha",
  "estoque": 50,
  "imagem_url": "https://exemplo.com/panela.jpg"
}

3. CHECKOUT:
POST /api/pedidos
{
  "usuario_id": 1,
  "pontos_utilizados": 5,
  "itens": [
    {
      "produto_id": 1,
      "quantidade": 2
    },
    {
      "produto_id": 3,
      "quantidade": 1
    }
  ]
}

*/