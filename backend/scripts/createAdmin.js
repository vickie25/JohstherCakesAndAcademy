// Create or update an admin user in the database
// Usage:
//   node scripts/createAdmin.js                            → uses defaults
//   node scripts/createAdmin.js --name="Vickie" --email="vickie@johsther.com" --password="MyPass123"

const path = require('path');
const { Client } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// --- Parse CLI args --------------------------------------------------
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, val] = arg.replace('--', '').split('=');
  acc[key] = val;
  return acc;
}, {});

const ADMIN_NAME = args.name || 'vick';
const ADMIN_EMAIL = args.email || 'nyandorovictor95@gmail.com';
const ADMIN_PASSWORD = args.password || 'vick123';
// ---------------------------------------------------------------------

async function createAdmin() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD || 'vick3900',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'johsther_cakes_academy',
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Hash the password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    // Check if user already exists
    const existing = await client.query(
      'SELECT id, name, email, role FROM users WHERE email = $1',
      [ADMIN_EMAIL]
    );

    if (existing.rows.length > 0) {
      // Update existing user to admin
      const updated = await client.query(
        `UPDATE users
         SET name = $1, password_hash = $2, role = 'admin', updated_at = NOW()
         WHERE email = $3
         RETURNING id, name, email, role`,
        [ADMIN_NAME, hashedPassword, ADMIN_EMAIL]
      );
      const user = updated.rows[0];
      console.log('🔄 Existing user updated to admin:');
      console.log(`   ID:    ${user.id}`);
      console.log(`   Name:  ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role:  ${user.role}`);
    } else {
      // Insert new admin user
      const inserted = await client.query(
        `INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
         VALUES ($1, $2, $3, 'admin', NOW(), NOW())
         RETURNING id, name, email, role`,
        [ADMIN_NAME, ADMIN_EMAIL, hashedPassword]
      );
      const user = inserted.rows[0];
      console.log('🎉 Admin user created successfully:');
      console.log(`   ID:    ${user.id}`);
      console.log(`   Name:  ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role:  ${user.role}`);
    }

    console.log('\n========================================');
    console.log('  LOGIN CREDENTIALS');
    console.log('========================================');
    console.log(`  Email:    ${ADMIN_EMAIL}`);
    console.log('  Password: (hidden)');
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

createAdmin().catch(console.error);
