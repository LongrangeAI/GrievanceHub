// backend/routes/authRoutes.js

const express = require('express');
const bcrypt = require('bcryptjs'); // Password hashing ke liye
const jwt = require('jsonwebtoken'); // JWT token generation ke liye
const User = require('../models/User'); // User model import karein

const router = express.Router();

// User Registration Route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Naam, email, aur password zaroori hain' });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: 'Email pehle se registered hai' });
    }

    // Password hash karein
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Naya user banayein
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user', // Default role 'user'
    });

    // User ko database mein save karein
    await user.save();

    res.status(201).json({ message: 'Registration successful', userId: user._id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email aur password zaroori hain' });
  }

  try {
    // User ko email se dhoondein
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email ya password' });
    }

    // Password match karein
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email ya password' });
    }

    // JWT token generate karein
    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name, email: user.email }, // name aur email add kiye
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Token 24 ghante ke liye valid
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Login Route
router.post('/admin/login', async (req, res) => {
  const { username, password } = req.body; // Frontend se 'username' aa raha hai

  // Validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username aur password zaroori hain' });
  }

  try {
    // Admin user ko email (jo username ke roop mein aa raha hai) aur role 'admin' se dhoondein
    const adminUser = await User.findOne({ email: username, role: 'admin' });

    if (!adminUser) {
      return res.status(401).json({ message: 'Invalid admin username ya password' });
    }

    // Password match karein
    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin username ya password' });
    }

    // JWT token generate karein (admin role ke saath)
    const token = jwt.sign(
      { userId: adminUser._id, role: adminUser.role, name: adminUser.name, email: adminUser.email }, // name aur email add kiye
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Admin login successful',
      token,
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
