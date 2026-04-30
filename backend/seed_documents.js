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
    
    console.log('Seeding documents...');

    // Fetch an admin user id to act as author
    const userRes = await client.query(`SELECT id FROM USER_ACCOUNT WHERE username = 'admin' LIMIT 1`);
    const authorId = userRes.rows.length > 0 ? userRes.rows[0].id : null;

    const docs = [
      {
        title: "Regulament de examinare 2026",
        type: "PDF",
        status: "APPROVED",
        content: "Acesta este un document mock reprezentand noul regulament de examinare pentru sesiunea de vara."
      },
      {
        title: "Cerere bursa merit - Popescu Ion",
        type: "XML",
        status: "PENDING_APPROVAL",
        content: "<cerere><student>Popescu Ion</student><tip>Merit</tip></cerere>"
      },
      {
        title: "Centralizator note anul 1 - CTI",
        type: "XLS",
        status: "DRAFT",
        content: "Document generat automat, necesita semnatura decanatului."
      },
      {
        title: "Structura an universitar 2026-2027",
        type: "CSV",
        status: "APPROVED",
        content: "Semestrul 1,Semestrul 2,Sesiune Iarna,Sesiune Vara"
      }
    ];

    for (const d of docs) {
      await client.query(
        `INSERT INTO DOCUMENT (author_id, title, type, status, content) VALUES ($1, $2, $3, $4, $5)`,
        [authorId, d.title, d.type, d.status, d.content]
      );
    }
    
    console.log('Documents seeded successfully!');
  } catch (err) {
    console.error('Error seeding documents:', err);
  } finally {
    await client.end();
  }
}

seed();
