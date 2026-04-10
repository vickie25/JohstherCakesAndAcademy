const express = require('express');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving profile.'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters long.'
      });
    }

    // Update user name (you would need to add this method to User model)
    const query = 'UPDATE users SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email, updated_at';
    const db = require('../config/database');
    const result = await db.query(query, [name.trim(), req.user.id]);
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile.'
    });
  }
});

// @route   GET /api/users
// @desc    Get all users (for testing)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const db = require('../config/database');
    const query = 'SELECT id, name, email, created_at, updated_at FROM users ORDER BY created_at DESC';
    const result = await db.query(query);
    
    res.json({
      success: true,
      message: 'All users retrieved successfully',
      data: {
        users: result.rows
      }
    });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users.'
    });
  }
});

module.exports = router;
