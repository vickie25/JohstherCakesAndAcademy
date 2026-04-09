const { Client } = require('pg');

async function createDatabase() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: 'vick3900',
    port: 5432,
    database: 'postgres' // Connect to default postgres database first
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL server');

    // Check if database exists
    const checkDbQuery = 'SELECT 1 FROM pg_database WHERE datname = $1';
    const result = await client.query(checkDbQuery, ['johsther_cakes_academy']);
    
    if (result.rows.length === 0) {
      // Create database if it doesn't exist
      await client.query('CREATE DATABASE "johsther_cakes_academy"');
      console.log('✅ Database "johsther_cakes_academy" created successfully');
    } else {
      console.log('✅ Database "johsther_cakes_academy" already exists');
    }
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createDatabase();
