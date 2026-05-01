const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'afsms',
  password: process.env.DB_PASS || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function migrate() {
  try {
    console.log('Connecting to DB...');
    // Add assigned_to_user_id to DOCUMENT
    await pool.query(`
      ALTER TABLE DOCUMENT 
      ADD COLUMN IF NOT EXISTS assigned_to_user_id UUID REFERENCES USER_ACCOUNT(id) ON DELETE SET NULL;
    `);
    console.log('Successfully added assigned_to_user_id to DOCUMENT table.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    pool.end();
  }
}

migrate();
