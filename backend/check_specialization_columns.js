const db = require('./src/db');

async function check() {
  try {
    const res = await db.query("SELECT * FROM SPECIALIZATION LIMIT 1");
    console.log("Columns in SPECIALIZATION:", Object.keys(res.rows[0] || {}));
    
    const studyFieldRes = await db.query("SELECT table_name FROM information_schema.tables WHERE table_name = 'study_field'");
    console.log("STUDY_FIELD table exists:", studyFieldRes.rows.length > 0);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

check();
