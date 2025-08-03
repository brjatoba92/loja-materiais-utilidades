require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para fazer perguntas ao usuário
function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

// Função para criar administrador
async function createAdmin(usuario, senha, nome) {
  try {
    console.log('🔧 Criando administrador...');
    console.log('Usuário:', usuario);
    console.log('Nome:', nome);
    console.log('');

    const senhaHash = await bcrypt.hash(senha, 10);

    const query = `
      INSERT INTO administradores (usuario, senha_hash, nome)
      VALUES ($1, $2, $3)
      ON CONFLICT (usuario) DO UPDATE SET
        senha_hash = EXCLUDED.senha_hash,
        nome = EXCLUDED.nome,
        updated_at = NOW()
      RETURNING *
    `;

    const result = await pool.query(query, [usuario, senhaHash, nome]);

    if (result.rows.length > 0) {
      console.log('✅ Administrador criado/atualizado com sucesso!');
      console.log('📋 Dados do administrador:');
      console.log('   ID:', result.rows[0].id);
      console.log('   Usuário:', result.rows[0].usuario);
      console.log('   Nome:', result.rows[0].nome);
      console.log('   Criado em:', result.rows[0].created_at);
      console.log('');
      console.log('🔑 Credenciais para login:');
      console.log('   Usuário:', usuario);
      console.log('   Senha:', senha);
      console.log('');
      console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
    }

    return true;
  } catch (error) {
    console.error('❌ Erro ao criar administrador:', error.message);
    return false;
  }
}

// Função para listar administradores
async function listAdmins() {
  try {
    console.log('📋 Listando administradores...\n');
    
    const query = 'SELECT id, usuario, nome, ultimo_acesso, created_at, updated_at FROM administradores ORDER BY id';
    const result = await pool.query(query);

    if (result.rows.length === 0) {
      console.log('❌ Nenhum administrador encontrado.');
      return;
    }

    console.log('┌─────┬──────────────┬──────────────────────┬──────────────────────┬──────────────────────┐');
    console.log('│ ID  │   Usuário    │         Nome         │    Último Acesso     │     Criado em        │');
    console.log('├─────┼──────────────┼──────────────────────┼──────────────────────┼──────────────────────┤');

    result.rows.forEach(admin => {
      const id = admin.id.toString().padEnd(4);
      const usuario = admin.usuario.padEnd(13);
      const nome = (admin.nome || '').padEnd(20);
      const ultimoAcesso = admin.ultimo_acesso ? 
        new Date(admin.ultimo_acesso).toLocaleString('pt-BR').padEnd(20) : 
        'Nunca'.padEnd(20);
      const criadoEm = new Date(admin.created_at).toLocaleString('pt-BR').padEnd(20);
      
      console.log(`│ ${id} │ ${usuario} │ ${nome} │ ${ultimoAcesso} │ ${criadoEm} │`);
    });

    console.log('└─────┴──────────────┴──────────────────────┴──────────────────────┴──────────────────────┘');
    console.log(`\n📊 Total de administradores: ${result.rows.length}`);

  } catch (error) {
    console.error('❌ Erro ao listar administradores:', error.message);
  }
}

// Função para atualizar administrador
async function updateAdmin(id, usuario, senha, nome) {
  try {
    console.log('🔄 Atualizando administrador...');
    
    let query, params;
    
    if (senha) {
      const senhaHash = await bcrypt.hash(senha, 10);
      query = `
        UPDATE administradores 
        SET usuario = $1, senha_hash = $2, nome = $3, updated_at = NOW()
        WHERE id = $4
        RETURNING *
      `;
      params = [usuario, senhaHash, nome, id];
    } else {
      query = `
        UPDATE administradores 
        SET usuario = $1, nome = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING *
      `;
      params = [usuario, nome, id];
    }

    const result = await pool.query(query, params);

    if (result.rows.length > 0) {
      console.log('✅ Administrador atualizado com sucesso!');
      console.log('📋 Dados atualizados:');
      console.log('   ID:', result.rows[0].id);
      console.log('   Usuário:', result.rows[0].usuario);
      console.log('   Nome:', result.rows[0].nome);
      console.log('   Atualizado em:', result.rows[0].updated_at);
    } else {
      console.log('❌ Administrador não encontrado.');
    }

    return true;
  } catch (error) {
    console.error('❌ Erro ao atualizar administrador:', error.message);
    return false;
  }
}

// Função para deletar administrador
async function deleteAdmin(id) {
  try {
    console.log('🗑️  Deletando administrador...');
    
    const query = 'DELETE FROM administradores WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rows.length > 0) {
      console.log('✅ Administrador deletado com sucesso!');
      console.log('📋 Administrador removido:');
      console.log('   ID:', result.rows[0].id);
      console.log('   Usuário:', result.rows[0].usuario);
      console.log('   Nome:', result.rows[0].nome);
    } else {
      console.log('❌ Administrador não encontrado.');
    }

    return true;
  } catch (error) {
    console.error('❌ Erro ao deletar administrador:', error.message);
    return false;
  }
}

