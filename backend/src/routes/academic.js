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

// Add Student
router.post('/students', async (req, res, next) => {
  try {
    const { first_name, last_name, email, study_formation_id } = req.body;
    
    // Generate a registration number (mock format: MAT + Random 4 digits)
    const regNum = 'MAT' + Math.floor(1000 + Math.random() * 9000);
    
    const newStudent = await auditableInsert(
      req.user.id,
      'ACADEMIC_DATA',
      'STUDENT',
      { registration_number: regNum, first_name, last_name, email, study_formation_id, enrollment_date: new Date().toISOString(), status: 'ACTIVE' }
    );
    res.status(201).json(newStudent);
  } catch (error) {
    next(error);
  }
});

// Bulk Add Students (REQ-AFSMS-18, 19)
router.post('/students/bulk', async (req, res, next) => {
  const { students } = req.body;
  
  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ message: 'Invalid payload. Expected an array of students.' });
  }

  const client = await db.getPool().connect();
  try {
    await client.query('BEGIN');
    
    // Process each student
    const addedStudents = [];
    for (const student of students) {
      const { first_name, last_name, email, study_formation_code } = student;
      
      // Lookup the formation ID by its code
      const formationRes = await client.query('SELECT id FROM STUDY_FORMATION WHERE code = $1 LIMIT 1', [study_formation_code]);
      if (formationRes.rows.length === 0) {
         throw new Error(`Study formation code '${study_formation_code}' not found.`);
      }
      const study_formation_id = formationRes.rows[0].id;
      
      const regNum = 'MAT' + Math.floor(1000 + Math.random() * 9000);
      
      const insertQuery = `
        INSERT INTO STUDENT (registration_number, first_name, last_name, email, study_formation_id, enrollment_date, status)
        VALUES ($1, $2, $3, $4, $5, $6, 'ACTIVE')
        RETURNING *
      `;
      const result = await client.query(insertQuery, [regNum, first_name, last_name, email, study_formation_id, new Date().toISOString()]);
      const newStudent = result.rows[0];
      addedStudents.push(newStudent);
      
      // Audit log it
      await client.query(`
        INSERT INTO AUDIT_LOG_ENTRY (user_id, operation_type, table_name, record_id, before_snapshot_json, after_snapshot_json)
        VALUES ($1, 'INSERT', 'STUDENT', $2, NULL, $3)
      `, [req.user.id, newStudent.id, JSON.stringify(newStudent)]);
    }

    await client.query('COMMIT');
    res.status(201).json({ success: true, count: addedStudents.length, message: `Successfully imported ${addedStudents.length} students.` });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

// Update Student
router.put('/students/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, study_formation_id, status } = req.body;
    
    const updatedStudent = await auditableUpdate(
      req.user.id,
      'ACADEMIC_DATA',
      'STUDENT',
      id,
      { first_name, last_name, email, study_formation_id, status }
    );
    res.json(updatedStudent);
  } catch (error) {
    next(error);
  }
});

// Soft Delete Student
router.delete('/students/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const updatedStudent = await auditableUpdate(
      req.user.id,
      'ACADEMIC_DATA',
      'STUDENT',
      id,
      { status: 'INACTIVE' }
    );
    res.json({ success: true, message: 'Student marked as INACTIVE', student: updatedStudent });
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

// Create a new grade (Pillar 1)
router.post('/grades', async (req, res, next) => {
  try {
    const { student_id, discipline_id, value, exam_session } = req.body;
    
    // Only Professor or Admin can add grades
    if (req.user.role !== 'PROFESSOR' && req.user.role !== 'ADMIN') {
       const err = new Error('Forbidden');
       err.status = 403;
       err.customCode = 'FORBIDDEN';
       err.customMessage = 'You do not have permission to add grades.';
       return next(err);
    }

    const insertFields = { 
      student_id, 
      discipline_id, 
      value, 
      exam_session: exam_session || 'WINTER',
      graded_by_user_id: req.user.id,
      grading_date: new Date().toISOString()
    };
    
    const newGrade = await auditableInsert(
      req.user.id, 
      'ACADEMIC_DATA', 
      'GRADE', 
      insertFields
    );

    res.status(201).json(newGrade);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
