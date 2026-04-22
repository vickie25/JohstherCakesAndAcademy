const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function setupAdminTables() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD || 'vick3900',
    port: Number.parseInt(String(process.env.DB_PORT || '5432'), 10) || 5432,
    database: process.env.DB_NAME || 'johsther_cakes_academy'
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // 1. Update/Create Cakes Table (using products as base)
    console.log('Setting up cakes table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS cakes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        color VARCHAR(50),
        price DECIMAL(12,2) NOT NULL,
        image_url TEXT,
        tag VARCHAR(100),
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Create Online Courses Table
    console.log('Setting up courses table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT,
        price DECIMAL(12,2) NOT NULL,
        duration VARCHAR(100),
        sessions VARCHAR(100),
        image_url TEXT,
        brand_color VARCHAR(20),
        features JSONB DEFAULT '[]',
        tag VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Migrating courses media & lessons...');
    await client.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`);
    await client.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS promo_video_url TEXT;`);
    await client.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS delivery_type VARCHAR(20) DEFAULT 'online';`);
    await client.query(`UPDATE courses SET delivery_type = 'online' WHERE delivery_type IS NULL OR delivery_type = '';`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS course_lessons (
        id SERIAL PRIMARY KEY,
        course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        video_url TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Create Academy Batches Table
    console.log('Setting up academy_batches table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS academy_batches (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        start_date DATE,
        price DECIMAL(12,2),
        status VARCHAR(50) DEFAULT 'Open',
        status_color VARCHAR(50),
        course_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Create Registrations Table
    console.log('Setting up registrations table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        student_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        course_name VARCHAR(255),
        batch_id INTEGER REFERENCES academy_batches(id),
        status VARCHAR(50) DEFAULT 'Pending',
        payment_status VARCHAR(50) DEFAULT 'Unpaid',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Create Inquiries Table
    console.log('Setting up inquiries table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        type VARCHAR(50),
        message TEXT,
        status VARCHAR(50) DEFAULT 'New',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Setting up staff_roles & user role assignment...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS staff_roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL UNIQUE,
        description TEXT,
        permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS staff_role_id INTEGER REFERENCES staff_roles(id) ON DELETE SET NULL;
    `);

    const allPerms = [
      'Overview', 'Analytics', 'Notifications', 'Orders', 'Cakes', 'Customers',
      'Inquiries', 'Testimonials', 'Refunds', 'Courses', 'Batches', 'Registrations',
      'Roles', 'Settings',
    ];
    const coursePerms = ['Overview', 'Courses', 'Batches', 'Registrations', 'Testimonials', 'Inquiries'];
    const orderPerms = ['Overview', 'Orders', 'Cakes', 'Customers', 'Inquiries', 'Analytics'];

    const cnt = await client.query('SELECT COUNT(*)::int AS c FROM staff_roles');
    if (cnt.rows[0].c === 0) {
      await client.query(
        `INSERT INTO staff_roles (name, description, permissions) VALUES
         ($1, $2, $3::jsonb),
         ($4, $5, $6::jsonb),
         ($7, $8, $9::jsonb)`,
        [
          'Super Admin',
          'Full dashboard access',
          JSON.stringify(allPerms),
          'Course Manager',
          'Academy content, intakes, and registrations',
          JSON.stringify(coursePerms),
          'Order Admin',
          'Boutique orders, cakes, customers, and analytics',
          JSON.stringify(orderPerms),
        ]
      );
      console.log('Seeded default staff roles');
    }

    console.log('✅ All admin tables setup successfully');

  } catch (error) {
    console.error('❌ Error setting up admin tables:', error.message);
  } finally {
    await client.end();
  }
}

setupAdminTables();
