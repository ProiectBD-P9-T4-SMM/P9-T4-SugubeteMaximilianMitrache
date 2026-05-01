const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');
const { auditableUpdate, auditableInsert, auditableDelete } = require('../services/auditService');
const fs = require('fs');
const path = require('path');

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

// POST /api/admin/roles - Create a new role
router.post('/roles', async (req, res, next) => {
  try {
    const { code, name, description } = req.body;
    const result = await auditableInsert(req.user.userId, 'ADMINISTRATION', 'ROLE', { code, name, description });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/roles/:id - Update a role
router.put('/roles/:id', async (req, res, next) => {
  try {
    const { code, name, description } = req.body;
    const result = await auditableUpdate(req.user.userId, 'ADMINISTRATION', 'ROLE', req.params.id, { code, name, description });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/roles/:id - Delete a role
router.delete('/roles/:id', async (req, res, next) => {
  try {
    await auditableDelete(req.user.userId, 'ADMINISTRATION', 'ROLE', req.params.id);
    res.json({ success: true, message: 'Role deleted successfully' });
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

// POST /api/admin/users - Create a new user (local admin creation)
router.post('/users', async (req, res, next) => {
  try {
    const { sso_subject, username, email, full_name, account_status } = req.body;
    const result = await auditableInsert(req.user.userId, 'ADMINISTRATION', 'USER_ACCOUNT', { 
      sso_subject, username, email, full_name, account_status: account_status || 'ACTIVE' 
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/users/:id - Update user details
router.put('/users/:id', async (req, res, next) => {
  try {
    const { full_name, email, account_status, username } = req.body;
    const updateFields = {};
    if (full_name) updateFields.full_name = full_name;
    if (email) updateFields.email = email;
    if (account_status) updateFields.account_status = account_status;
    if (username) updateFields.username = username;

    const result = await auditableUpdate(req.user.userId, 'ADMINISTRATION', 'USER_ACCOUNT', req.params.id, updateFields);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/users/:id - Delete a user
router.delete('/users/:id', async (req, res, next) => {
  try {
    await auditableDelete(req.user.userId, 'ADMINISTRATION', 'USER_ACCOUNT', req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
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
      await auditableUpdate(req.user.userId, 'ADMINISTRATION', 'USER_ROLE', existing.rows[0].id, { role_id: roleId });
    } else {
      await auditableInsert(req.user.userId, 'ADMINISTRATION', 'USER_ROLE', { user_id: userId, role_id: roleId });
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

// GET /api/admin/emails - View Outlook Notifications
router.get('/emails', async (req, res, next) => {
  try {
    const query = `
      SELECT n.id, n.subject, n.body_preview, n.recipients, n.delivery_status, n.sent_at,
             u.full_name as sent_by,
             g.name as group_name
      FROM OUTLOOK_NOTIFICATION n
      LEFT JOIN USER_ACCOUNT u ON n.sent_by_user_id = u.id
      LEFT JOIN USER_GROUP g ON n.user_group_id = g.id
      ORDER BY n.sent_at DESC
      LIMIT 100
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

const { createBackup, BACKUP_DIR, TABLES_TO_BACKUP } = require('../services/backupService');

// GET /api/admin/backups - List all backups
router.get('/backups', async (req, res, next) => {
  try {
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.endsWith('.json'))
      .map(f => {
        const stats = fs.statSync(path.join(BACKUP_DIR, f));
        return { filename: f, size: stats.size, createdAt: stats.birthtime };
      })
      .sort((a, b) => b.createdAt - a.createdAt);
    res.json(files);
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/backups/create - Create a new backup (REQ-AFSMS-56)
router.post('/backups/create', async (req, res, next) => {
  try {
    const result = await createBackup(req.user.userId, 'MANUAL');
    res.json({ success: true, message: 'Backup created successfully', filename: result.filename });
  } catch (error) {
    console.error('[AdminRoute] Manual backup failed:', error);
    next(error);
  }
});

const { updateSchedule } = require('../services/schedulerService');

// GET /api/admin/backups/config - Get current backup configuration
router.get('/backups/config', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM BACKUP_CONFIG LIMIT 1');
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/backups/config - Update backup configuration
router.put('/backups/config', async (req, res, next) => {
  try {
    const { cronExpression, enabled } = req.body;
    await updateSchedule(cronExpression, enabled);
    res.json({ success: true, message: 'Backup schedule updated successfully' });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/backups/restore - Restore from a backup (REQ-AFSMS-55)
router.post('/backups/restore', async (req, res, next) => {
  const { filename } = req.body;
  if (!filename) return res.status(400).json({ message: 'Filename required' });

  try {
    const filePath = path.join(BACKUP_DIR, filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'Backup not found' });

    const snapshot = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    await db.transaction(async (client) => {
      // 1. Disable triggers and truncate in reverse order
      // Using CASCADE to handle dependencies
      const tableNames = TABLES_TO_BACKUP.map(t => t.toUpperCase()).join(', ');
      await client.query(`TRUNCATE ${tableNames} CASCADE`);

      // 2. Insert data in correct order (same as TABLES_TO_BACKUP)
      for (const table of TABLES_TO_BACKUP) {
        const rows = snapshot.data[table];
        if (!rows || rows.length === 0) continue;

        const cols = Object.keys(rows[0]);
        const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
        const insertQuery = `INSERT INTO ${table.toUpperCase()} (${cols.join(', ')}) VALUES (${placeholders})`;

        for (const row of rows) {
          const values = cols.map(c => row[c]);
          await client.query(insertQuery, values);
        }
      }
      
      // Log the recovery action
      await client.query(`
        INSERT INTO AUDIT_LOG_ENTRY (actor_user_id, action_type, module, entity_type, entity_id, after_snapshot_json)
        VALUES ($1, 'RECOVERY', 'ADMIN_SYSTEM', 'DATABASE', 0, $2)
      `, [req.user.userId, JSON.stringify({ restored_file: filename })]);
    });

    res.json({ success: true, message: 'Database restored successfully' });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// GET /api/admin/backups/download/:filename - Download backup file
router.get('/backups/download/:filename', async (req, res) => {
  const filePath = path.join(BACKUP_DIR, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

module.exports = router;
