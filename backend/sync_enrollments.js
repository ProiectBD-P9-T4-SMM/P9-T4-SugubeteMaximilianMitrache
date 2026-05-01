require('dotenv').config();
const db = require('./src/db');

async function sync() {
  try {
    console.log('Synchronizing student enrollments based on their grades...');
    const res = await db.query(`
      INSERT INTO STUDENT_CURRICULUM (student_id, curriculum_id)
      SELECT DISTINCT g.student_id, d.curriculum_id
      FROM GRADE g
      JOIN DISCIPLINE d ON g.discipline_id = d.id
      ON CONFLICT (student_id, curriculum_id) DO NOTHING
      RETURNING *
    `);
    console.log(`Synchronization complete. Linked ${res.rowCount} new plan(s) to students.`);
  } catch (err) {
    console.error('Sync failed:', err);
  } finally {
    process.exit(0);
  }
}

sync();
