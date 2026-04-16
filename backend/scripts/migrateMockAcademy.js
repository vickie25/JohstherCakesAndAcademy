const { Client } = require('pg');
require('dotenv').config();

const MOCK_COURSES = [
  {
    title: 'Beginner Baker Online',
    subtitle: 'Master the basics from your own kitchen',
    price: 2900,
    duration: '12 Video Modules',
    sessions: 'Lifetime Access',
    image_url: '/hero_baker.png',
    brand_color: '#B45309',
    features: [
      'Step-by-step video tutorials',
      'Downloadable recipe PDFs',
      'Private WhatsApp support group',
      'Learn at your own pace',
      'Digital certificate of completion',
    ],
    tag: null,
  },
  {
    title: 'Master Cake Artist',
    subtitle: 'Advanced techniques, anywhere in the world',
    price: 7500,
    duration: '24 HD Lessons',
    sessions: 'On-Demand',
    image_url: '/hero_cake_elegant.png',
    brand_color: '#F59E0B',
    features: [
      'Fondant & Sculpting masterclass',
      'Multi-tier cake architecture',
      'Business & Pricing modules',
      'Monthly Live Q&A sessions',
      'Professional Portfolio tips',
      'Exclusive Alumni community',
    ],
    tag: 'Best Seller',
  },
  {
    title: 'Professional Path',
    subtitle: 'Launch your baking business digitally',
    price: 12000,
    duration: 'Full Certification',
    sessions: 'Unlimited Access',
    image_url: '/academy-class.png',
    brand_color: '#92400E',
    features: [
      'Advanced 3D & Sculpted cakes',
      'Marketing & Social Media for bakers',
      'Access to all future updates',
      '1-on-1 Digital mentorship call',
      'Business templates & contracts',
      'Internship opportunities (Remote)',
    ],
    tag: 'Premium',
  },
];

const MOCK_BATCHES = [
  { name: 'Beginner Baker (Batch #12)', start_date: '2026-04-19', price: 4500, status: '3 spots left', status_color: 'bg-amber-100 text-amber-800', course_name: 'Beginner Baker' },
  { name: 'Intermediate Artist', start_date: '2026-05-05', price: 9800, status: 'Filling fast', status_color: 'bg-orange-100 text-orange-800', course_name: 'Intermediate Artist' },
  { name: 'Pro Masterclass', start_date: '2026-05-20', price: 18500, status: 'Open', status_color: 'bg-emerald-100 text-emerald-800', course_name: 'Pro Masterclass' },
];

async function migrateMockAcademy() {
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

    console.log('Clearing existing courses and batches...');
    await client.query('TRUNCATE TABLE courses, academy_batches RESTART IDENTITY CASCADE;');

    console.log(`Migrating ${MOCK_COURSES.length} courses...`);
    for (const course of MOCK_COURSES) {
      const query = `
        INSERT INTO courses (title, subtitle, price, duration, sessions, image_url, brand_color, features, tag)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;
      await client.query(query, [
        course.title, course.subtitle, course.price, course.duration, course.sessions, 
        course.image_url, course.brand_color, JSON.stringify(course.features), course.tag
      ]);
      console.log(`✅ Course Inserted: ${course.title}`);
    }

    console.log(`Migrating ${MOCK_BATCHES.length} batches...`);
    for (const batch of MOCK_BATCHES) {
      const query = `
        INSERT INTO academy_batches (name, start_date, price, status, status_color, course_name)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      await client.query(query, [
        batch.name, batch.start_date, batch.price, batch.status, batch.status_color, batch.course_name
      ]);
      console.log(`✅ Batch Inserted: ${batch.name}`);
    }

    console.log('✅ Academy migration completed successfully');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await client.end();
  }
}

migrateMockAcademy();
