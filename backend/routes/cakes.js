const express = require('express');
const router = express.Router();
const Cake = require('../models/Cake');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// @route   GET /api/cakes
// @desc    Get all cakes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const activeOnly = req.query.active !== 'false';
    const cakes = await Cake.findAll(activeOnly);
    res.json({ success: true, count: cakes.length, data: cakes });
  } catch (error) {
    console.error('Error fetching cakes:', error);
    res.status(500).json({ success: false, message: 'Server error fetching cakes' });
  }
});

// @route   GET /api/cakes/:id
// @desc    Get single cake
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);
    if (!cake) {
      return res.status(404).json({ success: false, message: 'Cake not found' });
    }
    res.json({ success: true, data: cake });
  } catch (error) {
    console.error('Error fetching cake:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/cakes
// @desc    Add new cake
// @access  Private/Admin
router.post('/', [auth, isAdmin], async (req, res) => {
  try {
    const cake = await Cake.create(req.body);
    res.status(201).json({ success: true, data: cake });
  } catch (error) {
    console.error('Error creating cake:', error);
    res.status(500).json({ success: false, message: 'Server error creating cake' });
  }
});

// @route   PUT /api/cakes/:id
// @desc    Update cake
// @access  Private/Admin
router.put('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const cake = await Cake.update(req.params.id, req.body);
    if (!cake) {
      return res.status(404).json({ success: false, message: 'Cake not found' });
    }
    res.json({ success: true, data: cake });
  } catch (error) {
    console.error('Error updating cake:', error);
    res.status(500).json({ success: false, message: 'Server error updating cake' });
  }
});

// @route   DELETE /api/cakes/:id
// @desc    Delete cake
// @access  Private/Admin
router.delete('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const cake = await Cake.delete(req.params.id);
    if (!cake) {
      return res.status(404).json({ success: false, message: 'Cake not found' });
    }
    res.json({ success: true, message: 'Cake removed successfully' });
  } catch (error) {
    console.error('Error deleting cake:', error);
    res.status(500).json({ success: false, message: 'Server error deleting cake' });
  }
});

module.exports = router;
