// scripts/create-admin.ts
import bcrypt from 'bcryptjs';
import { openDB } from '../src/lib/sqlite/config';

async function main() {
  const email = 'adner.silva@abrasel.com.br';
  const name = 'Adner Santos Silva';
  const password = 'abrasel2025!'; // Use uma senha forte
  
  try {
    const db = await openDB();
    
    // Verificar se o usuário já existe
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      console.log('❌ Usuário já existe!');
      await db.close();
      return;
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();
    const supervisorId = crypto.randomUUID();
    
    await db.run('BEGIN TRANSACTION');
    
    // Criar usuário
    await db.run(
      `INSERT INTO users (id, email, name, password, role) 
       VALUES (?, ?, ?, ?, 'SUPERVISOR')`,
      [userId, email, name, hashedPassword]
    );
    
    // Criar supervisor
    await db.run(
      `INSERT INTO supervisors (id, user_id, permissions) 
       VALUES (?, ?, ?)`,
      [supervisorId, userId, JSON.stringify([
        'manage_users',
        'view_reports', 
        'system_admin',
        'create_associates',
        'edit_associates',
        'delete_associates',
        'view_analytics'
      ])]
    );
    
    await db.run('COMMIT');
    await db.close();
    
    console.log('✅ Usuário administrador criado com sucesso!');
    console.log('📧 Email:', email);
    console.log('👤 Nome:', name);
    console.log('🔐 Senha:', password);
    console.log('⚠️  Altere a senha no primeiro acesso!');
    
  } catch (error) {
    console.error('❌ Erro ao criar usuário administrador:', error);
  }
}

main();