import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BookOpen, Users, GraduationCap, Settings, ChevronRight, Menu, X, CheckCircle, Lightbulb, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Documentation() {
  const { language, t } = useLanguage();
  const { role } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // default to secretariat if no role specified or invalid
  const currentRole = ['secretariat', 'professors', 'students', 'admin'].includes(role) ? role : 'secretariat';

  useEffect(() => {
    if (!role || !['secretariat', 'professors', 'students', 'admin'].includes(role)) {
      navigate('/docs/secretariat', { replace: true });
    }
  }, [role, navigate]);

  const docs = {
    secretariat: {
      id: 'secretariat',
      icon: Users,
      title: language === 'ro' ? 'Manual Operațional - Secretariat' : 'Operations Manual - Secretariat',
      content: language === 'ro' ? (
        <>
          <p className="text-slate-600 mb-6 text-lg">Acest ghid acoperă fluxurile esențiale pentru gestionarea registrelor academice, a documentelor și a datelor studenților.</p>
          
          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">1. Colectarea datelor și liste de selecție</h2>
          <p className="text-slate-600 mb-4">Pentru a minimiza erorile de introducere a datelor, AFSMS utilizează masiv liste de selecție.</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
            <li>Când adaugi un student nou sau editezi înregistrări, folosește dropdown-urile cu căutare pentru <strong>Specializare</strong>, <strong>Grupă</strong> și <strong>An Universitar</strong>.</li>
            <li>Aceste liste sunt populate direct din baza de date centrală, asigurând consistența departamentală.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">2. Fluxul documentelor electronice</h2>
          <p className="text-slate-600 mb-4">Sistemul automatizează circulația documentelor între studenți și secretariat.</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
            <li>Navighează la pagina <strong>Documente & Flux</strong> din meniul principal.</li>
            <li>Caută documente după tip, autor, dată și status.</li>
            <li>Pentru a procesa o cerere (ex: adeverință de student), apasă pe <strong>Review</strong>, actualizează statusul în <strong>Aprobat</strong> sau <strong>Respins</strong>, și adaugă eventuale comentarii.</li>
            <li>Sistemul înregistrează automat ora și utilizatorul care a efectuat acțiunea (Audit Trail).</li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 my-8 flex gap-4">
            <Lightbulb className="text-blue-600 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-blue-900 mb-1">Integrare Microsoft Outlook</h4>
              <p className="text-blue-800 text-sm">Poți folosi acțiunea <strong>Email Group</strong> pentru a deschide direct Outlook-ul cu adresele tuturor studenților dintr-o grupă în câmpul BCC.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">3. Import și Export (Excel/CSV)</h2>
          <p className="text-slate-600 mb-4">Pentru actualizări la scară largă (ex: la început de an universitar):</p>
          <ol className="list-decimal pl-6 space-y-2 text-slate-600 mb-6">
            <li>Accesează pagina <strong>Studenți</strong> sau <strong>Catalog Note</strong>.</li>
            <li>Apasă butonul de <strong>Import Date</strong>.</li>
            <li>Descarcă șablonul furnizat (Excel/CSV), completează datele și încarcă fișierul.</li>
            <li>Sistemul va valida pe loc rândurile și va evidenția erorile înainte de salvarea finală.</li>
          </ol>

          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">4. Validări Inteligente (Smart Suggestions)</h2>
          <p className="text-slate-600 mb-4">Pentru a asigura integritatea datelor, AFSMS include un motor de sugestii automate.</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
            <li>Dacă introduci o valoare duplicat (ex: număr matricol existent), sistemul va afișa un banner albastru cu <strong>Sfat de Rezolvare Inteligent</strong>.</li>
            <li>Aceste sfaturi te ghidează pas cu pas pentru a corecta eroarea fără a consulta manualul tehnic.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">5. Generarea Rapoartelor (Centralizatoare)</h2>
          <p className="text-slate-600 mb-4">Generarea rapoartelor oficiale este complet automatizată.</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
            <li>Mergi în secțiunea <strong>Rapoarte / Centralizator</strong>.</li>
            <li>Selectează Anul, Specializarea și Formațiunea de studiu dorită.</li>
            <li>Apasă <strong>Generează</strong>. Rezultatul va putea fi exportat instant ca PDF (format oficial), sau XLS/CSV.</li>
          </ul>
        </>
      ) : (
        <>
          <p className="text-slate-600 mb-6 text-lg">This guide covers the essential workflows for managing academic records, documents, and student data.</p>
          
          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">1. Using Dropdown-Based Data Collection</h2>
          <p className="text-slate-600 mb-4">To minimize data entry errors, AFSMS heavily utilizes selection lists.</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
            <li>When adding a new student or editing records, use the searchable dropdowns for <strong>Specialization</strong>, <strong>Study Group</strong>, and <strong>Academic Year</strong>.</li>
            <li>These dropdowns are populated directly from the central database, ensuring consistency across all faculty departments.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">2. Managing Electronic Document Circulation</h2>
          <p className="text-slate-600 mb-4">The system automates document workflows between students and the secretariat.</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
            <li>Navigate to the <strong>Documents & Workflow</strong> page from the dashboard.</li>
            <li>You can search documents by type, author, date, and status.</li>
            <li>To process a student request (e.g., certificate request), click <strong>Review</strong>, update the status to <strong>Approved</strong> or <strong>Rejected</strong>, and add any necessary remarks.</li>
            <li>The system automatically logs the time and user who performed the action.</li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 my-8 flex gap-4">
            <Lightbulb className="text-blue-600 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-blue-900 mb-1">Microsoft Outlook Integration</h4>
              <p className="text-blue-800 text-sm">From any student list or group page, you can use the <strong>Email Group</strong> action. This will open your default email client with the BCC field pre-populated with the students' institutional email addresses.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">3. Bulk Data Imports & Exports (Excel/CSV)</h2>
          <p className="text-slate-600 mb-4">For large-scale updates (e.g., beginning of the academic year):</p>
          <ol className="list-decimal pl-6 space-y-2 text-slate-600 mb-6">
            <li>Navigate to the <strong>Students</strong> or <strong>Grades List</strong> page.</li>
            <li>Click on <strong>Import Data</strong>.</li>
            <li>Download the provided template (Excel/CSV), fill in the data according to the specified format, and upload it back.</li>
            <li>The system will validate all rows and highlight any discrepancies before saving to the database.</li>
          </ol>

          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">4. Smart Validation Suggestions</h2>
          <p className="text-slate-600 mb-4">To ensure data integrity, AFSMS includes an automated suggestion engine.</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
            <li>If you enter a duplicate value (e.g., existing registration number), the system will display a blue banner with **Smart Resolution Advice**.</li>
            <li>These hints guide you step-by-step to correct the error without consulting technical documentation.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">5. Generating e-Transcripts & Centralizers</h2>
          <p className="text-slate-600 mb-4">Report generation is automated:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
            <li>Go to the <strong>Reports / Centralizer</strong> page.</li>
            <li>Select the desired Year, Specialization, and Study Formation.</li>
            <li>Click <strong>Generate</strong>. The resulting tabular data can be immediately exported as an official PDF.</li>
          </ul>
        </>
      )
    },
    professors: {
      id: 'professors',
      icon: GraduationCap,
      title: language === 'ro' ? 'Ghid Rapid - Profesori' : 'Quick Start Guide - Professors',
      content: language === 'ro' ? (
        <>
          <p className="text-slate-600 mb-6 text-lg">Acest document explică pașii necesari pentru accesarea sistemului și adăugarea notelor eficient.</p>
          
          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">1. Autentificarea SSO</h2>
          <p className="text-slate-600 mb-4">Accesarea platformei necesită contul oficial instituțional.</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
            <li>Mergi pe pagina de pornire și apasă <strong>Login with University SSO</strong>.</li>
            <li>După conectare, rolul tău de PROFESOR este detectat automat, oferindu-ți acces strict la disciplinele pe care le predai.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">2. Localizarea disciplinelor alocate</h2>
          <p className="text-slate-600 mb-4">Odată conectat, vei putea vedea materiile tale.</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
            <li>Navighează la secțiunea <strong>Catalog Note</strong>.</li>
            <li>Folosește filtrele din partea de sus pentru a selecta Anul și Disciplina.</li>
            <li>Sistemul va afișa lista studenților înrolați la cursul respectiv.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">3. Introducerea notelor (scurtături rapide)</h2>
          <p className="text-slate-600 mb-4">Interfața este optimizată pentru rapiditate în timpul sesiunii.</p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 my-6 flex gap-4">
            <CheckCircle className="text-emerald-600 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-emerald-900 mb-1">Salvare Automată</h4>
              <p className="text-emerald-800 text-sm">Dă click direct pe coloana "Notă" pentru orice student. Tastează nota și apasă <strong>Enter</strong>. Nota este salvată instant și cursorul sare automat la următorul student!</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">4. Finalizarea mediilor</h2>
          <p className="text-slate-600 mb-4">Nu există un buton masiv de "Trimite tot" deoarece notele sunt salvate în timp real. După ce ai completat catalogul, secretariatul va avea imediat vizibilitate asupra notelor introduse de tine.</p>
        </>
      ) : (
        <>
          <p className="text-slate-600 mb-6 text-lg">This document covers how to access the system and manage student grades efficiently.</p>
          
          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">1. Authenticating via University SSO</h2>
          <p className="text-slate-600 mb-4">Accessing the platform requires your official institutional credentials.</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
            <li>Go to the AFSMS homepage and click <strong>Login with University SSO</strong>.</li>
            <li>Upon successful authentication, your specific role (PROFESSOR) is automatically applied, granting you access only to the disciplines you teach.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">2. Locating Assigned Study Formations</h2>
          <p className="text-slate-600 mb-4">Once logged in, your dashboard will display the subjects assigned to you.</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
            <li>Navigate to the <strong>Grades List</strong> page.</li>
            <li>Use the filters at the top to select the current Academic Year and your assigned Discipline.</li>
            <li>The system will load the list of students enrolled in that specific course.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">3. Entering Session Grades with Shortcuts</h2>
          <p className="text-slate-600 mb-4">AFSMS is optimized for fast data entry during busy exam sessions.</p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 my-6 flex gap-4">
            <CheckCircle className="text-emerald-600 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-emerald-900 mb-1">Auto-save Functionality</h4>
              <p className="text-emerald-800 text-sm">In the catalog view, click directly on the "Grade" field. Type the numerical value and press <strong>Enter</strong>. The grade is saved instantly, and focus moves to the next student.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">4. Finalizing and Submitting Records</h2>
          <p className="text-slate-600 mb-4">Grades are saved automatically as you enter them. There is no need for a massive "Submit All" button, ensuring no data is lost. Once completed, the secretariat is immediately able to see the grades.</p>
        </>
      )
    },
    students: {
      id: 'students',
      icon: GraduationCap,
      title: language === 'ro' ? 'Ghidul Portalului Studențesc' : 'Student Portal Guide',
      content: language === 'ro' ? (
        <>
          <p className="text-slate-600 mb-6 text-lg">Acest ghid te ajută să navighezi portalul și să ai acces la informațiile tale academice.</p>
          
          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">1. Vizualizarea Orarului și Curriculei</h2>
          <p className="text-slate-600 mb-4">Puteți vedea planul de învățământ și fără să vă autentificați via <strong>Portalul Public</strong>. Pentru date personale, logați-vă cu SSO.</p>

          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">2. Interpretarea Afișării Notelor</h2>
          <p className="text-slate-600 mb-4">Navigați la pagina <strong>Notele Mele</strong>. Veți vedea o listă securizată (read-only) cu toate notele, filtrată pe ani și semestre. Sistemul evidențiază examenele restante și calculează automat creditele acumulate.</p>

          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">3. Solicitarea Documentelor Online</h2>
          <p className="text-slate-600 mb-4">Pentru adeverințe sau cereri către secretariat:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
            <li>Navigați la secțiunea <strong>Documente</strong>.</li>
            <li>Apăsați <strong>Încarcă / Trimite Document</strong>.</li>
            <li>Cererea va intra direct în fluxul de lucru al secretariatului. Aici puteți verifica constant dacă starea este "În Așteptare", "Aprobat" sau "Respins" (inclusiv motivul respingerii).</li>
          </ul>
        </>
      ) : (
        <>
          <p className="text-slate-600 mb-6 text-lg">This guide helps you navigate your academic information safely and securely.</p>
          
          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">1. Viewing Personal Schedules and Curricula</h2>
          <p className="text-slate-600 mb-4">You can view your study plan without needing to log in via the <strong>Public Portal</strong>. For personalized information, log in using your University SSO account.</p>

          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">2. Interpreting Grade Displays</h2>
          <p className="text-slate-600 mb-4">Navigate to the <strong>My Grades</strong> section. Here you will see a secure, read-only list of all your grades. The system highlights pending exams and displays total accumulated credits automatically.</p>

          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">3. Requesting & Tracking Documents</h2>
          <p className="text-slate-600 mb-4">To request official documents (such as certificates):</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
            <li>Go to the <strong>Documents</strong> page and click <strong>Upload/Submit Document</strong>.</li>
            <li>Your request will enter the secretariat's workflow queue.</li>
            <li>You can view the status (Pending, Approved, Rejected) directly in the table. If rejected, check the remarks column for feedback.</li>
          </ul>
        </>
      )
    },
    admin: {
      id: 'admin',
      icon: Settings,
      title: language === 'ro' ? 'Ghidul Administratorului de Sistem' : 'System Administrator Guide',
      content: language === 'ro' ? (
        <>
          <p className="text-slate-600 mb-6 text-lg">Acest manual detaliază operațiunile de configurare, securitate și mentenanță.</p>
          
          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">1. Adaptarea Sistemului & Curricula</h2>
          <p className="text-slate-600 mb-4">În calitate de Administrator, tu configurezi datele fundamentale (Ani Universitari, Semestre, Specializări). Asigură-te că structura de credite și materii este corect setată înainte de începerea anului universitar.</p>

          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">2. Maparea Drepturilor și Grupurilor</h2>
          <p className="text-slate-600 mb-4">Sistemul folosește control pe bază de roluri (RBAC). Din <strong>User Groups</strong>, poți aloca utilizatorii autentificați pe rolurile de ADMIN, SECRETARIAT, PROFESOR sau STUDENT. Niciodată nu oferi rol de Admin unei persoane neautorizate.</p>

          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">3. Management DBMS și Loguri Audit</h2>
          <p className="text-slate-600 mb-4">Orice acțiune care modifică date (CREATE, UPDATE, DELETE) este salvată în logul central.</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
            <li>Mergi în pagina <strong>Audit Logs</strong> pentru a căuta acțiuni după ID Utilizator sau dată.</li>
            <li>Logurile afișează identitatea și contextul modificării pentru responsabilitate maximă.</li>
          </ul>

          <div className="bg-red-50 border border-red-200 rounded-xl p-5 my-6 flex gap-4">
            <AlertTriangle className="text-red-600 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-red-900 mb-1">Backup-uri Offline</h4>
              <p className="text-red-800 text-sm">Serviciile de programare în fundal (scheduler) execută backup-uri offline automatizate. Monitorizați regulat directoarele de backup. În caz de pierderi catastrofale, acestea permit <em>Point-in-Time Recovery</em> via utilitarele PostgreSQL.</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="text-slate-600 mb-6 text-lg">This manual details the configuration, security, and maintenance operations of the system.</p>
          
          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">1. Site Adaptation & Curricula Config</h2>
          <p className="text-slate-600 mb-4">As an Administrator, you configure the foundational data (Academic Years, Semesters, Specializations). Ensure structural data is correctly configured before the start of the academic year.</p>

          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">2. User Privilege & Group Mapping</h2>
          <p className="text-slate-600 mb-4">Access control is strictly role-based (RBAC). Navigate to the <strong>User Groups</strong> section to map SSO users to specific system roles. Never assign the ADMIN role to unauthorized personnel.</p>

          <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">3. DBMS Management & Audit Logs</h2>
          <p className="text-slate-600 mb-4">Every action that modifies data (CREATE, UPDATE, DELETE) is recorded.</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
            <li>Go to the <strong>Audit Logs</strong> page to search activities by User ID, Action Type, or Timestamp.</li>
            <li>Logs provide the actor's identity and the exact context of the modification.</li>
          </ul>

          <div className="bg-red-50 border border-red-200 rounded-xl p-5 my-6 flex gap-4">
            <AlertTriangle className="text-red-600 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-red-900 mb-1">Offline Backups & Recovery</h4>
              <p className="text-red-800 text-sm">The system includes background scheduler services for automated offline backups. In the event of catastrophic data corruption, these backups can be used to perform point-in-time recovery via PostgreSQL administration tools. Verify backups regularly.</p>
            </div>
          </div>
        </>
      )
    }
  };

  const navItems = [
    { id: 'secretariat', icon: Users, label: language === 'ro' ? 'Secretariat' : 'Secretariat' },
    { id: 'professors', icon: GraduationCap, label: language === 'ro' ? 'Profesori' : 'Professors' },
    { id: 'students', icon: BookOpen, label: language === 'ro' ? 'Studenți' : 'Students' },
    { id: 'admin', icon: Settings, label: language === 'ro' ? 'Administratori' : 'Administrators' },
  ];

  const CurrentDocIcon = docs[currentRole].icon;

  return (
    <div className="flex-1 bg-white min-h-screen flex flex-col md:flex-row">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center space-x-2">
          <BookOpen className="text-blue-600 h-5 w-5" />
          <span className="font-bold text-slate-800">Documentation</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white rounded-md border border-slate-200 shadow-sm">
          {isSidebarOpen ? <X size={20} className="text-slate-600" /> : <Menu size={20} className="text-slate-600" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className={`
        fixed md:sticky top-0 left-0 h-full md:h-auto min-h-screen w-64 bg-slate-50 border-r border-slate-200 z-10 transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 hidden md:block">
          <Link to="/help" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center mb-8 gap-1">
            &larr; {language === 'ro' ? 'Înapoi la Help' : 'Back to Help'}
          </Link>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{language === 'ro' ? 'Categorii' : 'Categories'}</h3>
        </div>
        <div className="p-4 md:pt-0 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const active = currentRole === item.id;
              return (
                <li key={item.id}>
                  <Link 
                    to={`/docs/${item.id}`}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                      active 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                        : 'text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon size={18} className={active ? 'text-blue-100' : 'text-slate-400'} />
                      <span className="font-bold text-sm">{item.label}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-6 md:p-12 lg:p-16">
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200">
              <CurrentDocIcon className="h-7 w-7 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {docs[currentRole].title}
            </h1>
          </div>
        </div>
        
        <div className="prose prose-slate prose-blue max-w-none prose-headings:tracking-tight prose-a:font-bold">
          {docs[currentRole].content}
        </div>
        
        <div className="mt-20 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm">
            {language === 'ro' ? 'Nu ai găsit ce căutai?' : 'Did not find what you were looking for?'} <Link to="/help" className="text-blue-600 font-bold hover:underline">{language === 'ro' ? 'Contactează suportul' : 'Contact support'}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
