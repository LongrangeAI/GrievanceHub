// backend/middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // User model import karein

// Token verification middleware
const auth = (req, res, next) => {
  // Header se token lein
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Token missing!' });
  }

  const token = authHeader.split(' ')[1]; // 'Bearer TOKEN' format se token extract karein

  if (!token) {
    return res.status(401).json({ message: 'Token missing!' });
  }

  try {
    // Token verify karein
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // User details ko req.user mein add karein
    // Ensure name and email are part of the decoded token (from login endpoint)
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      name: decoded.name, // Add name from JWT payload
      email: decoded.email // Add email from JWT payload
    };
    next(); // Next middleware ya route handler par jayein
  } catch (error) {
    console.error('Token verification error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired!' });
    }
    res.status(401).json({ message: 'Token invalid!' });
  }
};

// Admin role verification middleware
const adminAuth = (req, res, next) => {
  // Pehle regular auth middleware chalayein
  auth(req, res, async () => {
    try {
      // Check if user exists and has admin role
      const user = await User.findById(req.user.userId);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized: Admin access required!' });
      }
      // Ensure req.user has name and email for admin routes as well
      req.user.name = user.name;
      req.user.email = user.email;
      next();
    } catch (error) {
      console.error('Admin authorization error:', error);
      res.status(500).json({ message: 'Server error during admin check' });
    }
  });
};

module.exports = { auth, adminAuth };
