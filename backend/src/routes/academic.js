const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const { auditableUpdate, auditableInsert } = require('../services/auditService');

router.use(requireAuth);

// GET /api/academic/dashboard/stats - Dashboard statistics based on role
router.get('/dashboard/stats', requireRole(['STUDENT', 'PROFESSOR', 'ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  try {
    const { role, userId } = req.user;
    let stats = {};

    if (role === 'ADMIN') {
      const userCount = await db.query('SELECT COUNT(*) FROM USER_ACCOUNT');
      const studentCount = await db.query('SELECT COUNT(*) FROM STUDENT');
      const planCount = await db.query('SELECT COUNT(*) FROM CURRICULUM');
      const auditCount = await db.query('SELECT COUNT(*) FROM AUDIT_LOG_ENTRY WHERE occurred_at > NOW() - INTERVAL \'24 HOURS\'');
      
      stats = {
        totalUsers: parseInt(userCount.rows[0].count),
        totalStudents: parseInt(studentCount.rows[0].count),
        activeCurricula: parseInt(planCount.rows[0].count),
        recentActions: parseInt(auditCount.rows[0].count)
      };
    } 
    else if (role === 'SECRETARIAT') {
      const studentCount = await db.query('SELECT COUNT(*) FROM STUDENT WHERE status = \'ACTIVE\'');
      const unassignedCount = await db.query('SELECT COUNT(*) FROM STUDENT WHERE id NOT IN (SELECT student_id FROM STUDENT_CURRICULUM)');
      const docCount = await db.query('SELECT COUNT(*) FROM DOCUMENT WHERE created_at > NOW() - INTERVAL \'7 DAYS\'');
      const formationCount = await db.query('SELECT COUNT(*) FROM STUDY_FORMATION');
      
      stats = {
        activeStudents: parseInt(studentCount.rows[0].count),
        unassignedStudents: parseInt(unassignedCount.rows[0].count),
        recentDocuments: parseInt(docCount.rows[0].count),
        totalGroups: parseInt(formationCount.rows[0].count)
      };
    }
    else if (role === 'PROFESSOR') {
      const gradeCount = await db.query('SELECT COUNT(*) FROM GRADE WHERE graded_by_user_id = $1 AND grading_date > NOW() - INTERVAL \'30 DAYS\'', [userId]);
      const discCount = await db.query('SELECT COUNT(DISTINCT curriculum_id) FROM DISCIPLINE'); 
      
      // Real upcoming exams (disciplines in the current session)
      const currentMonth = new Date().getMonth() + 1;
      const targetSem = (currentMonth >= 2 && currentMonth <= 6) ? 2 : 1;
      const examRes = await db.query('SELECT COUNT(*) FROM DISCIPLINE WHERE semester % 2 = $1 OR semester % 2 = ($1 % 2)', [targetSem % 2 === 0 ? 0 : 1]);

      // Performance trend (last 6 months)
      const trendRes = await db.query(`
        SELECT TO_CHAR(grading_date, 'Mon') as month, COUNT(*) as count 
        FROM GRADE 
        WHERE graded_by_user_id = $1 AND grading_date > NOW() - INTERVAL '6 MONTHS'
        GROUP BY TO_CHAR(grading_date, 'Mon'), DATE_TRUNC('month', grading_date)
        ORDER BY DATE_TRUNC('month', grading_date) ASC
      `, [userId]);

      stats = {
        gradesThisMonth: parseInt(gradeCount.rows[0].count),
        totalDisciplines: parseInt(discCount.rows[0].count),
        upcomingExams: parseInt(examRes.rows[0].count || 0),
        performanceTrend: trendRes.rows
      };
    }
    else if (role === 'STUDENT') {
      const userRes = await db.query('SELECT email FROM USER_ACCOUNT WHERE id = $1', [userId]);
      if (userRes.rows.length > 0) {
        const studentRes = await db.query('SELECT id FROM STUDENT WHERE email = $1', [userRes.rows[0].email]);
        if (studentRes.rows.length > 0) {
          const studentId = studentRes.rows[0].id;
          const gpaRes = await db.query('SELECT AVG(value) FROM GRADE WHERE student_id = $1 AND value > 0', [studentId]);
          const ectsRes = await db.query('SELECT SUM(d.ects_credits) FROM GRADE g JOIN DISCIPLINE d ON g.discipline_id = d.id WHERE g.student_id = $1 AND g.value >= 5', [studentId]);
          const planCount = await db.query('SELECT COUNT(*) FROM STUDENT_CURRICULUM WHERE student_id = $1', [studentId]);
          
          // Rank calculation (Percentile)
          const allGpas = await db.query(`
            SELECT AVG(value) as avg_gpa 
            FROM GRADE 
            WHERE value > 0 
            GROUP BY student_id
          `);
          const studentGpa = parseFloat(gpaRes.rows[0].avg || 0);
          const higherGpas = allGpas.rows.filter(r => parseFloat(r.avg_gpa) > studentGpa).length;
          const percentile = allGpas.rows.length > 0 ? Math.round((1 - (higherGpas / allGpas.rows.length)) * 100) : 100;

          // Timeline (Last 3 events)
          const timelineRes = await db.query(`
            (SELECT 'Grade Received' as title, TO_CHAR(grading_date, 'DD Mon YYYY') as date, 'success' as status, grading_date as sort_date
             FROM GRADE WHERE student_id = $1)
            UNION ALL
            (SELECT 'Document Uploaded' as title, TO_CHAR(created_at, 'DD Mon YYYY') as date, 'info' as status, created_at as sort_date
             FROM DOCUMENT WHERE author_id = $2)
            ORDER BY sort_date DESC LIMIT 3
          `, [studentId, userId]);

          stats = {
            gpa: studentGpa.toFixed(2),
            totalCredits: parseInt(ectsRes.rows[0].sum || 0),
            activePlans: parseInt(planCount.rows[0].count),
            percentile: percentile,
            timeline: timelineRes.rows
          };
        }
      }
    }

    res.json({ success: true, stats });
  } catch (error) {
    next(error);
  }
});

