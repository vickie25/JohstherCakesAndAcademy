# 🎂 Johsther Cakes & Academy — Admin API Testing Guide

> **Base URL:** `http://localhost:5000`  
> **Rate Limit:** 100 requests / 15 minutes per IP  
> **Auth:** Bearer JWT token required on all `🔒 Admin` routes

---

## 📋 Table of Contents

1. [Setup & Prerequisites](#1-setup--prerequisites)
2. [Authentication Flow](#2-authentication-flow)
3. [Users API](#3-users-api)
4. [Cakes API](#4-cakes-api)
5. [Courses API](#5-courses-api)
6. [Academy (Batches & Registrations) API](#6-academy-batches--registrations-api)
7. [Testimonials API](#7-testimonials-api)
8. [Inquiries API](#8-inquiries-api)
9. [Health Check](#9-health-check)
10. [Error Reference](#10-error-reference)
11. [Quick cURL Cheatsheet](#11-quick-curl-cheatsheet)

---

## 1. Setup & Prerequisites

### Start the backend server
```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
```

### Tools you can use
| Tool | Notes |
|------|-------|
| **cURL** | Built into Windows 10/11 PowerShell & terminal |
| **Postman** | GUI client — recommended for exploring |
| **Thunder Client** | VS Code extension |
| **Insomnia** | Lightweight REST client |

### Common Headers
```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

---

## 2. Authentication Flow

### 2.1 — Admin Login 🔓 Public
**`POST /api/auth/admin-login`**

This is your **first step**. Get an admin JWT token to use on all protected routes.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

> ⚠️ The password **must** be `admin123`. The `username` field can be anything.  
> If no admin user exists in the DB, the server auto-creates `admin@johsther.com`.

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Admin login successful!",
  "data": {
    "user": {
      "id": 1,
      "name": "System Admin",
      "email": "admin@johsther.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response `401` — wrong password:**
```json
{
  "success": false,
  "message": "Invalid admin credentials."
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"admin\", \"password\": \"admin123\"}"
```

---

### 2.2 — Register a New User 🔓 Public
**`POST /api/auth/register`**

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass123"
}
```

**Success Response `201`:**
```json
{
  "success": true,
  "message": "User registered successfully! Welcome email sent.",
  "data": {
    "user": {
      "id": 5,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user",
      "createdAt": "2026-04-16T17:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Jane Doe\", \"email\": \"jane@example.com\", \"password\": \"SecurePass123\"}"
```

---

### 2.3 — Regular User Login 🔓 Public
**`POST /api/auth/login`**

**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "SecurePass123"
}
```

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Login successful!",
  "data": {
    "user": {
      "id": 5,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user",
      "createdAt": "2026-04-16T17:00:00.000Z",
      "lastLogin": "2026-04-16T20:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 3. Users API

### 3.1 — Get All Users 🔓 Public (Testing)
**`GET /api/users`**

> Note: No auth required — useful for quickly listing all registered users during development.

**Success Response `200`:**
```json
{
  "success": true,
  "message": "All users retrieved successfully",
  "data": {
    "users": [
      {
        "id": 1,
        "name": "System Admin",
        "email": "admin@johsther.com",
        "created_at": "2026-04-10T08:00:00.000Z",
        "updated_at": "2026-04-10T08:00:00.000Z"
      }
    ]
  }
}
```

**cURL:**
```bash
curl http://localhost:5000/api/users
```

---

### 3.2 — Get My Profile 🔒 Private
**`GET /api/users/profile`**

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "System Admin",
      "email": "admin@johsther.com",
      "role": "admin"
    }
  }
}
```

**cURL:**
```bash
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

### 3.3 — Update My Profile 🔒 Private
**`PUT /api/users/profile`**

**Request Body:**
```json
{
  "name": "Admin Updated Name"
}
```

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin Updated Name",
      "email": "admin@johsther.com",
      "updated_at": "2026-04-16T20:00:00.000Z"
    }
  }
}
```

---

## 4. Cakes API

### 4.1 — Get All Cakes 🔓 Public
**`GET /api/cakes`**

| Query Param | Type | Default | Description |
|-------------|------|---------|-------------|
| `active` | `boolean` | `true` | Pass `false` to include inactive cakes |

**Examples:**
```
GET /api/cakes          → active cakes only
GET /api/cakes?active=false  → all cakes including inactive
```

**Success Response `200`:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "name": "Red Velvet Delight",
      "description": "Rich red velvet with cream cheese frosting",
      "price": "2500.00",
      "category": "signature",
      "is_active": true,
      "created_at": "2026-04-10T08:00:00.000Z"
    }
  ]
}
```

**cURL:**
```bash
curl http://localhost:5000/api/cakes
curl "http://localhost:5000/api/cakes?active=false"
```

---

### 4.2 — Get Single Cake 🔓 Public
**`GET /api/cakes/:id`**

**cURL:**
```bash
curl http://localhost:5000/api/cakes/1
```

**Success Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Red Velvet Delight",
    "price": "2500.00"
  }
}
```

**Error `404`:**
```json
{
  "success": false,
  "message": "Cake not found"
}
```

---

### 4.3 — Create Cake 🔒 Admin
**`POST /api/cakes`**

**Request Body:**
```json
{
  "name": "Chocolate Fudge Supreme",
  "description": "Decadent layers of dark chocolate with fudge filling",
  "price": 3500,
  "category": "premium",
  "image_url": "https://example.com/cake.jpg",
  "is_active": true
}
```

**Success Response `201`:**
```json
{
  "success": true,
  "data": {
    "id": 4,
    "name": "Chocolate Fudge Supreme",
    "price": "3500.00",
    "category": "premium",
    "is_active": true,
    "created_at": "2026-04-16T20:00:00.000Z"
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/cakes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d "{\"name\": \"Chocolate Fudge Supreme\", \"description\": \"Decadent layers\", \"price\": 3500, \"category\": \"premium\", \"is_active\": true}"
```

---

### 4.4 — Update Cake 🔒 Admin
**`PUT /api/cakes/:id`**

**Request Body (any updatable fields):**
```json
{
  "price": 4000,
  "is_active": false
}
```

**cURL:**
```bash
curl -X PUT http://localhost:5000/api/cakes/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d "{\"price\": 4000, \"is_active\": false}"
```

---

### 4.5 — Delete Cake 🔒 Admin
**`DELETE /api/cakes/:id`**

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Cake removed successfully"
}
```

**cURL:**
```bash
curl -X DELETE http://localhost:5000/api/cakes/1 \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

---

## 5. Courses API

### 5.1 — Get All Courses 🔓 Public
**`GET /api/courses`**

| Query Param | Type | Default | Description |
|-------------|------|---------|-------------|
| `active` | `boolean` | `true` | Pass `false` to include inactive courses |

**Success Response `200`:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "title": "Cake Decorating Basics",
      "description": "Learn fondant, buttercream, and piping techniques",
      "price": "15000.00",
      "level": "beginner",
      "duration": "4 weeks",
      "is_active": true
    }
  ]
}
```

**cURL:**
```bash
curl http://localhost:5000/api/courses
```

---

### 5.2 — Create Course 🔒 Admin
**`POST /api/courses`**

**Request Body:**
```json
{
  "title": "Advanced Sugar Sculpting",
  "description": "Master-level sugar art and sculpture techniques",
  "price": 45000,
  "level": "advanced",
  "duration": "8 weeks",
  "image_url": "https://example.com/course.jpg",
  "is_active": true
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d "{\"title\": \"Advanced Sugar Sculpting\", \"description\": \"Master level\", \"price\": 45000, \"level\": \"advanced\", \"duration\": \"8 weeks\", \"is_active\": true}"
```

---

### 5.3 — Update Course 🔒 Admin
**`PUT /api/courses/:id`**

**Request Body:**
```json
{
  "price": 50000,
  "duration": "10 weeks"
}
```

**cURL:**
```bash
curl -X PUT http://localhost:5000/api/courses/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d "{\"price\": 50000}"
```

---

### 5.4 — Delete Course 🔒 Admin
**`DELETE /api/courses/:id`**

**cURL:**
```bash
curl -X DELETE http://localhost:5000/api/courses/1 \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

---

## 6. Academy (Batches & Registrations) API

### 6.1 — Get All Batches 🔓 Public
**`GET /api/academy/batches`**

**Success Response `200`:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "April 2026 Intake",
      "course_name": "Cake Decorating Basics",
      "start_date": "2026-05-01",
      "end_date": "2026-05-28",
      "capacity": 20,
      "enrolled": 8,
      "is_active": true
    }
  ]
}
```

**cURL:**
```bash
curl http://localhost:5000/api/academy/batches
```

---

### 6.2 — Create Batch 🔒 Admin
**`POST /api/academy/batches`**

**Request Body:**
```json
{
  "name": "June 2026 Intake",
  "course_name": "Advanced Sugar Sculpting",
  "start_date": "2026-06-01",
  "end_date": "2026-07-26",
  "capacity": 15,
  "is_active": true
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/academy/batches \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d "{\"name\": \"June 2026 Intake\", \"course_name\": \"Advanced Sugar Sculpting\", \"start_date\": \"2026-06-01\", \"end_date\": \"2026-07-26\", \"capacity\": 15, \"is_active\": true}"
```

---

### 6.3 — Update Batch 🔒 Admin
**`PUT /api/academy/batches/:id`**

**Request Body:**
```json
{
  "capacity": 20,
  "is_active": false
}
```

**cURL:**
```bash
curl -X PUT http://localhost:5000/api/academy/batches/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d "{\"capacity\": 20}"
```

---

### 6.4 — Delete Batch 🔒 Admin
**`DELETE /api/academy/batches/:id`**

**cURL:**
```bash
curl -X DELETE http://localhost:5000/api/academy/batches/1 \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

---

### 6.5 — Submit a Student Registration 🔓 Public
**`POST /api/academy/registrations`**

Used by prospective students to register for a physical batch.

**Request Body:**
```json
{
  "student_name": "Alice Wambui",
  "email": "alice@example.com",
  "phone": "+254700000000",
  "course_name": "Cake Decorating Basics",
  "batch_id": 1
}
```

**Success Response `201`:**
```json
{
  "success": true,
  "data": {
    "id": 10,
    "student_name": "Alice Wambui",
    "email": "alice@example.com",
    "phone": "+254700000000",
    "course_name": "Cake Decorating Basics",
    "batch_id": 1,
    "status": "pending",
    "payment_status": "unpaid",
    "created_at": "2026-04-16T20:00:00.000Z"
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/academy/registrations \
  -H "Content-Type: application/json" \
  -d "{\"student_name\": \"Alice Wambui\", \"email\": \"alice@example.com\", \"phone\": \"+254700000000\", \"course_name\": \"Cake Decorating Basics\", \"batch_id\": 1}"
```

---

### 6.6 — Get All Registrations 🔒 Admin
**`GET /api/academy/registrations`**

**Success Response `200`:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 10,
      "student_name": "Alice Wambui",
      "email": "alice@example.com",
      "phone": "+254700000000",
      "course_name": "Cake Decorating Basics",
      "batch_id": 1,
      "status": "pending",
      "payment_status": "unpaid"
    }
  ]
}
```

**cURL:**
```bash
curl http://localhost:5000/api/academy/registrations \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

