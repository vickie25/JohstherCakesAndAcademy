const { Client } = require('pg');
require('dotenv').config();

const MOCK_CAKES = [
  { name: 'Royal Ivory Dream', category: 'Wedding', color: 'White', price: 12500, image: '/hero_cake_elegant.png', tag: 'Premium', desc: 'A towering classic white wedding cake with subtle ivory floral details.' },
  { name: 'Blush Rose Celebration', category: 'Birthday', color: 'Pink', price: 4500, image: '/red_velvet_cake.png', tag: 'Best Seller', desc: 'Soft pink buttercream rosettes covering a rich velvet core.' },
  { name: 'Golden Jubilee Tier', category: 'Corporate', color: 'Gold', price: 8900, image: '/hero-cake.png', tag: 'Elegant', desc: 'Accented with genuine edible gold leaf for corporate milestones.' },
  { name: 'Midnight Stargazer', category: 'Birthday', color: 'Blue', price: 5200, image: '/hero_baker.png', tag: 'New', desc: 'Deep blue gradient with silver sprinkles resembling a night sky.' },
  { name: 'Pistachio Meadow', category: 'Academy', color: 'Green', price: 2800, image: '/academy-class.png', tag: 'Student Made', desc: 'Crafted by our senior academy students featuring pistachio crumbles.' },
  { name: 'Crimson Velvet Hearts', category: 'Wedding', color: 'Red', price: 9500, image: '/red_velvet_cake.png', tag: 'Romantic', desc: 'A passionate red velvet multi-tier perfect for bold weddings.' },
  { name: 'Double Chocolate Fudge', category: 'Birthday', color: 'Chocolate', price: 3800, image: '/hero_baker.png', tag: 'Popular', desc: 'Decadent, rich, and utterly chocolatey inside and out.' },
  { name: 'Lavender Dreamscape', category: 'Academy', color: 'Purple', price: 2600, image: '/hero-cake.png', tag: 'Student Made', desc: 'A beautiful lavender-infused creation with subtle floral notes.' },
  { name: 'Corporate Elegance', category: 'Corporate', color: 'White', price: 6000, image: '/hero_cake_elegant.png', tag: 'Bespoke', desc: 'Minimalist white fondant with space for your company logo.' },
  { name: 'Golden Choco Drip', category: 'Birthday', color: 'Chocolate', price: 4200, image: '/hero_baker.png', tag: 'Decadent', desc: 'Chocolate base with a mesmerizing metallic gold drip effect.' },
  { name: 'Ocean Breeze Fondant', category: 'Wedding', color: 'Blue', price: 11000, image: '/academy-class.png', tag: 'Premium', desc: 'Nautical-inspired wedding cake with sugar seashells.' },
  { name: 'Classic Strawberry Shortcake', category: 'Birthday', color: 'Red', price: 3300, image: '/red_velvet_cake.png', tag: 'Classic', desc: 'Fresh strawberries layered between vanilla sponge and cream.' },
];

async function migrateMockCakes() {
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

    console.log('Clearing existing cakes (clean migration)...');
    await client.query('TRUNCATE TABLE cakes RESTART IDENTITY CASCADE;');

    console.log(`Migrating ${MOCK_CAKES.length} cakes...`);
    
    for (const cake of MOCK_CAKES) {
      const query = `
        INSERT INTO cakes (name, category, color, price, image_url, tag, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      await client.query(query, [
        cake.name, 
        cake.category, 
        cake.color, 
        cake.price, 
        cake.image, 
        cake.tag, 
        cake.desc
      ]);
      console.log(`✅ Inserted: ${cake.name}`);
    }

    console.log('✅ Migration completed successfully');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await client.end();
  }
}

migrateMockCakes();
