/**
 * Seed students - assigns existing students to real formations and adds more demo students
 * properly distributed across specializations, years, groups and subgroups.
 */
const { Client } = require('pg');
const client = new Client({
  host: '79.76.96.223',
  user: 'afsms_app',
  password: '88u9GqwGEsAJ',
  database: 'afsms_db'
});

async function seed() {
  await client.connect();
  try {
    await client.query('BEGIN');

    // Get a map of formation code -> id
    const fRes = await client.query('SELECT id, code, name, study_year FROM STUDY_FORMATION ORDER BY code');
    const formations = fRes.rows;
    const formMap = {};
    for (const f of formations) formMap[f.code] = f;

    console.log(`Found ${formations.length} formations.`);

    // Delete all existing students cleanly
    await client.query('DELETE FROM STUDENT');
    console.log('Cleared existing students.');

    // Define demo students with a realistic distribution
    // Format: { first_name, last_name, email, formationCode }
    const demoStudents = [
      // CTI An 1
      { first_name: 'Andrei',      last_name: 'Popescu',       email: 'andrei.popescu@student.ucv.ro',       formationCode: 'CTI11A' },
      { first_name: 'Maria',       last_name: 'Ionescu',       email: 'maria.ionescu@student.ucv.ro',        formationCode: 'CTI11A' },
      { first_name: 'Alexandru',   last_name: 'Gheorghe',      email: 'alex.gheorghe@student.ucv.ro',        formationCode: 'CTI11B' },
      { first_name: 'Elena',       last_name: 'Constantin',    email: 'elena.constantin@student.ucv.ro',     formationCode: 'CTI11B' },
      { first_name: 'Mihai',       last_name: 'Dumitru',       email: 'mihai.dumitru@student.ucv.ro',        formationCode: 'CTI12A' },
      { first_name: 'Ana',         last_name: 'Stanescu',      email: 'ana.stanescu@student.ucv.ro',         formationCode: 'CTI12A' },
      // CTI An 2
      { first_name: 'Cristian',    last_name: 'Marin',         email: 'cristian.marin@student.ucv.ro',       formationCode: 'CTI21A' },
      { first_name: 'Ioana',       last_name: 'Dragomir',      email: 'ioana.dragomir@student.ucv.ro',       formationCode: 'CTI21B' },
      { first_name: 'Razvan',      last_name: 'Tudose',        email: 'razvan.tudose@student.ucv.ro',        formationCode: 'CTI22A' },
      { first_name: 'Simona',      last_name: 'Florescu',      email: 'simona.florescu@student.ucv.ro',      formationCode: 'CTI22B' },
      // CTI An 3
      { first_name: 'Bogdan',      last_name: 'Nicolescu',     email: 'bogdan.nicolescu@student.ucv.ro',     formationCode: 'CTI31A' },
      { first_name: 'Gabriela',    last_name: 'Popa',          email: 'gabriela.popa@student.ucv.ro',        formationCode: 'CTI31B' },
      { first_name: 'Daniel',      last_name: 'Barbu',         email: 'daniel.barbu@student.ucv.ro',         formationCode: 'CTI32A' },
      { first_name: 'Laura',       last_name: 'Serban',        email: 'laura.serban@student.ucv.ro',         formationCode: 'CTI32B' },
      // CTI An 4
      { first_name: 'Liviu',       last_name: 'Oprea',         email: 'liviu.oprea@student.ucv.ro',          formationCode: 'CTI41A' },
      { first_name: 'Diana',       last_name: 'Matei',         email: 'diana.matei@student.ucv.ro',          formationCode: 'CTI41B' },
      // IS An 1
      { first_name: 'Stefan',      last_name: 'Dima',          email: 'stefan.dima@student.ucv.ro',          formationCode: 'IS11A' },
      { first_name: 'Andreea',     last_name: 'Niculae',       email: 'andreea.niculae@student.ucv.ro',      formationCode: 'IS11B' },
      { first_name: 'Cosmin',      last_name: 'Dumitrescu',    email: 'cosmin.dumitrescu@student.ucv.ro',    formationCode: 'IS12A' },
      // IS An 2
      { first_name: 'Violeta',     last_name: 'Cristea',       email: 'violeta.cristea@student.ucv.ro',      formationCode: 'IS21A' },
      { first_name: 'Adrian',      last_name: 'Lungu',         email: 'adrian.lungu@student.ucv.ro',         formationCode: 'IS21B' },
      { first_name: 'Claudia',     last_name: 'Bucur',         email: 'claudia.bucur@student.ucv.ro',        formationCode: 'IS22A' },
      // AC An 1
      { first_name: 'Marian',      last_name: 'Stan',          email: 'marian.stan@student.ucv.ro',          formationCode: 'AC11A' },
      { first_name: 'Monica',      last_name: 'Chirita',       email: 'monica.chirita@student.ucv.ro',       formationCode: 'AC11B' },
      // AC An 3
      { first_name: 'Catalin',     last_name: 'Badea',         email: 'catalin.badea@student.ucv.ro',        formationCode: 'AC31A' },
      { first_name: 'Sorina',      last_name: 'Neagu',         email: 'sorina.neagu@student.ucv.ro',         formationCode: 'AC31B' },
      // IE An 2
      { first_name: 'Victor',      last_name: 'Iordache',      email: 'victor.iordache@student.ucv.ro',      formationCode: 'IE21A' },
      { first_name: 'Camelia',     last_name: 'Panait',        email: 'camelia.panait@student.ucv.ro',       formationCode: 'IE21B' },
    ];

    let inserted = 0;
    for (let i = 0; i < demoStudents.length; i++) {
      const s = demoStudents[i];
      const formation = formMap[s.formationCode];
      if (!formation) {
        console.warn(`  ⚠ Formation not found: ${s.formationCode}, skipping ${s.last_name}`);
        continue;
      }

      const regNum = `MAT${String(i + 1).padStart(4, '0')}`;
      await client.query(
        `INSERT INTO STUDENT (registration_number, first_name, last_name, email, study_formation_id, enrollment_date, status)
         VALUES ($1, $2, $3, $4, $5, NOW(), 'ENROLLED')`,
        [regNum, s.first_name, s.last_name, s.email, formation.id]
      );
      inserted++;
      console.log(`  ✓ ${regNum}  ${s.last_name} ${s.first_name}  →  ${formation.name}`);
    }

    await client.query('COMMIT');
    console.log(`\n✅ Seeded ${inserted} students successfully.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

seed();