---

### 6.7 — Update Registration Status 🔒 Admin
**`PUT /api/academy/registrations/:id`**

Use this to approve/reject a student and update payment status.

**Request Body:**
```json
{
  "status": "confirmed",
  "payment_status": "paid"
}
```

| Field | Accepted Values |
|-------|----------------|
| `status` | `pending`, `confirmed`, `cancelled` |
| `payment_status` | `unpaid`, `paid`, `refunded` |

**cURL:**
```bash
curl -X PUT http://localhost:5000/api/academy/registrations/10 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d "{\"status\": \"confirmed\", \"payment_status\": \"paid\"}"
```

---

## 7. Testimonials API

### 7.1 — Get All Testimonials 🔓 Public
**`GET /api/testimonials`**

| Query Param | Type | Default | Description |
|-------------|------|---------|-------------|
| `active` | `boolean` | `true` | Pass `false` to include hidden testimonials |

**cURL:**
```bash
curl http://localhost:5000/api/testimonials
curl "http://localhost:5000/api/testimonials?active=false"
```

---

### 7.2 — Create Testimonial 🔒 Admin
**`POST /api/testimonials`**

**Request Body:**
```json
{
  "customer_name": "Mary Njeri",
  "rating": 5,
  "message": "Absolutely stunning cakes! Every detail was perfect.",
  "course_name": null,
  "is_active": true
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/testimonials \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d "{\"customer_name\": \"Mary Njeri\", \"rating\": 5, \"message\": \"Absolutely stunning cakes!\", \"is_active\": true}"
```

