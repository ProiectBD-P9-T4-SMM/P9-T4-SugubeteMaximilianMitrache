const db = require('./src/db');

async function testQuery() {
  try {
    console.log('Testing SPECIALIZATION query...\n');
    
    const result = await db.query(`
      SELECT s.id, s.code, s.name
      FROM SPECIALIZATION s
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
