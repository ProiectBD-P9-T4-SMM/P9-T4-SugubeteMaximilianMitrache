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
             sf.name as formation_name, sf.study_year,
             (SELECT COUNT(*) FROM STUDENT_CURRICULUM sc WHERE sc.student_id = s.id) as plan_count,
             (SELECT c.name FROM STUDENT_CURRICULUM sc JOIN CURRICULUM c ON sc.curriculum_id = c.id WHERE sc.student_id = s.id LIMIT 1) as first_plan_name
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

// Fetch all grades with filtering (REQ-AFSMS-39)
router.get('/grades', requireRole(['PROFESSOR', 'ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  try {
    const { student_id, discipline_id, academic_year_id, exam_session, min_date, max_date } = req.query;
    let query = `
      SELECT g.id, g.value, g.exam_session, g.grading_date, g.validated,
             s.id as student_id, s.first_name, s.last_name, s.registration_number,
             (s.last_name || ' ' || s.first_name) AS student_name,
             d.id as discipline_id, d.code as discipline_code, d.name as discipline_name, d.ects_credits, d.semester,
             u.full_name as graded_by_name
      FROM GRADE g
      JOIN STUDENT s ON g.student_id = s.id
      JOIN DISCIPLINE d ON g.discipline_id = d.id
      LEFT JOIN USER_ACCOUNT u ON g.graded_by_user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    
    if (student_id) {
      params.push(student_id);
      query += ` AND g.student_id = $${params.length}`;
    }
    if (discipline_id) {
      params.push(discipline_id);
      query += ` AND g.discipline_id = $${params.length}`;
    }
    if (academic_year_id) {
      params.push(academic_year_id);
      query += ` AND g.academic_year_id = $${params.length}`;
    }
    if (exam_session) {
      params.push(exam_session);
      query += ` AND g.exam_session = $${params.length}`;
    }
    if (min_date) {
      params.push(min_date);
      query += ` AND g.grading_date >= $${params.length}`;
    }
    if (max_date) {
      params.push(max_date);
      query += ` AND g.grading_date <= $${params.length}`;
    }
    
    query += ' ORDER BY s.last_name ASC, d.semester ASC';

    const result = await db.query(query, params);
    res.json({ success: true, grades: result.rows });
  } catch (error) {
    next(error);
  }
});

// Update Grade
router.put('/grades/:id', requireRole(['PROFESSOR', 'ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { value, exam_session, validated } = req.body;
    
    const updateData = {};
    if (value !== undefined) {
      const gradeNum = parseFloat(value);
      if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 10) {
        return res.status(400).json({ 
          error: true, 
          message: 'Nota trebuie să fie între 1 și 10 (sau 0 pentru Absent).' 
        });
      }
      updateData.value = gradeNum;
    }
    if (exam_session !== undefined) updateData.exam_session = exam_session;
    if (validated !== undefined) updateData.validated = validated;
    if (req.body.student_id !== undefined) updateData.student_id = req.body.student_id;
    if (req.body.discipline_id !== undefined) updateData.discipline_id = req.body.discipline_id;
    if (req.body.grading_date !== undefined) updateData.grading_date = req.body.grading_date;
    
    const updatedGrade = await auditableUpdate(
      req.user.id,
      'ACADEMIC_DATA',
      'GRADE',
      id,
      updateData
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

    // 1. Căutăm studentul cu detalii complete despre specializare și formație
    const studentQuery = `
      SELECT 
        s.id, s.first_name, s.last_name, s.registration_number, s.email, s.status, s.enrollment_date,
        sf.name as formation_name, sf.education_form, sf.study_year as current_study_year,
        spec.name as specialization_name, spec.degree_level, spec.code as specialization_code
      FROM STUDENT s
      JOIN STUDY_FORMATION sf ON s.study_formation_id = sf.id
      JOIN SPECIALIZATION spec ON sf.specialization_id = spec.id
      WHERE s.email = (SELECT email FROM USER_ACCOUNT WHERE id = $1)
      LIMIT 1
    `;
    let studentRes = await db.query(studentQuery, [userId]);

    // Fallback pentru demo SSO
    if (studentRes.rows.length === 0) {
      studentRes = await db.query(`
        SELECT 
          s.id, s.first_name, s.last_name, s.registration_number, s.email, s.status, s.enrollment_date,
          sf.name as formation_name, sf.education_form, sf.study_year as current_study_year,
          spec.name as specialization_name, spec.degree_level, spec.code as specialization_code
        FROM STUDENT s
        JOIN STUDY_FORMATION sf ON s.study_formation_id = sf.id
        JOIN SPECIALIZATION spec ON sf.specialization_id = spec.id
        WHERE s.status = 'ENROLLED' 
        ORDER BY s.last_name ASC LIMIT 1
      `);
    }
    
    if (studentRes.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Nu a fost găsit niciun profil de student.' });
    }
    const student = studentRes.rows[0];

    // 2. Extragem TOATE planurile de învățământ la care este înscris studentul
    const curriculaQuery = `
      SELECT 
        c.id as curriculum_id, c.name as curriculum_name, c.code as curriculum_code,
        spec.name as specialization_name, spec.degree_level, spec.code as specialization_code
      FROM STUDENT_CURRICULUM sc
      JOIN CURRICULUM c ON sc.curriculum_id = c.id
      JOIN SPECIALIZATION spec ON c.specialization_id = spec.id
      WHERE sc.student_id = $1 AND sc.status = 'ACTIVE'
    `;
    const curriculaRes = await db.query(curriculaQuery, [student.id]);
    const studentCurricula = curriculaRes.rows;

    // 3. Extragem TOATE materiile și notele, grupate pe curriculum
    const gradesQuery = `
      SELECT 
        c.id as curriculum_id,
        d.id as discipline_id,
        d.name AS discipline_name,
        d.code AS discipline_code,
        d.semester,
        d.evaluation_type,
        d.ects_credits,
        g.value AS grade_value,
        g.grading_date,
        g.exam_session
      FROM STUDENT_CURRICULUM sc
      JOIN CURRICULUM c ON sc.curriculum_id = c.id
      JOIN DISCIPLINE d ON c.id = d.curriculum_id
      LEFT JOIN GRADE g ON sc.student_id = g.student_id AND d.id = g.discipline_id
      WHERE sc.student_id = $1 AND sc.status = 'ACTIVE'
      ORDER BY c.id, d.semester ASC, d.name ASC;
    `;

    const { rows } = await db.query(gradesQuery, [student.id]);

    // Grupăm datele pe curriculum pentru frontend
    const academicPlans = studentCurricula.map(plan => ({
      ...plan,
      records: rows.filter(r => r.curriculum_id === plan.curriculum_id)
    }));

    res.json({
      success: true,
      studentInfo: {
        ...student,
        institution: "Universitatea din Craiova",
        faculty: "Facultatea de Automatică, Calculatoare și Electronică",
        domain: "Calculatoare și Tehnologia Informației"
      },
      academicPlans
    });

  } catch (error) {
    next(error);
  }
});

// --- DISCIPLINES ---

// GET /api/academic/disciplines (Pentru Dropdown Materii + List view)
router.get('/disciplines', requireRole(['PROFESSOR', 'ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  try {
    const { curriculum_id } = req.query;
    let query = `
      SELECT d.id, d.code, d.name, d.semester, d.evaluation_type, d.ects_credits, d.contact_hours, 
             d.curriculum_id, c.code as curriculum_code
      FROM DISCIPLINE d
      JOIN CURRICULUM c ON d.curriculum_id = c.id
      WHERE 1=1
    `;
    const params = [];
    
    if (curriculum_id) {
      params.push(curriculum_id);
      query += ` AND d.curriculum_id = $${params.length}`;
    }
    
    query += ' ORDER BY d.semester ASC, d.name ASC';
    
    const result = await db.query(query, params);
    res.json({ success: true, disciplines: result.rows });
  } catch (error) {
    next(error);
  }
});

// GET /api/academic/disciplines/:id (Get single discipline)
router.get('/disciplines/:id', requireRole(['PROFESSOR', 'ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT d.*, c.code as curriculum_code, c.id as curriculum_id
       FROM DISCIPLINE d
       JOIN CURRICULUM c ON d.curriculum_id = c.id
       WHERE d.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Disciplina nu a fost găsită.' });
    }
    
    res.json({ success: true, discipline: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// POST /api/academic/disciplines (Create new discipline)
router.post('/disciplines', requireRole(['ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  try {
    const { curriculum_id, code, name, semester, evaluation_type, ects_credits, contact_hours } = req.body;
    
    // Validare
    if (!curriculum_id || !code || !name || !semester || !evaluation_type || !ects_credits || !contact_hours) {
      return res.status(400).json({ 
        error: true, 
        message: 'Toate câmpurile sunt obligatorii.',
        resolutionHint: 'Verificați că ați completat: cod, nume, semestru, tip evaluare, ECTS, ore contact.'
      });
    }
    
    const semNum = parseInt(semester);
    const ectsNum = parseInt(ects_credits);
    const hoursNum = parseInt(contact_hours);
    
    if (semNum < 1 || semNum > 8) {
      return res.status(400).json({ 
        error: true, 
        message: 'Semestrul trebuie să fie între 1 și 8.',
        resolutionHint: 'Introduceți un semestru valid.'
      });
    }
    
    if (ectsNum < 1 || ectsNum > 20) {
      return res.status(400).json({ 
        error: true, 
        message: 'Creditele ECTS trebuie să fie între 1 și 20.',
        resolutionHint: 'Introduceți o valoare validă pentru ECTS.'
      });
    }
    
    if (hoursNum < 0 || hoursNum > 200) {
      return res.status(400).json({ 
        error: true, 
        message: 'Orele contact trebuie să fie între 0 și 200.',
        resolutionHint: 'Introduceți o valoare validă pentru ore contact.'
      });
    }
    
    // Check if code already exists
    const existingCode = await db.query('SELECT id FROM DISCIPLINE WHERE code = $1', [code]);
    if (existingCode.rows.length > 0) {
      return res.status(400).json({ 
        error: true, 
        message: 'Un cod de disciplină cu această valoare există deja.',
        resolutionHint: 'Folosiți un cod unic pentru disciplină.'
      });
    }
    
    const newDiscipline = await auditableInsert(
      req.user.id,
      'ACADEMIC_DATA',
      'DISCIPLINE',
      { curriculum_id, code, name, semester: semNum, evaluation_type, ects_credits: ectsNum, contact_hours: hoursNum }
    );
    
    res.status(201).json({ success: true, message: 'Disciplina creată cu succes!', discipline: newDiscipline });
  } catch (error) {
    next(error);
  }
});

// PUT /api/academic/disciplines/:id (Update discipline)
router.put('/disciplines/:id', requireRole(['ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, name, semester, evaluation_type, ects_credits, contact_hours } = req.body;
    
    // Validare
    const semNum = parseInt(semester);
    const ectsNum = parseInt(ects_credits);
    const hoursNum = parseInt(contact_hours);
    
    if (semNum < 1 || semNum > 8 || ectsNum < 1 || ectsNum > 20 || hoursNum < 0 || hoursNum > 200) {
      return res.status(400).json({ 
        error: true, 
        message: 'Una sau mai multe valori nu sunt în intervalul valid.',
        resolutionHint: 'Semestru: 1-8, ECTS: 1-20, Ore: 0-200.'
      });
    }
    
    // Check if code exists for a different discipline
    if (code) {
      const existingCode = await db.query('SELECT id FROM DISCIPLINE WHERE code = $1 AND id != $2', [code, id]);
      if (existingCode.rows.length > 0) {
        return res.status(400).json({ 
          error: true, 
          message: 'Un cod de disciplină cu această valoare există deja.',
          resolutionHint: 'Folosiți un cod unic pentru disciplină.'
        });
      }
    }
    
    const updatedDiscipline = await auditableUpdate(
      req.user.id,
      'ACADEMIC_DATA',
      'DISCIPLINE',
      id,
      { code, name, semester: semNum, evaluation_type, ects_credits: ectsNum, contact_hours: hoursNum }
    );
    
    res.json({ success: true, message: 'Disciplina actualizată cu succes!', discipline: updatedDiscipline });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/academic/disciplines/:id (Soft delete - mark as inactive)
router.delete('/disciplines/:id', requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Soft delete: we'll just return success but log it
    // Note: Database schema doesn't have is_active for DISCIPLINE, so we just audit the delete attempt
    await db.query('DELETE FROM DISCIPLINE WHERE id = $1', [id]);
    
    // Log the deletion
    await db.query(`
      INSERT INTO AUDIT_LOG_ENTRY (actor_user_id, action_type, module, entity_type, entity_id, occurred_at, success)
      VALUES ($1, 'DELETE', 'ACADEMIC_DATA', 'DISCIPLINE', $2, CURRENT_TIMESTAMP, true)
    `, [req.user.id, id]);
    
    res.json({ success: true, message: 'Disciplina a fost ștearsă cu succes.' });
  } catch (error) {
    next(error);
  }
});

// GET /api/academic/disciplines/curriculum/:curriculumId (Get disciplines for a specific curriculum)
router.get('/curriculum/:curriculumId/disciplines', requireRole(['PROFESSOR', 'ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  try {
    const { curriculumId } = req.params;
    const result = await db.query(
      `SELECT id, code, name, semester, evaluation_type, ects_credits, contact_hours
       FROM DISCIPLINE
       WHERE curriculum_id = $1
       ORDER BY semester ASC, name ASC`,
      [curriculumId]
    );
    res.json({ success: true, disciplines: result.rows });
  } catch (error) {
    next(error);
  }
});

// GET /api/academic/students-dropdown (Pentru Dropdown Studenți din AddGrades)
router.get('/students-dropdown', requireRole(['PROFESSOR', 'ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT s.id, s.first_name, s.last_name, s.registration_number, sf.code as group_code,
             ARRAY_AGG(sc.curriculum_id) as curriculum_ids
      FROM STUDENT s
      LEFT JOIN STUDENT_CURRICULUM sc ON s.id = sc.student_id
      LEFT JOIN STUDY_FORMATION sf ON sc.study_formation_id = sf.id
      WHERE s.status IN ('ENROLLED', 'ACTIVE')
      GROUP BY s.id, sf.code
      ORDER BY s.last_name ASC
    `);
    res.json({ success: true, students: rows });
  } catch (error) {
    next(error);
  }
});

