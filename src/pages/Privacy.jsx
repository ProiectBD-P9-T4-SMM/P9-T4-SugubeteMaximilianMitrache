import React from 'react';
import { Shield, Lock, FileText, Database, UserCheck, Eye, Mail, Info, Globe, MapPin, Phone, Users } from 'lucide-react';

export default function Privacy() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const t = {
    title: "Privacy Policy & GDPR Compliance",
    subtitle: "We are committed to protecting your personal and academic information at the Faculty of Automation, Computers and Electronics, University of Craiova.",
    updated: "Last Updated",
    sections: ['Introduction', 'Data Categories', 'Processing Purpose', 'Authentication', 'Security', 'Data Retention', 'GDPR Statement', 'Data Subject Rights', 'Contact'],
    intro: {
      title: "1. Introduction",
      text1: "Welcome to the Privacy Policy for the Automated Faculty Student Management System (AFSMS). This system is designed to digitalize and manage the administrative processes of the Faculty of Automation, Computers and Electronics at the University of Craiova.",
      text2: "The University of Craiova, as a personal data controller, is constantly concerned with ensuring the protection of the personal data processing it carries out according to Regulation (EU) 2016/679 (GDPR)."
    },
    collection: {
      title: "2. What categories of data are processed?",
      text: "The AFSMS collects and manages data necessary strictly for university-level academic administration:",
      items: [
        { name: "Identification Data", desc: "Full name, Personal Identification Number (CNP), ID/Passport details, date and place of birth, citizenship, signature." },
        { name: "Academic History", desc: "Information on studies completed/graduated, grades and averages obtained during studies." },
        { name: "Professional Data", desc: "Profession, place of work, professional training, Curriculum Vitae." },
        { name: "Contact Information", desc: "Email address, phone number, home address." }
      ]
    },
    usage: {
      title: "3. What is the purpose of data processing?",
      text: "Data is processed for the conclusion and execution of study contracts and for the fulfillment of legal obligations:",
      items: [
        'Conclusion and execution of study contracts.',
        'Generation of study documents and grade centralizers.',
        'Statistical analysis and processing for management decisions.',
        'Managing relations with data subjects through institutional email.',
        'Ensuring security in the university space through video surveillance.'
      ]
    },
    auth: {
      title: "4. Authentication and Access Control",
      sso: "Single Sign-On (SSO)",
      ssoText: "AFSMS does not store passwords. Access requires authentication through the University of Craiova's centralized SSO subsystem (SAML 2.0 or OAuth 2.0).",
      rbac: "Role-Based Access Control (RBAC)",
      rbacText: "Access is strictly restricted based on the user group (Student, Professor, Secretariat, Admin)."
    },
    security: {
      title: "5. Security Measures",
      transport: "Secure Transport",
      transportText: "All communications are encrypted using modern TLS 1.2+ (HTTPS).",
      integrity: "Integrity and Recovery",
      integrityText: "The database uses point-in-time recovery to eliminate critical errors and ensure data persistence."
    },
    retention: {
      title: "6. Data Retention Period",
      text: "The University keeps personal data only for the period necessary to fulfill the purposes for which it was collected, the archiving period being that provided by national legislation."
    },
    gdpr: {
      title: "GDPR Compliance Statement",
      text: "The University of Craiova is a personal data controller and respects the rights of individuals according to Regulation (EU) 2016/679.",
      basis: "Legal Basis",
      basisText: "Processing is necessary for the performance of a task carried out in the public interest or for compliance with the legal obligations of the institution.",
      design: "Privacy by Design",
      designText: "Data protection is integrated into the system architecture through data minimization and rigorous access control."
    },
    rights: {
      title: "7. Data Subject Rights",
      text: "According to GDPR, you benefit from the right to information, access, rectification, erasure (\"the right to be forgotten\"), opposition, and data portability.",
      dpo: "Data Protection Officer (DPO)"
    },
    contact: {
      title: "Questions?",
      text: "To exercise these rights, please consult the DPO officer at the email address displayed below."
    }
  };

  const scrollTo = (index) => {
    const id = t.sections[index].toLowerCase().replace(/\s+/g, '-');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 space-y-6 md:space-y-0">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">{t.title}</h1>
          <p className="text-lg text-slate-600 max-w-2xl">{t.subtitle}</p>
        </div>
      </div>

      <div className="mb-12 text-center md:text-left">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
          {t.updated}: {lastUpdated}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <aside className="lg:col-span-1 hidden lg:block sticky top-8 h-fit">
          <nav className="space-y-1">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">Sections</h3>
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

        <div className="lg:col-span-3 space-y-16">
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
                    <div className="h-2 w-2 rounded-full bg-emerald-600 shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

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
