import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../services/api';
import { 
  ChevronDown, 
  ChevronRight, 
  GraduationCap, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Calendar, 
  FileText,
  Download,
  Award,
  BookOpen,
  FileBadge
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { generateFullTranscript } from '../utils/transcriptGenerator';

export default function MyGrades() {
  const { t, language } = useLanguage();
  const [plans, setPlans] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedYears, setExpandedYears] = useState({});
  
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/academic/my-grades');
      if (response.data.success) {
        setStudentInfo(response.data.studentInfo);
        setPlans(response.data.academicPlans || []);
        
        // Initialize expanded years for all plans
        const initialExpanded = {};
        response.data.academicPlans.forEach(plan => {
          initialExpanded[plan.curriculum_id] = { '1': true, '2': true, '3': true, '4': true };
        });
        setExpandedYears(initialExpanded);
      }
    } catch (err) {
      setError(err.response?.data?.message || (language === 'ro' ? 'Eroare la preluarea datelor academice.' : 'Error fetching academic data.'));
    } finally {
      setLoading(false);
    }
  };

  const toggleYear = (planId, year) => {
    setExpandedYears(prev => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        [year]: !prev[planId][year]
      }
    }));
  };

  const getStructuredData = (records) => {
    const years = {};
    records.forEach(discipline => {
      const year = Math.ceil(discipline.semester / 2);
      const semesterInYear = discipline.semester % 2 === 0 ? 2 : 1;
      if (!years[year]) years[year] = { 1: [], 2: [] };
      years[year][semesterInYear].push(discipline);
    });
    return years;
  };

  const calculateStats = (records) => {
    let totalCredits = 0;
    let earnedCredits = 0;
    let gradeSum = 0;
    let gradedCount = 0;

    records.forEach(d => {
      totalCredits += d.ects_credits;
      if (d.grade_value && d.grade_value >= 5) {
        earnedCredits += d.ects_credits;
        gradeSum += d.grade_value;
        gradedCount++;
      }
    });

    return {
      totalCredits,
      earnedCredits,
      average: gradedCount > 0 ? (gradeSum / gradedCount).toFixed(2) : '-',
      progress: totalCredits > 0 ? Math.round((earnedCredits / totalCredits) * 100) : 0
    };
  };

  const sanitize = (text) => {
    if (!text) return '';
    return text.toString()
      .replace(/ș/g, 's').replace(/Ș/g, 'S')
      .replace(/ț/g, 't').replace(/Ț/g, 'T')
      .replace(/ă/g, 'a').replace(/Ă/g, 'A')
      .replace(/î/g, 'i').replace(/Î/g, 'I')
      .replace(/â/g, 'a').replace(/Â/g, 'A');
  };

  const handleExportFormalTranscript = async () => {
    if (!studentInfo || plans.length === 0) return;
    try {
      // Adding a simple loading indicator in console or UI if needed
      await generateFullTranscript({
        studentInfo,
        academicPlans: plans
      }, language);
    } catch (err) {
      console.error('Formal Transcript Error:', err);
      alert((language === 'ro' ? 'Eroare la generarea documentului oficial: ' : 'Error generating official document: ') + err.message);
    }
  };


  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
      <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-xl font-bold text-slate-800 mb-2">Oops!</h3>
      <p className="text-slate-600">{error}</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-slate-50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2 text-blue-600">
              <GraduationCap size={28} />
              <h1 className="text-3xl font-bold tracking-tight">{t('myg_title')}</h1>
            </div>
            <p className="text-slate-500 text-lg">
              <strong>{studentInfo.last_name} {studentInfo.first_name}</strong> | {t('myg_reg_num')}: {studentInfo.registration_number}
            </p>
          </div>
          <button 
            onClick={handleExportFormalTranscript}
            className="group bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-black transition-all flex items-center gap-3 active:scale-95"
          >
            <FileBadge size={20} className="text-blue-400" />
            {t('gen_transcript')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 border-t border-slate-100 pt-8">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('myg_general_status')}</p>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${studentInfo.status === 'ENROLLED' || studentInfo.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
              <p className="text-slate-700 font-semibold">
                {studentInfo.status === 'ACTIVE' 
                  ? t('myg_active_student') 
                  : studentInfo.status === 'ENROLLED' 
                    ? t('myg_pending') 
                    : t('myg_inactive')}
              </p>
            </div>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('myg_active_plans')}</p>
            <p className="text-slate-700 font-bold text-xl">{plans.length} {t('myg_study_programs')}</p>
          </div>
        </div>
      </div>

      {/* RENDER EACH PLAN SEPARATELY */}
      <div className="space-y-16">
        {plans.map((plan, planIdx) => {
          const stats = calculateStats(plan.records);
          const structuredData = getStructuredData(plan.records);
          
          return (
            <div key={plan.curriculum_id} className="relative">
              {/* Plan Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3">
                  <BookOpen className="text-blue-600" size={20} />
                  <span className="font-bold text-slate-800 uppercase tracking-wide">{t('myg_plan')}: {plan.curriculum_name}</span>
                </div>
                <div className="h-px flex-1 bg-slate-200"></div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{plan.specialization_name} ({plan.specialization_code})</p>
                    <p className="text-sm text-slate-500 font-medium">{t('myg_degree_cycle')}: {plan.degree_level} | Status: {plan.records.length > 0 ? t('myg_in_progress') : t('myg_no_activity')}</p>
                  </div>
                  
                  <div className="flex gap-8">
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{t('myg_plan_average')}</p>
                      <p className="text-xl font-black text-blue-700">{stats.average}</p>
                    </div>
                    <div className="min-w-[150px]">
                      <div className="flex justify-between items-end mb-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{t('myg_credit_progress')}</p>
                        <p className="text-[10px] font-bold text-slate-700">{stats.earnedCredits} / {stats.totalCredits} PC</p>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${stats.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {Object.entries(structuredData).map(([year, semesters]) => {
                    const isExpanded = expandedYears[plan.curriculum_id]?.[year];
                    
                    return (
                      <div key={year} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/30">
                        <button 
                          onClick={() => toggleYear(plan.curriculum_id, year)}
                          className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition border-b border-slate-100"
                        >
                          <div className="flex items-center gap-3">
                            {isExpanded ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                            <h3 className="text-base font-bold text-slate-800">{t('unit_year')} {year}</h3>
                          </div>
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                            {semesters[1].length + semesters[2].length} {t('myg_disciplines')}
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="p-4 space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
                            {[1, 2].map(sem => (
                              <div key={sem}>
                                {semesters[sem].length > 0 && (
                                  <>
                                    <div className="flex items-center gap-2 mb-3 px-2">
                                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('myg_semester')} {sem}</span>
                                      <div className="h-px flex-1 bg-slate-100"></div>
                                    </div>
                                    <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm bg-white">
                                      <table className="w-full text-xs text-left">
                                        <thead>
                                          <tr className="bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                                            <th className="px-4 py-3">{t('myg_th_discipline')}</th>
                                            <th className="px-4 py-3 text-center">{t('myg_th_credits')}</th>
                                            <th className="px-4 py-3 text-center">{t('myg_th_grade')}</th>
                                            <th className="px-4 py-3 text-center">{t('myg_th_status')}</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                          {semesters[sem].map((d, idx) => {
                                            const isPromoted = d.grade_value && d.grade_value >= 5;
                                            return (
                                              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-4 py-3">
                                                  <div className="font-bold text-slate-700">{d.discipline_name}</div>
                                                  <div className="text-[9px] text-slate-400 font-mono">{d.discipline_code}</div>
                                                </td>
                                                <td className="px-4 py-3 text-center font-bold text-slate-600">{d.ects_credits}</td>
                                                <td className="px-4 py-3 text-center">
                                                  {d.grade_value ? (
                                                    <span className={`text-sm font-black ${isPromoted ? 'text-emerald-600' : 'text-red-600'}`}>
                                                      {d.grade_value}
                                                    </span>
                                                  ) : (
                                                    <span className="text-slate-300 italic">{t('myg_not_examined')}</span>
                                                  )}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                  {isPromoted ? (
                                                    <CheckCircle size={14} className="mx-auto text-emerald-500" />
                                                  ) : d.grade_value ? (
                                                    <XCircle size={14} className="mx-auto text-red-500" />
                                                  ) : (
                                                    <AlertCircle size={14} className="mx-auto text-amber-400" />
                                                  )}
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </table>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <footer className="mt-24 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest space-y-2 pb-12">
        <p>Powered by AFSMS Core | {t('myg_footer_rmu')}</p>
        <p>© 2026 Universitatea din Craiova. {t('myg_footer_rights')}</p>
        <p>© 2026 AFSMS University System. {t('myg_footer_rights')}</p>
        <div className="flex justify-center gap-4 pt-2">
            <span className="hover:text-slate-600 cursor-pointer">{t('nav_privacy')} / GDPR</span>
            <span className="hover:text-slate-600 cursor-pointer">{t('nav_contact')}</span>
            <span className="hover:text-slate-600 cursor-pointer">{t('nav_help')}</span>
        </div>
      </footer>
    </div>
  );
}