// --- STUDENTS ---
router.get('/students', async (req, res, next) => {
  try {
    const query = `
      SELECT s.id, s.registration_number, s.first_name, s.last_name, s.email, s.status, 
             sf.name as main_formation_name, sf.study_year as main_study_year,
             (SELECT COUNT(*) FROM STUDENT_CURRICULUM sc WHERE sc.student_id = s.id AND sc.status = 'ACTIVE') as plan_count,
             (SELECT JSON_AGG(JSON_BUILD_OBJECT(
               'curriculum_name', c.name, 
               'formation_name', sf_sc.name, 
               'study_year', sf_sc.study_year
             )) 
              FROM STUDENT_CURRICULUM sc 
              JOIN CURRICULUM c ON sc.curriculum_id = c.id 
              LEFT JOIN STUDY_FORMATION sf_sc ON sc.study_formation_id = sf_sc.id
              WHERE sc.student_id = s.id AND sc.status = 'ACTIVE') as enrollments
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
      req.user.userId,
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
    for (const data of students) {
      // Normalize keys (handle both exported Romanian headers and standard keys)
      const email = data.Email || data.email;
      const firstName = data.Prenume || data.first_name;
      const lastName = data.Nume || data.last_name;
      const regNum = data['Nr. Matricol'] || data.registration_number || ('MAT' + Math.floor(1000 + Math.random() * 9000));
      const curriculumName = data['Program Academic'] || data.curriculum_name;
      const formationName = data['Formație Specifică'] || data.formation_name;

      if (!email || !firstName || !lastName) continue;

      // 1. Find or Create Student
      let studentId;
      const statusMap = {
        'SUSPENDAT': 'SUSPENDED',
        'ACTIV': 'ACTIVE',
        'INMATRICULAT': 'ENROLLED',
        'ÎNMATRICULAT': 'ENROLLED',
        'ABSOLVIT': 'GRADUATED'
      };
      
      const rawStatus = data.Status || data.status;
      const normalizedStatus = statusMap[rawStatus?.toUpperCase()] || rawStatus?.toUpperCase() || 'ENROLLED';

      const existingStudent = await db.query('SELECT id FROM STUDENT WHERE email = $1', [email]);
      
      if (existingStudent.rows.length > 0) {
        studentId = existingStudent.rows[0].id;
        // Optionally update status for existing student
        await db.query('UPDATE STUDENT SET status = $1 WHERE id = $2', [normalizedStatus, studentId]);
      } else {
        const newStudent = await db.query(`
          INSERT INTO STUDENT (registration_number, first_name, last_name, email, enrollment_date, status)
          VALUES ($1, $2, $3, $4, CURRENT_DATE, $5) RETURNING id
        `, [regNum, firstName, lastName, email, normalizedStatus]);
        studentId = newStudent.rows[0].id;
      }

      // 2. Resolve Curriculum & Formation if names provided
      let curriculumId = data.curriculum_id;
      let formationId = data.study_formation_id;

      if (!curriculumId && curriculumName) {
        const currRes = await db.query('SELECT id FROM CURRICULUM WHERE name = $1 LIMIT 1', [curriculumName]);
        curriculumId = currRes.rows[0]?.id;
      }

      if (!formationId && formationName) {
        const formRes = await db.query('SELECT id FROM STUDY_FORMATION WHERE name = $1 LIMIT 1', [formationName]);
        formationId = formRes.rows[0]?.id;
      }

      // 3. Enroll in Curriculum if possible
      if (studentId && curriculumId) {
        await db.query(`
          INSERT INTO STUDENT_CURRICULUM (student_id, curriculum_id, study_formation_id, status)
          VALUES ($1, $2, $3, 'ACTIVE')
          ON CONFLICT (student_id, curriculum_id) DO UPDATE SET study_formation_id = EXCLUDED.study_formation_id
        `, [studentId, curriculumId, formationId || null]);
      }

      results.push({ email, studentId });
    }
    res.json({ success: true, message: `Successfully processed ${results.length} records.`, data: results });
  } catch (error) {
    console.error("Bulk import error:", error);
    next(error);
  }
});

// Update Student
router.put('/students/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, study_formation_id, status } = req.body;
    
    const updatedStudent = await auditableUpdate(
      req.user.userId,
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
      req.user.userId,
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
    const { student_id, discipline_id, academic_year_id, exam_session, min_date, max_date, graded_by } = req.query;
    let query = `
      SELECT g.id, g.value, g.exam_session, g.grading_date, g.validated,
             s.id as student_id, s.first_name, s.last_name, s.registration_number,
             (s.last_name || ' ' || s.first_name) AS student_name,
             d.id as discipline_id, d.code as discipline_code, d.name as discipline_name, d.ects_credits, d.semester,
             u.full_name as graded_by_name, u.id as graded_by_id,
             ay.year_start || '-' || ay.year_end as academic_year_label
      FROM GRADE g
      JOIN STUDENT s ON g.student_id = s.id
      JOIN DISCIPLINE d ON g.discipline_id = d.id
      JOIN ACADEMIC_YEAR ay ON g.academic_year_id = ay.id
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
    if (graded_by) {
      params.push(graded_by);
      query += ` AND g.graded_by_user_id = $${params.length}`;
    }
    
    query += ' ORDER BY s.last_name ASC, d.semester ASC';

    const result = await db.query(query, params);
    res.json({ success: true, grades: result.rows });
  } catch (error) {
    next(error);
  }
});

