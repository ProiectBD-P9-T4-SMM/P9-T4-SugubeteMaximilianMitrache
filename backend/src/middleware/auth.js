const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({ error: true, code: 'AUTH_MISSING', message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Format: "Bearer <token>"
  if (!token) {
    return res.status(403).json({ error: true, code: 'AUTH_MALFORMED', message: 'Malformed authorization header' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key_change_in_production', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: true, code: 'AUTH_INVALID', message: 'Failed to authenticate token' });
    }
    
    // Save decoded user payload to request for use in other routes
    req.user = decoded;
    next();
  });
};

module.exports = { verifyToken };
