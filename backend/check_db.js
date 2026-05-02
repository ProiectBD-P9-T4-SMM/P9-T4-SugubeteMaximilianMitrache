const db = require('./src/db');
async function check() {
  try {
    const students = await db.query('SELECT COUNT(*) FROM STUDENT');
    const grades = await db.query('SELECT COUNT(*) FROM GRADE');
    const users = await db.query('SELECT COUNT(*) FROM USER_ACCOUNT');
    console.log('Students:', students.rows[0].count);
    console.log('Grades:', grades.rows[0].count);
    console.log('Users:', users.rows[0].count);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
