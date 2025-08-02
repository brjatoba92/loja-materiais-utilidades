const bcrypt = require('bcryptjs');
const pool = require('../config/database');

async function createAdmin() {
  try {
    const usuario = 'admin';
    const senha = 'admin123'; // MUDE ISSO EM PRODUÇÃO!
    const nome = 'Administrador';

    const senhaHash = await bcrypt.hash(senha, 10);

    const query = `
      INSERT INTO administradores (usuario, senha_hash, nome)
      VALUES ($1, $2, $3)
      ON CONFLICT (usuario) DO NOTHING
      RETURNING *
    `;

    const result = await pool.query(query, [usuario, senhaHash, nome]);

    if (result.rows.length > 0) {
      console.log('✅ Admin criado com sucesso!');
      console.log('Usuário:', usuario);
      console.log('Senha:', senha);
      console.log('⚠️  ALTERE A SENHA EM PRODUÇÃO!');
    } else {
      console.log('ℹ️  Admin já existe');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
    process.exit(1);
  }
}

createAdmin();