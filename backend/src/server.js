const app = require('./app');
const db = require('../config/database');

// Test database connection
const testDbConnection = async () => {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('✅ Database connected successfully');
    console.log(`⏰ Database time: ${result.rows[0].now}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  await testDbConnection();
  
  // The server is already started in app.js
  console.log('🎉 Backend server is ready!');
};

startServer().catch(console.error);
