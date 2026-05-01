const db = require('./src/db');

async function testQuery() {
  try {
    console.log('Testing SPECIALIZATION with LEFT JOIN...\n');
    
    const result = await db.query(`
      SELECT s.id, s.code, s.name, s.study_field_id, sf.name as study_field_name
      FROM SPECIALIZATION s
      LEFT JOIN STUDY_FIELD sf ON s.study_field_id = sf.id
      ORDER BY s.name ASC
    `);
    
    console.log('✅ Query successful!');
    console.log('Results:', result.rows);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Code:', error.code);
    console.error('Detail:', error.detail);
  } finally {
    process.exit(0);
  }
}

testQuery();
