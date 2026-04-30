/**
 * Complete seed: Specializations (Licență + Masterat), Study Formations (IF + IFR), Students, Documents
 * Hierarchy: Ciclu → Specializare → Tip frecvență → An → Grupă → Subgrupă
 */
const { Client } = require('pg');
const client = new Client({ host: '79.76.96.223', user: 'afsms_app', password: '88u9GqwGEsAJ', database: 'afsms_db' });

const specializations = [
  // Licență
  { code: 'CTI', name: 'Calculatoare și Tehnologia Informației', degree_level: 'Licență' },
  { code: 'IS',  name: 'Ingineria Sistemelor',                   degree_level: 'Licență' },
  { code: 'AC',  name: 'Automatică și Informatică Aplicată',     degree_level: 'Licență' },
  { code: 'IE',  name: 'Inginerie Electronică și Telecomunicații',degree_level: 'Licență' },
  // Masterat
  { code: 'MSSC', name: 'Securitatea Sistemelor Cibernetice',     degree_level: 'Masterat' },
  { code: 'MIA',  name: 'Inteligență Artificială',               degree_level: 'Masterat' },
];

const demoStudents = [
  // CTI An 1
  { first_name: 'Andrei',    last_name: 'Popescu',     email: 'andrei.popescu@student.ucv.ro',    fCode: 'CTI', year: 1, group: 1, sub: 'A', eduForm: 'IF' },
  { first_name: 'Maria',     last_name: 'Ionescu',     email: 'maria.ionescu@student.ucv.ro',     fCode: 'CTI', year: 1, group: 1, sub: 'B', eduForm: 'IF' },
  { first_name: 'Alexandru', last_name: 'Gheorghe',    email: 'alex.gheorghe@student.ucv.ro',     fCode: 'CTI', year: 1, group: 2, sub: 'A', eduForm: 'IF' },
  { first_name: 'Elena',     last_name: 'Constantin',  email: 'elena.constantin@student.ucv.ro',  fCode: 'CTI', year: 1, group: 2, sub: 'B', eduForm: 'IF' },
  // CTI An 2
  { first_name: 'Mihai',     last_name: 'Dumitru',     email: 'mihai.dumitru@student.ucv.ro',     fCode: 'CTI', year: 2, group: 1, sub: 'A', eduForm: 'IF' },
  { first_name: 'Ana',       last_name: 'Stanescu',    email: 'ana.stanescu@student.ucv.ro',      fCode: 'CTI', year: 2, group: 1, sub: 'B', eduForm: 'IF' },
  { first_name: 'Cristian',  last_name: 'Marin',       email: 'cristian.marin@student.ucv.ro',    fCode: 'CTI', year: 2, group: 2, sub: 'A', eduForm: 'IF' },
  { first_name: 'Ioana',     last_name: 'Dragomir',    email: 'ioana.dragomir@student.ucv.ro',    fCode: 'CTI', year: 2, group: 2, sub: 'B', eduForm: 'IF' },
  // CTI An 3
  { first_name: 'Bogdan',    last_name: 'Nicolescu',   email: 'bogdan.nicolescu@student.ucv.ro',  fCode: 'CTI', year: 3, group: 1, sub: 'A', eduForm: 'IF' },
  { first_name: 'Gabriela',  last_name: 'Popa',        email: 'gabriela.popa@student.ucv.ro',     fCode: 'CTI', year: 3, group: 1, sub: 'B', eduForm: 'IF' },
  { first_name: 'Daniel',    last_name: 'Barbu',       email: 'daniel.barbu@student.ucv.ro',      fCode: 'CTI', year: 3, group: 2, sub: 'A', eduForm: 'IF' },
  { first_name: 'Laura',     last_name: 'Serban',      email: 'laura.serban@student.ucv.ro',      fCode: 'CTI', year: 3, group: 2, sub: 'B', eduForm: 'IF' },
  // CTI An 4
  { first_name: 'Liviu',     last_name: 'Oprea',       email: 'liviu.oprea@student.ucv.ro',       fCode: 'CTI', year: 4, group: 1, sub: 'A', eduForm: 'IF' },
  { first_name: 'Diana',     last_name: 'Matei',       email: 'diana.matei@student.ucv.ro',       fCode: 'CTI', year: 4, group: 1, sub: 'B', eduForm: 'IF' },
  // CTI IFR
  { first_name: 'Stefan',    last_name: 'Dima',        email: 'stefan.dima@student.ucv.ro',       fCode: 'CTI', year: 1, group: 1, sub: 'A', eduForm: 'IFR' },
  { first_name: 'Andreea',   last_name: 'Niculae',     email: 'andreea.niculae@student.ucv.ro',   fCode: 'CTI', year: 2, group: 1, sub: 'A', eduForm: 'IFR' },
  // IS
  { first_name: 'Cosmin',    last_name: 'Dumitrescu',  email: 'cosmin.dumitrescu@student.ucv.ro', fCode: 'IS',  year: 1, group: 1, sub: 'A', eduForm: 'IF' },
  { first_name: 'Violeta',   last_name: 'Cristea',     email: 'violeta.cristea@student.ucv.ro',   fCode: 'IS',  year: 2, group: 1, sub: 'B', eduForm: 'IF' },
  { first_name: 'Adrian',    last_name: 'Lungu',       email: 'adrian.lungu@student.ucv.ro',      fCode: 'IS',  year: 3, group: 1, sub: 'A', eduForm: 'IF' },
  // AC
  { first_name: 'Marian',    last_name: 'Stan',        email: 'marian.stan@student.ucv.ro',       fCode: 'AC',  year: 1, group: 1, sub: 'A', eduForm: 'IF' },
  { first_name: 'Monica',    last_name: 'Chirita',     email: 'monica.chirita@student.ucv.ro',    fCode: 'AC',  year: 2, group: 1, sub: 'B', eduForm: 'IF' },
  // IE
  { first_name: 'Victor',    last_name: 'Iordache',    email: 'victor.iordache@student.ucv.ro',   fCode: 'IE',  year: 1, group: 1, sub: 'A', eduForm: 'IF' },
  { first_name: 'Camelia',   last_name: 'Panait',      email: 'camelia.panait@student.ucv.ro',    fCode: 'IE',  year: 2, group: 1, sub: 'B', eduForm: 'IF' },
  // Masterat
  { first_name: 'Razvan',    last_name: 'Tudose',      email: 'razvan.tudose@student.ucv.ro',     fCode: 'MSSC', year: 1, group: 1, sub: 'A', eduForm: 'IF' },
  { first_name: 'Simona',    last_name: 'Florescu',    email: 'simona.florescu@student.ucv.ro',   fCode: 'MIA',  year: 1, group: 1, sub: 'A', eduForm: 'IF' },
];

