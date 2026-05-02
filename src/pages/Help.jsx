import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Book, GraduationCap, Users, Settings, MessageSquare, Clock, Globe, ExternalLink, HelpCircle, Zap, Send, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function Help() {
  const { t, language } = useLanguage();
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      await api.post('/notifications/contact', contactForm);
      setStatus({ type: 'success', text: t('help_success_msg') });
      setContactForm({ subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', text: t('help_error_msg') });
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      title: language === 'ro' ? 'Secretariat' : 'Registrar & Secretariat',
      icon: Users,
      bgColor: 'bg-blue-600',
      textColor: 'text-blue-600',
      dotColor: 'bg-blue-500',
      docName: language === 'ro' ? 'Manual Operațional' : 'Operations Manual',
      docUrl: '/docs/secretariat',
      items: language === 'ro' ? [
        'Utilizarea colectării datelor bazate pe liste',
        'Gestionarea circulației documentelor electronice',
        'Importuri/exporturi bulk de date (Excel/CSV)',
        'Integrare Microsoft Outlook',
        'Generarea foilor matricole și a centralizatoarelor'
      ] : [
        'Using dropdown-based data collection',
        'Managing electronic document circulation',
        'Bulk data imports/exports (Excel/CSV)',
        'Microsoft Outlook integration',
        'Generating e-Transcripts & Centralizers'
      ]
    },
    {
      title: language === 'ro' ? 'Profesori și Personal Didactic' : 'Professors & Teaching Staff',
      icon: GraduationCap,
      bgColor: 'bg-emerald-600',
      textColor: 'text-emerald-600',
      dotColor: 'bg-emerald-500',
      docName: language === 'ro' ? 'Ghid de Pornire Rapidă' : 'Quick Start Guide',
      docUrl: '/docs/professors',
      items: language === 'ro' ? [
        'Autentificarea prin SSO-ul Universității',
        'Localizarea formațiunilor de studiu alocate',
        'Introducerea notelor de sesiune cu scurtături',
        'Finalizarea și trimiterea înregistrărilor'
      ] : [
        'Authenticating via University SSO',
        'Locating assigned study formations',
        'Entering session grades with shortcuts',
        'Finalizing and submitting records'
      ]
    },
    {
      title: language === 'ro' ? 'Studenți' : 'Students',
      icon: GraduationCap,
      bgColor: 'bg-amber-600',
      textColor: 'text-amber-600',
      dotColor: 'bg-amber-500',
      docName: language === 'ro' ? 'Ghidul Portalului Studenților' : 'Student Portal Guide',
      docUrl: '/docs/students',
      items: language === 'ro' ? [
        'Vizualizarea orarelor personale',
        'Interpretarea afișării notelor',
        'Urmărirea documentelor administrative',
        'Solicitarea documentelor online'
      ] : [
        'Viewing personal schedules',
        'Interpreting grade displays',
        'Tracking administrative documents',
        'Requesting documents online'
      ]
    },
    {
      title: language === 'ro' ? 'Administratori' : 'Administrators',
      icon: Settings,
      bgColor: 'bg-slate-600',
      textColor: 'text-slate-600',
      dotColor: 'bg-slate-500',
      docName: language === 'ro' ? 'Ghidul Administratorului' : 'Administrator Guide',
      docUrl: '/docs/admin',
      items: language === 'ro' ? [
        'Adaptarea site-ului și configurarea curriculei',
        'Maparea privilegiilor și grupurilor de utilizatori',
        'Managementul DBMS și log-urile de audit',
        'Backup-uri offline și recuperare la un moment dat'
      ] : [
        'Site adaptation & curricula config',
        'User privilege & group mapping',
        'DBMS management & audit logs',
        'Offline backups & point-in-time recovery'
      ]
    }
  ];

  return (
    <div className="flex-1 bg-slate-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">{t('help_hero_title')}</h1>
          <p className="text-slate-400 text-lg mb-10">{t('help_hero_subtitle')}</p>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
            <input 
              type="text" 
              placeholder={t('help_search_placeholder')}
              className="w-full bg-slate-800 border-none rounded-2xl py-5 pl-14 pr-6 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-2xl"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Quick Assistance */}
        <section className="mb-20">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HelpCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{t('help_immediate_title')}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t('help_context_title')}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t('help_context_desc')}
              </p>
            </div>
            <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t('help_tooltips_title')}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t('help_tooltips_desc')}
              </p>
            </div>
            <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
                <Settings className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t('help_error_title')}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t('help_error_desc')}
              </p>
            </div>
            <Link to="/shortcuts" className="p-8 bg-slate-900 rounded-2xl shadow-xl border border-slate-800 hover:scale-[1.02] transition-all group">
              <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('help_shortcuts_title')}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                {t('help_shortcuts_desc')}
              </p>
              <span className="text-blue-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                {language === 'ro' ? 'Învață Scurtăturile' : 'Learn Shortcuts'} <ExternalLink size={14} />
              </span>
            </Link>
          </div>
        </section>

        {/* Role Specific Documentation */}
        <section className="mb-20">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-slate-200 rounded-lg">
              <Book className="h-6 w-6 text-slate-700" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{t('help_role_doc_title')}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {roles.map((role, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col shadow-sm group">
                <div className={`p-6 ${role.bgColor} text-white flex justify-between items-center`}>
                  <div className="flex items-center space-x-4">
                    <role.icon className="h-8 w-8" />
                    <div>
                      <h3 className="text-xl font-bold">{t('help_for')} {role.title}</h3>
                      <p className="text-white/80 text-xs font-medium uppercase tracking-wider">{language === 'ro' ? 'Document' : 'Document'}: {role.docName}</p>
                    </div>
                  </div>
                  <Link to={role.docUrl}>
                    <ExternalLink className="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer text-white" />
                  </Link>
                </div>
                <div className="p-8 flex-1">
                  <ul className="space-y-4">
                    {role.items.map((item, i) => (
                      <li key={i} className="flex items-start space-x-3 text-slate-600">
                        <div className={`mt-1.5 h-1.5 w-1.5 rounded-full ${role.dotColor} flex-shrink-0`} />
                        <span className="text-sm font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                  <Link to={role.docUrl} className={`${role.textColor} text-sm font-bold hover:underline inline-block`}>
                    {t('help_view_doc')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Support */}
        <section className="bg-white rounded-3xl p-10 md:p-16 border border-slate-200 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-blue-600 translate-x-1/2 -skew-x-12 opacity-5 hidden lg:block" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6">{t('help_still_need_help')}</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                {t('help_support_desc')}
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">{t('help_support_portal')}</p>
                    <a href="https://support.ucv.ro" className="text-slate-900 font-bold hover:text-blue-600 transition-colors">support.ucv.ro</a>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">{t('help_email_support')}</p>
                    <p className="text-slate-900 font-bold">helpdesk@ucv.ro</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">{t('help_operating_hours')}</p>
                    <p className="text-slate-900 font-bold">{language === 'ro' ? 'Lun - Vin, 08:00 - 16:00' : 'Mon - Fri, 08:00 - 16:00'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
              <h4 className="text-xl font-bold text-slate-900 mb-2 text-center">{t('help_send_message')}</h4>
              <p className="text-sm text-slate-500 mb-6 text-center">{t('help_ticketing_desc')}</p>
              
              {status.text && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  {status.type === 'success' ? <CheckCircle size={18} /> : <HelpCircle size={18} />}
                  {status.text}
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">{t('help_subject')}</label>
                  <input 
                    required
                    type="text" 
                    value={contactForm.subject}
                    onChange={e => setContactForm({...contactForm, subject: e.target.value})}
                    placeholder={t('help_subject_placeholder')}
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">{t('help_message')}</label>
                  <textarea 
                    required
                    rows="4"
                    value={contactForm.message}
                    onChange={e => setContactForm({...contactForm, message: e.target.value})}
                    placeholder={t('help_message_placeholder')}
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-blue-50 outline-none transition-all resize-none"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send size={16} /> {loading ? t('help_transmitting') : t('help_submit_ticket')}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
