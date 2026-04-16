const { Client } = require('pg');
require('dotenv').config();

const MOCK_INQUIRIES = [
  { name: 'Sarah Wanjiku', email: 'sarah.w@example.com', phone: '+254700111222', type: 'Course Information', message: 'I am interested in the Beginner Baker course. Does it cover vegan baking?', status: 'New' },
  { name: 'John Omondi', email: 'john.o@example.com', phone: '+254722333444', type: 'Custom Cake Order', message: 'I need a 3-tier wedding cake for next month. Can we schedule a tasting?', status: 'Read' },
  { name: 'Alice Mutua', email: 'alice.m@example.com', phone: '+254733555666', type: 'General Support', message: 'Where is your physical academy located?', status: 'Replied' }
];

const MOCK_TESTIMONIALS = [
  { name: 'Sarah W.', role: 'Happy Bride', content: 'Johsther Cakes made our dream wedding cake! It was not only beautiful but also the most delicious cake we have ever tasted.', rating: 5, image_url: '/dummy-user-1.jpg', is_featured: true },
  { name: 'Jane D.', role: 'Academy Graduate', content: 'The Master Cake Artist course completely changed my business. I can now confidently price and create multi-tier cakes.', rating: 5, image_url: '/dummy-user-2.jpg', is_featured: true },
  { name: 'Mike T.', role: 'Loyal Customer', content: 'Every birthday in our family is celebrated with a Johsther Cake. Consistently amazing quality and service.', rating: 4, image_url: '/dummy-user-3.jpg', is_featured: false }
];

async function migrateMockCRM() {
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

    console.log('Clearing existing inquiries and testimonials...');
    await client.query('TRUNCATE TABLE inquiries, testimonials RESTART IDENTITY CASCADE;');

    console.log(`Migrating ${MOCK_INQUIRIES.length} inquiries...`);
    for (const inquiry of MOCK_INQUIRIES) {
      const query = `
        INSERT INTO inquiries (name, email, phone, type, message, status)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      await client.query(query, [
        inquiry.name, inquiry.email, inquiry.phone, inquiry.type, inquiry.message, inquiry.status
      ]);
      console.log(`✅ Inquiry Inserted: ${inquiry.name}`);
    }

    console.log(`Migrating ${MOCK_TESTIMONIALS.length} testimonials...`);
    for (const test of MOCK_TESTIMONIALS) {
      const query = `
        INSERT INTO testimonials (name, role, content, rating, image_url, is_featured)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      await client.query(query, [
        test.name, test.role, test.content, test.rating, test.image_url, test.is_featured
      ]);
      console.log(`✅ Testimonial Inserted: ${test.name}`);
    }

    console.log('✅ CRM migration completed successfully');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await client.end();
  }
}

migrateMockCRM();
