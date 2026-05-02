const db = require('../db');

const logAudit = async (client, actorUserId, actionType, moduleName, entityType, entityId, beforeSnapshot = null, afterSnapshot = null) => {
  const query = `
    INSERT INTO AUDIT_LOG_ENTRY 
      (actor_user_id, action_type, module, entity_type, entity_id, before_snapshot_json, after_snapshot_json)
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7)
  `;
  
  const params = [
    actorUserId, 
    actionType, 
    moduleName, 
    entityType, 
    entityId, 
    beforeSnapshot ? JSON.stringify(beforeSnapshot) : null, 
    afterSnapshot ? JSON.stringify(afterSnapshot) : null
  ];

  await client.query(query, params);
};

// Generic function to perform an auditable update
const auditableUpdate = async (actorUserId, moduleName, tableName, id, updateFields, idColumn = 'id') => {
  return db.transaction(async (client) => {
    // 1. Fetch before snapshot
    const beforeResult = await client.query(`SELECT * FROM ${tableName} WHERE ${idColumn} = $1`, [id]);
    if (beforeResult.rows.length === 0) {
      const err = new Error('Entity not found');
      err.status = 404;
      err.customCode = 'NOT_FOUND';
      err.customMessage = `Could not find record to update in ${tableName}`;
      throw err;
    }
    const beforeSnapshot = beforeResult.rows[0];

    // 2. Perform Update
    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updateFields)) {
      setClauses.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
    values.push(id);

    const updateQuery = `
      UPDATE ${tableName}
      SET ${setClauses.join(', ')}
      WHERE ${idColumn} = $${paramIndex}
      RETURNING *
    `;

    const afterResult = await client.query(updateQuery, values);
    const afterSnapshot = afterResult.rows[0];

    // 3. Log Audit
    await logAudit(
      client, 
      actorUserId, 
      'UPDATE', 
      moduleName, 
      tableName.toUpperCase(), 
      id, 
      beforeSnapshot, 
      afterSnapshot
    );

    return afterSnapshot;
  });
};

// Generic function to perform an auditable insert
const auditableInsert = async (actorUserId, moduleName, tableName, insertFields) => {
  return db.transaction(async (client) => {
    const columns = [];
    const valuePlaceholders = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(insertFields)) {
      columns.push(key);
      valuePlaceholders.push(`$${paramIndex}`);
      values.push(value);
      paramIndex++;
    }

    const insertQuery = `
      INSERT INTO ${tableName} (${columns.join(', ')})
      VALUES (${valuePlaceholders.join(', ')})
      RETURNING *
    `;

    const afterResult = await client.query(insertQuery, values);
    const afterSnapshot = afterResult.rows[0];

    // Log Audit
    await logAudit(
      client, 
      actorUserId, 
      'INSERT', 
      moduleName, 
      tableName.toUpperCase(), 
      afterSnapshot.id, 
      null, 
      afterSnapshot
    );

    return afterSnapshot;
  });
};

// Generic function to perform an auditable delete
const auditableDelete = async (actorUserId, moduleName, tableName, id, idColumn = 'id') => {
  return db.transaction(async (client) => {
    // 1. Fetch before snapshot
    const beforeResult = await client.query(`SELECT * FROM ${tableName} WHERE ${idColumn} = $1`, [id]);
    if (beforeResult.rows.length === 0) {
      const err = new Error('Entity not found');
      err.status = 404;
      throw err;
    }
    const beforeSnapshot = beforeResult.rows[0];

    // 2. Perform Delete
    await client.query(`DELETE FROM ${tableName} WHERE ${idColumn} = $1`, [id]);

    // 3. Log Audit
    await logAudit(
      client, 
      actorUserId, 
      'DELETE', 
      moduleName, 
      tableName.toUpperCase(), 
      id, 
      beforeSnapshot, 
      null
    );

    return { success: true };
  });
};

const archiveOldLogs = async () => {
  return db.transaction(async (client) => {
    // 1. Ensure archive table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS AUDIT_LOG_ARCHIVE (
        id UUID PRIMARY KEY,
        actor_user_id UUID,
        action_type VARCHAR(50),
        module VARCHAR(100),
        entity_type VARCHAR(100),
        entity_id UUID,
        before_snapshot_json JSONB,
        after_snapshot_json JSONB,
        occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Archive logs older than 5 years
    const archiveQuery = `
      INSERT INTO AUDIT_LOG_ARCHIVE 
      SELECT * FROM AUDIT_LOG_ENTRY 
      WHERE occurred_at < NOW() - INTERVAL '5 years'
      RETURNING id
    `;
    const archiveRes = await client.query(archiveQuery);
    const count = archiveRes.rows.length;

    if (count > 0) {
      // 3. Delete from active logs
      await client.query(`
        DELETE FROM AUDIT_LOG_ENTRY 
        WHERE occurred_at < NOW() - INTERVAL '5 years'
      `);
    }

    return count;
  });
};

module.exports = {
  logAudit,
  auditableUpdate,
  auditableInsert,
  auditableDelete,
  archiveOldLogs
};
