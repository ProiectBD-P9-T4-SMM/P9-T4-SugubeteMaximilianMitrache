require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const lookupRoutes = require('./routes/lookup');
const academicRoutes = require('./routes/academic');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lookup', lookupRoutes);
app.use('/api/academic', academicRoutes);

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
