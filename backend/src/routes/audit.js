const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const { auditableUpdate } = require('../services/auditService');

router.use(requireAuth);

// GET /api/audit - Fetch Audit Logs
router.get('/', requireRole(['ADMIN', 'SECRETARIAT', 'PROFESSOR']), async (req, res, next) => {
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

// POST /api/audit/rollback/:logId - Perform Rollback (REQ-AFSMS-54)
router.post('/rollback/:logId', requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { logId } = req.params;

    // 1. Fetch the audit log entry
    const logRes = await db.query('SELECT * FROM AUDIT_LOG_ENTRY WHERE id = $1', [logId]);
    if (logRes.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Audit log entry not found' });
    }

    const log = logRes.rows[0];
    const entityType = log.entity_type;
    const entityId = log.entity_id;
    const actionType = log.action_type;

    // Validate table name to prevent SQL injection
    const validTables = ['STUDENT', 'GRADE', 'USER_ACCOUNT', 'DOCUMENT', 'STUDY_FORMATION', 'DISCIPLINE'];
    const uppercaseEntityType = entityType.toUpperCase();
    if (!validTables.includes(uppercaseEntityType)) {
      return res.status(400).json({ error: true, message: `Invalid entity type '${entityType}' for rollback` });
    }

    let result;
    let message = '';

    await db.transaction(async (client) => {
      if (actionType === 'INSERT') {
        // UNDO INSERT = DELETE the record
        const deleteQuery = `DELETE FROM ${uppercaseEntityType} WHERE id = $1 RETURNING *`;
        const delRes = await client.query(deleteQuery, [entityId]);
        
        if (delRes.rows.length === 0) {
           throw new Error('Record already deleted or not found');
        }
        
        result = delRes.rows[0];
        message = `Successfully rolled back INSERT by DELETING record ${entityId} from ${uppercaseEntityType}.`;
        
        // Log the UNDO action
        await client.query(`
          INSERT INTO AUDIT_LOG_ENTRY (actor_user_id, action_type, module, entity_type, entity_id, before_snapshot_json, after_snapshot_json)
          VALUES ($1, 'ROLLBACK_INSERT', 'AUDIT_SYSTEM', $2, $3, $4, NULL)
        `, [req.user.userId, uppercaseEntityType, entityId, JSON.stringify(result)]);

      } else if (actionType === 'UPDATE') {
        // UNDO UPDATE = RESTORE before_snapshot_json
        if (!log.before_snapshot_json) {
          throw new Error('No before_snapshot_json available for rollback.');
        }

        const snapshot = log.before_snapshot_json;
        
        // Filter out tracking columns and ID
        const columnsToUpdate = Object.keys(snapshot).filter(
          key => key !== 'id' && key !== 'created_at' && key !== 'updated_at' && key !== 'registration_number'
        );

        if (columnsToUpdate.length === 0) {
          throw new Error('No valid columns to restore.');
        }

        const setClauses = columnsToUpdate.map((col, index) => `${col} = $${index + 1}`).join(', ');
        const params = columnsToUpdate.map(col => snapshot[col]);
        params.push(entityId);

        const rollbackQuery = `UPDATE ${uppercaseEntityType} SET ${setClauses} WHERE id = $${params.length} RETURNING *`;
        const updateRes = await client.query(rollbackQuery, params);
        
        if (updateRes.rows.length === 0) {
          throw new Error('Record not found to update');
        }

        result = updateRes.rows[0];
        message = `Successfully rolled back UPDATE on ${uppercaseEntityType}.`;

        // Log the UNDO action
        await client.query(`
          INSERT INTO AUDIT_LOG_ENTRY (actor_user_id, action_type, module, entity_type, entity_id, before_snapshot_json, after_snapshot_json)
          VALUES ($1, 'ROLLBACK_UPDATE', 'AUDIT_SYSTEM', $2, $3, $4, $5)
        `, [req.user.userId, uppercaseEntityType, entityId, JSON.stringify(log.after_snapshot_json), JSON.stringify(log.before_snapshot_json)]);
      } else {
        throw new Error(`Rollback for '${actionType}' is not yet supported.`);
      }
    });

    res.json({
      success: true,
      message,
      restoredData: result
    });

  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router;
