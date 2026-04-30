-- ==============================================================================
-- AFSMS - Mock Data Seeding (GDPR Compliant)
-- RDBMS: PostgreSQL
-- Scop: Popularea bazei de date cu date de test pentru demonstrația NFR.
-- ==============================================================================

-- 0. CURĂȚAREA DATELOR EXISTENTE (Opțional, pentru a putea rula scriptul de mai multe ori)
-- TRUNCATE TABLE GRADE, STUDENT, DISCIPLINE, CURRICULUM_SNAPSHOT, CURRICULUM, STUDY_FORMATION, SPECIALIZATION, ACADEMIC_YEAR, USER_ROLE, USER_ACCOUNT, ROLE CASCADE;

-- ==============================================================================
-- 1. SECURITY & USER MODULE (Roluri și Utilizatori)
-- ==============================================================================

-- Adăugare Roluri
INSERT INTO ROLE (code, name, description) VALUES
('ADMIN', 'Administrator', 'Acces complet la sistem, inclusiv rollback.'),
('SECRETARIAT', 'Secretariat', 'Gestionează studenții, cataloagele și documentele.'),
('PROFESSOR', 'Profesor', 'Introduce și validează notele studenților.'),
('STUDENT', 'Student', 'Acces read-only la propriile date.');

-- Adăugare Utilizatori Fictivi
INSERT INTO USER_ACCOUNT (sso_subject, username, email, full_name, account_status) VALUES
('sso_admin_01', 'admin.sistem', 'admin@mock.ucv.ro', 'Admin Fictiv', 'ACTIVE'),
('sso_sec_01', 'secretariat.ace', 'secretariat@mock.ucv.ro', 'Secretar Maria Pop', 'ACTIVE'),
('sso_prof_01', 'prof.ing.progr', 'prof1@mock.ucv.ro', 'Prof. Dr. Ingineria Programării', 'ACTIVE'),
('sso_prof_02', 'prof.baze.date', 'prof2@mock.ucv.ro', 'Prof. Dr. Baze de Date', 'ACTIVE'),
('sso_prof_03', 'prof.sisteme', 'prof3@mock.ucv.ro', 'Prof. Dr. Sisteme Distribuite', 'ACTIVE');

-- Alocare Roluri (Mapare Utilizator <-> Rol)
INSERT INTO USER_ROLE (user_id, role_id) VALUES
((SELECT id FROM USER_ACCOUNT WHERE username = 'admin.sistem'), (SELECT id FROM ROLE WHERE code = 'ADMIN')),
((SELECT id FROM USER_ACCOUNT WHERE username = 'secretariat.ace'), (SELECT id FROM ROLE WHERE code = 'SECRETARIAT')),
((SELECT id FROM USER_ACCOUNT WHERE username = 'prof.ing.progr'), (SELECT id FROM ROLE WHERE code = 'PROFESSOR')),
((SELECT id FROM USER_ACCOUNT WHERE username = 'prof.baze.date'), (SELECT id FROM ROLE WHERE code = 'PROFESSOR')),
((SELECT id FROM USER_ACCOUNT WHERE username = 'prof.sisteme'), (SELECT id FROM ROLE WHERE code = 'PROFESSOR'));

-- ==============================================================================
-- 2. ACADEMIC DATA MODULE (An, Specializare, Grupe, Materii)
-- ==============================================================================

-- Anul Universitar
INSERT INTO ACADEMIC_YEAR (year_start, year_end, is_active) VALUES
(2023, 2024, TRUE);

-- Specializarea
INSERT INTO SPECIALIZATION (code, name, degree_level, is_active) VALUES
('CR', 'Calculatoare (Română)', 'Licență', TRUE);

-- Formațiunea de Studiu (Grupa)
INSERT INTO STUDY_FORMATION (specialization_id, code, name, education_form, study_year, group_index, is_active) VALUES
((SELECT id FROM SPECIALIZATION WHERE code = 'CR'), 'CR3.2B', 'Grupa 3.2B', 'IF (Învățământ cu Frecvență)', 3, 2, TRUE);

-- Planul de Învățământ (Curricula) & Snapshot-ul asociat
INSERT INTO CURRICULUM (specialization_id, code, name, valid_from, status) VALUES
((SELECT id FROM SPECIALIZATION WHERE code = 'CR'), 'CURR-CR-2023', 'Plan Învățământ Calculatoare 2023', '2023-10-01', 'ACTIVE');

INSERT INTO CURRICULUM_SNAPSHOT (curriculum_id, snapshot_date, disciplines_serialized, snapshot_status) VALUES
((SELECT id FROM CURRICULUM WHERE code = 'CURR-CR-2023'), '2023-10-01', '{"version": 1.0, "status": "locked"}', 'ACTIVE');

-- Disciplinele
INSERT INTO DISCIPLINE (curriculum_id, code, name, semester, evaluation_type, ects_credits, contact_hours) VALUES
((SELECT id FROM CURRICULUM WHERE code = 'CURR-CR-2023'), 'SE-01', 'Ingineria Programării', 1, 'EXAMEN', 5, 56),
((SELECT id FROM CURRICULUM WHERE code = 'CURR-CR-2023'), 'DB-01', 'Baze de Date', 1, 'EXAMEN', 5, 56),
((SELECT id FROM CURRICULUM WHERE code = 'CURR-CR-2023'), 'SD-01', 'Sisteme Distribuite', 1, 'EXAMEN', 4, 42);

