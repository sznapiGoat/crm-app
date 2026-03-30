require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const clientRoutes = require('./routes/clients');
const authRoutes = require('./routes/auth');
const { protect } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/clients', protect, clientRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
