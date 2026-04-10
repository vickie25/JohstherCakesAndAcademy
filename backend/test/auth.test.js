const request = require('supertest');
const app = require('../src/app');

describe('Authentication Tests', () => {
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

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      // Use timestamp to ensure unique email for each test run
      const timestamp = Date.now();
      const userData = {
        name: 'Test User',
        email: `test${timestamp}@example.com`,
        password: 'Password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully!');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should not register user with invalid email', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'Password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('valid email');
    });

    it('should not register user with weak password', async () => {
      const userData = {
        name: 'Test User',
        email: 'test2@example.com',
        password: 'weak'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Password must be at least 8 characters');
    });
  });

  describe('POST /api/auth/login', () => {
    let testUserEmail;

    beforeAll(async () => {
      // Create a test user for login tests
      const timestamp = Date.now();
      testUserEmail = `logintest${timestamp}@example.com`;
      
      const userData = {
        name: 'Login Test User',
        email: testUserEmail,
        password: 'Password123'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);
    });

    it('should login user successfully', async () => {
      const loginData = {
        email: testUserEmail,
        password: 'Password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful!');
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should not login with wrong password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'WrongPassword123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password.');
    });

    it('should not login non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'Password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password.');
    });
  });

  describe('Protected Routes', () => {
    let token;

    beforeAll(async () => {
      // Get token by logging in with the test user created above
      const loginData = {
        email: testUserEmail,
        password: 'Password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      token = response.body.data.token;
    });

    it('should access protected route with valid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUserEmail);
    });

    it('should not access protected route without token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access denied. No token provided.');
    });

    it('should not access protected route with invalid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
