const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// @route   GET /api/testimonials
// @desc    Get all testimonials
// @access  Public (filtered by active)
router.get('/', async (req, res) => {
  try {
    const activeOnly = req.query.active !== 'false';
    const testimonials = await Testimonial.findAll(activeOnly);
    res.json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/testimonials
// @desc    Add new testimonial
// @access  Private/Admin
router.post('/', [auth, isAdmin], async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/testimonials/:id
// @desc    Update testimonial
// @access  Private/Admin
router.put('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const testimonial = await Testimonial.update(req.params.id, req.body);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/testimonials/:id
// @desc    Delete testimonial
// @access  Private/Admin
router.delete('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const result = await Testimonial.delete(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.json({ success: true, message: 'Testimonial removed' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