---

### 7.3 — Update Testimonial 🔒 Admin
**`PUT /api/testimonials/:id`**

```json
{
  "is_active": false
}
```

**cURL:**
```bash
curl -X PUT http://localhost:5000/api/testimonials/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d "{\"is_active\": false}"
```

---

### 7.4 — Delete Testimonial 🔒 Admin
**`DELETE /api/testimonials/:id`**

**cURL:**
```bash
curl -X DELETE http://localhost:5000/api/testimonials/1 \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

---

## 8. Inquiries API

### 8.1 — Submit an Inquiry 🔓 Public
**`POST /api/inquiries`**

Used by website visitors via the contact form.

**Request Body:**
```json
{
  "name": "John Kamau",
  "email": "john@example.com",
  "phone": "+254722000000",
  "subject": "Custom Wedding Cake",
  "message": "I'd like to order a 5-tier wedding cake for June 15th."
}
```

**Success Response `201`:**
```json
{
  "success": true,
  "data": {
    "id": 7,
    "name": "John Kamau",
    "email": "john@example.com",
    "subject": "Custom Wedding Cake",
    "status": "new",
    "created_at": "2026-04-16T20:00:00.000Z"
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/inquiries \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"John Kamau\", \"email\": \"john@example.com\", \"phone\": \"+254722000000\", \"subject\": \"Custom Wedding Cake\", \"message\": \"I would like a 5-tier cake.\"}"
```

---

### 8.2 — Get All Inquiries 🔒 Admin
**`GET /api/inquiries`**

**cURL:**
```bash
curl http://localhost:5000/api/inquiries \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Success Response `200`:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 7,
      "name": "John Kamau",
      "email": "john@example.com",
      "subject": "Custom Wedding Cake",
      "message": "I'd like to order a 5-tier wedding cake.",
      "status": "new",
      "created_at": "2026-04-16T20:00:00.000Z"
    }
  ]
}
```

---

### 8.3 — Update Inquiry Status 🔒 Admin
**`PUT /api/inquiries/:id`**

| Status | Meaning |
|--------|---------|
| `new` | Just submitted, not yet read |
| `in_progress` | Admin is handling it |
| `resolved` | Inquiry closed |

**Request Body:**
```json
{
  "status": "in_progress"
}
```

**cURL:**
```bash
curl -X PUT http://localhost:5000/api/inquiries/7 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d "{\"status\": \"in_progress\"}"
```

---

### 8.4 — Delete Inquiry 🔒 Admin
**`DELETE /api/inquiries/:id`**

**cURL:**
```bash
curl -X DELETE http://localhost:5000/api/inquiries/7 \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

