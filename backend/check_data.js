const { Client } = require('pg');

async function check() {
  const client = new Client({
    host: "79.76.96.223",
    user: "afsms_app",
    password: "88u9GqwGEsAJ",
    database: "afsms_db"
  });

  try {
    await client.connect();
    
    console.log('\n=== SPECIALIZATION ===');
    let res = await client.query('SELECT id, code, name FROM SPECIALIZATION;');
    console.log(res.rows);
    
    console.log('\n=== CURRICULUM ===');
    res = await client.query('SELECT id, code, name, specialization_id FROM CURRICULUM;');
    console.log(res.rows);
    
    console.log('\n=== DISCIPLINE ===');
    res = await client.query('SELECT id, code, name, semester, ects_credits FROM DISCIPLINE;');
    console.log(res.rows);
    
    console.log('\n=== ACADEMIC_YEAR ===');
    res = await client.query('SELECT id, year_start, year_end, is_active FROM ACADEMIC_YEAR;');
    console.log(res.rows);
    
    console.log('\n=== STUDENT (count) ===');
    res = await client.query('SELECT COUNT(*) FROM STUDENT;');
    console.log('Total students:', res.rows[0].count);
    
    console.log('\n=== GRADE (count) ===');
    res = await client.query('SELECT COUNT(*) FROM GRADE;');
    console.log('Total grades:', res.rows[0].count);
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

check();