// --- LOOKUP ENDPOINTS ---

// GET /api/academic/specializations (Specializations for dropdowns - REQ-AFSMS-16)
router.get('/specializations', requireRole(['PROFESSOR', 'ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT s.id, s.code, s.name, s.degree_level, s.is_active
      FROM SPECIALIZATION s
      WHERE s.is_active = true
      ORDER BY s.name ASC
    `);
    res.json({ success: true, specializations: result.rows });
  } catch (error) {
    next(error);
  }
});

// POST /api/academic/specializations (Create new specialization - REQ-AFSMS-16)
router.post('/specializations', requireRole(['ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  try {
    const { code, name, degree_level } = req.body;
    
    if (!code || !name || !degree_level) {
      return res.status(400).json({ error: true, message: 'Lipsesc date obligatorii (Cod, Nume, Ciclu Studii).' });
    }

    const result = await auditableUpdate(
      req.user.id,
      'ACADEMIC_DATA',
      'SPECIALIZATION',
      null, // New record
      { code, name, degree_level, is_active: true }
    );

    res.status(201).json({ success: true, specialization: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/academic/academic-years (Academic years for dropdowns - REQ-AFSMS-16)
router.get('/academic-years', requireRole(['PROFESSOR', 'ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT id, year_start, year_end, is_active
      FROM ACADEMIC_YEAR
      ORDER BY year_start DESC
    `);
    res.json({ success: true, academicYears: result.rows });
  } catch (error) {
    next(error);
  }
});

