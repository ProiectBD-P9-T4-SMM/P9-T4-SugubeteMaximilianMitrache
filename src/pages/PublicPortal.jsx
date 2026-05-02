import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Users, Shield, ArrowRight, CheckCircle, 
  ExternalLink, Layers, Database, ChevronRight, Menu, X,
  Calendar, Info, Terminal, Layout, WifiOff, RefreshCw
} from 'lucide-react';
import { publicService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const HERO_IMAGE = "hero_university.png";

export default function PublicPortal() {
  const [curricula, setCurricula] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [fetchError, setFetchError] = useState(null); // null | 'network' | 'server'
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('curricula');
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const repositoryRef = useRef(null);

  // ── Offline detection ──────────────────────────────────────────────────
  useEffect(() => {
    const goOnline  = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);
    window.addEventListener('online',  goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online',  goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // ── Scroll + initial fetch ────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    fetchCurricula();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchCurricula = useCallback(async (isRetry = false) => {
    if (isRetry) setRetrying(true);
    else setLoading(true);
    setFetchError(null);
    try {
      const [curRes, setRes] = await Promise.all([
        publicService.getCurricula(),
        publicService.getSettings()
      ]);
      setCurricula(curRes.data);
      setSettings(setRes.data?.settings || {});
    } catch (err) {
      console.error('[PublicPortal] Failed to load curricula:', err);
      setFetchError(!err.response ? 'network' : 'server');
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  }, []);

  const scrollToRepository = () => {
    repositoryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Shield size={24} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">AFSMS <span className="text-blue-600">Core</span></span>
          </div>

          {/* Offline pill in nav */}
          {isOffline && (
            <div className="hidden md:flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              <WifiOff size={12} /> {t('err_offline_banner').split('.')[0]}
            </div>
          )}

          <div className="hidden md:flex items-center gap-8">
            <NavLink href="#announcements" label={t('pub_announcements')} />
            <NavLink href="#repository" label={t('pub_explore_curricula')} />
            <NavLink href="#architecture" label={t('pub_architecture')} />
            <button 
              onClick={() => navigate('/login')}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200"
            >
              {t('pub_get_started')}
            </button>
          </div>

          <button className="md:hidden text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col gap-6">
            <MobileNavLink href="#announcements" label={t('pub_announcements')} onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink href="#repository" label={t('pub_explore_curricula')} onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink href="#architecture" label={t('pub_architecture')} onClick={() => setMobileMenuOpen(false)} />
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest"
            >
              {t('pub_get_started')}
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Terminal size={14} /> System Version 1.0 Ready
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 [text-shadow:_0_4px_12px_rgb(0_0_0_/_5%)]">
                {t('pub_hero_title')}
              </h1>
              <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                {language === 'ro' 
                  ? `Susținem studenții și facultatea cu soluții avansate de management digital la ${settings.faculty_name || 'Facultatea de Automatică, Calculatoare și Electronică'}.`
                  : `Empowering students and faculty with advanced digital management solutions at the ${settings.faculty_name_en || 'Faculty of Automation, Computers and Electronics'}.`}
              </p>
              <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <button 
                  onClick={scrollToRepository}
                  className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3"
                >
                  {t('pub_learn_more')} <ArrowRight size={18} />
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-white text-slate-900 border-2 border-slate-100 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:border-slate-900 transition-all active:scale-95"
                >
                  {t('pub_get_started')}
                </button>
              </div>
            </div>

            <div className="relative animate-in fade-in zoom-in duration-1000 delay-200 mt-12 lg:mt-0">
              <div className="relative w-full aspect-video lg:aspect-[4/3] group">
                <div className="absolute inset-0 bg-blue-600/10 rounded-[3rem] rotate-3 transition-transform group-hover:rotate-1"></div>
                <img 
                  src={HERO_IMAGE} 
                  alt="University" 
                  className="relative w-full h-full object-cover rounded-[3rem] shadow-2xl border-8 border-white transition-transform group-hover:-translate-y-2 group-hover:-translate-x-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-100/20 rounded-full blur-[100px]"></div>
        </div>
      </section>

      {/* Announcements Section */}
      <section id="announcements" className="py-24 bg-slate-50/50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-4">{t('pub_announcements')}</h2>
              <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnnouncementCard 
              date="May 02, 2026"
              title={language === 'ro' ? "Lansarea Versiunii 1.0 AFSMS" : "AFSMS Version 1.0 Release"}
              desc={language === 'ro' ? "Sistemul integrat de management academic este acum live pentru toți studenții și profesorii." : "The integrated academic management system is now live for all students and faculty."}
              tag="System"
            />
            <AnnouncementCard 
              date="April 28, 2026"
              title={language === 'ro' ? "Program Sesiune Vară" : "Summer Session Schedule"}
              desc={language === 'ro' ? "Calendarul oficial pentru examenele din sesiunea de vară a fost publicat în depozitarul academic." : "The official calendar for summer session exams has been published in the academic repository."}
              tag="Academic"
            />
            <AnnouncementCard 
              date="April 25, 2026"
              title={language === 'ro' ? "Noi Diagrame de Arhitectură" : "New Architecture Diagrams"}
              desc={language === 'ro' ? "Documentația tehnică a fost actualizată cu noile fluxuri de lucru pentru secretariat." : "Technical documentation updated with new secretariat workflow diagrams."}
              tag="Docs"
            />
          </div>
        </div>
      </section>

      {/* Academic Repository */}
      <section id="repository" ref={repositoryRef} className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <h2 className="text-5xl font-black tracking-tight mb-6">{t('pub_explore_curricula')}</h2>
            <p className="text-lg text-slate-500 font-medium">{language === 'ro' ? "Acces deplin la planurile de învățământ, structura disciplinelor și creditele ECTS alocate pentru toate specializările facultății." : "Full access to study plans, discipline structures, and allocated ECTS credits for all faculty specializations."}</p>
          </div>

          <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('th_specialization')}</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('th_year')}</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('th_semester')}</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('th_discipline')}</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('th_credits')}</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('th_type')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan="6" className="py-20 text-center"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" /> <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('public_loading')}</span></td></tr>
                  ) : fetchError ? (
                    <tr>
                      <td colSpan="6" className="py-16 text-center">
                        <div className="inline-flex flex-col items-center gap-4">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 border border-rose-100">
                            {fetchError === 'network'
                              ? <WifiOff size={28} className="text-rose-400" />
                              : <RefreshCw size={28} className="text-rose-400" />
                            }
                          </div>
                          <div>
                            <p className="font-black text-slate-700 text-sm mb-1">{t('err_public_curricula')}</p>
                            <p className="text-xs text-slate-400 font-medium">
                              {fetchError === 'network' ? t('err_network') : t('err_server')}
                            </p>
                          </div>
                          <button
                            id="public-portal-retry-btn"
                            onClick={() => fetchCurricula(true)}
                            disabled={retrying || isOffline}
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            <RefreshCw size={14} className={retrying ? 'animate-spin' : ''} />
                            {retrying ? t('btn_retry_loading') : t('btn_retry')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : curricula.length === 0 ? (
                    <tr><td colSpan="6" className="py-20 text-center text-slate-300 font-black italic">{t('public_no_data')}</td></tr>
                  ) : curricula.map((row) => (
                    <tr key={row.id} className="group hover:bg-blue-50/30 transition-all">
                      <td className="px-8 py-6"><span className="font-black text-slate-900 text-sm">{row.specialization_name}</span></td>
                      <td className="px-8 py-6"><span className="font-bold text-slate-500 text-xs">{t('unit_year')} {row.study_year}</span></td>
                      <td className="px-8 py-6"><span className="font-bold text-slate-500 text-xs">{t('unit_sem')} {row.semester}</span></td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-800 text-sm">{row.discipline_name}</span>
                          <span className="text-[10px] text-blue-600 font-black uppercase mt-0.5">{row.discipline_code}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6"><span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black">{row.ects_credits} ECTS</span></td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${row.evaluation_type === 'EXAM' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                          {row.evaluation_type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* System Architecture Section */}
      <section id="architecture" className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="container mx-auto px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
                <Layout size={14} /> Architecture Insight
              </div>
              <h2 className="text-5xl font-black tracking-tight mb-8 leading-tight">{t('pub_architecture')}</h2>
              <p className="text-lg text-slate-400 font-medium mb-12">
                {language === 'ro' ? "AFSMS este construit pe o arhitectură robustă, securizată, care utilizează SSO și RBAC pentru a asigura integritatea datelor academice. Explorați logicile noastre de proces prin diagramele de sistem oficiale." : "AFSMS is built on a robust, secure architecture that utilizes SSO and RBAC to ensure the integrity of academic data. Explore our process logic through official system diagrams."}
              </p>
              
              <div className="space-y-6">
                <ArchitectureItem 
                  icon={Shield} 
                  title={language === 'ro' ? "Securitate Centralizată" : "Centralized Security"}
                  desc={language === 'ro' ? "Autentificare unificată prin SSO și control al accesului bazat pe roluri (RBAC)." : "Unified SSO authentication and Role-Based Access Control (RBAC)."}
                />
                <ArchitectureItem 
                  icon={Database} 
                  title={language === 'ro' ? "Integritatea Datelor" : "Data Integrity"}
                  desc={language === 'ro' ? "Fiecare modificare este înregistrată în jurnalele de audit pentru o trasabilitate completă." : "Every modification is recorded in audit logs for full traceability."}
                />
                <ArchitectureItem 
                  icon={Layers} 
                  title={language === 'ro' ? "Modularitate Scalabilă" : "Scalable Modularity"}
                  desc={language === 'ro' ? "Design modular care permite extinderea facilă a funcționalităților academice." : "Modular design allowing easy expansion of academic features."}
                />
              </div>

              <button 
                onClick={() => navigate('/sugu-diagrams')}
                className="mt-12 bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-400 hover:text-white transition-all flex items-center gap-3"
              >
                {t('pub_view_details')} <ChevronRight size={18} />
              </button>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-slate-800 p-4 rounded-[2rem] shadow-2xl border border-slate-700">
                <img 
                  src="diagrams/sugu/use-case/use-case_v1.svg" 
                  alt="High-level Architecture" 
                  className="w-full h-auto rounded-xl filter invert grayscale brightness-200"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="max-w-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-slate-900 p-2 rounded-xl text-white">
                  <Shield size={24} />
                </div>
                <span className="text-xl font-black tracking-tighter uppercase">AFSMS <span className="text-blue-600">Core</span></span>
              </div>
              <p className="text-sm text-slate-500 font-bold leading-relaxed mb-8">
                Integrated Academic Management System for the {settings.institution_name_en || 'University of Craiova'}. Built for excellence in education and administrative efficiency.
              </p>
              <div className="flex gap-4">
                 <SocialLink href="#" label="Twitter" />
                 <SocialLink href="#" label="LinkedIn" />
                 <SocialLink href="#" label="GitHub" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <FooterColumn title="Platform" links={[{label: 'Announcements', href:'#announcements'}, {label: 'Repository', href:'#repository'}, {label: 'System Logic', href:'#architecture'}]} />
              <FooterColumn title="Legal" links={[{label: 'Privacy Policy', href:'/privacy'}, {label: 'Terms of Use', href:'#'}, {label: 'Cookie Policy', href:'#'}]} />
              <FooterColumn title="Support" links={[{label: 'Help Center', href:'/help'}, {label: 'Contact', href:'/contact'}, {label: 'Technical FAQ', href:'#'}]} />
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <p>© {new Date().getFullYear()} {language === 'ro' ? settings.institution_name : settings.institution_name_en} - {language === 'ro' ? settings.faculty_name : settings.faculty_name_en}</p>
            <p>Designed by Sugubete Andrei & Maximilian Mitrache</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Components
function NavLink({ href, label }) {
  return (
    <a href={href} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">
      {label}
    </a>
  );
}

function MobileNavLink({ href, label, onClick }) {
  return (
    <a href={href} onClick={onClick} className="text-2xl font-black tracking-tight text-slate-900">
      {label}
    </a>
  );
}

function AnnouncementCard({ date, title, desc, tag }) {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 hover:-translate-y-2 transition-all group">
      <div className="flex justify-between items-center mb-6">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Calendar size={14} /> {date}
        </span>
        <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">{tag}</span>
      </div>
      <h3 className="text-xl font-black mb-4 group-hover:text-blue-600 transition-colors">{title}</h3>
      <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">{desc}</p>
      <button className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest group-hover:gap-3 transition-all">
        Read More <ChevronRight size={14} className="text-blue-600" />
      </button>
    </div>
  );
}

function ArchitectureItem({ icon: Icon, title, desc }) {
  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0 w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-blue-400">
        <Icon size={24} />
      </div>
      <div>
        <h4 className="text-lg font-black mb-1">{title}</h4>
        <p className="text-sm text-slate-400 font-medium">{desc}</p>
      </div>
    </div>
  );
}

function SocialLink({ label }) {
  return (
    <a href="#" className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
      <Info size={18} />
    </a>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{title}</h5>
      <ul className="space-y-4">
        {links.map(link => (
          <li key={link.label}>
            <a href={link.href} className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">{link.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
