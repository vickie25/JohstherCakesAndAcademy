const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const emailService = require('../config/email');

const router = express.Router();

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.'
      });
    }

    // Create new user
    const user = await User.create({ name, email, password });

    // Generate token
    const token = generateToken(user.id);

    // Send welcome email (async, don't wait for it to complete)
    emailService.sendWelcomeEmail(user.email, user.name).catch(emailError => {
      console.error('Failed to send welcome email:', emailError);
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully! Welcome email sent.',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.created_at
        },
        token: generateToken(user.id, user.role)
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.message === 'Email already exists') {
      return res.status(400).json({
        success: false,
        message: 'Email already exists.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration.'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Update last login
    await User.updateLastLogin(user.id);

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful!',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.created_at,
          lastLogin: user.last_login
        },
        token: generateToken(user.id, user.role)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login.'
    });
  }
});

// @route   POST /api/auth/admin-login
// @desc    Login admin with special credentials
// @access  Public (Check logic inside)
router.post('/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // As requested: Any username, but password must be 'admin123'
    // For "security" we will also check if an admin user exists in DB or just use this logic
    if (password !== 'admin123') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials.'
      });
    }

    // Usually we would find a specific admin user, but for now we follow the "credentials we give the system"
    // We will look for a user with role 'admin' or just generate a token for this session
    // To maintain security, let's find the first user with role 'admin' or create a shadow one
    let admin = await User.findByEmail('admin@johsther.com');
    
    if (!admin) {
      console.log('Admin not found, attempting to create default admin...');
      try {
        admin = await User.create({
          name: 'System Admin',
          email: 'admin@johsther.com',
          password: 'admin123',
          role: 'admin'
        });
        console.log('Default admin created successfully');
      } catch (createError) {
        console.warn('Failed to create default admin (possibly role column missing):', createError.message);
        // Attempt one last find in case it exists but role couldn't be inserted
        admin = await User.findByEmail('admin@johsther.com');
      }
    }

    if (!admin) {
      return res.status(500).json({
        success: false,
        message: 'Could not resolve admin user. Please ensure database schema is up to date (role column).'
      });
    }

    const token = generateToken(admin.id, 'admin');

    res.json({
      success: true,
      message: 'Admin login successful!',
      data: {
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: 'admin'
        },
        token
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin login.'
    });
  }
});

module.exports = router;
