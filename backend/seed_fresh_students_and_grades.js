/**
 * Complete fresh seed: new students + grades
 * Clears existing students and creates new ones with realistic data and grades
 */
const { Client } = require('pg');
const client = new Client({
  host: '79.76.96.223',
  user: 'afsms_app',
  password: '88u9GqwGEsAJ',
  database: 'afsms_db'
});

// Diverse Romanian names for realistic data
const firstNames = [
  // Male names
  'Andrei', 'Alexandru', 'Mihai', 'Cristian', 'Razvan', 'Bogdan', 'Daniel', 'Liviu', 
  'Stefan', 'Adrian', 'Marian', 'Victor', 'Catalin', 'Ionut', 'Florin', 'Cosmin',
  'Denis', 'Radu', 'Pavel', 'Sergei', 'Nikolai', 'Vlad', 'Darius', 'Felix',
  'Gheorghe', 'Dumitru', 'Nicolae', 'Ion', 'Lucian', 'Traian',
  // Female names
  'Maria', 'Elena', 'Ana', 'Ioana', 'Simona', 'Gabriela', 'Laura', 'Diana',
  'Andreea', 'Violeta', 'Claudia', 'Monica', 'Sorina', 'Camelia', 'Alexandra',
  'Raluca', 'Cristina', 'Daniela', 'Roxana', 'Silvia', 'Tatiana', 'Valentina',
  'Irina', 'Nadia', 'Lidia', 'Aurelia', 'Margherita'
];

