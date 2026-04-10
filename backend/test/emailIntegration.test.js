// Email integration test
const request = require('supertest');
const app = require('../src/app');

describe('Email Integration Tests', () => {
  let server;

  beforeAll(async () => {
    // Use port 0 to get a random available port
    server = app.listen(0);
  });

  afterAll(async () => {
    if (server) {
      await new Promise((resolve) => {
        server.close(resolve);
      });
    }
  });

  describe('User Registration with Email', () => {
    it('should register user and send welcome email', async () => {
      // Use timestamp to ensure unique email for each test run
      const timestamp = Date.now();
      const userData = {
        name: 'Email Test User',
        email: `emailtest${timestamp}@example.com`,
        password: 'Password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Welcome email sent');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();

      console.log('Registration with email test passed!');
    });
  });
});
