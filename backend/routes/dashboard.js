const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// @route   GET /api/dashboard/stats
// @desc    Get aggregated dashboard stats
// @access  Private/Admin
router.get('/stats', [auth, isAdmin], async (req, res) => {
  try {
    // Basic aggregations
    // 1. Total Users
    const usersResult = await db.query('SELECT COUNT(*) as count FROM users');
    const usersCount = parseInt(usersResult.rows[0].count);

    // 2. Active Orders/Registrations (Combining courses & inquiries for now as "orders")
    const regResult = await db.query('SELECT COUNT(*) as count FROM registrations');
    const ordersCount = parseInt(regResult.rows[0].count);

    // Since we don't have a dedicated sales/orders table with prices yet, 
    // we'll approximate using courses registered * course price if possible,
    // or just return some generated calculations.
    // For now, let's join registrations with courses or batches just to get a mock total if needed,
    // but to be truly dynamic, we'll sum up some real values once an Order table exists.
    // Let's just return real counts.
    res.json({
      success: true,
      data: {
        users: usersCount.toLocaleString(),
        orders: ordersCount.toLocaleString(),
        monthlySales: 0, // Placeholder until Orders table is built
        totalSales: 0    // Placeholder until Orders table is built
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Server error fetching stats' });
  }
});

// @route   GET /api/dashboard/recent-orders
// @desc    Get most recent orders/registrations
// @access  Private/Admin
router.get('/recent-orders', [auth, isAdmin], async (req, res) => {
  try {
    // Fetch latest 5 registrations as "orders" for now
    const query = `
      SELECT id, student_name as product, created_at as date, status 
      FROM registrations 
      ORDER BY created_at DESC 
      LIMIT 5
    `;
    const result = await db.query(query);
    
    const formattedData = result.rows.map(row => ({
      id: `#REG${row.id.toString().padStart(4, '0')}`,
      product: `Course Registration (${row.product})`,
      date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: 0, // Placeholder
      status: row.status
    }));

    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

function monthShort(m) {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1] || '';
}

function pgDateKey(v) {
  if (!v) return '';
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === 'string') return v.slice(0, 10);
  return String(v).slice(0, 10);
}

/** Merge two maps keyed by string into sorted line points for Recharts. */
function mergeSeries(keysSorted, usersMap, salesMap, labelFn) {
  return keysSorted.map((k) => ({
    name: labelFn(k),
    key: k,
    users: usersMap[k] || 0,
    sales: Math.round((salesMap[k] || 0) * 100) / 100,
  }));
}

async function buildLineDataMonthly() {
  const year = new Date().getFullYear();
  const usersR = await db.query(
    `
    SELECT EXTRACT(MONTH FROM created_at)::int AS m, COUNT(*)::int AS c
    FROM users
    WHERE EXTRACT(YEAR FROM created_at) = $1
    GROUP BY 1 ORDER BY 1
  `,
    [year]
  );
  const salesR = await db.query(
    `
    SELECT EXTRACT(MONTH FROM r.created_at)::int AS m,
           COALESCE(SUM(b.price), 0)::numeric AS s
    FROM registrations r
    LEFT JOIN academy_batches b ON r.batch_id = b.id
    WHERE EXTRACT(YEAR FROM r.created_at) = $1
    GROUP BY 1 ORDER BY 1
  `,
    [year]
  );
  const uMap = {};
  const sMap = {};
  usersR.rows.forEach((row) => {
    uMap[row.m] = parseInt(row.c, 10);
  });
  salesR.rows.forEach((row) => {
    sMap[row.m] = parseFloat(row.s) || 0;
  });
  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  return mergeSeries(keys, uMap, sMap, (m) => monthShort(m));
}

async function buildLineDataWeekly() {
  const usersR = await db.query(`
    SELECT (date_trunc('week', created_at))::date AS wk, COUNT(*)::int AS c
    FROM users
    WHERE created_at >= NOW() - INTERVAL '84 days'
    GROUP BY 1 ORDER BY 1
  `);
  const salesR = await db.query(`
    SELECT (date_trunc('week', r.created_at))::date AS wk,
           COALESCE(SUM(b.price), 0)::numeric AS s
    FROM registrations r
    LEFT JOIN academy_batches b ON r.batch_id = b.id
    WHERE r.created_at >= NOW() - INTERVAL '84 days'
    GROUP BY 1 ORDER BY 1
  `);
  const uMap = {};
  const sMap = {};
  usersR.rows.forEach((row) => {
    const k = pgDateKey(row.wk);
    uMap[k] = parseInt(row.c, 10);
  });
  salesR.rows.forEach((row) => {
    const k = pgDateKey(row.wk);
    sMap[k] = parseFloat(row.s) || 0;
  });
  const keys = Array.from(new Set([...Object.keys(uMap), ...Object.keys(sMap)])).sort();
  if (keys.length === 0) {
    return [];
  }
  return mergeSeries(keys, uMap, sMap, (k) => {
    const d = new Date(k + 'T12:00:00Z');
    return d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
  });
}

async function buildLineDataDaily() {
  const usersR = await db.query(`
    SELECT created_at::date AS d, COUNT(*)::int AS c
    FROM users
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY created_at::date
    ORDER BY created_at::date
  `);
  const salesR = await db.query(`
    SELECT r.created_at::date AS d,
           COALESCE(SUM(b.price), 0)::numeric AS s
    FROM registrations r
    LEFT JOIN academy_batches b ON r.batch_id = b.id
    WHERE r.created_at >= NOW() - INTERVAL '30 days'
    GROUP BY r.created_at::date
    ORDER BY r.created_at::date
  `);
  const uMap = {};
  const sMap = {};
  usersR.rows.forEach((row) => {
    const k = pgDateKey(row.d);
    uMap[k] = parseInt(row.c, 10);
  });
  salesR.rows.forEach((row) => {
    const k = pgDateKey(row.d);
    sMap[k] = parseFloat(row.s) || 0;
  });
  const keys = Array.from(new Set([...Object.keys(uMap), ...Object.keys(sMap)])).sort();
  if (keys.length === 0) {
    return [];
  }
  return mergeSeries(keys, uMap, sMap, (k) => {
    const d = new Date(k + 'T12:00:00Z');
    return d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
  });
}

/** No device telemetry in DB — return a balanced placeholder that sums to 100 (clearly labeled in UI). */
function buildDevicePlaceholder() {
  return [
    { name: 'Desktop', value: 55, color: '#C8884A', estimated: true },
    { name: 'Phone', value: 35, color: '#5A8A5E', estimated: true },
    { name: 'Other', value: 10, color: '#B5A090', estimated: true },
  ];
}

// @route   GET /api/dashboard/analytics?range=daily|weekly|monthly
// @desc    Chart data from users + registrations (sales = sum of linked batch prices)
// @access  Private/Admin
router.get('/analytics', [auth, isAdmin], async (req, res) => {
  try {
    const range = ['daily', 'weekly', 'monthly'].includes(req.query.range) ? req.query.range : 'monthly';

    let lineData = [];
    if (range === 'daily') lineData = await buildLineDataDaily();
    else if (range === 'weekly') lineData = await buildLineDataWeekly();
    else lineData = await buildLineDataMonthly();

    const deviceData = buildDevicePlaceholder();

    const usersResult = await db.query('SELECT COUNT(*)::int AS count FROM users');
    const usersCount = parseInt(usersResult.rows[0].count, 10) || 0;

    const countryData =
      usersCount === 0
        ? []
        : [{ name: 'All regions (no geo on file)', users: usersCount, percentage: 100 }];

    res.json({
      success: true,
      data: {
        range,
        refreshedAt: new Date().toISOString(),
        lineData,
        deviceData,
        countryData,
        deviceNote:
          'Device split is an industry-style estimate until client analytics are stored.',
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
