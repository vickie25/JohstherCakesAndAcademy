// Manual test for authentication endpoints
// Run this with: node test/manualTest.js

const request = require('supertest');
const app = require('../src/app');

async function runTests() {
  console.log('🧪 Testing Authentication Endpoints...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await request(app).get('/health');
    console.log('✅ Health Check:', healthResponse.body.message);
    console.log('   Server is running on:', healthResponse.body.environment, '\n');

    // Test 2: Register User
    console.log('2️⃣ Testing User Registration...');
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123'
    };

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userData);

    if (registerResponse.status === 201) {
      console.log('✅ Registration Successful!');
      console.log('   User:', registerResponse.body.data.user.name);
      console.log('   Email:', registerResponse.body.data.user.email);
      console.log('   Token received:', registerResponse.body.data.token ? 'Yes' : 'No', '\n');
    } else {
      console.log('❌ Registration Failed:', registerResponse.body.message, '\n');
    }

    // Test 3: Login User
    console.log('3️⃣ Testing User Login...');
    const loginData = {
      email: 'test@example.com',
      password: 'Password123'
    };

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send(loginData);

    if (loginResponse.status === 200) {
      console.log('✅ Login Successful!');
      console.log('   User:', loginResponse.body.data.user.name);
      console.log('   Token received:', loginResponse.body.data.token ? 'Yes' : 'No', '\n');
      
      // Test 4: Protected Route
      console.log('4️⃣ Testing Protected Route...');
      const token = loginResponse.body.data.token;
      
      const profileResponse = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      if (profileResponse.status === 200) {
        console.log('✅ Protected Route Access Successful!');
        console.log('   User Profile:', profileResponse.body.data.user.name, '\n');
      } else {
        console.log('❌ Protected Route Access Failed:', profileResponse.body.message, '\n');
      }
    } else {
      console.log('❌ Login Failed:', loginResponse.body.message, '\n');
    }

    console.log('🎉 Authentication tests completed!');
    console.log('\n📝 Postman Setup:');
    console.log('   Base URL: http://localhost:5000');
    console.log('   Register: POST /api/auth/register');
    console.log('   Login: POST /api/auth/login');
    console.log('   Profile: GET /api/users/profile (with Authorization: Bearer <token>)');

  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

runTests();
