const db = require('./backend/src/db');

async function setupAnnouncements() {
  try {
    console.log('Creating announcements table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS announcements (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          title_ro VARCHAR(255),
          content TEXT NOT NULL,
          content_ro TEXT,
          tag VARCHAR(50),
          published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          created_by INTEGER REFERENCES users(id)
      );
    `);

    console.log('Checking for existing announcements...');
    const existing = await db.query('SELECT count(*) FROM announcements');
    
    if (parseInt(existing.rows[0].count) === 0) {
      console.log('Seeding initial announcements...');
      await db.query(`
        INSERT INTO announcements (title, title_ro, content, content_ro, tag) VALUES
        ('AFSMS Version 1.0 Release', 'Lansarea Versiunii 1.0 AFSMS', 
         'The integrated academic management system is now live for all students and faculty. This version includes full student lifecycle management, digital grade registers, and automated academic reporting.', 
         'Sistemul integrat de management academic este acum live pentru toți studenții și profesorii. Această versiune include gestionarea completă a ciclului de viață al studentului, registre digitale de note și raportare academică automatizată.', 
         'System'),
        ('Summer Session Schedule', 'Program Sesiune Vară', 
         'The official calendar for summer session exams has been published in the academic repository. Students can now check their specific exam dates and locations through their personalized dashboard.', 
         'Calendarul oficial pentru examenele din sesiunea de vară a fost publicat în depozitarul academic. Studenții pot acum verifica datele și locațiile specifice ale examenelor prin intermediul tabloului de bord personalizat.', 
         'Academic'),
        ('New Architecture Diagrams', 'Noi Diagrame de Arhitectură', 
         'Technical documentation updated with new secretariat workflow diagrams. These diagrams illustrate the complex state transitions of document requests and the audit logging mechanism.', 
         'Documentația tehnică a fost actualizată cu noile fluxuri de lucru pentru secretariat. Aceste diagrame ilustrează tranzițiile complexe de stare ale cererilor de documente și mecanismul de jurnalizare a auditului.', 
         'Docs');
      `);
      console.log('Seeding complete.');
    } else {
      console.log('Announcements table already has data, skipping seed.');
    }
  } catch (err) {
    console.error('Error setting up announcements:', err);
  } finally {
    process.exit();
  }
}

setupAnnouncements();
