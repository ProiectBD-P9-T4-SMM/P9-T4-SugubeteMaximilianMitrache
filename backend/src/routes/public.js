const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/public/curricula
// Returns disciplines with their specialization and study year
router.get('/curricula', async (req, res, next) => {
  try {
    const query = `
      SELECT d.id, d.code, d.name as discipline_name, d.semester, d.evaluation_type, d.ects_credits,
             CEIL(d.semester / 2.0) as study_year, s.name as specialization_name, s.degree_level
      FROM DISCIPLINE d
      JOIN CURRICULUM c ON d.curriculum_id = c.id
      JOIN SPECIALIZATION s ON c.specialization_id = s.id
      WHERE c.status = 'ACTIVE' AND s.is_active = TRUE
      ORDER BY s.name ASC, study_year ASC, d.semester ASC, d.name ASC
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
