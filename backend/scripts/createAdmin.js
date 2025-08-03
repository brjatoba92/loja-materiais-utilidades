const bcrypt = require('bcryptjs');
const pool = require('../config/database');

async function createAdmin(usuario = 'admin', senha = 'admin123', nome = 'Administrador') {
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

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar administrador:', error);
    process.exit(1);
  }
}

// Verificar argumentos da linha de comando
const args = process.argv.slice(2);

if (args.length >= 3) {
  // node createAdmin.js usuario senha nome
  createAdmin(args[0], args[1], args[2]);
} else if (args.length === 2) {
  // node createAdmin.js usuario senha
  createAdmin(args[0], args[1]);
} else if (args.length === 1) {
  // node createAdmin.js usuario
  createAdmin(args[0]);
} else {
  // Usar valores padrão
  console.log('📝 Criando administrador padrão...');
  console.log('💡 Para criar um administrador personalizado, use:');
  console.log('   node createAdmin.js <usuario> <senha> <nome>');
  console.log('   Exemplo: node createAdmin.js joao 123456 "João Silva"');
  console.log('');
  createAdmin();
}