-- ==============================================================================
-- 3. STUDENT DATA (Anonimizat GDPR)
-- ==============================================================================

INSERT INTO STUDENT (study_formation_id, registration_number, first_name, last_name, email, enrollment_date, status) VALUES
((SELECT id FROM STUDY_FORMATION WHERE code = 'CR3.2B'), 'MAT001', 'Andrei', 'StudentFictiv1', 'student1@mock.ucv.ro', '2021-10-01', 'ENROLLED'),
((SELECT id FROM STUDY_FORMATION WHERE code = 'CR3.2B'), 'MAT002', 'Marian', 'StudentFictiv2', 'student2@mock.ucv.ro', '2021-10-01', 'ENROLLED'),
((SELECT id FROM STUDY_FORMATION WHERE code = 'CR3.2B'), 'MAT003', 'Maximilian', 'StudentFictiv3', 'student3@mock.ucv.ro', '2021-10-01', 'ENROLLED'),
((SELECT id FROM STUDY_FORMATION WHERE code = 'CR3.2B'), 'MAT004', 'Elena', 'StudentFictiv4', 'student4@mock.ucv.ro', '2021-10-01', 'ENROLLED'),
((SELECT id FROM STUDY_FORMATION WHERE code = 'CR3.2B'), 'MAT005', 'Diana', 'StudentFictiv5', 'student5@mock.ucv.ro', '2021-10-01', 'ENROLLED'),
((SELECT id FROM STUDY_FORMATION WHERE code = 'CR3.2B'), 'MAT006', 'Mihai', 'StudentFictiv6', 'student6@mock.ucv.ro', '2021-10-01', 'ENROLLED'),
((SELECT id FROM STUDY_FORMATION WHERE code = 'CR3.2B'), 'MAT007', 'Alexandru', 'StudentFictiv7', 'student7@mock.ucv.ro', '2021-10-01', 'ENROLLED'),
((SELECT id FROM STUDY_FORMATION WHERE code = 'CR3.2B'), 'MAT008', 'Ioana', 'StudentFictiv8', 'student8@mock.ucv.ro', '2021-10-01', 'ENROLLED'),
((SELECT id FROM STUDY_FORMATION WHERE code = 'CR3.2B'), 'MAT009', 'Cristian', 'StudentFictiv9', 'student9@mock.ucv.ro', '2021-10-01', 'ENROLLED'),
((SELECT id FROM STUDY_FORMATION WHERE code = 'CR3.2B'), 'MAT010', 'Gabriel', 'StudentFictiv10', 'student10@mock.ucv.ro', '2021-10-01', 'ENROLLED');

-- ==============================================================================
-- 4. GRADES (Date pentru testarea "e-Grade Centralizer" în 3 minute)
-- ==============================================================================

-- Note pentru Ingineria Programării (SE-01) - Evaluator: prof.ing.progr
INSERT INTO GRADE (student_id, discipline_id, academic_year_id, curriculum_snapshot_id, graded_by_user_id, value, exam_session, grading_date, validated)
SELECT
    id,
    (SELECT id FROM DISCIPLINE WHERE code = 'SE-01'),
    (SELECT id FROM ACADEMIC_YEAR WHERE year_start = 2023),
    (SELECT id FROM CURRICULUM_SNAPSHOT LIMIT 1),
    (SELECT id FROM USER_ACCOUNT WHERE username = 'prof.ing.progr'),
    (random() * 5 + 5)::DECIMAL(4,2), -- Generează note aleatorii între 5.00 și 10.00
    'IARNA', '2024-02-15', TRUE
FROM STUDENT WHERE registration_number LIKE 'MAT%';

-- Note pentru Baze de Date (DB-01) - Evaluator: prof.baze.date
INSERT INTO GRADE (student_id, discipline_id, academic_year_id, curriculum_snapshot_id, graded_by_user_id, value, exam_session, grading_date, validated)
SELECT
    id,
    (SELECT id FROM DISCIPLINE WHERE code = 'DB-01'),
    (SELECT id FROM ACADEMIC_YEAR WHERE year_start = 2023),
    (SELECT id FROM CURRICULUM_SNAPSHOT LIMIT 1),
    (SELECT id FROM USER_ACCOUNT WHERE username = 'prof.baze.date'),
    (random() * 5 + 5)::DECIMAL(4,2),
    'IARNA', '2024-02-18', TRUE
FROM STUDENT WHERE registration_number LIKE 'MAT%';

-- Note pentru Sisteme Distribuite (SD-01) - Evaluator: prof.sisteme
INSERT INTO GRADE (student_id, discipline_id, academic_year_id, curriculum_snapshot_id, graded_by_user_id, value, exam_session, grading_date, validated)
SELECT
    id,
    (SELECT id FROM DISCIPLINE WHERE code = 'SD-01'),
    (SELECT id FROM ACADEMIC_YEAR WHERE year_start = 2023),
    (SELECT id FROM CURRICULUM_SNAPSHOT LIMIT 1),
    (SELECT id FROM USER_ACCOUNT WHERE username = 'prof.sisteme'),
    (random() * 5 + 5)::DECIMAL(4,2),
    'IARNA', '2024-02-22', TRUE
FROM STUDENT WHERE registration_number IN ('MAT001', 'MAT002', 'MAT003', 'MAT004', 'MAT005'); -- Doar jumătate au dat examenul
