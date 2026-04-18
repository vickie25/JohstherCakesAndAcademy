require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    console.log('Creating system_settings table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) UNIQUE NOT NULL,
        value JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed default settings if they don't exist
    const defaults = [
      { key: 'site_config', value: { name: 'Johsther Cakes', email: 'vickie@johsther.com', phone: '+254700000000', address: 'Nairobi, Kenya' } },
      { key: 'notifications', value: { email_on_order: true, email_on_registration: true, email_on_inquiry: true } },
      { key: 'academy_config', value: { registration_fee: 1000, currency: 'KES' } }
    ];

    for (const d of defaults) {
      await client.query(
        'INSERT INTO system_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING',
        [d.key, d.value]
      );
    }

    await client.query('COMMIT');
    console.log('Migration Complete!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration Failed:', err);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