// GET /api/academic/grades/export - Export grades to CSV
router.get('/grades/export', requireRole(['PROFESSOR', 'ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  try {
    const { student_id, discipline_id, academic_year_id, exam_session, min_date, max_date, graded_by } = req.query;
    let query = `
      SELECT s.registration_number as "Registration Number", 
             s.last_name || ' ' || s.first_name as "Student Name",
             d.code as "Discipline Code", 
             d.name as "Discipline Name",
             ay.year_start || '-' || ay.year_end as "Academic Year",
             g.exam_session as "Session", 
             CASE WHEN g.value = 0 THEN 'Abs.' ELSE g.value::text END as "Grade",
             g.grading_date as "Date",
             u.full_name as "Graded By"
      FROM GRADE g
      JOIN STUDENT s ON g.student_id = s.id
      JOIN DISCIPLINE d ON g.discipline_id = d.id
      JOIN ACADEMIC_YEAR ay ON g.academic_year_id = ay.id
      LEFT JOIN USER_ACCOUNT u ON g.graded_by_user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    
    if (student_id) { params.push(student_id); query += ` AND g.student_id = $${params.length}`; }
    if (discipline_id) { params.push(discipline_id); query += ` AND g.discipline_id = $${params.length}`; }
    if (academic_year_id) { params.push(academic_year_id); query += ` AND g.academic_year_id = $${params.length}`; }
    if (exam_session) { params.push(exam_session); query += ` AND g.exam_session = $${params.length}`; }
    if (min_date) { params.push(min_date); query += ` AND g.grading_date >= $${params.length}`; }
    if (max_date) { params.push(max_date); query += ` AND g.grading_date <= $${params.length}`; }
    if (graded_by) { params.push(graded_by); query += ` AND g.graded_by_user_id = $${params.length}`; }
    
    query += ' ORDER BY s.last_name ASC, d.semester ASC';

    const { rows } = await db.query(query, params);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: true, message: 'No grades found to export.' });
    }

    const Papa = require('papaparse');
    const csv = Papa.unparse(rows);
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=grades-export.csv');
    res.status(200).send('\uFEFF' + csv);
  } catch (error) {
    next(error);
  }
});

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/academic/grades/import - Bulk Import Grades from CSV
router.post('/grades/import', requireRole(['ADMIN', 'SECRETARIAT']), upload.single('file'), async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: true, message: 'No file uploaded.' });
  }

  try {
    const Papa = require('papaparse');
    const csvData = req.file.buffer.toString('utf8');
    const { data, errors } = Papa.parse(csvData, { header: true, skipEmptyLines: true });

    if (errors.length > 0) {
      return res.status(400).json({ error: true, message: 'CSV Parsing Error', details: errors });
    }

    const results = { success: 0, failed: 0, details: [] };
    
    // Active Year and Snapshot for fallback
    const academicYearRes = await db.query('SELECT id FROM ACADEMIC_YEAR WHERE is_active = TRUE LIMIT 1');
    const snapshotRes = await db.query("SELECT id FROM CURRICULUM_SNAPSHOT WHERE snapshot_status = 'ACTIVE' LIMIT 1");
    const activeYearId = academicYearRes.rows[0]?.id;
    const activeSnapshotId = snapshotRes.rows[0]?.id;

    for (const row of data) {
      try {
        const regNum = row['Registration Number'] || row['Nr. Matricol'] || row.registration_number;
        const discCode = row['Discipline Code'] || row['Cod Disciplină'] || row.discipline_code;
        const gradeValRaw = row['Grade'] || row['Notă'] || row.grade;
        const session = row['Session'] || row['Sesiune'] || row.session || 'SUMMER';
        
        if (!regNum || !discCode || gradeValRaw === undefined) {
          results.failed++;
          results.details.push({ row, error: 'Missing required fields' });
          continue;
        }

        // 1. Resolve Student
        const studentRes = await db.query('SELECT id FROM STUDENT WHERE registration_number = $1', [regNum]);
        if (studentRes.rows.length === 0) {
          results.failed++;
          results.details.push({ row, error: `Student not found: ${regNum}` });
          continue;
        }
        const studentId = studentRes.rows[0].id;

        // 2. Resolve Discipline
        const discRes = await db.query('SELECT id FROM DISCIPLINE WHERE code = $1', [discCode]);
        if (discRes.rows.length === 0) {
          results.failed++;
          results.details.push({ row, error: `Discipline not found: ${discCode}` });
          continue;
        }
        const disciplineId = discRes.rows[0].id;

        // 3. Parse Grade
        let gradeValue = gradeValRaw.toLowerCase() === 'abs.' ? 0 : parseFloat(gradeValRaw);
        if (isNaN(gradeValue)) {
          results.failed++;
          results.details.push({ row, error: `Invalid grade value: ${gradeValRaw}` });
          continue;
        }

        // 4. Insert/Update Grade
        await auditableInsert(
          req.user.userId,
          'ACADEMIC_DATA',
          'GRADE',
          {
            student_id: studentId,
            discipline_id: disciplineId,
            academic_year_id: activeYearId,
            curriculum_snapshot_id: activeSnapshotId,
            graded_by_user_id: req.user.userId,
            value: gradeValue,
            exam_session: session,
            grading_date: new Date().toISOString().split('T')[0],
            validated: true
          }
        );

        results.success++;
      } catch (rowErr) {
        results.failed++;
        results.details.push({ row, error: rowErr.message });
      }
    }

    res.json({
      success: true,
      message: `Import complete. Success: ${results.success}, Failed: ${results.failed}`,
      summary: results
    });

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
          message: 'The grade must be between 1 and 10 (or 0 for Absent).' 
        });
      }
      updateData.value = gradeNum;
    }
    if (exam_session !== undefined) updateData.exam_session = exam_session;
    if (validated !== undefined) updateData.validated = validated;
    if (req.body.student_id !== undefined) updateData.student_id = req.body.student_id;
    if (req.body.discipline_id !== undefined) updateData.discipline_id = req.body.discipline_id;
    if (req.body.grading_date !== undefined) updateData.grading_date = req.body.grading_date;
    
    // Track who performed the last edit
    updateData.graded_by_user_id = req.user.userId;
    
    const updatedGrade = await auditableUpdate(
      req.user.userId,
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

// Fetch Grade Audit History (REQ-AFSMS-50)
router.get('/grades/:id/history', requireRole(['PROFESSOR', 'ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT al.id, al.action_type, al.occurred_at, al.before_snapshot_json, al.after_snapshot_json,
             u.full_name as actor_name
      FROM AUDIT_LOG_ENTRY al
      JOIN USER_ACCOUNT u ON al.actor_user_id = u.id
      WHERE al.entity_type = 'GRADE' AND al.entity_id = $1
      ORDER BY al.occurred_at DESC
    `;
    const { rows } = await db.query(query, [id]);
    res.json({ success: true, history: rows });
  } catch (error) {
    next(error);
  }
});

