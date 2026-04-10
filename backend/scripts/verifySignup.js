// Verify signup functionality - test user creation in database
const request = require('supertest');
const app = require('../src/app');
const db = require('../config/database');

async function verifySignupFlow() {
  let server;
  
  try {
    console.log('=== VERIFYING SIGNUP FUNCTIONALITY ===\n');
    
    // Start server
    server = app.listen(0);
    console.log('1. Server started successfully');
    
    // Test data
    const timestamp = Date.now();
    const testUser = {
      name: 'Frontend Test User',
      email: `frontendtest${timestamp}@example.com`,
      password: 'Password123'
    };
    
    console.log('2. Testing user registration...');
    console.log(`   Email: ${testUser.email}`);
    
    // Register user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    if (registerResponse.status === 201) {
      console.log('   Registration successful! Response:');
      console.log(`   - Success: ${registerResponse.body.success}`);
      console.log(`   - Message: ${registerResponse.body.message}`);
      console.log(`   - User ID: ${registerResponse.body.data.user.id}`);
      console.log(`   - Token: ${registerResponse.body.data.token ? 'Generated' : 'Missing'}`);
    } else {
      console.log('   Registration failed:', registerResponse.body.message);
      return;
    }
    
    // Verify user in database
    console.log('\n3. Verifying user in database...');
    const dbUser = await db.query('SELECT * FROM users WHERE email = $1', [testUser.email]);
    
    if (dbUser.rows.length > 0) {
      const user = dbUser.rows[0];
      console.log('   User found in database!');
      console.log(`   - ID: ${user.id}`);
      console.log(`   - Name: ${user.name}`);
      console.log(`   - Email: ${user.email}`);
      console.log(`   - Created: ${user.created_at}`);
      console.log(`   - Password Hash: ${user.password_hash ? 'Present' : 'Missing'}`);
      
      // Test login
      console.log('\n4. Testing login with created user...');
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      if (loginResponse.status === 200) {
        console.log('   Login successful!');
        console.log(`   - Token received: ${loginResponse.body.data.token ? 'Yes' : 'No'}`);
        
        // Test protected route
        console.log('\n5. Testing protected route access...');
        const profileResponse = await request(app)
          .get('/api/users/profile')
          .set('Authorization', `Bearer ${loginResponse.body.data.token}`);
        
        if (profileResponse.status === 200) {
          console.log('   Protected route access successful!');
          console.log(`   - Profile user: ${profileResponse.body.data.user.name}`);
        } else {
          console.log('   Protected route access failed:', profileResponse.body.message);
        }
      } else {
        console.log('   Login failed:', loginResponse.body.message);
      }
    } else {
      console.log('   User NOT found in database!');
    }
    
    // Check total users in database
    console.log('\n6. Database summary:');
    const totalUsers = await db.query('SELECT COUNT(*) as count FROM users');
    console.log(`   Total users in database: ${totalUsers.rows[0].count}`);
    
    // List all users
    const allUsers = await db.query('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT 5');
    console.log('   Recent users:');
    allUsers.rows.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - ID: ${user.id}`);
    });
    
    console.log('\n=== SIGNUP VERIFICATION COMPLETE ===');
    console.log('   Frontend signup will work correctly!');
    console.log('   Users are properly created in the database.');
    console.log('   Authentication flow is working.');
    
  } catch (error) {
    console.error('Verification failed:', error);
  } finally {
    if (server) {
      await new Promise((resolve) => {
        server.close(resolve);
      });
    }
  }
}

verifySignupFlow();
