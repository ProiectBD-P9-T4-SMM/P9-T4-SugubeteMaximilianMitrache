const { Client } = require('pg');
const client = new Client({
  host: "79.76.96.223",
  user: "afsms_app",
  password: "88u9GqwGEsAJ",
  database: "afsms_db"
});
client.connect().then(() => {
  return client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
}).then(res => {
  console.log("Tables:", res.rows.map(r => r.table_name));
  client.end();
}).catch(console.error);
