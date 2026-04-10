// Clear all users from database
const { Client } = require('pg');

async function clearAllUsers() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: 'vick3900',
    port: 5432,
    database: 'johsther_cakes_academy'
  });

  try {
    await client.connect();
    console.log('Connected to johsther_cakes_academy database');

    // Get current user count
    const countResult = await client.query('SELECT COUNT(*) as count FROM users');
    const userCount = parseInt(countResult.rows[0].count);
    console.log(`Current users in database: ${userCount}`);

    if (userCount > 0) {
      // Delete all users
      const deleteResult = await client.query('DELETE FROM users');
      console.log(`Deleted ${deleteResult.rowCount} users from database`);
      
      // Reset auto-increment sequence
      await client.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
      console.log('Reset user ID sequence to 1');
    } else {
      console.log('No users to delete - database is already empty');
    }

    // Verify deletion
    const verifyResult = await client.query('SELECT COUNT(*) as count FROM users');
    console.log(`Users remaining: ${verifyResult.rows[0].count}`);

    console.log('\n=== ALL USERS CLEARED SUCCESSFULLY ===');

  } catch (error) {
    console.error('Error clearing users:', error);
    throw error;
  } finally {
    await client.end();
  }
}

clearAllUsers().catch(console.error);
