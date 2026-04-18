const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const User = require('../models/User');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const bcrypt = require('bcrypt');

// @route   GET /api/settings
// @desc    Get all system settings
// @access  Private/Admin
router.get('/', [auth, isAdmin], async (req, res) => {
  try {
    const settings = await Setting.findAll();
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/settings
// @desc    Update settings (bulk)
// @access  Private/Admin
router.post('/', [auth, isAdmin], async (req, res) => {
  try {
    const results = await Setting.bulkUpdate(req.body);
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/settings/profile
// @desc    Update admin profile (name, email, password)
// @access  Private/Admin
router.post('/profile', [auth, isAdmin], async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const userId = req.user.id; // From auth middleware

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // If changing password, verify current one
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password required to set a new one.' });
      }
      const isMatch = await User.verifyPassword(currentPassword, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Incorrect current password.' });
      }
      
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // We need a way to update user in User model. 
      // Assuming User model has an update method or we do it directly.
      const db = require('../config/database');
      await db.query(
        'UPDATE users SET name = $1, email = $2, password_hash = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
        [name || user.name, email || user.email, hashedPassword, userId]
      );
    } else {
      const db = require('../config/database');
      await db.query(
        'UPDATE users SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
        [name || user.name, email || user.email, userId]
      );
    }

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
