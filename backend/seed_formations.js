const { Client } = require('pg');
const client = new Client({ host: "79.76.96.223", user: "afsms_app", password: "88u9GqwGEsAJ", database: "afsms_db" });
async function seed() {
  await client.connect();
  const specRes = await client.query("SELECT id FROM SPECIALIZATION LIMIT 1");
  const specId = specRes.rows[0].id;
  await client.query("INSERT INTO STUDY_FORMATION (specialization_id, code, name, study_year, education_form, is_active, group_index) VALUES ($1, '321AC', 'Grupa 321AC', 2, 'IF', true, 1) ON CONFLICT DO NOTHING", [specId]);
  await client.query("INSERT INTO STUDY_FORMATION (specialization_id, code, name, study_year, education_form, is_active, group_index) VALUES ($1, '331AC', 'Grupa 331AC', 3, 'IF', true, 1) ON CONFLICT DO NOTHING", [specId]);
  await client.query("INSERT INTO STUDY_FORMATION (specialization_id, code, name, study_year, education_form, is_active, group_index) VALUES ($1, '341AC', 'Grupa 341AC', 4, 'IF', true, 1) ON CONFLICT DO NOTHING", [specId]);
  await client.end();
  console.log("Added more formations");
}
seed();
