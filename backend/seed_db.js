require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function seed() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

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
