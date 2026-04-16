const { Client } = require('pg');
require('dotenv').config();

async function addRoleColumn() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD || 'vick3900',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'johsther_cakes_academy'
  });

  try {
    await client.connect();
    console.log('Connected to database');

    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='role';
    `;
    
    const res = await client.query(checkColumnQuery);
    
    if (res.rows.length === 0) {
      console.log('Adding "role" column to "users" table...');
      await client.query("ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user';");
      console.log('✅ Column added successfully');
    } else {
      console.log('Column "role" already exists');
    }

  } catch (error) {
    console.error('❌ Error updating schema:', error.message);
  } finally {
    await client.end();
  }
}

addRoleColumn();
