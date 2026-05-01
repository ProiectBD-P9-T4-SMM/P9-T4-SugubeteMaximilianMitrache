const db = require('../src/db');

async function checkLegacy() {
  try {
    const userRes = await db.query("SELECT id, email, full_name FROM USER_ACCOUNT WHERE email = 'student@ucv.ro'");
    console.log('User Account:', userRes.rows[0]);
    
    if (userRes.rows[0]) {
      const studentRes = await db.query("SELECT id, email FROM STUDENT WHERE email = 'student@ucv.ro'");
      console.log('Student Record:', studentRes.rows[0]);
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkLegacy();
