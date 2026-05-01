const db = require('./src/db');

async function checkTables() {
  try {
    const result = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('Tables in database:\n');
    result.rows.forEach((row, i) => {
      console.log(`${i + 1}. ${row.table_name}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkTables();
