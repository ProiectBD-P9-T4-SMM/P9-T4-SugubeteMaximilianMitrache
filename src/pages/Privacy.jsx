import React, { useState } from 'react';
import { Shield, Lock, FileText, Database, UserCheck, Eye, Mail, Info, Globe, MapPin, Phone, Users } from 'lucide-react';

export default function Privacy() {
  const [lang, setLang] = useState('en');
  const lastUpdated = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'ro-RO', { year: 'numeric', month: 'long', day: 'numeric' });

  const content = {
    en: {
      title: "Privacy Policy & GDPR Compliance",
      subtitle: "We are committed to protecting your personal and academic information at the Faculty of Automation, Computers and Electronics.",
      updated: "Last Updated",
      sections: ['Introduction', 'Information Collection', 'Usage', 'Authentication', 'Security', 'Retention', 'GDPR Statement', 'Your Rights', 'Contact'],
      intro: {
        title: "1. Introduction",
        text1: "Welcome to the Privacy Policy for the Automated Faculty Student Management System (AFSMS). This system is designed to digitalize and manage the administrative processes of the Faculty of Automation, Computers and Electronics at the University of Craiova.",
        text2: "We are committed to protecting the privacy and security of your personal and academic information. This policy explains in detail how your data is collected, processed, stored, and protected."
      },
      collection: {
        title: "2. Information Collection",
        text: "The AFSMS collects and manages data necessary strictly for university-level academic administration:",
        items: [
          { name: "Personally Identifiable Information (PII)", desc: "Student names, identification numbers, and contact details." },
          { name: "Academic Records", desc: "Curricula, study formations, grades, and ECTS credits." },
          { name: "Workflow Documentation", desc: "Electronic documents submitted for approval or modification." },
          { name: "System Activity Logs", desc: "Identity, timestamps, and details of all data modifications." }
        ]
      },
      usage: {
        title: "3. How We Use Your Information",
        text: "Data is used exclusively for official university processes:",
        items: [
          'Maintain accurate academic records without redundancy.',
          'Generate official documents (e-Transcript, e-Grade Centralizer).',
          'Facilitate secure electronic document circulation.',
          'Enable targeted academic communication via Microsoft Outlook.',
          'Provide 24/7 access to schedules and grades.'
        ]
      },
      auth: {
        title: "4. Authentication and Access Control",
        sso: "Single Sign-On (SSO)",
        ssoText: "AFSMS does not store passwords. Access requires authentication through the University of Craiova's centralized SSO subsystem (SAML 2.0 or OAuth 2.0).",
        rbac: "Role-Based Access Control (RBAC)",
        rbacText: "Access is heavily restricted based on your user group (Student, Professor, Registrar, Admin). We enforce \"least privilege\" principles."
      },
      security: {
        title: "5. Data Security Measures",
        transport: "Secure Transport",
        transportText: "All communications are encrypted using modern TLS 1.2+ (HTTPS).",
        integrity: "Data Integrity & Rollback",
        integrityText: "The database utilizes point-in-time recovery and offline backups for maximum reliability."
      },
      retention: {
        title: "6. Data Retention",
        text: "Essential academic records are maintained indefinitely in accordance with educational legislation. System audit logs are retained for up to 5 years."
      },
      gdpr: {
        title: "GDPR Compliance Statement",
        text: "The University of Craiova is fully committed to compliance with the European Union General Data Protection Regulation (GDPR) and corresponding Romanian data protection legislation.",
        basis: "Lawful Basis",
        basisText: "Processing is conducted under the lawful basis of performing a public task and complying with legal obligations as a higher education institution.",
        design: "Privacy by Design",
        designText: "Data protection is integrated into our core architecture with strict data minimization and access control."
      },
      rights: {
        title: "7. Your Rights",
        text: "Under the GDPR, you have the right to access, rectify, or, under certain conditions, erase your data. Requests must be processed through official university channels.",
        dpo: "Data Protection Officer (DPO)"
      },
      contact: {
        title: "Questions?",
        text: "If you have questions regarding this Privacy Policy or how your data is handled within the AFSMS, please contact the faculty administration."
      }
    },
    ro: {
      title: "Politica de Confidențialitate și GDPR",
      subtitle: "Ne angajăm să protejăm informațiile dumneavoastră personale și academice în cadrul Facultății de Automatică, Calculatoare și Electronică.",
      updated: "Ultima actualizare",
      sections: ['Introducere', 'Colectarea Datelor', 'Scopul Prelucrării', 'Autentificare', 'Securitate', 'Stocare', 'Declarație GDPR', 'Drepturile Vizate', 'Contact'],
      intro: {
        title: "1. Introducere",
        text1: "Bun venit la Politica de Confidențialitate pentru Sistemul Automatizat de Management al Studenților (AFSMS). Acest sistem este conceput pentru a digitaliza și gestiona procesele administrative ale Facultății de Automatică, Calculatoare și Electronică din cadrul Universității din Craiova.",
        text2: "Suntem preocupați în mod constant de asigurarea protecției cu privire la prelucrările de date cu caracter personal pe care le efectuăm conform Regulamentului (UE) 2016/679 (GDPR)."
      },
      collection: {
        title: "2. Ce categorii de date sunt prelucrate?",
        text: "Categoriile de date cu caracter personal prelucrate de Universitatea din Craiova sunt următoarele:",
        items: [
          { name: "Date de Identificare", desc: "Nume, prenume, CNP, CI/Pașaport, data și locul nașterii, cetățenia, semnătura." },
          { name: "Situație Academică", desc: "Informații privind studiile efectuate/absolvite, note și medii obținute pe parcursul studiilor." },
          { name: "Date Profesionale", desc: "Profesia, locul de muncă, formarea profesională, Curriculum Vitae." },
          { name: "Date de Contact", desc: "Adresa de email, numărul de telefon, domiciliul." }
        ]
      },
      usage: {
        title: "3. Care este scopul prelucrării datelor?",
        text: "Universitatea prelucrează date în scopul executării contractelor și îndeplinirii obligațiilor legale:",
        items: [
          'Încheierea și executarea contractelor de studii.',
          'Generarea actelor de studii și centralizatoarelor de note.',
          'Analize și prelucrări statistice pentru management.',
          'Gestionarea relațiilor cu persoanele vizate prin email instituțional.',
          'Asigurarea securității în spațiul universitar prin supraveghere video.'
        ]
      },
      auth: {
        title: "4. Autentificare și Control Acces",
        sso: "Single Sign-On (SSO)",
        ssoText: "AFSMS nu stochează parole. Accesul necesită autentificare prin subsistemul centralizat SSO al Universității din Craiova.",
        rbac: "Control Acces bazat pe Roluri (RBAC)",
        rbacText: "Accesul este restricționat riguros în funcție de grupul de utilizatori (Student, Profesor, Secretariat, Admin)."
      },
      security: {
        title: "5. Măsuri de Securitate",
        transport: "Transport Securizat",
        transportText: "Toate comunicațiile sunt criptate folosind TLS 1.2+ (HTTPS).",
        integrity: "Integritate și Recuperare",
        integrityText: "Baza de date utilizează puncte de restaurare (point-in-time recovery) pentru eliminarea erorilor critice."
      },
      retention: {
        title: "6. Perioada de Stocare",
        text: "Datele academice sunt păstrate pe perioada necesară îndeplinirii scopurilor, perioada de arhivare fiind cea prevăzută de legislația națională."
      },
      gdpr: {
        title: "Declarație de Conformitate GDPR",
        text: "Universitatea din Craiova este operator de date cu caracter personal și respectă drepturile persoanelor conform Regulamentului (UE) 2016/679.",
        basis: "Temei Legal",
        basisText: "Prelucrarea este necesară pentru îndeplinirea unei sarcini de interes public sau a obligațiilor legale ale instituției.",
        design: "Protecție prin Design",
        designText: "Protecția datelor este integrată în arhitectura sistemului prin minimizarea datelor și control riguros."
      },
      rights: {
        title: "7. Drepturile Persoanelor Vizate",
        text: "Conform GDPR, beneficiați de dreptul la informare, acces, rectificare, ștergere (\"dreptul de a fi uitat\"), opoziție și portabilitatea datelor.",
        dpo: "Responsabil cu Protecția Datelor (DPO)"
      },
      contact: {
        title: "Întrebări?",
        text: "Pentru exercitarea acestor drepturi, vă rugăm să consultați responsabilul DPO la adresa de email afișată mai jos."
      }
    }
  };

  const t = content[lang];

  const scrollTo = (index) => {
    const id = t.sections[index].toLowerCase().replace(/\s+/g, '-');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Header & Language Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 space-y-6 md:space-y-0">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">{t.title}</h1>
          <p className="text-lg text-slate-600 max-w-2xl">{t.subtitle}</p>
        </div>
        <div className="flex bg-slate-200 p-1.5 rounded-2xl shadow-inner shrink-0">
          <button 
            onClick={() => setLang('en')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${lang === 'en' ? 'bg-white text-blue-600 shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Globe className="h-4 w-4" />
            <span>EN</span>
          </button>
          <button 
            onClick={() => setLang('ro')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${lang === 'ro' ? 'bg-white text-blue-600 shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Globe className="h-4 w-4" />
            <span>RO</span>
          </button>
        </div>
      </div>

      <div className="mb-12 text-center md:text-left">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
          {t.updated}: {lastUpdated}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 hidden lg:block sticky top-8 h-fit">
          <nav className="space-y-1">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">
              {lang === 'en' ? 'Sections' : 'Secțiuni'}
            </h3>
            {t.sections.map((item, idx) => (
              <button
                key={item}
                onClick={() => scrollTo(idx)}
                className="w-full text-left block px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="lg:col-span-3 space-y-16">
          {/* 1. Introduction */}
          <section id={t.sections[0].toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2.5 bg-blue-100 rounded-xl">
                <Info className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{t.intro.title}</h2>
            </div>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>{t.intro.text1}</p>
              <p>{t.intro.text2}</p>
            </div>
          </section>

          {/* 2. Information Collection */}
          <section id={t.sections[1].toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-8 p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2.5 bg-indigo-100 rounded-xl">
                <Database className="h-6 w-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{t.collection.title}</h2>
            </div>
            <div className="space-y-8 text-slate-600">
              <p>{t.collection.text}</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0">
                {t.collection.items.map((item, i) => (
                  <li key={i} className="flex items-start space-x-4 p-5 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                    <div className="mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-200"></div>
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">{item.name}</span>
                      <span className="text-sm leading-relaxed">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 3. Usage */}
          <section id={t.sections[2].toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2.5 bg-emerald-100 rounded-xl">
                <Eye className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{t.usage.title}</h2>
            </div>
            <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
              <p>{t.usage.text}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {t.usage.items.map((text, i) => (
                  <div key={i} className="flex items-center space-x-3 text-sm border-l-4 border-emerald-500 bg-emerald-50/50 p-4 rounded-r-xl font-medium text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Authentication */}
          <section id={t.sections[3].toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2.5 bg-amber-100 rounded-xl">
                <UserCheck className="h-6 w-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{t.auth.title}</h2>
            </div>
            <div className="bg-slate-900 text-slate-300 p-10 rounded-3xl shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <h4 className="text-white font-bold text-lg flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-amber-400" />
                    <span>{t.auth.sso}</span>
                  </h4>
                  <p className="text-sm leading-relaxed opacity-80">{t.auth.ssoText}</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-white font-bold text-lg flex items-center space-x-2">
                    <Users className="h-5 w-5 text-amber-400" />
                    <span>{t.auth.rbac}</span>
                  </h4>
                  <p className="text-sm leading-relaxed opacity-80">{t.auth.rbacText}</p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Security */}
          <section id={t.sections[4].toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2.5 bg-red-100 rounded-xl">
                <Lock className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{t.security.title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 border border-slate-200 rounded-3xl hover:border-red-200 hover:bg-red-50/30 transition-all group shadow-sm">
                <h4 className="font-bold text-slate-900 mb-3 text-lg group-hover:text-red-700 transition-colors">{t.security.transport}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{t.security.transportText}</p>
              </div>
              <div className="p-8 border border-slate-200 rounded-3xl hover:border-red-200 hover:bg-red-50/30 transition-all group shadow-sm">
                <h4 className="font-bold text-slate-900 mb-3 text-lg group-hover:text-red-700 transition-colors">{t.security.integrity}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{t.security.integrityText}</p>
              </div>
            </div>
          </section>

          {/* 6. Retention */}
          <section id={t.sections[5].toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2.5 bg-violet-100 rounded-xl">
                <FileText className="h-6 w-6 text-violet-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{t.retention.title}</h2>
            </div>
            <div className="prose prose-slate max-w-none text-slate-600 p-8 bg-violet-50/50 rounded-3xl border border-violet-100">
              <p className="text-lg leading-relaxed font-medium text-slate-700">{t.retention.text}</p>
            </div>
          </section>

          <hr className="border-slate-200 my-16" />

          {/* GDPR Statement */}
          <section id={t.sections[6].toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-8 p-10 md:p-16 bg-blue-600 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <Shield className="absolute -right-12 -bottom-12 h-64 w-64 opacity-10 rotate-12" />
            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-6 tracking-tight">{t.gdpr.title}</h2>
              <p className="text-blue-100 mb-10 text-lg leading-relaxed max-w-3xl font-medium">{t.gdpr.text}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h4 className="font-black text-white text-xl uppercase tracking-wider">{t.gdpr.basis}</h4>
                  <p className="text-blue-50 leading-relaxed opacity-90">{t.gdpr.basisText}</p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-black text-white text-xl uppercase tracking-wider">{t.gdpr.design}</h4>
                  <p className="text-blue-50 leading-relaxed opacity-90">{t.gdpr.designText}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section id={t.sections[7].toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-8">
            <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">{t.rights.title}</h2>
            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-lg group hover:border-blue-200 transition-all">
              <div className="p-8 bg-slate-50 border-b border-slate-200 group-hover:bg-blue-50/30 transition-colors">
                <p className="text-slate-700 text-lg leading-relaxed font-medium">
                  {t.rights.text}
                </p>
              </div>
              <div className="p-10">
                <h4 className="font-bold text-slate-900 mb-8 text-xl flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                  <span>{t.rights.dpo}</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="flex items-center space-x-5 group/item">
                    <div className="h-14 w-14 bg-blue-100 rounded-2xl flex items-center justify-center group-hover/item:bg-blue-600 group-hover/item:text-white transition-all">
                      <Mail className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Email</p>
                      <span className="text-slate-900 font-black text-lg">dpo@ucv.ro</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-5 group/item">
                    <div className="h-14 w-14 bg-blue-100 rounded-2xl flex items-center justify-center group-hover/item:bg-blue-600 group-hover/item:text-white transition-all">
                      <MapPin className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Address</p>
                      <span className="text-slate-900 font-bold leading-tight">Str. A.I. Cuza nr.13, Craiova, RO-200585</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section id={t.sections[8].toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-8 p-12 md:p-20 bg-slate-900 text-white rounded-[3rem] text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-blue-600 opacity-5 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-6 tracking-tight">{t.contact.title}</h2>
              <p className="text-slate-400 mb-12 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                {t.contact.text}
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-12">
                <div className="flex items-center space-x-4 group cursor-pointer">
                  <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-all">
                    <Mail className="h-6 w-6" />
                  </div>
                  <span className="text-xl font-bold">support.ace@ucv.ro</span>
                </div>
                <div className="hidden md:block h-12 w-px bg-white/20" />
                <div className="flex items-center space-x-4 group cursor-pointer">
                  <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-all">
                    <Phone className="h-6 w-6" />
                  </div>
                  <span className="text-xl font-bold">+40 251 438198</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// Additional icon needed for the usage section
function CheckCircle2(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
