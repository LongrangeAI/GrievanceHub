// backend/models/User.js

const mongoose = require('mongoose');

// User Schema define karein
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Email unique hona chahiye
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Role 'user' ya 'admin' ho sakta hai
    default: 'user', // Default role 'user' hai
  },
  createdAt: {
    type: Date,
    default: Date.now, // User creation date
  },
});

// User model export karein
module.exports = mongoose.model('User', UserSchema);