const lastNames = [
  'Popescu', 'Ionescu', 'Gheorghe', 'Constantin', 'Dumitru', 'Stanescu', 'Marin',
  'Dragomir', 'Tudose', 'Florescu', 'Nicolescu', 'Popa', 'Barbu', 'Serban',
  'Oprea', 'Matei', 'Dima', 'Niculae', 'Dumitrescu', 'Cristea', 'Lungu',
  'Bucur', 'Stan', 'Chirita', 'Badea', 'Neagu', 'Iordache', 'Panait',
  'Marinescu', 'Vasilescu', 'Stoian', 'Moldovan', 'Balan', 'Toma', 'Ene',
  'Gica', 'Nicu', 'Kovacs', 'Szabo', 'Varga', 'Novak', 'Cernat', 'Biro',
  'Blaga', 'Trifan', 'Iacob', 'Iorga', 'Nistor', 'Petrov', 'Miloson'
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateEmail(firstName, lastName, counter) {
  // Make emails unique by appending counter
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${counter}@student.ucv.ro`;
}

async function seed() {
  await client.connect();
  try {
    console.log('🔄 Starting fresh seed...\n');
    await client.query('BEGIN');

    // Get formations
    const fRes = await client.query('SELECT id, code, name FROM STUDY_FORMATION ORDER BY code');
    const formations = fRes.rows;
    console.log(`✓ Found ${formations.length} formations`);

    // Get active academic year
    const yrRes = await client.query('SELECT id FROM ACADEMIC_YEAR WHERE is_active = true LIMIT 1');
    const academicYearId = yrRes.rows[0].id;
    console.log(`✓ Found active academic year`);

    // Get curriculum snapshot
    const snapshotRes = await client.query("SELECT id FROM CURRICULUM_SNAPSHOT WHERE snapshot_status = 'ACTIVE' LIMIT 1");
    const snapshotId = snapshotRes.rows[0]?.id;
    console.log(`✓ Found curriculum snapshot`);

    // Get disciplines
    const discRes = await client.query('SELECT id FROM DISCIPLINE ORDER BY code LIMIT 20');
    const disciplines = discRes.rows;
    console.log(`✓ Found ${disciplines.length} disciplines\n`);

    // Delete all students (cascades to grades)
    await client.query('DELETE FROM STUDENT');
    console.log('🗑️  Cleared existing students\n');

    // Create new students - more diverse distribution
    const newStudents = [];
    let regNumCounter = 1;

    // Generate 2-4 students per formation
    for (const formation of formations) {
      const studentsPerFormation = 2 + Math.floor(Math.random() * 3); // 2-4 students
      for (let i = 0; i < studentsPerFormation; i++) {
        const firstName = getRandomElement(firstNames);
        const lastName = getRandomElement(lastNames);
        const email = generateEmail(firstName, lastName, regNumCounter);
        const regNum = `MAT${String(regNumCounter++).padStart(5, '0')}`;

        newStudents.push({
          registration_number: regNum,
          first_name: firstName,
          last_name: lastName,
          email,
          formation_id: formation.id,
          formation_code: formation.code
        });
      }
    }

    // Insert new students
    for (const student of newStudents) {
      await client.query(
        `INSERT INTO STUDENT (registration_number, first_name, last_name, email, study_formation_id, enrollment_date, status)
         VALUES ($1, $2, $3, $4, $5, NOW(), 'ENROLLED')`,
        [
          student.registration_number,
          student.first_name,
          student.last_name,
          student.email,
          student.formation_id
        ]
      );
    }

    console.log(`✓ Inserted ${newStudents.length} new students\n`);

    // Seed grades for each student
    console.log('📊 Seeding grades...');
    let gradeCount = 0;

    // Get all students (we just inserted)
    const allStudentsRes = await client.query('SELECT id FROM STUDENT ORDER BY registration_number');
    const studentIds = allStudentsRes.rows.map(r => r.id);

    // Assign 5-10 random disciplines to each student with random grades
    for (let i = 0; i < studentIds.length; i++) {
      const studentId = studentIds[i];
      const numDisciplines = 5 + Math.floor(Math.random() * 6); // 5-10 disciplines
      const selectedDisciplines = [];

      // Randomly select disciplines
      for (let j = 0; j < numDisciplines && j < disciplines.length; j++) {
        const randomDisc = getRandomElement(disciplines);
        if (!selectedDisciplines.some(d => d.id === randomDisc.id)) {
          selectedDisciplines.push(randomDisc);
        }
      }

      // Create grades for selected disciplines
      for (const discipline of selectedDisciplines) {
        // 85% chance of having a grade, 15% chance of no grade yet
        if (Math.random() < 0.85) {
          const gradeValue = Math.random() > 0.1 ? (5 + Math.random() * 5) : (0 + Math.random() * 5); // 90% good grades, 10% lower
          const sessions = ['WINTER', 'SUMMER', 'RETAKE'];
          const examSession = sessions[Math.floor(Math.random() * sessions.length)];
          const daysAgo = Math.floor(Math.random() * 120);
          const gradingDate = new Date();
          gradingDate.setDate(gradingDate.getDate() - daysAgo);
          const validated = Math.random() > 0.3; // 70% validated, 30% pending

          try {
            await client.query(`
              INSERT INTO GRADE (
                student_id, discipline_id, academic_year_id, curriculum_snapshot_id,
                value, exam_session, validated, grading_date, source, graded_by_user_id
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'MANUAL', NULL)
            `, [
              studentId,
              discipline.id,
              academicYearId,
              snapshotId,
              Math.round(gradeValue * 100) / 100, // Round to 2 decimals
              examSession,
              validated,
              gradingDate.toISOString().split('T')[0]
            ]);
            gradeCount++;
          } catch (e) {
            // Ignore constraint errors
          }
        }
      }

      if ((i + 1) % 10 === 0) process.stdout.write('.');
    }

    console.log(`\n✓ Created ${gradeCount} grades\n`);

    await client.query('COMMIT');

    // Final verification
    const studentCountRes = await client.query('SELECT COUNT(*) as total FROM STUDENT');
    const gradeCountRes = await client.query('SELECT COUNT(*) as total FROM GRADE');

    console.log('✅ SEED COMPLETE');
    console.log(`   Students: ${studentCountRes.rows[0].total}`);
    console.log(`   Grades: ${gradeCountRes.rows[0].total}\n`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', err.message);
    console.error(err.stack);
  } finally {
    await client.end();
  }
}

seed();
