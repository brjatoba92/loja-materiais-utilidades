const pool = require('./config/database');

async function testDatabase() {
    try {
        console.log('🔍 Testando conexão com banco...');
        
        // Testar conexão
        const client = await pool.connect();
        console.log('✅ Conexão estabelecida!');
        
        // Listar tabelas
        const tablesResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        
        console.log('📋 Tabelas encontradas:');
        tablesResult.rows.forEach(row => {
            console.log(`  - ${row.table_name}`);
        });
        
        // Verificar se tabela produtos existe
        const produtosExists = tablesResult.rows.some(row => row.table_name === 'produtos');
        
        if (produtosExists) {
            console.log('✅ Tabela produtos encontrada!');
            
            // Contar produtos
            const countResult = await client.query('SELECT COUNT(*) FROM produtos');
            console.log(`📊 Total de produtos: ${countResult.rows[0].count}`);
            
            // Listar alguns produtos
            const produtosResult = await client.query('SELECT id, nome, preco FROM produtos LIMIT 3');
            console.log('📦 Primeiros produtos:');
            produtosResult.rows.forEach(prod => {
                console.log(`  - ${prod.id}: ${prod.nome} - R$ ${prod.preco}`);
            });
        } else {
            console.log('❌ Tabela produtos NÃO encontrada!');
        }
        
        client.release();
        
    } catch (error) {
        console.error('❌ Erro ao testar banco:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await pool.end();
    }
}

testDatabase();
