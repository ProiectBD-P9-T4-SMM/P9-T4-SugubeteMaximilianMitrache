const db = require('../db');

/**
 * Bulk import students from JSON data (parsed from Excel/CSV)
 * Expected fields: last_name, first_name, email, registration_number (optional), status (optional)
 */
async function importStudents(students, actorId) {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    
    let imported = 0;
    let rejected = 0;
    const errors = [];

    for (const student of students) {
      try {
        // Validation
        if (!student.last_name || !student.first_name || !student.email) {
          throw new Error('Missing required fields (name, email)');
        }

        // Generate registration number if not provided
        const regNum = student.registration_number || `REG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const res = await client.query(
          `INSERT INTO STUDENT (first_name, last_name, email, registration_number, status) 
           VALUES ($1, $2, $3, $4, $5) 
           ON CONFLICT (registration_number) DO NOTHING
           RETURNING id`,
          [student.first_name, student.last_name, student.email, regNum, student.status || 'ENROLLED']
        );

        if (res.rows.length > 0) {
          imported++;
        } else {
          rejected++;
          errors.push(`Student with registration number ${regNum} already exists.`);
        }
      } catch (err) {
        rejected++;
        errors.push(`Error importing ${student.last_name}: ${err.message}`);
      }
    }

    await client.query('COMMIT');
    return { imported, rejected, errors };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Bulk import grades
 * Expected fields: registration_number, discipline_code, value, exam_session, grading_date, academic_year_code
 */
async function importGrades(grades, actorId) {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    
    let imported = 0;
    let rejected = 0;
    const errors = [];

    for (const grade of grades) {
      try {
        // 1. Find Student
        const studentRes = await client.query('SELECT id FROM STUDENT WHERE registration_number = $1', [grade.registration_number]);
        if (studentRes.rows.length === 0) throw new Error(`Student ${grade.registration_number} not found.`);
        const studentId = studentRes.rows[0].id;

        // 2. Find Discipline
        const disciplineRes = await client.query('SELECT id FROM DISCIPLINE WHERE code = $1', [grade.discipline_code]);
        if (disciplineRes.rows.length === 0) throw new Error(`Discipline ${grade.discipline_code} not found.`);
        const disciplineId = disciplineRes.rows[0].id;

        // 3. Find Academic Year
        const ayRes = await client.query('SELECT id FROM ACADEMIC_YEAR WHERE code = $1', [grade.academic_year_code]);
        if (ayRes.rows.length === 0) throw new Error(`Academic year ${grade.academic_year_code} not found.`);
        const ayId = ayRes.rows[0].id;

        // 4. Insert Grade
        await client.query(
          `INSERT INTO GRADE (student_id, discipline_id, academic_year_id, value, exam_session, grading_date, graded_by_user_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            studentId, 
            disciplineId, 
            ayId, 
            grade.value, 
            grade.exam_session || 'WINTER', 
            grade.grading_date || new Date(),
            actorId
          ]
        );
        imported++;
      } catch (err) {
        rejected++;
        errors.push(`Row ${imported + rejected}: ${err.message}`);
      }
    }

    await client.query('COMMIT');
    return { imported, rejected, errors };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  importStudents,
  importGrades
};