// Função para buscar administrador por ID
async function findAdminById(id) {
  try {
    const query = 'SELECT id, usuario, nome, ultimo_acesso, created_at, updated_at FROM administradores WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('❌ Erro ao buscar administrador:', error.message);
    return null;
  }
}

// Menu principal
async function showMenu() {
  console.log('\n' + '='.repeat(60));
  console.log('🔧 GERENCIADOR DE ADMINISTRADORES');
  console.log('='.repeat(60));
  console.log('1. 📝 Criar novo administrador');
  console.log('2. 📋 Listar todos os administradores');
  console.log('3. ✏️  Atualizar administrador');
  console.log('4. 🗑️  Deletar administrador');
  console.log('5. 🔍 Buscar administrador por ID');
  console.log('6. 🚪 Sair');
  console.log('='.repeat(60));
}

// Função principal
async function main() {
  try {
    console.log('🔧 Iniciando gerenciador de administradores...');
    
    while (true) {
      await showMenu();
      const choice = await question('\nEscolha uma opção (1-6): ');

      switch (choice) {
        case '1':
          console.log('\n📝 CRIAR NOVO ADMINISTRADOR');
          console.log('-'.repeat(30));
          const usuario = await question('Usuário: ');
          const senha = await question('Senha: ');
          const nome = await question('Nome completo: ');
          
          if (usuario && senha && nome) {
            await createAdmin(usuario, senha, nome);
          } else {
            console.log('❌ Todos os campos são obrigatórios!');
          }
          break;

        case '2':
          console.log('\n📋 LISTAR ADMINISTRADORES');
          console.log('-'.repeat(30));
          await listAdmins();
          break;

        case '3':
          console.log('\n✏️  ATUALIZAR ADMINISTRADOR');
          console.log('-'.repeat(30));
          const updateId = await question('ID do administrador: ');
          const admin = await findAdminById(updateId);
          
          if (admin) {
            console.log(`\nAdministrador encontrado: ${admin.nome} (${admin.usuario})`);
            const newUsuario = await question(`Novo usuário (${admin.usuario}): `) || admin.usuario;
            const newSenha = await question('Nova senha (deixe em branco para manter): ');
            const newNome = await question(`Novo nome (${admin.nome}): `) || admin.nome;
            
            await updateAdmin(updateId, newUsuario, newSenha, newNome);
          } else {
            console.log('❌ Administrador não encontrado!');
          }
          break;

        case '4':
          console.log('\n🗑️  DELETAR ADMINISTRADOR');
          console.log('-'.repeat(30));
          const deleteId = await question('ID do administrador: ');
          const adminToDelete = await findAdminById(deleteId);
          
          if (adminToDelete) {
            console.log(`\nAdministrador encontrado: ${adminToDelete.nome} (${adminToDelete.usuario})`);
            const confirm = await question('Tem certeza que deseja deletar? (s/N): ');
            
            if (confirm.toLowerCase() === 's' || confirm.toLowerCase() === 'sim') {
              await deleteAdmin(deleteId);
            } else {
              console.log('❌ Operação cancelada.');
            }
          } else {
            console.log('❌ Administrador não encontrado!');
          }
          break;

        case '5':
          console.log('\n🔍 BUSCAR ADMINISTRADOR');
          console.log('-'.repeat(30));
          const searchId = await question('ID do administrador: ');
          const searchAdmin = await findAdminById(searchId);
          
          if (searchAdmin) {
            console.log('\n📋 Dados do administrador:');
            console.log('   ID:', searchAdmin.id);
            console.log('   Usuário:', searchAdmin.usuario);
            console.log('   Nome:', searchAdmin.nome);
            console.log('   Último acesso:', searchAdmin.ultimo_acesso || 'Nunca');
            console.log('   Criado em:', new Date(searchAdmin.created_at).toLocaleString('pt-BR'));
            console.log('   Atualizado em:', new Date(searchAdmin.updated_at).toLocaleString('pt-BR'));
          } else {
            console.log('❌ Administrador não encontrado!');
          }
          break;

        case '6':
          console.log('\n👋 Saindo do gerenciador de administradores...');
          rl.close();
          process.exit(0);
          break;

        default:
          console.log('❌ Opção inválida! Escolha uma opção de 1 a 6.');
      }

      if (choice !== '6') {
        await question('\nPressione ENTER para continuar...');
      }
    }
  } catch (error) {
    console.error('❌ Erro no gerenciador:', error.message);
    rl.close();
    process.exit(1);
  }
}

// Verificar argumentos da linha de comando
const args = process.argv.slice(2);

if (args.length >= 3) {
  // node adminManager.js usuario senha nome
  createAdmin(args[0], args[1], args[2]).then(() => {
    rl.close();
    process.exit(0);
  });
} else {
  // Executar menu interativo
  main();
} 