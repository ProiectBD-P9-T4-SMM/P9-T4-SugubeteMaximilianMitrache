const { Client } = require('pg');
const client = new Client({ host: "79.76.96.223", user: "afsms_app", password: "88u9GqwGEsAJ", database: "afsms_db" });
async function run() {
  await client.connect();
  try {
    await client.query('BEGIN');
    const userRes = await client.query(`
      INSERT INTO USER_ACCOUNT (username, email, full_name, sso_subject, account_status)
      VALUES ($1, $2, $3, $4, 'ACTIVE') RETURNING id`, ['testu2', 'test2@u.com', 'Test U2', 'testu2']);
    const newUser = userRes.rows[0];
    const roleRes = await client.query(`SELECT id FROM ROLE WHERE code = 'STUDENT' LIMIT 1`);
    if (roleRes.rows.length === 0) throw new Error("Role not found");
    await client.query(`INSERT INTO USER_ROLE (user_id, role_id) VALUES ($1, $2)`, [newUser.id, roleRes.rows[0].id]);
    await client.query('COMMIT');
    console.log("Success");
  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
