// backend/routes/grievanceRoutes.js

const express = require('express');
const multer = require('multer'); // File uploads handle karne ke liye
const path = require('path'); // File paths ke liye
const fs = require('fs'); // File system operations ke liye
const Grievance = require('../models/Grievance');
const { auth, adminAuth } = require('../middleware/auth');
// const json = require('json'); // Yeh line hata di gayi hai, JSON.parse() built-in hai

const router = express.Router();

// Multer storage configuration (local storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads'); // uploads folder backend root mein
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Folder nahi hai to banayein
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Unique filename banayein
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter (allowed extensions)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 16 // 16MB limit
  },
  fileFilter: fileFilter
});

// Grievance Submit Route
router.post('/', auth, upload.single('attachment'), async (req, res) => {
  const { title, details, category, subFields } = req.body; // Frontend se 'details' aa raha hai
  const attachmentFilename = req.file ? req.file.filename : null; // Uploaded file ka naam

  // Validation
  if (!title || !details || !category) {
    return res.status(400).json({ message: 'Title, description, aur category zaroori hain' });
  }

  try {
    // subFields ko JSON string se parse karein
    let parsedSubFields = {};
    if (subFields) {
      try {
        parsedSubFields = JSON.parse(subFields); // JSON.parse() built-in hai
      } catch (e) {
        console.error("Error parsing subFields:", e);
        return res.status(400).json({ message: 'Invalid subFields JSON format' });
      }
    }

    // req.user mein user ki details available honi chahiye auth middleware se
    const newGrievance = new Grievance({
      userId: req.user.userId, // Authenticated user ka ID
      userName: req.user.name, // Authenticated user ka naam (JWT payload se)
      userEmail: req.user.email, // Authenticated user ka email (JWT payload se)
      title,
      description: details,
      category,
      subFields: parsedSubFields,
      attachmentFilename,
      status: 'Pending',
    });

    await newGrievance.save();
    res.status(201).json({ message: 'Grievance submitted successfully', grievanceId: newGrievance._id });
  } catch (error) {
    console.error('Grievance submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User ki Grievances Fetch Route
router.get('/my', auth, async (req, res) => {
  try {
    const grievances = await Grievance.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json(grievances.map(g => ({
      id: g._id,
      category: g.category,
      details: g.description,
      status: g.status,
      submittedAt: g.createdAt,
      attachmentName: g.attachmentFilename,
      subFields: g.subFields,
      title: g.title,
      name: g.userName,
      email: g.userEmail,
    })));
  } catch (error) {
    console.error('User grievances fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Saari Grievances Fetch Route
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const grievances = await Grievance.find({}).sort({ createdAt: -1 });
    res.status(200).json(grievances.map(g => ({
      id: g._id,
      email: g.userEmail,
      subject: g.title,
      category: g.category,
      description: g.description,
      document: g.attachmentFilename, // Frontend mein 'document' naam se hai
      status: g.status,
      submittedAt: g.createdAt,
      name: g.userName,
      subFields: g.subFields,
    })));
  } catch (error) {
    console.error('Admin all grievances fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Specific Grievance Detail Fetch Route
router.get('/admin/:id', adminAuth, async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance nahi mili' });
    }
    res.status(200).json({
      id: grievance._id,
      email: grievance.userEmail,
      subject: grievance.title,
      category: grievance.category,
      description: grievance.description,
      document: grievance.attachmentFilename,
      status: grievance.status,
      submittedAt: grievance.createdAt,
      name: grievance.userName,
      subFields: grievance.subFields,
    });
  } catch (error) {
    console.error('Admin grievance detail fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Grievance Status Update Route
router.put('/admin/:id', adminAuth, async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Naya status zaroori hai' });
  }

  const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}` });
  }

  try {
    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true } // Updated document return karein
    );

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance nahi mili' });
    }
    res.status(200).json({ message: 'Grievance status successfully updated', grievance });
  } catch (error) {
    console.error('Grievance status update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Department-wise Grievances Fetch Route
router.get('/admin/department/:deptName', adminAuth, async (req, res) => {
  const { deptName } = req.params;
  try {
    const grievances = await Grievance.find({ category: deptName }).sort({ createdAt: -1 });
    res.status(200).json(grievances.map(g => ({
      id: g._id,
      name: g.userName,
      email: g.userEmail,
      description: g.description,
      attachmentName: g.attachmentFilename,
      submittedAt: g.createdAt,
      status: g.status,
      subFields: g.subFields,
      title: g.title,
    })));
  } catch (error) {
    console.error('Department grievances fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
