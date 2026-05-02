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
      } else if (actionType === 'DELETE') {
        // UNDO DELETE = INSERT the record
        const snapshot = log.before_snapshot_json;
        if (!snapshot) throw new Error('No before_snapshot_json available for delete rollback.');

        const columns = Object.keys(snapshot);
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
        const insertQuery = `INSERT INTO ${uppercaseEntityType} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        
        const insertRes = await client.query(insertQuery, columns.map(c => snapshot[c]));
        result = insertRes.rows[0];
        message = `Successfully rolled back DELETE by RE-INSERTING record ${entityId} into ${uppercaseEntityType}.`;

        // Log the UNDO action
        await client.query(`
          INSERT INTO AUDIT_LOG_ENTRY (actor_user_id, action_type, module, entity_type, entity_id, before_snapshot_json, after_snapshot_json)
          VALUES ($1, 'ROLLBACK_DELETE', 'AUDIT_SYSTEM', $2, $3, NULL, $4)
        `, [req.user.userId, uppercaseEntityType, entityId, JSON.stringify(result)]);
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

// POST /api/audit/pitr - Point-in-Time Recovery (REQ-AFSMS-54 Extended)
router.post('/pitr', requireRole(['ADMIN']), async (req, res, next) => {
  const { targetTimestamp } = req.body;
  if (!targetTimestamp) return res.status(400).json({ message: 'Target timestamp is required' });

  try {
    const validTables = ['STUDENT', 'GRADE', 'USER_ACCOUNT', 'DOCUMENT', 'STUDY_FORMATION', 'DISCIPLINE'];
    let count = 0;
    
    await db.transaction(async (client) => {
      // 1. Fetch all logs after the target timestamp in reverse order
      const logsRes = await client.query(`
        SELECT * FROM AUDIT_LOG_ENTRY 
        WHERE occurred_at > $1 
        AND action_type IN ('INSERT', 'UPDATE', 'DELETE')
        ORDER BY occurred_at DESC
      `, [targetTimestamp]);

      const logsToProcess = logsRes.rows;

      for (const log of logsToProcess) {
        const entityType = log.entity_type.toUpperCase();
        if (!validTables.includes(entityType)) continue;

        if (log.action_type === 'INSERT') {
          await client.query(`DELETE FROM ${entityType} WHERE id = $1`, [log.entity_id]);
        } else if (log.action_type === 'UPDATE') {
          const snapshot = log.before_snapshot_json;
          if (!snapshot) continue;
          
          const columnsToUpdate = Object.keys(snapshot).filter(
            key => key !== 'id' && key !== 'created_at' && key !== 'updated_at' && key !== 'registration_number'
          );
          if (columnsToUpdate.length === 0) continue;

          const setClauses = columnsToUpdate.map((col, index) => `${col} = $${index + 1}`).join(', ');
          const params = columnsToUpdate.map(col => snapshot[col]);
          params.push(log.entity_id);

          await client.query(`UPDATE ${entityType} SET ${setClauses} WHERE id = $${params.length}`, params);
        } else if (log.action_type === 'DELETE') {
          const snapshot = log.before_snapshot_json;
          if (!snapshot) continue;
          const columns = Object.keys(snapshot);
          const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
          await client.query(`INSERT INTO ${entityType} (${columns.join(', ')}) VALUES (${placeholders})`, columns.map(c => snapshot[c]));
        }
        count++;
      }

      // Log the PITR action
      await client.query(`
        INSERT INTO AUDIT_LOG_ENTRY (actor_user_id, action_type, module, entity_type, entity_id, after_snapshot_json)
        VALUES ($1, 'PITR', 'ADMIN_SYSTEM', 'DATABASE', '00000000-0000-0000-0000-000000000000', $2)
      `, [req.user.userId, JSON.stringify({ targetTimestamp, actionsReversed: count })]);
    });

    res.json({ success: true, message: `System state restored to ${targetTimestamp}. Reversed ${count} actions.` });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router;