---

## 9. Health Check

### Server Health 🔓 Public
**`GET /health`**

Quick check if the server is alive.

```bash
curl http://localhost:5000/health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-04-16T20:13:00.000Z",
  "environment": "development"
}
```

---

## 10. Error Reference

| HTTP Code | Meaning | When It Happens |
|-----------|---------|-----------------|
| `200` | OK | Request successful |
| `201` | Created | Resource was created successfully |
| `400` | Bad Request | Validation failed / email already exists |
| `401` | Unauthorized | Missing or invalid JWT token |
| `403` | Forbidden | Valid token but not an admin |
| `404` | Not Found | Resource with given ID doesn't exist |
| `429` | Too Many Requests | Rate limit exceeded (100 req/15 min) |
| `500` | Server Error | Database or unhandled server error |

### Standard Error Shape
All errors return the same JSON structure:
```json
{
  "success": false,
  "message": "Human readable error description"
}
```

### Common Auth Errors

**Missing token `401`:**
```json
{ "success": false, "message": "Authentication required." }
```

**Not an admin `403`:**
```json
{ "success": false, "message": "Access denied. Administrator privileges required." }
```

---

## 11. Quick cURL Cheatsheet

> Replace `<TOKEN>` with your admin token from Step 2.1

```bash
# ── HEALTH ──────────────────────────────────────
curl http://localhost:5000/health

# ── AUTH ────────────────────────────────────────
# Get admin token
curl -X POST http://localhost:5000/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"

# ── CAKES ───────────────────────────────────────
curl http://localhost:5000/api/cakes                        # List all
curl http://localhost:5000/api/cakes/1                      # Single cake
curl -X POST http://localhost:5000/api/cakes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d "{\"name\":\"Test Cake\",\"price\":2000,\"is_active\":true}"
curl -X PUT http://localhost:5000/api/cakes/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d "{\"price\":2500}"
curl -X DELETE http://localhost:5000/api/cakes/1 \
  -H "Authorization: Bearer <TOKEN>"

# ── COURSES ─────────────────────────────────────
curl http://localhost:5000/api/courses                      # List all
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d "{\"title\":\"Test Course\",\"price\":10000,\"level\":\"beginner\",\"is_active\":true}"
curl -X DELETE http://localhost:5000/api/courses/1 \
  -H "Authorization: Bearer <TOKEN>"

# ── ACADEMY ─────────────────────────────────────
curl http://localhost:5000/api/academy/batches              # Public batches
curl http://localhost:5000/api/academy/registrations \
  -H "Authorization: Bearer <TOKEN>"                        # Admin: all registrations
curl -X PUT http://localhost:5000/api/academy/registrations/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d "{\"status\":\"confirmed\",\"payment_status\":\"paid\"}"

# ── INQUIRIES ───────────────────────────────────
curl http://localhost:5000/api/inquiries \
  -H "Authorization: Bearer <TOKEN>"                        # Admin: all inquiries
curl -X PUT http://localhost:5000/api/inquiries/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d "{\"status\":\"resolved\"}"

# ── TESTIMONIALS ────────────────────────────────
curl http://localhost:5000/api/testimonials                 # Public
curl -X POST http://localhost:5000/api/testimonials \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d "{\"customer_name\":\"Test User\",\"rating\":5,\"message\":\"Great!\",\"is_active\":true}"

# ── USERS ───────────────────────────────────────
curl http://localhost:5000/api/users                        # All users (public, dev only)
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer <TOKEN>"                        # My profile
```

---

*Generated: April 2026 | Johsther Cakes & Academy Backend v1.0*
