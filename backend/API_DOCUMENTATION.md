# Johsther Cakes & Academy Backend API Documentation

## Overview
This is a bulletproof Node.js backend API built with Express.js, PostgreSQL, and JWT authentication for the Johsther Cakes & Academy ecommerce application.

## Base URL
```
http://localhost:5000/api
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Health Check
**GET** `/health`

Check if the server is running.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-04-09T14:19:00.000Z",
  "environment": "development"
}
```

---

### Authentication Routes

#### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Validation Rules:**
- Name: Minimum 2 characters
- Email: Valid email format
- Password: Minimum 8 characters, must contain uppercase, lowercase, and numbers

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully!",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2026-04-09T14:19:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400` - Invalid input data
- `400` - Email already exists
- `500` - Server error

---

#### Login User
**POST** `/auth/login`

Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful!",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2026-04-09T14:19:00.000Z",
      "lastLogin": "2026-04-09T14:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400` - Invalid input data
- `401` - Invalid email or password
- `500` - Server error

---

### User Routes (Protected)

#### Get User Profile
**GET** `/users/profile`

Get the authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2026-04-09T14:19:00.000Z"
    }
  }
}
```

**Error Responses:**
- `401` - No token provided or invalid token
- `401` - Token expired
- `500` - Server error

---

#### Update User Profile
**PUT** `/users/profile`

Update the authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
  "name": "John Smith"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Smith",
      "email": "john@example.com",
      "updated_at": "2026-04-09T14:35:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400` - Invalid input data
- `401` - No token provided or invalid token
- `401` - Token expired
- `500` - Server error

---

## Error Response Format

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Rate Limiting
- API endpoints are rate-limited to 100 requests per 15 minutes per IP
- Rate limit exceeded response (429):
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

## Testing with Postman/cURL

### Register User (cURL)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123"
  }'
```

### Login User (cURL)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

### Get Profile (cURL)
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Security Features
- Password hashing with bcrypt (12 salt rounds)
- JWT token authentication
- Rate limiting
- CORS protection
- Helmet.js for security headers
- Input validation and sanitization
- SQL injection prevention with parameterized queries

## Database Schema
The backend uses PostgreSQL with the following main tables:
- `users` - User authentication and profile data
- `products` - Product catalog (prepared for future ecommerce features)

See `utils/databaseSchema.sql` for complete schema definition.
