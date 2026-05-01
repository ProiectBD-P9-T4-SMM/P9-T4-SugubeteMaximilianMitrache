const db = require('./src/db');

async function checkTables() {
  try {
    const tables = ['student', 'study_formation', 'specialization', 'curriculum', 'discipline', 'grade', 'institution'];
    for (const table of tables) {
      console.log(`--- Table: ${table} ---`);
      const res = await db.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = $1
        ORDER BY ordinal_position
      `, [table]);
      res.rows.forEach(row => console.log(`${row.column_name}: ${row.data_type}`));
      console.log('');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkTables();
