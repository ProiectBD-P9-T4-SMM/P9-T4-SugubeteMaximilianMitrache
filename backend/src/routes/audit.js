const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const { auditableUpdate } = require('../services/auditService');

router.use(requireAuth);

// GET /api/audit - Fetch Audit Logs
router.get('/', requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const query = `
      SELECT a.id, a.action_type, a.module, a.entity_type, a.entity_id, 
             a.before_snapshot_json, a.after_snapshot_json, a.occurred_at,
             u.full_name as actor_name, u.username as actor_username
      FROM AUDIT_LOG_ENTRY a
      LEFT JOIN USER_ACCOUNT u ON a.actor_user_id = u.id
      ORDER BY a.occurred_at DESC
      LIMIT 100
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// POST /api/audit/rollback/:logId - Perform Rollback
router.post('/rollback/:logId', requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { logId } = req.params;

    // 1. Fetch the audit log entry
    const logRes = await db.query('SELECT * FROM AUDIT_LOG_ENTRY WHERE id = $1', [logId]);
    if (logRes.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Audit log entry not found' });
    }

    const log = logRes.rows[0];

    // We only support rollback for UPDATE in this demo
    if (log.action_type !== 'UPDATE') {
      return res.status(400).json({ error: true, message: 'Rollback is currently only supported for UPDATE operations.' });
    }

    if (!log.before_snapshot_json) {
      return res.status(400).json({ error: true, message: 'No before_snapshot_json available for rollback.' });
    }

    const snapshot = log.before_snapshot_json;
    const entityType = log.entity_type;
    const entityId = log.entity_id;

    // Validate table name to prevent SQL injection
    const validTables = ['STUDENT', 'GRADE', 'USER_ACCOUNT', 'DOCUMENT'];
    const uppercaseEntityType = entityType.toUpperCase();
    if (!validTables.includes(uppercaseEntityType)) {
      return res.status(400).json({ error: true, message: 'Invalid entity type for rollback' });
    }

    // 2. Generate dynamic UPDATE statement
    // We filter out 'id' and tracking columns from the snapshot
    const columnsToUpdate = Object.keys(snapshot).filter(
      key => key !== 'id' && key !== 'created_at' && key !== 'updated_at'
    );

    if (columnsToUpdate.length === 0) {
      return res.status(400).json({ error: true, message: 'No valid columns to restore.' });
    }

    const setClauses = columnsToUpdate.map((col, index) => `${col} = $${index + 1}`).join(', ');
    const params = columnsToUpdate.map(col => snapshot[col]);
    
    // Add entity_id as the last parameter for the WHERE clause
    params.push(entityId);

    const rollbackQuery = `UPDATE ${uppercaseEntityType} SET ${setClauses} WHERE id = $${params.length} RETURNING *`;

    // 3. Execute rollback and log it as a new audit action
    let result;
    await db.transaction(async (client) => {
      // Perform the restoration
      const updateRes = await client.query(rollbackQuery, params);
      result = updateRes.rows[0];

      // Insert an audit log specifically mentioning this was a ROLLBACK
      await client.query(`
        INSERT INTO AUDIT_LOG_ENTRY (actor_user_id, action_type, module, entity_type, entity_id, before_snapshot_json, after_snapshot_json)
        VALUES ($1, 'ROLLBACK_UPDATE', 'AUDIT_SYSTEM', $2, $3, $4, $5)
      `, [req.user.id, uppercaseEntityType, entityId, log.after_snapshot_json, log.before_snapshot_json]);
    });

    res.json({
      success: true,
      message: `Successfully rolled back ${uppercaseEntityType} to previous state.`,
      restoredData: result
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
