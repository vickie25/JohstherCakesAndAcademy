const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbUser = process.env.DB_USER || 'postgres';
const dbHost = process.env.DB_HOST || 'localhost';
const dbName = process.env.DB_NAME || 'johsther_cakes_academy';
const dbPassword = process.env.DB_PASSWORD ?? '';
const dbPort = Number.parseInt(String(process.env.DB_PORT || '5432'), 10) || 5432;

if (process.env.DB_PASSWORD === undefined && process.env.NODE_ENV !== 'production') {
  console.warn(
    '⚠️  DB_PASSWORD is not set. Using empty password (common for local Postgres). ' +
      'If connection fails, copy `backend/.env.example` to `backend/.env` and set DB_* values.'
  );
}

const pool = new Pool({
  user: dbUser,
  host: dbHost,
  database: dbName,
  password: dbPassword,
  port: dbPort,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