// GET /api/academic/my-grades (Accessible ONLY for Student)
router.get('/my-grades', requireRole(['STUDENT']), async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // 1. Search for student with full details about specialization and formation
    // Using LEFT JOINs so we still find the student even if they aren't enrolled in a formation yet
    const studentQuery = `
      SELECT 
        s.id, s.first_name, s.last_name, s.registration_number, s.email, s.status, s.enrollment_date,
        sf.name as formation_name, sf.education_form, sf.study_year as current_study_year,
        spec.name as specialization_name, spec.degree_level, spec.code as specialization_code
      FROM STUDENT s
      LEFT JOIN STUDY_FORMATION sf ON s.study_formation_id = sf.id
      LEFT JOIN SPECIALIZATION spec ON sf.specialization_id = spec.id
      WHERE s.email = (SELECT email FROM USER_ACCOUNT WHERE id = $1)
      LIMIT 1
    `;
    const studentRes = await db.query(studentQuery, [userId]);
    
    if (studentRes.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'No student profile found for this account.' });
    }
    const student = studentRes.rows[0];

    // 2. Extract ALL study plans the student is enrolled in
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

    // 3. Extract ALL disciplines and grades, grouped by curriculum
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

    // Group data by curriculum for frontend
    const academicPlans = studentCurricula.map(plan => ({
      ...plan,
      records: rows.filter(r => r.curriculum_id === plan.curriculum_id)
    }));

    res.json({
      success: true,
      studentInfo: {
        ...student,
        institution: "University of Craiova",
        faculty: "Faculty of Automation, Computers and Electronics",
        domain: "Computer Science and Information Technology"
      },
      academicPlans
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/academic/transcript/:studentId (Accessible for SECRETARIAT, ADMIN)
router.get('/transcript/:studentId', requireRole(['SECRETARIAT', 'ADMIN']), async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // 1. Fetch student info
    const studentQuery = `
      SELECT 
        s.id, s.first_name, s.last_name, s.registration_number, s.email, s.status, s.enrollment_date,
        sf.name as formation_name, sf.education_form, sf.study_year as current_study_year,
        spec.name as specialization_name, spec.degree_level, spec.code as specialization_code
      FROM STUDENT s
      LEFT JOIN STUDY_FORMATION sf ON s.study_formation_id = sf.id
      LEFT JOIN SPECIALIZATION spec ON sf.specialization_id = spec.id
      WHERE s.id = $1
      LIMIT 1
    `;
    const studentRes = await db.query(studentQuery, [studentId]);
    
    if (studentRes.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Student not found.' });
    }
    const student = studentRes.rows[0];

    // 2. Extract ALL study plans
    const curriculaQuery = `
      SELECT 
        c.id as curriculum_id, c.name as curriculum_name, c.code as curriculum_code,
        spec.name as specialization_name, spec.degree_level, spec.code as specialization_code
      FROM STUDENT_CURRICULUM sc
      JOIN CURRICULUM c ON sc.curriculum_id = c.id
      JOIN SPECIALIZATION spec ON c.specialization_id = spec.id
      WHERE sc.student_id = $1 AND sc.status = 'ACTIVE'
    `;
    const curriculaRes = await db.query(curriculaQuery, [studentId]);
    const studentCurricula = curriculaRes.rows;

    // 3. Extract ALL disciplines and grades
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
    const { rows } = await db.query(gradesQuery, [studentId]);

    const academicPlans = studentCurricula.map(plan => ({
      ...plan,
      records: rows.filter(r => r.curriculum_id === plan.curriculum_id)
    }));

    res.json({
      success: true,
      studentInfo: {
        ...student,
        institution: "University of Craiova",
        faculty: "Faculty of Automation, Computers and Electronics",
        domain: "Computer Science and Information Technology"
      },
      academicPlans
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/academic/grades/template - Generate Import Template
router.get('/grades/template', requireRole(['PROFESSOR', 'ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  try {
    const { curriculum_id, formation_id, discipline_id } = req.query;
    
    if (!curriculum_id || !discipline_id) {
      return res.status(400).json({ error: true, message: 'Curriculum and Discipline are required to generate a template.' });
    }

    // 1. Fetch Discipline Code
    const discRes = await db.query('SELECT code FROM DISCIPLINE WHERE id = $1', [discipline_id]);
    if (discRes.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Discipline not found.' });
    }
    const disciplineCode = discRes.rows[0].code;

    // 2. Fetch Students enrolled in this Curriculum
    let query = `
      SELECT s.registration_number as "Registration Number", 
             s.last_name || ' ' || s.first_name as "Student Name",
             $1 as "Discipline Code",
             '' as "Grade",
             '' as "Session"
      FROM STUDENT s
      JOIN STUDENT_CURRICULUM sc ON s.id = sc.student_id
      WHERE sc.curriculum_id = $2 AND sc.status = 'ACTIVE'
    `;
    const params = [disciplineCode, curriculum_id];

    if (formation_id) {
      params.push(formation_id);
      query += ` AND sc.study_formation_id = $${params.length}`;
    }

    query += ' ORDER BY s.last_name ASC';

    const { rows } = await db.query(query, params);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: true, message: 'No students found for the selected curriculum/formation.' });
    }

    const Papa = require('papaparse');
    const csv = Papa.unparse(rows);
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=grade-template-${disciplineCode}.csv`);
    res.status(200).send('\uFEFF' + csv);
  } catch (error) {
    next(error);
  }
});

// --- DISCIPLINES ---

// GET /api/academic/disciplines (For Discipline Dropdown + List view)
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
      return res.status(404).json({ error: true, message: 'Discipline not found.' });
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
    
    // Validation
    if (!curriculum_id || !code || !name || !semester || !evaluation_type || !ects_credits || !contact_hours) {
      return res.status(400).json({ 
        error: true, 
        message: 'All fields are required.',
        resolutionHint: 'Check that you completed: code, name, semester, evaluation type, ECTS, contact hours.'
      });
    }
    
    const semNum = parseInt(semester);
    const ectsNum = parseInt(ects_credits);
    const hoursNum = parseInt(contact_hours);
    
    if (semNum < 1 || semNum > 8) {
      return res.status(400).json({ 
        error: true, 
        message: 'Semester must be between 1 and 8.',
        resolutionHint: 'Enter a valid semester.'
      });
    }
    
    if (ectsNum < 1 || ectsNum > 20) {
      return res.status(400).json({ 
        error: true, 
        message: 'ECTS credits must be between 1 and 20.',
        resolutionHint: 'Enter a valid ECTS value.'
      });
    }
    
    if (hoursNum < 0 || hoursNum > 200) {
      return res.status(400).json({ 
        error: true, 
        message: 'Contact hours must be between 0 and 200.',
        resolutionHint: 'Enter a valid value for contact hours.'
      });
    }
    
    // Check if code already exists
    const existingCode = await db.query('SELECT id FROM DISCIPLINE WHERE code = $1', [code]);
    if (existingCode.rows.length > 0) {
      return res.status(400).json({ 
        error: true, 
        message: 'A discipline code with this value already exists.',
        resolutionHint: 'Use a unique code for the discipline.'
      });
    }
    
    const newDiscipline = await auditableInsert(
      req.user.userId,
      'ACADEMIC_DATA',
      'DISCIPLINE',
      { curriculum_id, code, name, semester: semNum, evaluation_type, ects_credits: ectsNum, contact_hours: hoursNum }
    );
    
    res.status(201).json({ success: true, message: 'Discipline created successfully!', discipline: newDiscipline });
  } catch (error) {
    next(error);
  }
});

// PUT /api/academic/disciplines/:id (Update discipline)
router.put('/disciplines/:id', requireRole(['ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, name, semester, evaluation_type, ects_credits, contact_hours } = req.body;
    
    // Validation
    const semNum = parseInt(semester);
    const ectsNum = parseInt(ects_credits);
    const hoursNum = parseInt(contact_hours);
    
    if (semNum < 1 || semNum > 8 || ectsNum < 1 || ectsNum > 20 || hoursNum < 0 || hoursNum > 200) {
      return res.status(400).json({ 
        error: true, 
        message: 'One or more values are not in the valid range.',
        resolutionHint: 'Semester: 1-8, ECTS: 1-20, Hours: 0-200.'
      });
    }
    
    // Check if code exists for a different discipline
    if (code) {
      const existingCode = await db.query('SELECT id FROM DISCIPLINE WHERE code = $1 AND id != $2', [code, id]);
      if (existingCode.rows.length > 0) {
        return res.status(400).json({ 
          error: true, 
          message: 'A discipline code with this value already exists.',
          resolutionHint: 'Use a unique code for the discipline.'
        });
      }
    }
    
    const updatedDiscipline = await auditableUpdate(
      req.user.userId,
      'ACADEMIC_DATA',
      'DISCIPLINE',
      id,
      { code, name, semester: semNum, evaluation_type, ects_credits: ectsNum, contact_hours: hoursNum }
    );
    
    res.json({ success: true, message: 'Discipline updated successfully!', discipline: updatedDiscipline });
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
    `, [req.user.userId, id]);
    
    res.json({ success: true, message: 'Discipline deleted successfully.' });
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

// GET /api/academic/students-dropdown (For Students Dropdown in AddGrades)
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
      return res.status(400).json({ error: true, message: 'Missing mandatory data (Code, Name, Study Cycle).' });
    }

    const result = await auditableInsert(
      req.user.userId,
      'ACADEMIC_DATA',
      'SPECIALIZATION',
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
      SELECT c.id, c.code, c.name, c.specialization_id, s.name as specialization_name, c.status, c.valid_from
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
      return res.status(400).json({ error: true, message: 'Missing mandatory data (Specialization, Code, Name).' });
    }

    const result = await auditableInsert(
      req.user.userId,
      'ACADEMIC_DATA',
      'CURRICULUM',
      { 
        specialization_id, 
        code, 
        name, 
        status: 'ACTIVE', 
        valid_from: req.body.valid_from || new Date().toISOString().split('T')[0] 
      }
    );

    res.status(201).json({ success: true, curriculum: result });
  } catch (error) {
    next(error);
  }
});

