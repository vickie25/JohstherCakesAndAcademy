const express = require('express');
const router = express.Router();
const StaffRole = require('../models/StaffRole');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

/** Valid dashboard tab ids (must match Sidebar / AdminDashboard). */
const ALLOWED_PERMISSIONS = new Set([
  'Overview',
  'Analytics',
  'Notifications',
  'Orders',
  'Cakes',
  'Customers',
  'Inquiries',
  'Testimonials',
  'Refunds',
  'Courses',
  'Batches',
  'Registrations',
  'Roles',
  'Settings',
]);

function sanitizePermissions(input) {
  if (!Array.isArray(input)) return [];
  const out = [];
  const seen = new Set();
  for (const key of input) {
    const k = typeof key === 'string' ? key.trim() : '';
    if (!k || !ALLOWED_PERMISSIONS.has(k) || seen.has(k)) continue;
    seen.add(k);
    out.push(k);
  }
  return out;
}

// @route   GET /api/staff-roles/permissions-catalog
// @desc    List valid permission keys for the UI
router.get('/permissions-catalog', [auth, isAdmin], (req, res) => {
  res.json({
    success: true,
    data: Array.from(ALLOWED_PERMISSIONS),
  });
});

// @route   GET /api/staff-roles
router.get('/', [auth, isAdmin], async (req, res) => {
  try {
    const roles = await StaffRole.findAll();
    res.json({ success: true, data: roles });
  } catch (error) {
    console.error('staff-roles list:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/staff-roles/:id
router.get('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid id' });
    }
    const role = await StaffRole.findById(id);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }
    res.json({ success: true, data: role });
  } catch (error) {
    console.error('staff-roles get:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/staff-roles
router.post('/', [auth, isAdmin], async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Role name is required' });
    }
    const perms = sanitizePermissions(permissions);
    const role = await StaffRole.create({
      name,
      description: description || '',
      permissions: perms,
    });
    res.status(201).json({ success: true, data: role });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ success: false, message: 'A role with this name already exists' });
    }
    console.error('staff-roles create:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/staff-roles/:id
router.put('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid id' });
    }
    const { name, description, permissions } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Role name is required' });
    }
    const perms = sanitizePermissions(permissions);
    const role = await StaffRole.update(id, {
      name,
      description: description || '',
      permissions: perms,
    });
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }
    res.json({ success: true, data: role });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ success: false, message: 'A role with this name already exists' });
    }
    console.error('staff-roles update:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/staff-roles/:id
router.delete('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid id' });
    }
    await StaffRole.delete(id);
    res.json({ success: true, message: 'Role removed' });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.error('staff-roles delete:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
