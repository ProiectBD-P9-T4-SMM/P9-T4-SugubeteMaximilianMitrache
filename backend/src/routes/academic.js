const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');
const { auditableUpdate, auditableInsert } = require('../services/auditService');

router.use(verifyToken);

// --- STUDENTS ---
router.get('/students', async (req, res, next) => {
  try {
    const query = `
      SELECT s.id, s.registration_number, s.first_name, s.last_name, s.email, s.status, 
             sf.name as formation_name, sf.study_year
      FROM STUDENT s
      LEFT JOIN STUDY_FORMATION sf ON s.study_formation_id = sf.id
      ORDER BY s.last_name ASC
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// --- GRADES ---
router.get('/grades', async (req, res, next) => {
  try {
    const query = `
      SELECT g.id, g.value, g.exam_session, g.grading_date, g.validated,
             s.registration_number, s.first_name as student_first_name, s.last_name as student_last_name,
             d.name as discipline_name, d.code as discipline_code,
             u.full_name as graded_by
      FROM GRADE g
      JOIN STUDENT s ON g.student_id = s.id
      JOIN DISCIPLINE d ON g.discipline_id = d.id
      LEFT JOIN USER_ACCOUNT u ON g.graded_by_user_id = u.id
      ORDER BY g.grading_date DESC
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Example of auditable update for a grade
router.put('/grades/:id', async (req, res, next) => {
  try {
    const gradeId = req.params.id;
    const { value, validated } = req.body;
    
    // Only Professor or Admin can update grades (Basic role check simulation)
    if (req.user.role !== 'PROFESSOR' && req.user.role !== 'ADMIN') {
       const err = new Error('Forbidden');
       err.status = 403;
       err.customCode = 'FORBIDDEN';
       err.customMessage = 'You do not have permission to modify grades.';
       return next(err);
    }

    const updateFields = { value, validated };
    
    const updatedGrade = await auditableUpdate(
      req.user.id, 
      'ACADEMIC_DATA', 
      'GRADE', 
      gradeId, 
      updateFields
    );

    res.json(updatedGrade);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
