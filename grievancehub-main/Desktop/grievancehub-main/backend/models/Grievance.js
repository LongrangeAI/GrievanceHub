// backend/models/Grievance.js

const mongoose = require('mongoose');

// Grievance Schema define karein
const GrievanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // User ID ko reference karega
    ref: 'User', // 'User' model se link karein
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subFields: {
    type: Object, // Dynamic sub-fields ke liye Object type
    default: {},
  },
  attachmentFilename: {
    type: String, // Local storage mein save kiye gaye file ka naam
    default: null,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'], // Grievance status
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now, // Grievance creation date
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Last update date
  },
});

// Grievance model export karein
module.exports = mongoose.model('Grievance', GrievanceSchema);
