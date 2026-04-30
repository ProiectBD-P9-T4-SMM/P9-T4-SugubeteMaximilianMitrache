const { Client } = require('pg');
const client = new Client({ host: "79.76.96.223", user: "afsms_app", password: "88u9GqwGEsAJ", database: "afsms_db" });
async function run() {
  await client.connect();
  try {
  const query = `
      SELECT d.id, d.code, d.name as discipline_name, d.semester, d.evaluation_type, d.ects_credits,
             c.study_year, s.name as specialization_name, s.degree_level
      FROM DISCIPLINE d
      JOIN CURRICULUM c ON d.curriculum_id = c.id
      JOIN SPECIALIZATION s ON c.specialization_id = s.id
      WHERE c.status = 'APPROVED' AND s.is_active = TRUE
      ORDER BY s.name ASC, c.study_year ASC, d.semester ASC, d.name ASC
    `;
    const res = await client.query(query);
    console.log(res.rows.length);
  } catch(e) { console.error(e); }
  await client.end();
}
run();
