const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const { auditableUpdate, auditableInsert, auditableDelete } = require('../services/auditService');

router.use(requireAuth);
router.use(requireRole(['ADMIN']));

// --- SYSTEM SETTINGS (Global Metadata) ---

// GET /api/config/settings
router.get('/settings', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM SYSTEM_SETTING');
    const settings = {};
    result.rows.forEach(row => {
      settings[row.key] = row.value;
    });
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

// PUT /api/config/settings
router.put('/settings', async (req, res, next) => {
  try {
    const settings = req.body; // { key: value, ... }
    
    await db.transaction(async (client) => {
      for (const [key, value] of Object.entries(settings)) {
        // Check if exists
        const existing = await client.query('SELECT id FROM SYSTEM_SETTING WHERE key = $1', [key]);
        if (existing.rows.length > 0) {
          await client.query('UPDATE SYSTEM_SETTING SET value = $1, updated_at = CURRENT_TIMESTAMP WHERE key = $2', [value, key]);
        } else {
          await client.query('INSERT INTO SYSTEM_SETTING (key, value) VALUES ($1, $2)', [key, value]);
        }
      }
      
      // Log as a single system event
      await client.query(`
        INSERT INTO AUDIT_LOG_ENTRY (actor_user_id, action_type, module, entity_type, entity_id, after_snapshot_json)
        VALUES ($1, 'UPDATE_SETTINGS', 'ADMIN_SYSTEM', 'CONFIGURATION', '00000000-0000-0000-0000-000000000000', $2)
      `, [req.user.userId, JSON.stringify(settings)]);
    });

    res.json({ success: true, message: 'System settings updated successfully' });
  } catch (error) {
    next(error);
  }
});

// --- ACADEMIC YEARS ---

// GET /api/config/academic-years
router.get('/academic-years', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM ACADEMIC_YEAR ORDER BY year_start DESC');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// POST /api/config/academic-years
router.post('/academic-years', async (req, res, next) => {
  try {
    const { year_start, year_end, is_active } = req.body;
    
    if (is_active) {
      await db.query('UPDATE ACADEMIC_YEAR SET is_active = FALSE');
    }

    const result = await auditableInsert(req.user.userId, 'ADMINISTRATION', 'ACADEMIC_YEAR', { 
      year_start, year_end, is_active: !!is_active 
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// PUT /api/config/academic-years/:id
router.put('/academic-years/:id', async (req, res, next) => {
  try {
    const { year_start, year_end, is_active } = req.body;
    
    if (is_active) {
      await db.query('UPDATE ACADEMIC_YEAR SET is_active = FALSE WHERE id != $1', [req.params.id]);
    }

    const result = await auditableUpdate(req.user.userId, 'ADMINISTRATION', 'ACADEMIC_YEAR', req.params.id, { 
      year_start, year_end, is_active: !!is_active 
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/config/academic-years/:id
router.delete('/academic-years/:id', async (req, res, next) => {
  try {
    await auditableDelete(req.user.userId, 'ADMINISTRATION', 'ACADEMIC_YEAR', req.params.id);
    res.json({ success: true, message: 'Academic year deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// --- SPECIALIZATIONS ---

// GET /api/config/specializations
router.get('/specializations', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM SPECIALIZATION ORDER BY name ASC');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// POST /api/config/specializations
router.post('/specializations', async (req, res, next) => {
  try {
    const { code, name, degree_level, is_active } = req.body;
    const result = await auditableInsert(req.user.userId, 'ADMINISTRATION', 'SPECIALIZATION', { 
      code, name, degree_level, is_active: is_active !== undefined ? is_active : true 
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// PUT /api/config/specializations/:id
router.put('/specializations/:id', async (req, res, next) => {
  try {
    const result = await auditableUpdate(req.user.userId, 'ADMINISTRATION', 'SPECIALIZATION', req.params.id, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/config/specializations/:id
router.delete('/specializations/:id', async (req, res, next) => {
  try {
    await auditableDelete(req.user.userId, 'ADMINISTRATION', 'SPECIALIZATION', req.params.id);
    res.json({ success: true, message: 'Specialization deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