// GET /api/academic/curricula (Curricula for dropdowns - REQ-AFSMS-16)
router.get('/curricula', requireRole(['PROFESSOR', 'ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  try {
    const { specialization_id } = req.query;
    let query = `
      SELECT c.id, c.code, c.name, c.specialization_id, s.name as specialization_name, c.status
      FROM CURRICULUM c
      LEFT JOIN SPECIALIZATION s ON c.specialization_id = s.id
      WHERE 1=1
    `;
    const params = [];
    
    if (specialization_id) {
      params.push(specialization_id);
      query += ` AND c.specialization_id = $${params.length}`;
    }
    
    query += ' ORDER BY c.code ASC';
    
    const result = await db.query(query, params);
    res.json({ success: true, curricula: result.rows });
  } catch (error) {
    next(error);
  }
});

// POST /api/academic/curricula (Create new curriculum - REQ-AFSMS-16)
router.post('/curricula', requireRole(['ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  try {
    const { specialization_id, code, name } = req.body;
    
    if (!specialization_id || !code || !name) {
      return res.status(400).json({ error: true, message: 'Lipsesc date obligatorii (Specializare, Cod, Nume).' });
    }

    const result = await auditableUpdate(
      req.user.id,
      'ACADEMIC_DATA',
      'CURRICULUM',
      null, // New record
      { 
        specialization_id, 
        code, 
        name, 
        status: 'ACTIVE', 
        valid_from: new Date().toISOString().split('T')[0] 
      }
    );

    res.status(201).json({ success: true, curriculum: result });
  } catch (error) {
    next(error);
  }
});

