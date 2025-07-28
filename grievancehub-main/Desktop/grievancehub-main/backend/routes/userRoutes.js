// backend/routes/userRoutes.js

const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // User model import karein
const Grievance = require('../models/Grievance'); // Grievance model import karein (for admin delete user)
const { auth, adminAuth } = require('../middleware/auth'); // Auth middleware import karein

const router = express.Router();

// User Profile Fetch (GET)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password'); // Password exclude karein
    if (!user) {
      return res.status(404).json({ message: 'User nahi mila' });
    }
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Profile Update (PUT)
router.put('/profile', auth, async (req, res) => {
  const { name, role } = req.body; // Frontend se 'name' aur 'role' aa rahe hain

  if (!name) {
    return res.status(400).json({ message: 'Naam zaroori hai' });
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User nahi mila' });
    }

    user.name = name || user.name;
    // User apna role frontend se update nahi kar sakta
    // Agar admin role update karna chahta hai, to woh admin panel se karega
    // user.role = role || user.role; // Is line ko comment out rakhein ya hata dein agar user role update allowed nahi hai

    await user.save();

    res.status(200).json({
      message: 'Profile successfully updated',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // Current role return karein
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Settings Update (PUT) - Password change, notifications etc.
router.put('/settings', auth, async (req, res) => {
  const { currentPassword, newPassword, notifications, twoFactorAuth, newsletter } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User nahi mila' });
    }

    // Password change logic
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password galat hai' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Other settings (notifications, twoFactorAuth, newsletter)
    // Frontend mein twoFactorAuth aur newsletter ka UI nahi hai, to abhi inko database mein save nahi karenge.
    // Agar aap inko frontend mein add karte hain, to yahan update kar sakte hain.
    // Example: if (typeof notifications === 'boolean') user.notifications = notifications;

    await user.save();

    res.status(200).json({ message: 'Settings successfully updated' });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all users
router.get('/admin/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({}).select('-password'); // Password exclude karein
    res.status(200).json(users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    })));
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Add a new user
router.post('/admin/users', adminAuth, async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Sabhi fields zaroori hain' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: 'Email pehle se maujood hai' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();
    res.status(201).json({ message: 'User successfully added', userId: user._id });
  } catch (error) {
    console.error('Admin add user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update user details
router.put('/admin/users/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User nahi mila' });
    }

    user.name = name || user.name;
    user.email = email || user.email; // Email update karne par uniqueness check karna hoga
    user.role = role || user.role;

    // Agar email change ho raha hai, to uniqueness check karein
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && String(existingUser._id) !== id) {
        return res.status(409).json({ message: 'Yeh email pehle se kisi aur user ke paas hai' });
      }
    }

    await user.save();
    res.status(200).json({ message: 'User details successfully updated' });
  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete a user
router.delete('/admin/users/:id', adminAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User nahi mila' });
    }

    // Grievances bhi delete karein jo is user ne submit kiye hain (optional, ya rekh sakte hain)
    await Grievance.deleteMany({ userId: id });

    await user.deleteOne(); // Use deleteOne() instead of remove()
    res.status(200).json({ message: 'User successfully deleted' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
