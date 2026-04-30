const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res, next) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      const err = new Error('Username is required');
      err.status = 400;
      err.customCode = 'BAD_REQUEST';
      err.customMessage = 'Please provide a username to login.';
      return next(err);
    }

    // Note: This is a simulation of SSO. Real auth would verify a password or token.
    const query = `
      SELECT u.id, u.sso_subject, u.username, u.email, u.full_name, r.code as role_code, r.name as role_name
      FROM USER_ACCOUNT u
      JOIN USER_ROLE ur ON u.id = ur.user_id
      JOIN ROLE r ON ur.role_id = r.id
      WHERE u.username = $1 AND u.account_status = 'ACTIVE'
    `;
    
    const result = await db.query(query, [username]);
    
    if (result.rows.length === 0) {
      const err = new Error('User not found or inactive');
      err.status = 401;
      err.customCode = 'AUTH_FAILED';
      err.customMessage = 'Invalid username or inactive account.';
      return next(err);
    }

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role_code 
      }, 
      process.env.JWT_SECRET || 'super_secret_key_change_in_production', 
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role_code,
        roleName: user.role_name
      },
      token
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
