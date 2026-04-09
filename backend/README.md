# Johsther Cakes & Academy Backend

A bulletproof Node.js backend API built with Express.js, PostgreSQL, and JWT authentication for the Johsther Cakes & Academy ecommerce application.

## Features

- **Authentication**: Secure user registration and login with JWT
- **Security**: Password hashing with bcrypt, rate limiting, CORS protection
- **Database**: PostgreSQL with connection pooling
- **Validation**: Input validation and sanitization
- **Development**: Hot reload with nodemon
- **Documentation**: Complete API documentation

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository and navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up your PostgreSQL database:
```bash
# Create a new database
createdb johsther_cakes_academy

# Run the database schema
psql -d johsther_cakes_academy -f utils/databaseSchema.sql
```

4. Configure environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your database credentials and JWT secret
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=johsther_cakes_academy
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## Running the Application

### Development Mode (with hot reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API endpoints and usage examples.

## Testing the APIs

### Health Check
```bash
curl http://localhost:5000/health
```

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

### Get Profile (with token)
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Project Structure

```
backend/
├── src/
│   ├── app.js              # Express app configuration
│   └── server.js           # Server startup and database connection
├── config/
│   └── database.js         # PostgreSQL connection configuration
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   └── validation.js       # Input validation middleware
├── models/
│   └── User.js             # User model and database operations
├── routes/
│   ├── auth.js             # Authentication routes
│   └── users.js            # User management routes
├── utils/
│   └── databaseSchema.sql  # Database schema definition
├── .env                    # Environment variables
├── nodemon.json            # Nodemon configuration
├── package.json            # Project dependencies and scripts
├── API_DOCUMENTATION.md    # Detailed API documentation
└── README.md               # This file
```

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT token authentication with expiration
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet.js security headers
- Input validation and sanitization
- SQL injection prevention with parameterized queries

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
