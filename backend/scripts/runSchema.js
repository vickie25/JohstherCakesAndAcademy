const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function runSchema() {
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

    // Read and execute the schema file
    const schemaPath = path.join(__dirname, '../utils/databaseSchema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await client.query(schema);
    console.log('✅ Database schema executed successfully');
  } catch (error) {
    console.error('❌ Error running schema:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSchema();
