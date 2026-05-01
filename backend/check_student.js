require('dotenv').config();
const db = require('./src/db');
db.query('SELECT * FROM student LIMIT 1').then(r => {
  console.log(r.rows[0]);
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
