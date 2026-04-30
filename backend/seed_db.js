const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function seed() {
  const client = new Client({
    host: "79.76.96.223",
    user: "afsms_app",
    password: "88u9GqwGEsAJ",
    database: "afsms_db"
  });

  try {
    await client.connect();
    
    const schemaSql = fs.readFileSync(path.join(__dirname, '../src/schema.sql'), 'utf8');
    console.log('Running schema.sql...');
    await client.query(schemaSql);
    
    const seedSql = fs.readFileSync(path.join(__dirname, '../src/seed.sql'), 'utf8');
    console.log('Running seed.sql...');
    await client.query(seedSql);
    
    console.log('Database seeded successfully in public schema!');
  } catch (err) {
    console.error('Error seeding DB:', err);
  } finally {
    await client.end();
  }
}

seed();
