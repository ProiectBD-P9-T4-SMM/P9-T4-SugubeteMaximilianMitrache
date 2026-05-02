require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const { initScheduler } = require('./services/schedulerService');

// Initialize background tasks
initScheduler();

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

// ── Security Headers (lightweight, no extra dependency) ─────────────────────
app.use((_req, res, next) => {
  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Deny iframe embedding (clickjacking protection)
  res.setHeader('X-Frame-Options', 'DENY');
  // Restrict Referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Minimal CSP for an API server (block all non-API browser access)
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
  // Remove powered-by fingerprint
  res.removeHeader('X-Powered-By');
  next();
});

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, mobile apps, same-origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin '${origin}' is not allowed`));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '2mb' })); // cap request body size

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

