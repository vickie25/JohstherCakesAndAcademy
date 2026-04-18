require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('Seeding Database...');

    // Clear existing data to avoid duplicates
    await client.query('TRUNCATE TABLE inquiries, testimonials, academy_batches, courses, cakes, users RESTART IDENTITY CASCADE');

    // 1. Seed Users (Admin & Customer)
    const adminPassword = await bcrypt.hash('admin123', 10);
    const customerPassword = await bcrypt.hash('customer123', 10);
    
    await client.query(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES 
        ('Admin User', 'admin@johsther.com', $1, 'admin'),
        ('John Kamau', 'john@example.com', $2, 'customer'),
        ('Jane Doe', 'jane@example.com', $2, 'customer')
    `, [adminPassword, customerPassword]);
    console.log('Users seeded.');

    // 2. Seed Cakes
    await client.query(`
      INSERT INTO cakes (name, category, price, description, image_url, color, tag, is_active)
      VALUES 
        ('Midnight Truffle Symphony', 'Birthday', 4500, 'Triple-layered dark Belgian chocolate with a silky smooth ganache finish.', '/hero_cake_elegant.png', 'Chocolate', 'Luxury', true),
        ('Royal Red Velvet Pearl', 'Birthday', 3200, 'Our signature crimson cocoa layers with Madagascar vanilla cream cheese frost.', '/red_velvet_cake.png', 'Red', 'Signature', true),
        ('Golden Orchard Delight', 'Custom', 4000, 'Moist vanilla bean layers filled with fresh passion fruit curd and citrus zest.', '/hero-cake.png', 'Gold', 'Fresh', true),
        ('Antique Lace Wedding', 'Wedding', 15500, 'Exquisite three-tier masterpiece with hand-sculpted sugar flowers.', '/hero_cake_elegant.png', 'White', 'Wedding', true)
    `);
    console.log('Cakes seeded.');

    // 3. Seed Courses
    await client.query(`
      INSERT INTO courses (title, subtitle, price, duration, sessions, image_url, tag, is_active)
      VALUES 
        ('Beginner Baker Pro', 'Master the science of cake mixing and basic decorating from scratch.', 2900, '5h 30m', '12', '/hero_baker.png', 'Starter', true),
        ('The Fondant Masterclass', 'Advanced sculpting, sharp edges, and multi-tier stability techniques.', 7500, '12h 45m', '24', '/hero_cake_elegant.png', 'Best Seller', true),
        ('Baking Business Launchpad', 'Transform your passion into a profitable brand with marketing & costing.', 12000, '20h 15m', '30', '/academy-class.png', 'Business', true)
    `);
    console.log('Courses seeded.');

    // 4. Seed Batches (for Academy)
    await client.query(`
      INSERT INTO academy_batches (name, course_name, start_date, price, status, status_color)
      VALUES 
        ('Easter Intake 2026', 'Beginner Baker Pro', '2026-04-20', 2900, 'Active', 'green'),
        ('Summer Fast-track', 'The Fondant Masterclass', '2026-06-01', 7500, 'Upcoming', 'orange')
    `);
    console.log('Batches seeded.');

    // 5. Seed Testimonials
    await client.query(`
      INSERT INTO testimonials (name, role, content, rating, image_url, is_featured, is_active)
      VALUES 
        ('Mercy Njeri', 'Home Baker', 'Johsther Academy changed my life! The advanced baking course was intense but rewarding.', 5, '', true, true),
        ('David Maina', 'Entrepreneur', 'Best cakes in Nairobi, hands down. The Victorian Velvet is a masterpiece.', 5, '', false, true)
    `);
    console.log('Testimonials seeded.');

    // 6. Seed Inquiries
    await client.query(`
      INSERT INTO inquiries (name, email, phone, type, message, status)
      VALUES 
        ('Grace Wambui', 'grace@example.com', '0700112233', 'Custom Cake', 'I need a 3-tier cake for my wedding in June.', 'new'),
        ('Alex Muli', 'alex@example.com', '0788990011', 'Academy', 'When is the next intermediate baking class?', 'read')
    `);
    console.log('Inquiries seeded.');

    await client.query('COMMIT');
    console.log('Seeding Complete!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error seeding data:', err);
  } finally {
    client.release();
    pool.end();
  }
}

main();
