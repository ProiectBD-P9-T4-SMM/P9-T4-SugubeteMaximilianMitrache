const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const { auditableUpdate, auditableInsert } = require('../services/auditService');

router.use(requireAuth);

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
    return res.status(400).json({ error: true, message: 'Invalid students data.' });
  }

  try {
    const results = [];
    for (const student of students) {
      const regNum = 'MAT' + Math.floor(1000 + Math.random() * 9000);
      const res = await db.query(`
        INSERT INTO STUDENT (registration_number, first_name, last_name, email, study_formation_id, enrollment_date, status)
        VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, 'ENROLLED') RETURNING *
      `, [regNum, student.first_name, student.last_name, student.email, student.study_formation_id]);
      results.push(res.rows[0]);
    }
    res.json({ success: true, message: `Successfully imported ${results.length} students.`, data: results });
  } catch (error) {
    next(error);
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

// Soft Delete Student (mark as INACTIVE)
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
    res.json(updatedStudent);
  } catch (error) {
    next(error);
  }
});

// --- GRADES ---

// Fetch all grades for centralizer
router.get('/grades', async (req, res, next) => {
  try {
    const { student_id, academic_year_id } = req.query;
    let query = `
      SELECT g.*, s.first_name, s.last_name, d.name as discipline_name, d.ects_credits
      FROM GRADE g
      JOIN STUDENT s ON g.student_id = s.id
      JOIN DISCIPLINE d ON g.discipline_id = d.id
      WHERE 1=1
    `;
    const params = [];
    if (student_id) {
      params.push(student_id);
      query += ` AND g.student_id = $${params.length}`;
    }
    if (academic_year_id) {
      params.push(academic_year_id);
      query += ` AND g.academic_year_id = $${params.length}`;
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Update Grade
router.put('/grades/:id', requireRole(['PROFESSOR', 'ADMIN']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { value, exam_session } = req.body;
    
    const updatedGrade = await auditableUpdate(
      req.user.id,
      'ACADEMIC_DATA',
      'GRADE',
      id,
      { value, exam_session }
    );

    res.json(updatedGrade);
  } catch (error) {
    next(error);
  }
});

// GET /api/academic/my-grades (Accesibil DOAR pentru Student)
router.get('/my-grades', requireRole(['STUDENT']), async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Căutăm studentul după email-ul contului sau, dacă nu găsim, luăm primul student disponibil (demo SSO)
    let studentRes = await db.query(
      'SELECT id, first_name, last_name, registration_number FROM STUDENT WHERE email = (SELECT email FROM USER_ACCOUNT WHERE id = $1) LIMIT 1',
      [userId]
    );

    // Fallback pentru demo SSO: student@ucv.ro nu există în DB, luăm primul student enrolled
    if (studentRes.rows.length === 0) {
      studentRes = await db.query(
        "SELECT id, first_name, last_name, registration_number FROM STUDENT WHERE status = 'ENROLLED' ORDER BY last_name ASC LIMIT 1"
      );
    }
    
    if (studentRes.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Nu a fost găsit niciun profil de student.' });
    }
    const student = studentRes.rows[0];

    // 2. Extragem TOATE materiile (Disciplines) din planul său de învățământ, făcând LEFT JOIN cu notele (Grades)
    const gradesQuery = `
      SELECT 
        d.name AS discipline_name,
        d.semester,
        d.evaluation_type,
        d.ects_credits,
        g.value AS grade_value,
        g.grading_date,
        g.exam_session
      FROM STUDENT s
      JOIN STUDY_FORMATION sf ON s.study_formation_id = sf.id
      JOIN CURRICULUM c ON sf.specialization_id = c.specialization_id
      JOIN DISCIPLINE d ON c.id = d.curriculum_id
      LEFT JOIN GRADE g ON s.id = g.student_id AND d.id = g.discipline_id
      WHERE s.id = $1
      ORDER BY d.semester ASC, d.name ASC;
    `;

    const { rows } = await db.query(gradesQuery, [student.id]);

    res.json({
      success: true,
      studentInfo: student,
      academicRecord: rows
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/academic/disciplines (Pentru Dropdown Materii)
router.get('/disciplines', requireRole(['PROFESSOR', 'ADMIN']), async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT id, name, code, semester FROM DISCIPLINE ORDER BY name ASC');
    res.json({ success: true, disciplines: rows });
  } catch (error) {
    next(error);
  }
});

// GET /api/academic/students-dropdown (Pentru Dropdown Studenți din AddGrades)
router.get('/students-dropdown', requireRole(['PROFESSOR', 'ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT s.id, s.first_name, s.last_name, s.registration_number, sf.code as group_code 
      FROM STUDENT s
      JOIN STUDY_FORMATION sf ON s.study_formation_id = sf.id
      WHERE s.status = 'ENROLLED'
      ORDER BY s.last_name ASC
    `);
    res.json({ success: true, students: rows });
  } catch (error) {
    next(error);
  }
});

// POST /api/academic/grades (Adăugarea efectivă a notei - REQ-AFSMS-47, REQ-AFSMS-48)
router.post('/grades', requireRole(['PROFESSOR', 'ADMIN']), async (req, res, next) => {
  const { studentId, disciplineId, gradeValue, examSession } = req.body;
  const professorId = req.user.id;

  try {
    // Validare Backend (Siguranță suplimentară)
    const gradeNum = parseFloat(gradeValue);
    if (isNaN(gradeNum) || gradeNum < 1 || gradeNum > 10) {
      return res.status(400).json({ error: true, message: 'Nota trebuie să fie între 1 și 10.' });
    }

    // Extragem Anul Academic Activ și Snapshot-ul Curriculei
    const academicYearRes = await db.query('SELECT id FROM ACADEMIC_YEAR WHERE is_active = TRUE LIMIT 1');
    const snapshotRes = await db.query("SELECT id FROM CURRICULUM_SNAPSHOT WHERE snapshot_status = 'ACTIVE' LIMIT 1");
    
    // Inserăm nota (Triggerul de PostgreSQL va face jurnalizarea dacă există)
    const insertRes = await db.query(`
      INSERT INTO GRADE (student_id, discipline_id, academic_year_id, curriculum_snapshot_id, graded_by_user_id, value, exam_session, grading_date, validated)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE, TRUE)
      RETURNING id, value
    `, [studentId, disciplineId, academicYearRes.rows[0]?.id || null, snapshotRes.rows[0]?.id || null, professorId, gradeNum, examSession]);

    res.json({ success: true, message: 'Notă adăugată cu succes!', grade: insertRes.rows[0] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
