# 📋 Scripts de Gerenciamento de Administradores

Este diretório contém scripts para gerenciar administradores do sistema.

## 📁 Arquivos

- `createAdmin.js` - Script simples para criar administradores
- `adminManager.js` - Gerenciador completo com menu interativo

## 🔧 Como Usar

### 1. Script Simples (createAdmin.js)

**Criar administrador padrão:**
```bash
node scripts/createAdmin.js
```

**Criar administrador personalizado:**
```bash
node scripts/createAdmin.js <usuario> <senha> <nome>
```

**Exemplo:**
```bash
node scripts/createAdmin.js joao 123456 "João Silva"
```

### 2. Gerenciador Completo (adminManager.js)

**Executar menu interativo:**
```bash
node scripts/adminManager.js
```

**Criar administrador via linha de comando:**
```bash
node scripts/adminManager.js <usuario> <senha> <nome>
```

## 🎯 Funcionalidades do Gerenciador Completo

### Menu Principal
```
============================================================
🔧 GERENCIADOR DE ADMINISTRADORES
============================================================
1. 📝 Criar novo administrador
2. 📋 Listar todos os administradores
3. ✏️  Atualizar administrador
4. 🗑️  Deletar administrador
5. 🔍 Buscar administrador por ID
6. 🚪 Sair
============================================================
```

### Funcionalidades Disponíveis

#### 1. 📝 Criar Novo Administrador
- Solicita usuário, senha e nome
- Valida se todos os campos estão preenchidos
- Cria o administrador no banco de dados
- Exibe as credenciais criadas

#### 2. 📋 Listar Administradores
- Mostra todos os administradores em formato de tabela
- Exibe ID, usuário, nome, último acesso e data de criação
- Conta total de administradores

#### 3. ✏️ Atualizar Administrador
- Busca administrador por ID
- Permite atualizar usuário, senha e nome
- Senha pode ser mantida (deixe em branco)
- Atualiza automaticamente o timestamp

#### 4. 🗑️ Deletar Administrador
- Busca administrador por ID
- Confirma a exclusão
- Remove o administrador do banco de dados

#### 5. 🔍 Buscar Administrador
- Busca administrador por ID
- Exibe dados completos do administrador
- Mostra último acesso, datas de criação e atualização

## ⚠️ Importante

- **Segurança**: Sempre altere a senha após o primeiro login
- **Backup**: Faça backup do banco antes de deletar administradores
- **Permissões**: Certifique-se de que o usuário do banco tem permissões adequadas

## 🔐 Credenciais Padrão

Quando criado sem parâmetros, o script cria um administrador com:
- **Usuário**: `admin`
- **Senha**: `admin123`
- **Nome**: `Administrador`

## 🛠️ Requisitos

- Node.js instalado
- PostgreSQL configurado
- Arquivo `.env` com credenciais do banco
- Dependências instaladas (`npm install`)

## 📊 Exemplo de Saída

```
📋 Listando administradores...

┌─────┬──────────────┬──────────────────────┬──────────────────────┬──────────────────────┐
│ ID  │   Usuário    │         Nome         │    Último Acesso     │     Criado em        │
├─────┼──────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ 1   │ admin        │ Administrador        │ Nunca                │ 02/08/2025 17:23:32 │
│ 2   │ joao         │ João Silva           │ Nunca                │ 03/08/2025 22:01:56 │
└─────┴──────────────┴──────────────────────┴──────────────────────┴──────────────────────┘

📊 Total de administradores: 2
``` 