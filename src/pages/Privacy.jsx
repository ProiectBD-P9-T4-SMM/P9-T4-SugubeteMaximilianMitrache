import React from 'react';
import { Shield, Lock, FileText, Database, UserCheck, Eye, Mail, Info, Globe, MapPin, Phone, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Privacy() {
  const { t, language } = useLanguage();
  const lastUpdated = new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'ro-RO', { year: 'numeric', month: 'long', day: 'numeric' });

  const sections = [
    { id: 'introduction', label: language === 'ro' ? 'Introducere' : 'Introduction' },
    { id: 'data-categories', label: language === 'ro' ? 'Categorii de Date' : 'Data Categories' },
    { id: 'processing-purpose', label: language === 'ro' ? 'Scopul Prelucrării' : 'Processing Purpose' },
    { id: 'authentication', label: language === 'ro' ? 'Autentificare' : 'Authentication' },
    { id: 'security', label: language === 'ro' ? 'Securitate' : 'Security' },
    { id: 'data-retention', label: language === 'ro' ? 'Păstrarea Datelor' : 'Data Retention' },
    { id: 'gdpr-statement', label: language === 'ro' ? 'Declarație GDPR' : 'GDPR Statement' },
    { id: 'data-subject-rights', label: language === 'ro' ? 'Drepturile Persoanei Vizate' : 'Data Subject Rights' },
    { id: 'contact', label: language === 'ro' ? 'Contact' : 'Contact' }
  ];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 space-y-6 md:space-y-0">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">{t('priv_title')}</h1>
          <p className="text-lg text-slate-600 max-w-2xl">{t('priv_subtitle')}</p>
        </div>
      </div>

      <div className="mb-12 text-center md:text-left">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
          {t('priv_last_updated')}: {lastUpdated}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <aside className="lg:col-span-1 hidden lg:block sticky top-8 h-fit">
          <nav className="space-y-1">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">{t('priv_sections')}</h3>
            {sections.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="w-full text-left block px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="lg:col-span-3 space-y-16">
          <section id="introduction" className="scroll-mt-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2.5 bg-blue-100 rounded-xl">
                <Info className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{t('priv_intro_title')}</h2>
            </div>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>{t('priv_intro_text1')}</p>
              <p>{t('priv_intro_text2')}</p>
            </div>
          </section>

          <section id="data-categories" className="scroll-mt-8 p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2.5 bg-indigo-100 rounded-xl">
                <Database className="h-6 w-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{t('priv_categories_title')}</h2>
            </div>
            <div className="space-y-8 text-slate-600">
              <p>{t('priv_categories_desc')}</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0">
                <li className="flex items-start space-x-4 p-5 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                    <div className="mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-200"></div>
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">{t('priv_id_data')}</span>
                      <span className="text-sm leading-relaxed">{t('priv_id_desc')}</span>
                    </div>
                </li>
                <li className="flex items-start space-x-4 p-5 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                    <div className="mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-200"></div>
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">{t('priv_academic_data')}</span>
                      <span className="text-sm leading-relaxed">{t('priv_academic_desc')}</span>
                    </div>
                </li>
                <li className="flex items-start space-x-4 p-5 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                    <div className="mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-200"></div>
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">{t('priv_prof_data')}</span>
                      <span className="text-sm leading-relaxed">{t('priv_prof_desc')}</span>
                    </div>
                </li>
                <li className="flex items-start space-x-4 p-5 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                    <div className="mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-200"></div>
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">{t('priv_contact_data')}</span>
                      <span className="text-sm leading-relaxed">{t('priv_contact_desc')}</span>
                    </div>
                </li>
              </ul>
            </div>
          </section>

          <section id="processing-purpose" className="scroll-mt-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2.5 bg-emerald-100 rounded-xl">
                <Eye className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{t('priv_purpose_title')}</h2>
            </div>
            <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
              <p>{t('priv_purpose_desc')}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[t('priv_purpose_1'), t('priv_purpose_2'), t('priv_purpose_3'), t('priv_purpose_4'), t('priv_purpose_5')].map((text, i) => (
                  <div key={i} className="flex items-center space-x-3 text-sm border-l-4 border-emerald-500 bg-emerald-50/50 p-4 rounded-r-xl font-medium text-slate-700">
                    <div className="h-2 w-2 rounded-full bg-emerald-600 shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="authentication" className="scroll-mt-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2.5 bg-amber-100 rounded-xl">
                <UserCheck className="h-6 w-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{t('priv_auth_title')}</h2>
            </div>
            <div className="bg-slate-900 text-slate-300 p-10 rounded-3xl shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <h4 className="text-white font-bold text-lg flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-amber-400" />
                    <span>{t('priv_auth_sso')}</span>
                  </h4>
                  <p className="text-sm leading-relaxed opacity-80">{t('priv_auth_sso_text')}</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-white font-bold text-lg flex items-center space-x-2">
                    <Users className="h-5 w-5 text-amber-400" />
                    <span>{t('priv_auth_rbac')}</span>
                  </h4>
                  <p className="text-sm leading-relaxed opacity-80">{t('priv_auth_rbac_text')}</p>
                </div>
              </div>
            </div>
          </section>

          <section id="security" className="scroll-mt-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2.5 bg-red-100 rounded-xl">
                <Lock className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{t('priv_security_title')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 border border-slate-200 rounded-3xl hover:border-red-200 hover:bg-red-50/30 transition-all group shadow-sm">
                <h4 className="font-bold text-slate-900 mb-3 text-lg group-hover:text-red-700 transition-colors">{t('priv_sec_transport')}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{t('priv_sec_transport_text')}</p>
              </div>
              <div className="p-8 border border-slate-200 rounded-3xl hover:border-red-200 hover:bg-red-50/30 transition-all group shadow-sm">
                <h4 className="font-bold text-slate-900 mb-3 text-lg group-hover:text-red-700 transition-colors">{t('priv_sec_integrity')}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{t('priv_sec_integrity_text')}</p>
              </div>
            </div>
          </section>

          <section id="data-retention" className="scroll-mt-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2.5 bg-violet-100 rounded-xl">
                <FileText className="h-6 w-6 text-violet-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{t('priv_retention_title')}</h2>
            </div>
            <div className="prose prose-slate max-w-none text-slate-600 p-8 bg-violet-50/50 rounded-3xl border border-violet-100">
              <p className="text-lg leading-relaxed font-medium text-slate-700">{t('priv_retention_text')}</p>
            </div>
          </section>

          <hr className="border-slate-200 my-16" />

          <section id="gdpr-statement" className="scroll-mt-8 p-10 md:p-16 bg-blue-600 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <Shield className="absolute -right-12 -bottom-12 h-64 w-64 opacity-10 rotate-12" />
            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-6 tracking-tight">{t('priv_gdpr_title')}</h2>
              <p className="text-blue-100 mb-10 text-lg leading-relaxed max-w-3xl font-medium">{t('priv_gdpr_text')}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h4 className="font-black text-white text-xl uppercase tracking-wider">{t('priv_gdpr_basis')}</h4>
                  <p className="text-blue-50 leading-relaxed opacity-90">{t('priv_gdpr_basis_text')}</p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-black text-white text-xl uppercase tracking-wider">{t('priv_gdpr_design')}</h4>
                  <p className="text-blue-50 leading-relaxed opacity-90">{t('priv_gdpr_design_text')}</p>
                </div>
              </div>
            </div>
          </section>

          <section id="data-subject-rights" className="scroll-mt-8">
            <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">{t('priv_rights_title')}</h2>
            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-lg group hover:border-blue-200 transition-all">
              <div className="p-8 bg-slate-50 border-b border-slate-200 group-hover:bg-blue-50/30 transition-colors">
                <p className="text-slate-700 text-lg leading-relaxed font-medium">
                  {t('priv_rights_text')}
                </p>
              </div>
              <div className="p-10">
                <h4 className="font-bold text-slate-900 mb-8 text-xl flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                  <span>{t('priv_rights_dpo')}</span>
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
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{language === 'ro' ? 'Adresă' : 'Address'}</p>
                      <span className="text-slate-900 font-bold leading-tight">Str. A.I. Cuza nr.13, Craiova, RO-200585</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="contact" className="scroll-mt-8 p-12 md:p-20 bg-slate-900 text-white rounded-[3rem] text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-blue-600 opacity-5 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-6 tracking-tight">{t('priv_questions_title')}</h2>
              <p className="text-slate-400 mb-12 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                {t('priv_questions_text')}
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
