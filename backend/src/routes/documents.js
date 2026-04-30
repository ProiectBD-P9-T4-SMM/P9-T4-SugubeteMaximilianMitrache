const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');
const { auditableUpdate } = require('../services/auditService');

router.use(verifyToken);

// GET /api/documents - Advanced Search
router.get('/', async (req, res, next) => {
  try {
    const { type, author_id, startDate, endDate, contentKeyword } = req.query;

    let query = `
      SELECT d.id, d.title, d.type, d.content, d.status, d.created_at,
             u.full_name as author_name
      FROM DOCUMENT d
      LEFT JOIN USER_ACCOUNT u ON d.created_by_user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (type) {
      params.push(type);
      query += ` AND d.type = $${params.length}`;
    }
    if (author_id) {
      params.push(author_id);
      query += ` AND d.created_by_user_id = $${params.length}`;
    }
    if (startDate) {
      params.push(startDate);
      query += ` AND d.created_at >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      // add 1 day to endDate to include the entire day
      query += ` AND d.created_at < $${params.length}::date + interval '1 day'`;
    }
    if (contentKeyword) {
      params.push(`%${contentKeyword}%`);
      query += ` AND (d.title ILIKE $${params.length} OR d.content ILIKE $${params.length})`;
    }

    query += ` ORDER BY d.created_at DESC`;

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// PUT /api/documents/:id/status - Update Status (Workflow)
router.put('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // e.g. APPROVED, REJECTED

    // Audit the document status update
    const updatedDocument = await auditableUpdate(
      req.user.id,
      'DOCUMENT_FLOW',
      'DOCUMENT',
      id,
      { status, updated_at: new Date().toISOString() }
    );

    res.json(updatedDocument);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
