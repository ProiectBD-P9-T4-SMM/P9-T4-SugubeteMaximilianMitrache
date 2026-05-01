const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.use(requireAuth);

// GET /api/groups - Get all groups
router.get('/', requireRole(['SECRETARIAT', 'ADMIN', 'PROFESSOR']), async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM USER_GROUP ORDER BY name ASC');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// POST /api/groups - Create a group
router.post('/', requireRole(['SECRETARIAT', 'ADMIN']), async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const result = await db.query(
      'INSERT INTO USER_GROUP (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// PUT /api/groups/:id - Update a group
router.put('/:id', requireRole(['SECRETARIAT', 'ADMIN']), async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const result = await db.query(
      'UPDATE USER_GROUP SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [name, description, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/groups/:id - Delete a group
router.delete('/:id', requireRole(['ADMIN']), async (req, res, next) => {
  try {
    await db.query('DELETE FROM USER_GROUP WHERE id = $1', [req.params.id]);
    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// GET /api/groups/:id/members - Get members of a group
router.get('/:id/members', requireRole(['SECRETARIAT', 'ADMIN', 'PROFESSOR']), async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT gm.user_account_id, u.full_name, u.email, u.username, gm.joined_at
      FROM USER_GROUP_MEMBER gm
      JOIN USER_ACCOUNT u ON gm.user_account_id = u.id
      WHERE gm.group_id = $1
    `, [req.params.id]);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// POST /api/groups/:id/members - Add member to group
router.post('/:id/members', requireRole(['SECRETARIAT', 'ADMIN']), async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    // Check if already exists
    const check = await db.query('SELECT * FROM USER_GROUP_MEMBER WHERE group_id = $1 AND user_account_id = $2', [req.params.id, userId]);
    if (check.rows.length > 0) return res.status(400).json({ message: 'User is already in group' });

    await db.query('INSERT INTO USER_GROUP_MEMBER (group_id, user_account_id) VALUES ($1, $2)', [req.params.id, userId]);
    res.status(201).json({ message: 'User added to group' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/groups/:id/members/:userId - Remove member from group
router.delete('/:id/members/:userId', requireRole(['SECRETARIAT', 'ADMIN']), async (req, res, next) => {
  try {
    await db.query('DELETE FROM USER_GROUP_MEMBER WHERE group_id = $1 AND user_account_id = $2', [req.params.id, req.params.userId]);
    res.json({ message: 'User removed from group' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