async function seed() {
  await client.connect();
  try {
    await client.query('BEGIN');

    console.log('Cleaning...');
    await client.query('DELETE FROM STUDENT');
    await client.query('DELETE FROM STUDY_FORMATION');
    await client.query('DELETE FROM SPECIALIZATION');

    console.log('Inserting specializations...');
    const specIds = {};
    for (const spec of specializations) {
      const res = await client.query(
        `INSERT INTO SPECIALIZATION (code, name, degree_level, is_active) VALUES ($1, $2, $3, true) RETURNING id, code`,
        [spec.code, spec.name, spec.degree_level]
      );
      specIds[spec.code] = res.rows[0].id;
      console.log(`  ✓ ${spec.degree_level}: ${spec.code} – ${spec.name}`);
    }

    console.log('\nGenerating study formations...');
    const educationForms = ['IF', 'IFR'];
    const licentaYears = 4;
    const masteratYears = 2;

    let formCount = 0;
    const formationIds = {}; // key: "CTI-IF-1-1-A" → id

    for (const spec of specializations) {
      const specId = specIds[spec.code];
      const maxYear = spec.degree_level === 'Masterat' ? masteratYears : licentaYears;
      const forms = spec.degree_level === 'Masterat' ? ['IF'] : educationForms;

      for (const eduForm of forms) {
        for (let year = 1; year <= maxYear; year++) {
          const maxGroups = spec.degree_level === 'Masterat' ? 1 : 4;
          for (let group = 1; group <= maxGroups; group++) {
            const subs = spec.degree_level === 'Masterat' ? ['A'] : ['A', 'B'];
            for (const sub of subs) {
              const code = `${spec.code}-${eduForm}-${year}${group}${sub}`;
              const name = `${spec.code} ${eduForm} – An ${year}, Gr.${group}, Sgr.${sub}`;
              const res = await client.query(
                `INSERT INTO STUDY_FORMATION (specialization_id, code, name, education_form, study_year, group_index, is_active)
                 VALUES ($1, $2, $3, $4, $5, $6, true) ON CONFLICT (code) DO UPDATE SET name=EXCLUDED.name RETURNING id`,
                [specId, code, name, eduForm, year, group]
              );
              formationIds[`${spec.code}-${eduForm}-${year}-${group}-${sub}`] = res.rows[0].id;
              formCount++;
            }
          }
        }
      }
    }
    console.log(`  ✓ Generated ${formCount} study formations`);

    console.log('\nInserting students...');
    let stuCount = 0;
    for (let i = 0; i < demoStudents.length; i++) {
      const s = demoStudents[i];
      const key = `${s.fCode}-${s.eduForm}-${s.year}-${s.group}-${s.sub}`;
      const formId = formationIds[key];
      if (!formId) {
        console.warn(`  ⚠ No formation for key ${key}`);
        continue;
      }
      const regNum = `MAT${String(i + 1).padStart(4, '0')}`;
      await client.query(
        `INSERT INTO STUDENT (registration_number, first_name, last_name, email, study_formation_id, enrollment_date, status)
         VALUES ($1, $2, $3, $4, $5, NOW(), 'ENROLLED')`,
        [regNum, s.first_name, s.last_name, s.email, formId]
      );
      console.log(`  ✓ ${regNum}  ${s.last_name} ${s.first_name}  →  ${key}`);
      stuCount++;
    }

    console.log('\nSeeding documents...');
    await client.query("DELETE FROM DOCUMENT");
    const userRes = await client.query(`SELECT id FROM USER_ACCOUNT WHERE account_status='ACTIVE' LIMIT 1`);
    const authorId = userRes.rows[0]?.id;
    const docs = [
      { title: 'Regulament de examinare 2025-2026',     type: 'PDF', status: 'APPROVED',         content: 'Regulamentul privind organizarea examenelor 2025-2026.' },
      { title: 'Cerere bursă merit – Popescu Andrei',   type: 'XML', status: 'PENDING_APPROVAL', content: '<cerere><student>Popescu Andrei</student><tip>Merit</tip></cerere>' },
      { title: 'Centralizator note CTI An 1 – Sem 1',   type: 'XLS', status: 'DRAFT',            content: 'Centralizator generat pentru CTI An 1 Sem 1.' },
      { title: 'Structura an universitar 2025-2026',    type: 'PDF', status: 'APPROVED',         content: 'Sem 1: Oct–Ian | Sem 2: Feb–Iun.' },
      { title: 'Cerere adeverință – Ionescu Maria',     type: 'PDF', status: 'PENDING_APPROVAL', content: 'Solicitare adeverință calitate student.' },
      { title: 'Plan învățământ CTI 2025-2026',         type: 'PDF', status: 'APPROVED',         content: 'Plan aprobat CTI, an univ. 2025-2026.' },
      { title: 'Raport prezențe IS An 3 – Sem 2',       type: 'CSV', status: 'DRAFT',            content: 'student_id,discipline,absente\nMAT0019,Automatizări,2' },
    ];
    for (const d of docs) {
      await client.query(`INSERT INTO DOCUMENT (author_id, title, type, status, content) VALUES ($1,$2,$3,$4,$5)`,
        [authorId, d.title, d.type, d.status, d.content]);
    }

    await client.query('COMMIT');
    console.log(`\n✅ Done! ${stuCount} students, ${formCount} formations, ${docs.length} documents seeded.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}
seed();