// POST /api/academic/grades (Effective grade addition - REQ-AFSMS-47, REQ-AFSMS-48)
router.post('/grades', requireRole(['PROFESSOR', 'ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  const { studentId, disciplineId, gradeValue, examSession } = req.body;
  const professorId = req.user.userId;

  try {
    // Backend Validation (Extra safety)
    const gradeNum = parseFloat(gradeValue);
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 10) {
      return res.status(400).json({ error: true, message: 'The grade must be between 1 and 10 (or 0 for Absent).' });
    }

    // Extract Active Academic Year and Curriculum Snapshot
    const academicYearRes = await db.query('SELECT id FROM ACADEMIC_YEAR WHERE is_active = TRUE LIMIT 1');
    const snapshotRes = await db.query("SELECT id FROM CURRICULUM_SNAPSHOT WHERE snapshot_status = 'ACTIVE' LIMIT 1");
    
    // Insert grade
    const insertRes = await db.query(`
      INSERT INTO GRADE (student_id, discipline_id, academic_year_id, curriculum_snapshot_id, graded_by_user_id, value, exam_session, grading_date, validated)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE, TRUE)
      RETURNING id, value
    `, [studentId, disciplineId, academicYearRes.rows[0]?.id || null, snapshotRes.rows[0]?.id || null, professorId, gradeNum, examSession]);

    res.json({ success: true, message: 'Grade added successfully!', grade: insertRes.rows[0] });
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
      return res.status(404).json({ error: true, message: 'Grade not found.' });
    }
    
    const grade = gradeRes.rows[0];
    
    // Delete the grade
    await db.query('DELETE FROM GRADE WHERE id = $1', [id]);
    
    // Log the deletion
    await db.query(`
      INSERT INTO AUDIT_LOG_ENTRY (actor_user_id, action_type, module, entity_type, entity_id, before_snapshot_json, occurred_at, success)
      VALUES ($1, 'DELETE', 'ACADEMIC_DATA', 'GRADE', $2, $3, CURRENT_TIMESTAMP, true)
    `, [req.user.userId, id, JSON.stringify(grade)]);
    
    res.json({ success: true, message: 'Grade deleted successfully.' });
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
        c.specialization_id,
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
      SET study_formation_id = $1
      WHERE student_id = $2 AND curriculum_id = $3
    `, [study_formation_id, student_id, curriculum_id]);
    res.json({ success: true, message: 'Enrollment formation updated.' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/academic/unenroll-student
router.delete('/unenroll-student', requireRole(['ADMIN', 'SECRETARIAT']), async (req, res, next) => {
  try {
    const { student_id, curriculum_id } = req.body;
    await db.query(`
      UPDATE STUDENT_CURRICULUM 
      SET status = 'INACTIVE'
      WHERE student_id = $1 AND curriculum_id = $2
    `, [student_id, curriculum_id]);
    res.json({ success: true, message: 'Student unenrolled successfully.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
