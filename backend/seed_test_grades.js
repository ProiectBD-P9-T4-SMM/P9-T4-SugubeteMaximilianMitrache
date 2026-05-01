const { Client } = require('pg');

async function seedTestGrades() {
  const client = new Client({
    host: "79.76.96.223",
    user: "afsms_app",
    password: "88u9GqwGEsAJ",
    database: "afsms_db"
  });

  try {
    await client.connect();
    console.log('Connected. Seeding test grades...\n');

    // Get data
    const studRes = await client.query('SELECT id FROM STUDENT ORDER BY RANDOM() LIMIT 15');
    const discRes = await client.query('SELECT id FROM DISCIPLINE LIMIT 5');
    const yrRes = await client.query('SELECT id FROM ACADEMIC_YEAR WHERE is_active = true LIMIT 1');

    const studentIds = studRes.rows.map(r => r.id);
    const disciplineIds = discRes.rows.map(r => r.id);
    const academicYearId = yrRes.rows[0].id;

    console.log(`Seeding ${studentIds.length} students × ${disciplineIds.length} disciplines\n`);

    let count = 0;
    for (let i = 0; i < studentIds.length; i++) {
      for (let j = 0; j < disciplineIds.length; j++) {
        const grade = 5 + Math.floor(Math.random() * 5);
        const sessions = ['IARNA', 'VARA', 'RESTANTA'];
        const examSession = sessions[Math.floor(Math.random() * 3)];
        const daysAgo = Math.floor(Math.random() * 60);
        const gradingDate = new Date();
        gradingDate.setDate(gradingDate.getDate() - daysAgo);

        try {
          await client.query(`
            INSERT INTO GRADE (
              student_id, discipline_id, academic_year_id,
              value, exam_session, validated, grading_date, source
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'MANUAL')
          `, [
            studentIds[i],
            disciplineIds[j],
            academicYearId,
            grade,
            examSession,
            Math.random() > 0.25,
            gradingDate.toISOString().split('T')[0]
          ]);
          count++;
        } catch (e) {
          // Ignore duplicates or constraint errors
        }
      }
      if ((i + 1) % 5 === 0) process.stdout.write('.');
    }

    console.log(`\n\n✅ Seeded ${count} grades\n`);

    const verifyRes = await client.query('SELECT COUNT(*) as total FROM GRADE');
    console.log(`Total grades in DB: ${verifyRes.rows[0].total}`);

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

seedTestGrades();
