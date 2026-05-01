require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const mockSsoRoutes = require('./routes/mockSso');
const authRoutes = require('./routes/auth');
const lookupRoutes = require('./routes/lookup');
const academicRoutes = require('./routes/academic');
const reportsRoutes = require('./routes/reports');
const documentsRoutes = require('./routes/documents');
const notificationsRoutes = require('./routes/notifications');
const auditRoutes = require('./routes/audit');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');
const groupsRoutes = require('./routes/groups');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
// Ruta externă (Simulatorul Universității)
app.use('/api/mock-sso', mockSsoRoutes);

// Rutele interne AFSMS
app.use('/api/auth', authRoutes);
app.use('/api/lookup', lookupRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/groups', groupsRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'AFSMS Backend API is running' });
});

// Global Error Handler (must be the last middleware)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
