const express = require('express');
const router = express.Router();
const Batch = require('../models/Batch');
const Registration = require('../models/Registration');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const db = require('../config/database');

// --- Batch Routes ---

// @route   GET /api/academy/batches
// @desc    Get all physical intakes
// @access  Public
router.get('/batches', async (req, res) => {
  try {
    const batches = await Batch.findAll();
    res.json({ success: true, count: batches.length, data: batches });
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/academy/batches/:id/registrations
// @desc    Students registered for this intake batch
// @access  Private/Admin
router.get('/batches/:id/registrations', [auth, isAdmin], async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid batch id' });
    }
    const rows = await Registration.findByBatchId(id);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error('Error fetching batch registrations:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/academy/batches
// @desc    Add new intake batch
// @access  Private/Admin
router.post('/batches', [auth, isAdmin], async (req, res) => {
  try {
    const batch = await Batch.create(req.body);
    res.status(201).json({ success: true, data: batch });
  } catch (error) {
    console.error('Error creating batch:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/academy/batches/:id
// @desc    Update intake batch
// @access  Private/Admin
router.put('/batches/:id', [auth, isAdmin], async (req, res) => {
  try {
    const batch = await Batch.update(req.params.id, req.body);
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }
    res.json({ success: true, data: batch });
  } catch (error) {
    console.error('Error updating batch:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/academy/batches/:id
// @desc    Delete intake batch
// @access  Private/Admin
router.delete('/batches/:id', [auth, isAdmin], async (req, res) => {
  try {
    const result = await Batch.delete(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }
    res.json({ success: true, message: 'Batch removed' });
  } catch (error) {
    console.error('Error deleting batch:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// --- Registration Routes ---

// @route   POST /api/academy/registrations
// @desc    Register for a course (Public)
// @access  Public
router.post('/registrations', async (req, res) => {
  try {
    const { student_name, email, phone, course_name, batch_id } = req.body;
    
    const query = `
      INSERT INTO registrations (student_name, email, phone, course_name, batch_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await db.query(query, [student_name, email, phone, course_name, batch_id]);
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// @route   GET /api/academy/registrations
// @desc    Get all registrations
// @access  Private/Admin
router.get('/registrations', [auth, isAdmin], async (req, res) => {
  try {
    const registrations = await Registration.findAll();
    res.json({ success: true, count: registrations.length, data: registrations });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/academy/registrations/:id
// @desc    Update registration status
// @access  Private/Admin
router.put('/registrations/:id', [auth, isAdmin], async (req, res) => {
  try {
    const { status, payment_status } = req.body;
    const registration = await Registration.updateStatus(req.params.id, status, payment_status);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    res.json({ success: true, data: registration });
  } catch (error) {
    console.error('Error updating registration:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
