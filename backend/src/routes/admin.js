const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');
const { auditableUpdate, auditableInsert } = require('../services/auditService');

router.use(verifyToken);

// GET /api/admin/roles - Fetch available roles
router.get('/roles', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM ROLE ORDER BY name ASC');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/users - Fetch all users and their assigned role
router.get('/users', async (req, res, next) => {
  try {
    const query = `
      SELECT u.id, u.sso_subject, u.username, u.email, u.full_name, u.account_status,
             r.id as role_id, r.name as role_name, r.code as role_code, ur.id as user_role_id
      FROM USER_ACCOUNT u
      LEFT JOIN USER_ROLE ur ON u.id = ur.user_id
      LEFT JOIN ROLE r ON ur.role_id = r.id
      ORDER BY u.full_name ASC
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/users/:id/role - Update user's role
router.put('/users/:id/role', async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { roleId } = req.body;
    
    // Check if user already has a role
    const existing = await db.query('SELECT id FROM USER_ROLE WHERE user_id = $1', [userId]);
    
    if (existing.rows.length > 0) {
      // Update existing
      await auditableUpdate(
        req.user.id,
        'ADMINISTRATION',
        'USER_ROLE',
        existing.rows[0].id,
        { role_id: roleId }
      );
    } else {
      // Insert new
      await auditableInsert(
        req.user.id,
        'ADMINISTRATION',
        'USER_ROLE',
        { user_id: userId, role_id: roleId }
      );
    }
    
    res.json({ success: true, message: 'Role updated successfully' });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/queries - DBA Query Monitor
router.get('/queries', async (req, res, next) => {
  try {
    // Only fetch queries for the current database, excluding idle connections to keep it clean
    const query = `
      SELECT pid, usename as username, application_name, client_addr, state, query, state_change
      FROM pg_stat_activity
      WHERE datname = current_database() AND state IS NOT NULL AND query NOT LIKE '%pg_stat_activity%'
      ORDER BY state_change DESC
      LIMIT 100
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
