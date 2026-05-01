const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.use(requireAuth);

// Pillar 2: e-Grade Centralizer
router.get('/centralizer', requireRole(['SECRETARIAT', 'ADMIN']), async (req, res, next) => {
  try {
    const { academicYear, specializationId, studyYear } = req.query;

    // Build query conditionally (if params exist)
    // We aggregate the average grade and sum of credits per student
    let query = `
      SELECT 
        s.id as student_id,
        s.registration_number,
        s.first_name,
        s.last_name,
        sf.name as formation_name,
        sf.study_year,
        ROUND(AVG(g.value)::numeric, 2) as average_grade,
        SUM(CASE WHEN g.value >= 5 THEN d.ects_credits ELSE 0 END) as accumulated_credits,
        COUNT(g.id) as exams_taken
      FROM STUDENT s
      JOIN STUDY_FORMATION sf ON s.study_formation_id = sf.id
      LEFT JOIN GRADE g ON s.id = g.student_id AND g.validated = true
      LEFT JOIN DISCIPLINE d ON g.discipline_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (academicYear) {
      params.push(academicYear);
      query += ` AND sf.academic_year = $${params.length}`;
    }
    
    if (specializationId) {
      params.push(specializationId);
      query += ` AND sf.specialization_id = $${params.length}`;
    }

    if (studyYear) {
      params.push(studyYear);
      query += ` AND sf.study_year = $${params.length}`;
    }

    query += `
      GROUP BY s.id, s.registration_number, s.first_name, s.last_name, sf.name, sf.study_year
      ORDER BY s.last_name ASC, s.first_name ASC
    `;

    const startTime = Date.now();
    const result = await db.query(query, params);
    const duration = Date.now() - startTime;
    
    console.log(`[BENCHMARK] Centralizer generated in ${duration}ms for ${result.rows.length} students.`);
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
