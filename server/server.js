/**
 * Smart Waste Management System — Express Server
 *
 * This is the main entry point for the backend API.
 * It loads environment variables, connects to MongoDB, mounts all route modules,
 * and starts listening on the configured port.
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Import route modules
const userRoutes = require('./routes/userRoutes');
const binRoutes = require('./routes/binRoutes');
const reportRoutes = require('./routes/reportRoutes');
const taskRoutes = require('./routes/taskRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const activityLogRoutes = require('./routes/activityLogRoutes');

// Initialize Express app
const app = express();

// ─── Middleware ──────────────────────────────────────────────
app.use(cors()); // Allow cross-origin requests from the React frontend
app.use(express.json()); // Parse JSON request bodies
app.use(morgan('dev')); // HTTP request logger

// ─── API Routes ─────────────────────────────────────────────
app.use('/api', userRoutes); // /api/register, /api/login, /api/users
app.use('/api/bins', binRoutes); // /api/bins CRUD
app.use('/api/reports', reportRoutes); // /api/reports CRUD
app.use('/api/tasks', taskRoutes); // /api/tasks CRUD
app.use('/api/vehicles', vehicleRoutes); // /api/vehicles
app.use('/api/notifications', notificationRoutes); // /api/notifications
app.use('/api/feedback', feedbackRoutes); // /api/feedback
app.use('/api/activity-logs', activityLogRoutes); // /api/activity-logs CRUD

// ─── Health Check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Waste Management API is running' });
});

// ─── 404 Handler ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ─── Global Error Handler ───────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// ─── Start Server ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  });
});
