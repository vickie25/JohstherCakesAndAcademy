# Johsther Cakes & Academy - Ecommerce Platform

<div align="center">

![Johsther Cakes Logo](https://via.placeholder.com/200x80/FBF4E4/52362F?text=Johsther+Cakes)

**A modern, full-stack ecommerce platform for artisanal cakes and baking education**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-%5E18.0.0-blue)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-%5E12.0.0-blue)](https://www.postgresql.org/)

[View Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

## Table of Contents

- [About the Project](#about-the-project)
- [Technology Stack](#technology-stack)
- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Installation Guide](#installation-guide)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About the Project

Johsther Cakes & Academy is a comprehensive ecommerce platform that combines an online cake marketplace with an educational baking academy. The platform enables customers to browse and purchase artisanal cakes while also offering professional baking courses and tutorials.

### Key Features

- **Ecommerce Functionality**
  - Product catalog with advanced filtering
  - Shopping cart and checkout process
  - Order management and tracking
  - Payment integration (Stripe/PayPal ready)
  - User reviews and ratings

- **Educational Platform**
  - Baking course enrollment
  - Video tutorials and resources
  - Progress tracking
  - Certificate generation
  - Instructor profiles

- **User Management**
  - Secure authentication with JWT
  - Profile management
  - Order history
  - Wishlist functionality
  - Email notifications

- **Admin Dashboard**
  - Product management
  - Order processing
  - Customer management
  - Analytics and reporting
  - Content management

## Technology Stack

### Frontend Technologies

| Technology | Version | Description |
|------------|---------|-------------|
| **React** | ^18.0.0 | JavaScript library for building user interfaces |
| **TypeScript** | ^5.0.0 | Typed JavaScript for enhanced development experience |
| **Vite** | ^5.0.0 | Fast build tool and development server |
| **Tailwind CSS** | ^3.4.0 | Utility-first CSS framework for rapid UI development |
| **React Router** | ^6.8.0 | Declarative routing for React applications |
| **React Query** | ^4.24.0 | Powerful data fetching and state management |
| **React Hook Form** | ^7.43.0 | Performant forms with easy validation |
| **Zustand** | ^4.4.0 | Small, fast, and scalable state management |
| **Framer Motion** | ^10.12.0 | Production-ready motion library for React |
| **Lucide React** | ^0.263.0 | Beautiful & consistent icon toolkit |

### Backend Technologies

| Technology | Version | Description |
|------------|---------|-------------|
| **Node.js** | ^18.0.0 | JavaScript runtime for server-side development |
| **Express.js** | ^4.18.0 | Fast, unopinionated web framework for Node.js |
| **TypeScript** | ^5.0.0 | Typed JavaScript for enhanced backend development |
| **PostgreSQL** | ^12.0.0 | Powerful open-source relational database |
| **Prisma** | ^5.0.0 | Next-generation ORM for Node.js and TypeScript |
| **JWT** | ^9.0.0 | JSON Web Token implementation for authentication |
| **bcrypt** | ^5.1.0 | Password hashing library |
| **Nodemailer** | ^6.9.0 | Email sending library for Node.js |
| **Multer** | ^1.4.0 | Middleware for handling multipart/form-data |
| **Helmet** | ^7.0.0 | Security middleware for Express.js |

### Development Tools

| Technology | Version | Description |
|------------|---------|-------------|
| **ESLint** | ^8.45.0 | Pluggable JavaScript linter |
| **Prettier** | ^3.0.0 | Opinionated code formatter |
| **Husky** | ^8.0.0 | Git hooks for quality assurance |
| **lint-staged** | ^13.2.0 | Run linters on staged files |
| **Jest** | ^29.5.0 | Delightful JavaScript testing framework |
| **Cypress** | ^12.17.0 | Fast, easy, and reliable testing for anything |

## Architecture Overview

```
Johsther Cakes & Academy/
|
|-- frontend/                 # React TypeScript application
|   |-- src/
|   |   |-- components/       # Reusable UI components
|   |   |-- pages/           # Page-level components
|   |   |-- hooks/           # Custom React hooks
|   |   |-- services/        # API service layers
|   |   |-- store/           # State management
|   |   |-- types/           # TypeScript type definitions
|   |   |-- utils/           # Utility functions
|   |   `-- styles/          # Global styles and themes
|   |-- public/              # Static assets
|   `-- package.json
|
|-- backend/                  # Node.js Express API
|   |-- src/
|   |   |-- controllers/     # Request handlers
|   |   |-- middleware/      # Custom middleware
|   |   |-- models/          # Database models
|   |   |-- routes/          # API route definitions
|   |   |-- services/        # Business logic services
|   |   |-- utils/           # Utility functions
|   |   `-- types/           # TypeScript type definitions
|   |-- config/              # Configuration files
|   |-- migrations/          # Database migrations
|   `-- package.json
|
`-- README.md
```

## Prerequisites

### System Requirements

- **Node.js**: >= 18.0.0 (LTS version recommended)
- **npm**: >= 8.0.0 or **yarn**: >= 1.22.0
- **PostgreSQL**: >= 12.0.0
- **Git**: >= 2.30.0

### Development Environment

- **IDE**: Visual Studio Code (recommended)
- **Extensions**:
  - ES7+ React/Redux/React-Native snippets
  - TypeScript Importer
  - Prettier - Code formatter
  - ESLint
  - Tailwind CSS IntelliSense

### Environment Variables

See the [Configuration](#configuration) section for required environment variables.

## Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/johsther-cakes-academy.git
cd johsther-cakes-academy
```

### 2. Database Setup

#### PostgreSQL Installation

**Windows:**
```bash
# Download and install PostgreSQL from https://www.postgresql.org/download/windows/
# Or use Chocolatey:
choco install postgresql
```

**macOS:**
```bash
# Using Homebrew:
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Database Creation

```bash
# Create database user (optional)
sudo -u postgres createuser --interactive

# Create database
sudo -u postgres createdb johsther_cakes_academy

# Or use the provided script
cd backend
node scripts/createDatabase.js
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit environment variables (see Configuration section)
nano .env

# Run database migrations
npm run migrate

# Seed database (optional)
npm run seed
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit environment variables (see Configuration section)
nano .env
```

## Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

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

# Email Configuration (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880

# Payment Configuration (Stripe)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Redis Configuration (optional, for caching)
REDIS_URL=redis://localhost:6379
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_APP_URL=http://localhost:3000

# Feature Flags
VITE_ENABLE_PAYMENT=true
VITE_ENABLE_COURSES=true

# Analytics (optional)
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID

# Map Configuration (optional)
VITE_MAPBOX_TOKEN=your_mapbox_access_token
```

## Running the Application

### Development Mode

#### Start Backend Server

```bash
# Terminal 1: Navigate to backend
cd backend

# Start development server with hot reload
npm run dev

# Alternative: Start without nodemon
npm start
```

The backend server will start at `http://localhost:5000`

#### Start Frontend Server

```bash
# Terminal 2: Navigate to frontend
cd frontend

# Start development server with hot reload
npm run dev

# Alternative: Start without Vite dev server
npm run preview
```

The frontend application will start at `http://localhost:3000`

### Production Mode

#### Backend Production Build

```bash
cd backend

# Build the application
npm run build

# Start production server
npm start
```

#### Frontend Production Build

```bash
cd frontend

# Build the application
npm run build

# Preview production build
npm run preview

# Or serve with a static server
npx serve -s dist -l 3000
```

### Using Docker (Optional)

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop containers
docker-compose down
```

## API Documentation

The backend API provides comprehensive RESTful endpoints for all application features.

### Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-domain.com/api`

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | User login |
| POST | `/auth/logout` | User logout |
| POST | `/auth/refresh` | Refresh JWT token |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password |

### Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products |
| GET | `/products/:id` | Get product by ID |
| GET | `/products/category/:category` | Get products by category |
| POST | `/products` | Create product (admin) |
| PUT | `/products/:id` | Update product (admin) |
| DELETE | `/products/:id` | Delete product (admin) |

### Order Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | Get user orders |
| GET | `/orders/:id` | Get order by ID |
| POST | `/orders` | Create new order |
| PUT | `/orders/:id` | Update order status (admin) |

### Course Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/courses` | Get all courses |
| GET | `/courses/:id` | Get course by ID |
| POST | `/courses/enroll` | Enroll in course |
| GET | `/courses/my-courses` | Get user's enrolled courses |

For complete API documentation, visit `/api/docs` when the backend is running.

## Development Workflow

### Code Quality

The project uses several tools to maintain code quality:

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Run type checking
npm run type-check
```

### Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

### Git Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

3. **Push and create pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for code style changes
- `refactor:` for code refactoring
- `test:` for adding or updating tests
- `chore:` for maintenance tasks

## Deployment

### Frontend Deployment

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### AWS S3 + CloudFront

```bash
# Use AWS CLI to deploy
aws s3 sync dist/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Backend Deployment

#### Heroku

```bash
# Install Heroku CLI
# Create app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL=your_database_url

# Deploy
git push heroku main
```

#### DigitalOcean

```bash
# Use App Platform or Droplet
# Follow DigitalOcean deployment guide
```

#### AWS EC2 + Elastic Beanstalk

```bash
# Use EB CLI
eb init your-app-name
eb create production-environment
eb deploy
```

### Environment-Specific Considerations

#### Production Environment Variables

Ensure these are set in production:

```env
NODE_ENV=production
DB_HOST=your_production_db_host
JWT_SECRET=your_production_jwt_secret
SMTP_HOST=your_production_smtp_host
STRIPE_SECRET_KEY=your_production_stripe_key
```

#### Security Headers

The backend includes security middleware (Helmet) that sets:

- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer Policy
- HSTS (in production)

## Contributing

We welcome contributions! Please follow these guidelines:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'feat: add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation

### Reporting Issues

When reporting bugs, please include:

- **Environment**: OS, Node.js version, browser
- **Steps to reproduce**: Detailed reproduction steps
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Screenshots**: If applicable

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

**Project Maintainer**
- **Name**: [Your Name]
- **Email**: [your.email@example.com]
- **Website**: [https://your-website.com]

**Project Links**
- **Repository**: [https://github.com/your-username/johsther-cakes-academy](https://github.com/your-username/johsther-cakes-academy)
- **Issues**: [https://github.com/your-username/johsther-cakes-academy/issues](https://github.com/your-username/johsther-cakes-academy/issues)
- **Discussions**: [https://github.com/your-username/johsther-cakes-academy/discussions](https://github.com/your-username/johsther-cakes-academy/discussions)

---

<div align="center">

**Made with love by the Johsther Cakes & Academy team**

[![Built with love](https://img.shields.io/badge/Built%20with-%E2%99%A5-red)](https://github.com/your-username/johsther-cakes-academy)

</div>
