// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Routes import karein
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const grievanceRoutes = require('./routes/grievanceRoutes');

// Environment variables load karein
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Default port 5000

// Middleware
app.use(cors()); // CORS enable karein
app.use(express.json()); // JSON request bodies parse karne ke liye
// express.urlencoded ko hata diya hai, kyunki multer form-data handle karega
// aur JSON requests ke liye express.json() kaafi hai.

// Static folder for uploaded files serve karein
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Atlas se successfully connect ho gaya!'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Connection fail hone par process exit karein
  });

// Routes ko use karein
app.use('/api/auth', authRoutes); // /api/auth/signup, /api/auth/login, /api/auth/admin/login
app.use('/api/users', userRoutes); // /api/users/profile, /api/users/settings, /api/users/admin/users
app.use('/api/grievances', grievanceRoutes); // /api/grievances, /api/grievances/my, /api/grievances/admin/all etc.

// Error handling middleware (optional but good practice)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Server start karein
app.listen(PORT, () => {
  console.log(`Server ${PORT} port par chal raha hai`);
});
