// Clean up test users from database
const { Client } = require('pg');

async function cleanupTestUsers() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: 'vick3900',
    port: 5432,
    database: 'johsther_cakes_academy'
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Delete test users (emails containing 'test' or 'example')
    const deleteQuery = `
      DELETE FROM users 
      WHERE email LIKE '%test%' 
      OR email LIKE '%example%'
      OR email LIKE '%@ethereal.email%'
    `;
    
    const result = await client.query(deleteQuery);
    console.log(`Deleted ${result.rowCount} test users`);

    // Show remaining users
    const remainingQuery = 'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC';
    const remaining = await client.query(remainingQuery);
    
    console.log('\nRemaining users:');
    remaining.rows.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Created: ${user.created_at}`);
    });

  } catch (error) {
    console.error('Error cleaning up test users:', error);
  } finally {
    await client.end();
  }
}

cleanupTestUsers();
