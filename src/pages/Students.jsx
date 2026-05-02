import { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { 
  Database, Plus, Search, Edit, Trash, BookOpen, X, Check, 
  MapPin, Calendar, Users, Save, ChevronRight, Layers, 
  Download, Filter, AlertCircle, Shield, UserPlus, GraduationCap,
  FileBadge
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { academicService, lookupService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { generateFullTranscript } from '../utils/transcriptGenerator';
import api from '../services/api';

export default function Students() {
  const searchRef = useRef(null);
  const { t, language } = useLanguage();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formations, setFormations] = useState([]);
  const [curricula, setCurricula] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({
    first_name: '', last_name: '', email: '', status: 'ENROLLED'
  });
  
  // Enrollment management
  const [studentEnrollments, setStudentEnrollments] = useState([]);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [editingEnrollmentId, setEditingEnrollmentId] = useState(null);
  
  // Selection state for enrollment
  const [selectedSpecId, setSelectedSpecId] = useState('');
  const [selectedCurriculumId, setSelectedCurriculumId] = useState('');
  const [enrollmentFormationId, setEnrollmentFormationId] = useState('');
  const [formationSel, setFormationSel] = useState({ eduForm: '', year: '', group: '', sub: '' });
  const [message, setMessage] = useState({ type: '', text: '', suggestion: '', hint: '' });

  useKeyboardShortcuts({
    'Alt+A': () => {
      setEditingStudent(null);
      setStudentForm({ first_name: '', last_name: '', email: '', status: 'ENROLLED' });
      setShowModal(true);
    },
    '/': (e) => {
      if (document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    },
    'Escape': () => setShowModal(false)
  });

  useEffect(() => { 
    fetchStudents(); 
    fetchFormations();
    fetchCurricula();
    fetchSpecializations();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try { 
      const res = await academicService.getStudents(); 
      setStudents(res.data); 
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchFormations = async () => {
    try {
      const res = await lookupService.getStudyFormations();
      setFormations(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchCurricula = async () => {
    try {
      const res = await academicService.getCurricula();
      if (res.data.success) setCurricula(res.data.curricula);
    } catch (err) { console.error(err); }
  };

  const fetchSpecializations = async () => {
    try {
      const res = await lookupService.getSpecializations();
      if (res.data.success) setSpecializations(res.data.specializations);
    } catch (err) { console.error(err); }
  };

  const fetchStudentEnrollments = async (studentId) => {
    try {
      const res = await academicService.getStudentEnrollments(studentId);
      if (res.data.success) setStudentEnrollments(res.data.enrollments);
    } catch (err) { console.error(err); }
  };

  const handleEnrollStudent = async () => {
    if (!selectedCurriculumId || !editingStudent || !enrollmentFormationId) {
      alert(language === 'ro' ? 'Vă rugăm să completați toate selecțiile (Plan + Formațiune).' : 'Please complete all selections (Plan + Formation).');
      return;
    }
    try {
      await academicService.enrollStudent({
        student_id: editingStudent.id,
        curriculum_id: selectedCurriculumId,
        study_formation_id: enrollmentFormationId
      });
      fetchStudentEnrollments(editingStudent.id);
      resetEnrollmentForm();
    } catch (err) { alert(language === 'ro' ? 'Eroare la înscriere.' : 'Enrollment error.'); }
  };

  const handleUpdateEnrollment = async (currId) => {
    if (!enrollmentFormationId) return;
    try {
        await academicService.updateEnrollmentFormation({
            student_id: editingStudent.id,
            curriculum_id: currId,
            study_formation_id: enrollmentFormationId
        });
        fetchStudentEnrollments(editingStudent.id);
        resetEnrollmentForm();
    } catch (err) { alert(language === 'ro' ? 'Eroare la actualizare.' : 'Update error.'); }
  };

  const resetEnrollmentForm = () => {
    setIsAddingPlan(false);
    setEditingEnrollmentId(null);
    setSelectedSpecId('');
    setSelectedCurriculumId('');
    setEnrollmentFormationId('');
    setFormationSel({ eduForm: '', year: '', group: '', sub: '' });
  };

  const startEditEnrollment = (enr) => {
    setIsAddingPlan(false);
    setEditingEnrollmentId(enr.curriculum_id);
    setSelectedSpecId(enr.specialization_id);
    setSelectedCurriculumId(enr.curriculum_id);
    setEnrollmentFormationId(enr.study_formation_id);
    
    const formInfo = formations.find(f => f.id === enr.study_formation_id);
    if (formInfo) {
      setFormationSel({
        eduForm: formInfo.education_form,
        year: String(formInfo.study_year),
        group: String(formInfo.group_index),
        sub: formInfo.code.slice(-1)
      });
    }
  };

  const handleUnenrollStudent = async (currId) => {
    if (!window.confirm(language === 'ro' ? "Eliminați acest plan academic?" : "Remove this academic plan?")) return;
    try {
      await academicService.unenrollStudent(editingStudent.id, currId);
      fetchStudentEnrollments(editingStudent.id);
    } catch (err) { alert(language === 'ro' ? 'Eroare la eliminarea planului.' : 'Error removing plan.'); }
  };

  const activeSpec = specializations.find(s => s.id === selectedSpecId);
  const specCode = activeSpec?.code || '';
  const filteredCurricula = curricula.filter(c => c.specialization_id === selectedSpecId);
  
  const filteredEduForms = [...new Set(formations.filter(f => f.spec_code === specCode).map(f => f.education_form))].sort();
  const filteredYears = [...new Set(formations.filter(f => f.spec_code === specCode && f.education_form === formationSel.eduForm).map(f => f.study_year))].sort();
  const filteredGroups = [...new Set(formations.filter(f => f.spec_code === specCode && f.education_form === formationSel.eduForm && f.study_year === parseInt(formationSel.year)).map(f => f.group_index))].sort();
  const filteredSubs = formations.filter(f => f.spec_code === specCode && f.education_form === formationSel.eduForm && f.study_year === parseInt(formationSel.year) && f.group_index === parseInt(formationSel.group)).map(f => f.code.slice(-1));

  useEffect(() => {
    if (specCode && formationSel.eduForm && formationSel.year && formationSel.group && formationSel.sub) {
      const match = formations.find(f => f.spec_code === specCode && f.education_form === formationSel.eduForm && f.study_year === parseInt(formationSel.year) && f.group_index === parseInt(formationSel.group) && f.code.endsWith(formationSel.sub));
      setEnrollmentFormationId(match?.id || '');
    }
  }, [formationSel, specCode, formations]);

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    try {
      const payload = { first_name: studentForm.first_name, last_name: studentForm.last_name, email: studentForm.email, status: studentForm.status };
      if (editingStudent) await academicService.updateStudent(editingStudent.id, payload);
      else await academicService.addStudent(studentForm);
      setShowModal(false); fetchStudents();
    } catch (err) { 
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || (language === 'ro' ? 'Eroare la salvare.' : 'Failed to save'),
        suggestion: err.response?.data?.suggestion,
        hint: err.response?.data?.resolutionHint
      });
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm(t('confirm_delete'))) return;
    try { await academicService.deleteStudent(id); fetchStudents(); } catch (err) { alert(language === 'ro' ? 'Eroare la ștergere.' : 'Delete error.'); }
  };

  const openEditModal = (student) => {
    setMessage({ type: '', text: '', suggestion: '', hint: '' });
    setEditingStudent(student);
    setStudentForm({
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      status: student.status
    });
    fetchStudentEnrollments(student.id);
    setShowModal(true);
  };

  const handleGenerateOfficialTranscript = async () => {
    if (!editingStudent) return;
    try {
        const [res, settingsRes] = await Promise.all([
           api.get(`/academic/transcript/${editingStudent.id}`),
           api.get(`/public/settings`)
        ]);
        if (res.data.success) {
            const dataToPass = {
                ...res.data,
                settings: settingsRes.data?.settings || {}
            };
            await generateFullTranscript(dataToPass, language);
        }
    } catch (err) {
        alert(language === 'ro' ? 'Eroare la generarea documentului.' : 'Error generating document.');
    }
  };

  const handleExportExcel = () => {
    const exportData = filteredStudents.map(s => ({
      [language === 'ro' ? 'Nr. Matricol' : 'Matriculation No.']: s.registration_number,
      [language === 'ro' ? 'Identitate' : 'Identity']: `${s.last_name} ${s.first_name}`,
      'Email': s.email,
      'Status': s.status,
      [language === 'ro' ? 'Programe' : 'Programs']: s.enrollments?.map(e => e.curriculum_name).join(', ') || (language === 'ro' ? 'Neînscris' : 'Not Enrolled')
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, `Student_Registry_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const filteredStudents = students.filter(s => 
    s.status !== 'INACTIVE' &&
    (s.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     s.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     s.registration_number.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 bg-slate-50/50 min-h-screen p-8 lg:p-12 animate-in fade-in duration-500">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">{t('std_title')}</h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
            <Shield size={16} className="text-blue-600" /> {t('std_subtitle')}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <label className="group bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 border border-slate-100 hover:bg-slate-900 hover:text-white transition-all cursor-pointer flex items-center gap-3">
            <Database size={18} />
            <span>{t('upload')}</span>
            <input type="file" accept=".xlsx,.xls" className="hidden" onChange={async (e) => {
               const file = e.target.files[0];
               if (!file) return;

               // ── Security: validate extension & MIME ──────────────────────
               const allowedExts = ['.xlsx', '.xls'];
               const ext = '.' + file.name.split('.').pop().toLowerCase();
               if (!allowedExts.includes(ext)) {
                 alert(language === 'ro' ? 'Tip de fișier invalid. Doar .xlsx și .xls sunt acceptate.' : 'Invalid file type. Only .xlsx and .xls are accepted.');
                 e.target.value = null;
                 return;
               }

               // ── Security: enforce 5 MB size cap (mitigates ReDoS) ────────
               const MAX_BYTES = 5 * 1024 * 1024;
               if (file.size > MAX_BYTES) {
                 alert(language === 'ro' ? 'Fișierul depășește limita de 5 MB.' : 'File exceeds the 5 MB limit.');
                 e.target.value = null;
                 return;
               }

               const reader = new FileReader();
               reader.onload = async (evt) => {
                 try {
                   // Use ArrayBuffer (safer than binary string) + sheetStubs:false to avoid prototype pollution
                   const workbook = XLSX.read(evt.target.result, { type: 'array', sheetStubs: false });
                   const sheetName = workbook.SheetNames[0];
                   const rawRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

                   // ── Security: strip prototype-polluting keys ─────────────
                   const BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
                   const sanitized = rawRows.map(row => {
                     const clean = Object.create(null);
                     for (const [k, v] of Object.entries(row)) {
                       if (!BLOCKED_KEYS.has(k)) clean[k] = v;
                     }
                     return clean;
                   });

                   const res = await academicService.addStudentsBulk(sanitized);
                   alert(res.data.message);
                   fetchStudents();
                 } catch (err) {
                   console.error('[XLSX Import]', err);
                   alert(language === 'ro' ? 'Import eșuat. Verificați formatul fișierului.' : 'Import failed. Check the file format.');
                 }
               };
               reader.readAsArrayBuffer(file);
               e.target.value = null;
            }} />
          </label>
          <button onClick={handleExportExcel} className="group bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 border border-slate-100 hover:bg-slate-900 hover:text-white transition-all flex items-center gap-3">
            <Download size={18} /> {t('download')}
          </button>
          <button onClick={() => { setMessage({ type: '', text: '', suggestion: '', hint: '' }); setEditingStudent(null); setStudentForm({first_name:'', last_name:'', email:'', status:'ENROLLED'}); setShowModal(true); }} className="group bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center gap-3">
            <UserPlus size={18} /> {t('add_student')}
          </button>
        </div>
      </header>

      {/* Search & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10 items-center">
        <div className="lg:col-span-3 relative group">
          <input 
            ref={searchRef}
            type="text" 
            placeholder={language === 'ro' ? 'Caută după nume sau număr matricol...' : "Search by name or registration number..."} 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border-none rounded-3xl p-6 pl-14 text-sm font-bold shadow-xl shadow-slate-200/50 outline-none focus:ring-4 focus:ring-blue-50 transition-all"
          />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500" size={20} />
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center justify-between">
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('sec_active_students')}</p>
              <h4 className="text-3xl font-black text-slate-900">{filteredStudents.length}</h4>
           </div>
           <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl"><Users size={24}/></div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <TableHead label={t('th_reg_num')} />
                <TableHead label={t('th_name')} />
                <TableHead label={language === 'ro' ? 'Planuri Academice' : 'Academic Programs'} />
                <TableHead label={t('th_status')} />
                <TableHead label={t('th_actions')} />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="py-20 text-center text-slate-300 animate-pulse font-black uppercase tracking-widest">{language === 'ro' ? 'Se reîmprospătează Registrul...' : 'Refreshing Registry...'}</td></tr>
              ) : filteredStudents.map((row) => (
                <tr key={row.id} className="group hover:bg-blue-50/30 transition-all">
                  <td className="px-8 py-6">
                    <span className="font-mono text-[11px] font-black text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl group-hover:bg-white group-hover:text-blue-600 transition-all">{row.registration_number}</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-900 text-base">{row.last_name} {row.first_name}</p>
                    <p className="text-[11px] text-slate-400 font-bold lowercase mt-0.5">{row.email}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${Number(row.plan_count) > 0 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-300'}`}>
                        <GraduationCap size={16} />
                      </div>
                      <div>
                        <p className={`text-xs font-black truncate max-w-[240px] ${Number(row.plan_count) > 0 ? 'text-slate-800' : 'text-slate-300 italic'}`}>
                          {row.enrollments?.map(e => e.curriculum_name).join(', ') || (language === 'ro' ? 'În așteptare plan' : 'Awaiting Plan')}
                        </p>
                        {Number(row.plan_count) > 0 && <p className="text-[9px] text-blue-500 font-black uppercase mt-1">{language === 'ro' ? 'Înscriere Activă' : 'Active Enrollment'}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button onClick={() => openEditModal(row)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black hover:scale-105 transition-all shadow-lg flex items-center gap-2">
                          {language === 'ro' ? 'Vezi Dosar' : 'View File'} <ChevronRight size={14} />
                       </button>
                       <button onClick={() => handleDeleteStudent(row.id)} className="p-2.5 bg-rose-50 text-rose-400 hover:bg-rose-600 hover:text-white rounded-xl transition-all"><Trash size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Academic File */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[90vh] animate-in zoom-in-95">
            <header className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-white rounded-2xl shadow-xl flex items-center justify-center text-blue-600 border border-slate-50">
                     <Users size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{editingStudent ? (language === 'ro' ? 'Dosar Academic' : 'Academic File') : t('add_student')}</h3>
                    {editingStudent && <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{language === 'ro' ? 'ID Dosar' : 'File ID'}: {editingStudent.registration_number}</p>}
                  </div>
               </div>
               <button onClick={() => setShowModal(false)} className="p-3 bg-white text-slate-400 hover:text-slate-900 rounded-2xl shadow-sm hover:shadow-md transition-all"><X size={24} /></button>
            </header>

            <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
               {message.text && (
                 <div className="lg:col-span-12 p-6 rounded-3xl mb-4 flex flex-col gap-3 animate-in fade-in duration-300 bg-rose-50 text-rose-600 border border-rose-100">
                    <div className="flex items-center gap-3">
                      <AlertCircle size={18} /> 
                      <p className="text-xs font-black uppercase tracking-widest">{message.text}</p>
                    </div>
                    {message.suggestion && (
                      <div className="mt-2 p-4 bg-white/50 rounded-2xl border border-rose-200/50">
                        <p className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-1">{language === 'ro' ? 'Sfat Inteligent' : 'Smart Suggestion'}</p>
                        <p className="text-[11px] font-bold text-slate-700">{t(message.suggestion) || message.hint}</p>
                      </div>
                    )}
                 </div>
               )}
               {/* Left Column: Personal Info */}
               <div className="lg:col-span-4 space-y-10">
                  <SectionHeader icon={Shield} title={language === 'ro' ? 'Date Identitate' : "Identity Data"} color="text-blue-600" />
                  <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        <ModalField label={language === 'ro' ? 'Nume' : "Last Name"} value={studentForm.last_name} onChange={e => setStudentForm({...studentForm, last_name: e.target.value})} />
                        <ModalField label={language === 'ro' ? 'Prenume' : "First Name"} value={studentForm.first_name} onChange={e => setStudentForm({...studentForm, first_name: e.target.value})} />
                     </div>
                     <ModalField label={language === 'ro' ? 'Email Instituțional' : "Institutional Email"} value={studentForm.email} onChange={e => setStudentForm({...studentForm, email: e.target.value})} />
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{language === 'ro' ? 'Ciclu Viață' : 'Current Lifecycle'}</label>
                        <Select
                          options={['ENROLLED', 'ACTIVE', 'SUSPENDED', 'GRADUATED'].map(s => ({ value: s, label: s }))}
                          value={{ value: studentForm.status, label: studentForm.status }}
                          onChange={opt => setStudentForm({...studentForm, status: opt?.value || 'ENROLLED'})}
                          styles={customSelectStyles}
                        />
                     </div>
                  </div>
                  <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
                     <Layers className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500" size={120} />
                     <h5 className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-4">{language === 'ro' ? 'Rezumat Rapid' : 'Quick Summary'}</h5>
                     <div className="flex items-center gap-4">
                        <div className="text-3xl font-black">{studentEnrollments.length}</div>
                        <div className="text-[10px] font-bold text-blue-100 uppercase leading-tight">{language === 'ro' ? 'Planuri de\nStudiu Alocate' : 'Assigned\nStudy Plans'}</div>
                     </div>
                  </div>
               </div>

               {/* Right Column: Academic Path */}
               <div className="lg:col-span-8 space-y-10">
                  <div className="flex items-center justify-between">
                     <SectionHeader icon={Layers} title={language === 'ro' ? 'Istoric Înscrieri' : "Enrollment History"} color="text-indigo-600" />
                     {editingStudent && !isAddingPlan && !editingEnrollmentId && (
                        <button onClick={() => setIsAddingPlan(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all">
                           <Plus size={16} /> {language === 'ro' ? 'Înscriere Nouă' : 'New Enrollment'}
                        </button>
                     )}
                  </div>

                  {editingStudent ? (
                     <div className="space-y-6">
                        {(isAddingPlan || editingEnrollmentId) && (
                           <div className="bg-indigo-50/50 p-8 rounded-[2.5rem] border border-indigo-100 space-y-8 animate-in slide-in-from-top-4 duration-500">
                              <div className="flex justify-between items-start">
                                 <div>
                                    <h5 className="text-xl font-black text-indigo-900">{isAddingPlan ? (language === 'ro' ? 'Configurare Plan' : 'Plan Configuration') : (language === 'ro' ? 'Actualizare Rută' : 'Route Update')}</h5>
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">{language === 'ro' ? 'Specificați curricula și formațiunea de studiu' : 'Specify curriculum and study formation'}</p>
                                 </div>
                                 <button onClick={resetEnrollmentForm} className="p-2 bg-white rounded-xl text-indigo-400 shadow-sm"><X size={18} /></button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <SelectField label={t('th_specialization')} options={specializations.map(s => ({ value: s.id, label: `${s.name} (${s.degree_level})` }))} value={selectedSpecId} onChange={opt => { setSelectedSpecId(opt?.value || ''); setSelectedCurriculumId(''); }} disabled={!!editingEnrollmentId} />
                                 <SelectField label={language === 'ro' ? 'Plan Studiu' : "Study Plan"} options={filteredCurricula.map(c => ({ value: c.id, label: c.name }))} value={selectedCurriculumId} onChange={opt => setSelectedCurriculumId(opt?.value || '')} disabled={!selectedSpecId || !!editingEnrollmentId} />
                              </div>

                              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-indigo-50 grid grid-cols-4 gap-4">
                                 <MiniSelect label={language === 'ro' ? 'Formă' : "Form"} options={filteredEduForms} value={formationSel.eduForm} onChange={opt => setFormationSel({...formationSel, eduForm: opt?.value || '', year:'', group:'', sub:''})} disabled={!selectedCurriculumId} />
                                 <MiniSelect label={language === 'ro' ? 'An' : "Year"} options={filteredYears.map(y => String(y))} value={formationSel.year} onChange={opt => setFormationSel({...formationSel, year: opt?.value || '', group:'', sub:''})} disabled={!formationSel.eduForm} />
                                 <MiniSelect label={language === 'ro' ? 'Grupă' : "Group"} options={filteredGroups.map(g => String(g))} value={formationSel.group} onChange={opt => setFormationSel({...formationSel, group: opt?.value || '', sub:''})} disabled={!formationSel.year} />
                                 <MiniSelect label="Sub" options={filteredSubs} value={formationSel.sub} onChange={opt => setFormationSel({...formationSel, sub: opt?.value || ''})} disabled={!formationSel.group} />
                              </div>

                              <div className="flex gap-4">
                                 <button onClick={resetEnrollmentForm} className="flex-1 py-4 text-[10px] font-black text-indigo-400 uppercase tracking-widest">{t('cancel')}</button>
                                 <button onClick={() => isAddingPlan ? handleEnrollStudent() : handleUpdateEnrollment(editingEnrollmentId)} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                                    {isAddingPlan ? (language === 'ro' ? 'Confirmare Înscriere' : 'Confirm Enrollment') : t('save')}
                                 </button>
                              </div>
                           </div>
                        )}

                        <div className="grid grid-cols-1 gap-4">
                           {studentEnrollments.length === 0 ? (
                              <div className="text-center py-16 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                                 <GraduationCap className="mx-auto text-slate-200 mb-4" size={56} />
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{language === 'ro' ? 'Nicio rută academică activă' : 'No Active Academic Route'}</p>
                              </div>
                           ) : studentEnrollments.map(enr => (
                              <div key={enr.curriculum_id} className={`p-6 rounded-[2rem] border transition-all flex flex-col md:flex-row justify-between items-center gap-6 ${editingEnrollmentId === enr.curriculum_id ? 'bg-indigo-50 border-indigo-200 ring-8 ring-indigo-50/50' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl'}`}>
                                 <div className="flex items-center gap-5">
                                    <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black">{enr.specialization_name[0]}</div>
                                    <div>
                                       <h6 className="font-black text-slate-900 text-sm leading-tight">{enr.curriculum_name}</h6>
                                       <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">{enr.specialization_name}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-8">
                                    <div className="text-right">
                                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{language === 'ro' ? 'Formațiune' : 'Formation'}</p>
                                       <p className="text-sm font-black text-slate-800">{language === 'ro' ? 'Anul' : 'Year'} {enr.study_year} • {enr.formation_name}</p>
                                    </div>
                                    <div className="flex gap-2">
                                       <button onClick={() => startEditEnrollment(enr)} className={`p-3 rounded-xl transition-all ${editingEnrollmentId === enr.curriculum_id ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 hover:text-indigo-600'}`}><Edit size={16} /></button>
                                       <button onClick={() => handleUnenrollStudent(enr.curriculum_id)} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all"><Trash size={16} /></button>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  ) : (
                     <div className="py-20 text-center bg-amber-50/50 rounded-[3rem] border border-amber-100">
                        <AlertCircle className="mx-auto text-amber-400 mb-4" size={48} />
                        <h5 className="text-lg font-black text-amber-900">{language === 'ro' ? 'Finalizați Identitatea Mai Întâi' : 'Finalize Identity First'}</h5>
                        <p className="text-xs font-bold text-amber-700/60 mt-1 uppercase tracking-widest">{language === 'ro' ? 'Salvați profilul pentru a debloca înscrierea academică' : 'Save the profile to unlock academic enrollment'}</p>
                     </div>
                  )}
               </div>
            </div>

            <footer className="p-8 border-t border-slate-50 bg-white flex justify-between gap-6 items-center">
               <div className="flex gap-4">
                {editingStudent && (
                    <button 
                        onClick={handleGenerateOfficialTranscript}
                        className="bg-slate-100 text-slate-700 px-6 py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-[10px] hover:bg-slate-200 shadow-sm transition-all flex items-center gap-2"
                    >
                        <FileBadge size={18} className="text-blue-600" />
                        {t('gen_transcript')}
                    </button>
                )}
               </div>
               <div className="flex gap-6 items-center">
                <button onClick={() => setShowModal(false)} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">{language === 'ro' ? 'Renunță' : 'Discard Changes'}</button>
                <button onClick={handleSaveStudent} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-black shadow-2xl transition-all active:scale-95">{language === 'ro' ? 'Salvează Dosar Academic' : 'Commit Academic Record'}</button>
               </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-components
function TableHead({ label }) {
  return (
    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{label}</th>
  );
}

function StatusBadge({ status }) {
  const config = {
    ENROLLED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    ACTIVE: "bg-blue-50 text-blue-600 border-blue-100",
    SUSPENDED: "bg-rose-50 text-rose-600 border-rose-100",
    GRADUATED: "bg-slate-50 text-slate-900 border-slate-100"
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${config[status] || config.ACTIVE}`}>
      {status}
    </span>
  );
}

function SectionHeader({ icon: Icon, title, color }) {
  return (
    <div className="flex items-center gap-3">
       <div className={`p-2 rounded-xl bg-slate-50 ${color}`}><Icon size={18} /></div>
       <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">{title}</h4>
    </div>
  );
}

function ModalField({ label, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <input className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none shadow-sm" {...props} />
    </div>
  );
}

function SelectField({ label, options, value, onChange, disabled }) {
  const { language } = useLanguage();
  return (
    <div className="space-y-2">
       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
       <Select
          options={options}
          value={value ? options.find(o => o.value === value) : null}
          onChange={onChange}
          isDisabled={disabled}
          styles={customSelectStyles}
          placeholder={language === 'ro' ? `-- Selectează ${label} --` : `-- Select ${label} --`}
       />
    </div>
  );
}

function MiniSelect({ label, options, value, onChange, disabled }) {
   return (
    <div className="space-y-1.5">
       <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
       <Select
          options={typeof options[0] === 'string' ? options.map(o => ({ value: o, label: o })) : options}
          value={value ? { value, label: value } : null}
          onChange={onChange}
          isDisabled={disabled}
          styles={{...customSelectStyles, control: b => ({...b, borderRadius:'1rem', padding:'0.1rem', fontSize:'10px'})}}
          placeholder="--"
       />
    </div>
   );
}

const customSelectStyles = {
  control: (base) => ({
    ...base,
    borderRadius: '1.25rem',
    padding: '0.4rem',
    border: '2px solid transparent',
    backgroundColor: '#f8fafc',
    fontWeight: 'bold',
    fontSize: '0.875rem',
    boxShadow: 'none',
    '&:hover': { border: '2px solid transparent' },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#eff6ff' : 'white',
    color: state.isSelected ? 'white' : '#1e293b',
    fontWeight: 'bold',
    fontSize: '0.875rem',
  })
};
