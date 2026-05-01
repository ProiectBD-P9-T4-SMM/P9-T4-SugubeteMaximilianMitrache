require('dotenv').config();
const db = require('./src/db');

async function migrate() {
  try {
    console.log('Creating STUDENT_CURRICULUM table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS STUDENT_CURRICULUM (
        student_id UUID REFERENCES STUDENT(id) ON DELETE CASCADE,
        curriculum_id UUID REFERENCES CURRICULUM(id) ON DELETE CASCADE,
        enrolled_at DATE DEFAULT CURRENT_DATE,
        status VARCHAR(20) DEFAULT 'ACTIVE',
        PRIMARY KEY (student_id, curriculum_id)
      )
    `);

    console.log('Migrating existing students to the new table...');
    // Link existing students to the curriculum associated with their study formation's specialization
    await db.query(`
      INSERT INTO STUDENT_CURRICULUM (student_id, curriculum_id)
      SELECT s.id, c.id
      FROM STUDENT s
      JOIN STUDY_FORMATION sf ON s.study_formation_id = sf.id
      JOIN CURRICULUM c ON sf.specialization_id = c.specialization_id
      ON CONFLICT DO NOTHING
    `);

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
