const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

// All lookup routes are protected by verifyToken
router.use(verifyToken);

router.get('/academic-years', async (req, res, next) => {
  try {
    const query = `SELECT id, year_start, year_end, is_active FROM ACADEMIC_YEAR ORDER BY year_start DESC`;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.get('/specializations', async (req, res, next) => {
  try {
    const query = `SELECT id, code, name, degree_level FROM SPECIALIZATION WHERE is_active = TRUE ORDER BY name ASC`;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.get('/study-formations', async (req, res, next) => {
  try {
    const query = `
      SELECT sf.id, sf.code, sf.name, sf.study_year, sf.education_form, sf.group_index,
             s.id as specialization_id, s.name as specialization_name, s.code as spec_code, s.degree_level
      FROM STUDY_FORMATION sf
      JOIN SPECIALIZATION s ON sf.specialization_id = s.id
      WHERE sf.is_active = TRUE
      ORDER BY s.degree_level ASC, s.name ASC, sf.study_year, sf.group_index ASC
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.get('/disciplines', async (req, res, next) => {
  try {
    const query = `
      SELECT d.id, d.code, d.name, d.semester, d.evaluation_type, d.ects_credits, d.curriculum_id
      FROM DISCIPLINE d
      ORDER BY d.semester, d.name ASC
    `;
    const result = await db.query(query);
    res.json({ success: true, disciplines: result.rows });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