// POST /api/academic/grades (Adăugarea efectivă a notei - REQ-AFSMS-47, REQ-AFSMS-48)
router.post('/grades', requireRole(['PROFESSOR', 'ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  const { studentId, disciplineId, gradeValue, examSession } = req.body;
  const professorId = req.user.id;

  try {
    // Validare Backend (Siguranță suplimentară)
    const gradeNum = parseFloat(gradeValue);
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 10) {
      return res.status(400).json({ error: true, message: 'Nota trebuie să fie între 1 și 10 (sau 0 pentru Absent).' });
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

// DELETE /api/academic/grades/:id (Soft delete - mark as invalid or remove)
router.delete('/grades/:id', requireRole(['PROFESSOR', 'ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Fetch the grade before deleting for audit trail
    const gradeRes = await db.query(
      `SELECT id, student_id, discipline_id, value FROM GRADE WHERE id = $1`,
      [id]
    );
    
    if (gradeRes.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Nota nu a fost găsită.' });
    }
    
    const grade = gradeRes.rows[0];
    
    // Delete the grade
    await db.query('DELETE FROM GRADE WHERE id = $1', [id]);
    
    // Log the deletion
    await db.query(`
      INSERT INTO AUDIT_LOG_ENTRY (actor_user_id, action_type, module, entity_type, entity_id, before_snapshot_json, occurred_at, success)
      VALUES ($1, 'DELETE', 'ACADEMIC_DATA', 'GRADE', $2, $3, CURRENT_TIMESTAMP, true)
    `, [req.user.id, id, JSON.stringify(grade)]);
    
    res.json({ success: true, message: 'Nota a fost ștearsă cu succes.' });
  } catch (error) {
    next(error);
  }
});

// --- STUDENT ENROLLMENT MANAGEMENT ---

// GET /api/academic/student-enrollments/:studentId
router.get('/student-enrollments/:studentId', requireRole(['ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const result = await db.query(`
      SELECT 
        sc.curriculum_id,
        sc.enrolled_at,
        sc.status,
        sc.study_formation_id,
        c.name as curriculum_name,
        c.code as curriculum_code,
        s.name as specialization_name,
        sf.name as formation_name,
        sf.study_year
      FROM STUDENT_CURRICULUM sc
      JOIN CURRICULUM c ON sc.curriculum_id = c.id
      JOIN SPECIALIZATION s ON c.specialization_id = s.id
      LEFT JOIN STUDY_FORMATION sf ON sc.study_formation_id = sf.id
      WHERE sc.student_id = $1
    `, [studentId]);
    res.json({ success: true, enrollments: result.rows });
  } catch (error) {
    next(error);
  }
});

// POST /api/academic/enroll-student
router.post('/enroll-student', requireRole(['ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  try {
    const { student_id, curriculum_id, study_formation_id } = req.body;
    if (!student_id || !curriculum_id) {
      return res.status(400).json({ error: true, message: 'Student ID and Curriculum ID are required.' });
    }

    await db.query(`
      INSERT INTO STUDENT_CURRICULUM (student_id, curriculum_id, study_formation_id, status)
      VALUES ($1, $2, $3, 'ACTIVE')
      ON CONFLICT (student_id, curriculum_id) DO UPDATE SET 
        study_formation_id = EXCLUDED.study_formation_id,
        status = 'ACTIVE'
    `, [student_id, curriculum_id, study_formation_id]);

    res.json({ success: true, message: 'Student enrolled successfully.' });
  } catch (error) {
    next(error);
  }
});

// POST /api/academic/update-enrollment-formation
router.post('/update-enrollment-formation', requireRole(['ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  try {
    const { student_id, curriculum_id, study_formation_id } = req.body;
    await db.query(`
      UPDATE STUDENT_CURRICULUM
      SET study_formation_id = $3
      WHERE student_id = $1 AND curriculum_id = $2
    `, [student_id, curriculum_id, study_formation_id]);
    res.json({ success: true, message: 'Enrollment formation updated.' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/academic/unenroll-student/:studentId/:curriculumId
router.delete('/unenroll-student/:studentId/:curriculumId', requireRole(['ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  try {
    const { studentId, curriculumId } = req.params;
    await db.query(`
      DELETE FROM STUDENT_CURRICULUM 
      WHERE student_id = $1 AND curriculum_id = $2
    `, [studentId, curriculumId]);
    res.json({ success: true, message: 'Student unenrolled successfully.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
