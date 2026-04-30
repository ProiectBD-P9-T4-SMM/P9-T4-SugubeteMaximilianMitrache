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

module.exports = {
  logAudit,
  auditableUpdate,
  auditableInsert
};
