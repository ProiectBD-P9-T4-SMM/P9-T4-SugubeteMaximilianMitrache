const { Client } = require('pg');

async function seedCurriculaAndDisciplines() {
  const client = new Client({
    host: "79.76.96.223",
    user: "afsms_app",
    password: "88u9GqwGEsAJ",
    database: "afsms_db"
  });

  try {
    await client.connect();
    console.log('Connected to database. Seeding curricula and disciplines...\n');

    // Get specialization IDs
    const specRes = await client.query(`
      SELECT id, code, name FROM SPECIALIZATION 
      WHERE code IN ('CTI', 'IS', 'AC')
    `);
    
    if (specRes.rows.length === 0) {
      console.error('No specializations found!');
      return;
    }

    console.log('Found specializations:', specRes.rows.map(s => s.code).join(', '));

    // Insert curricula for each specialization
    for (const spec of specRes.rows) {
      const currRes = await client.query(`
        INSERT INTO CURRICULUM (specialization_id, code, name, valid_from, status)
        VALUES ($1, $2, $3, '2023-09-01', 'ACTIVE')
        ON CONFLICT (code) DO NOTHING
        RETURNING id, code
      `, [
        spec.id,
        `CURR-${spec.code}-2023`,
        `Plan Învățământ ${spec.name} - 2023`
      ]);

      if (currRes.rows.length === 0) {
        console.log(`⚠️  Curriculum for ${spec.code} already exists or not inserted`);
        continue;
      }

      const currId = currRes.rows[0].id;
      console.log(`✅ Created Curriculum: ${currRes.rows[0].code}`);

      // Also create snapshot for this curriculum
      const snapRes = await client.query(`
        INSERT INTO CURRICULUM_SNAPSHOT (curriculum_id, snapshot_date, disciplines_serialized, snapshot_status)
        VALUES ($1, '2023-09-01', '{"version": 1.0, "status": "locked"}', 'ACTIVE')
        ON CONFLICT DO NOTHING
        RETURNING id
      `, [currId]);

      if (snapRes.rows.length > 0) {
        console.log(`   └─ Created Curriculum Snapshot`);
      }

      // Insert disciplines based on specialization
      const disciplinesData = {
        'CTI': [
          { code: 'SE-001', name: 'Ingineria Programării', sem: 1, ects: 5, hours: 56 },
          { code: 'DB-001', name: 'Baze de Date', sem: 1, ects: 5, hours: 56 },
          { code: 'SD-001', name: 'Sisteme Distribuite', sem: 1, ects: 4, hours: 42 },
          { code: 'ALG-001', name: 'Algoritmi Avansați', sem: 2, ects: 5, hours: 56 },
          { code: 'WEB-001', name: 'Dezvoltare Web', sem: 2, ects: 4, hours: 42 }
        ],
        'IS': [
          { code: 'SYS-001', name: 'Sisteme de Operare', sem: 1, ects: 5, hours: 56 },
          { code: 'NET-001', name: 'Rețele de Calculatoare', sem: 1, ects: 5, hours: 56 },
          { code: 'SEC-001', name: 'Securitate Cibernetică', sem: 2, ects: 4, hours: 42 }
        ],
        'AC': [
          { code: 'AUTO-001', name: 'Sisteme Automate', sem: 1, ects: 5, hours: 56 },
          { code: 'CTRL-001', name: 'Teoria Controlului', sem: 1, ects: 4, hours: 42 },
          { code: 'SIMU-001', name: 'Simulare și Modelare', sem: 2, ects: 5, hours: 56 }
        ]
      };

      const disciplines = disciplinesData[spec.code] || [];
      
      for (const disc of disciplines) {
        const discRes = await client.query(`
          INSERT INTO DISCIPLINE (curriculum_id, code, name, semester, evaluation_type, ects_credits, contact_hours)
          VALUES ($1, $2, $3, $4, 'EXAMEN', $5, $6)
          ON CONFLICT (code) DO NOTHING
          RETURNING code
        `, [currId, disc.code, disc.name, disc.sem, disc.ects, disc.hours]);

        if (discRes.rows.length > 0) {
          console.log(`   ├─ Added discipline: ${disc.code} - ${disc.name}`);
        }
      }
    }

    console.log('\n✅ Seed complete! Curricula and Disciplines populated.');

    // Verify
    const verifyRes = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM CURRICULUM) as curricula_count,
        (SELECT COUNT(*) FROM DISCIPLINE) as disciplines_count,
        (SELECT COUNT(*) FROM CURRICULUM_SNAPSHOT) as snapshots_count
    `);
    
    console.log('\nVerification:');
    console.log(`  Curricula: ${verifyRes.rows[0].curricula_count}`);
    console.log(`  Disciplines: ${verifyRes.rows[0].disciplines_count}`);
    console.log(`  Snapshots: ${verifyRes.rows[0].snapshots_count}`);

  } catch (err) {
    console.error('Error seeding:', err.message);
  } finally {
    await client.end();
  }
}

seedCurriculaAndDisciplines();
