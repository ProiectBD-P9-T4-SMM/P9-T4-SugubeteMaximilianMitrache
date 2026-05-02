import { useState, useEffect } from 'react';
import Select from 'react-select';
import { 
  Trash2, Edit2, CheckCircle, AlertCircle, Filter, X, Save, 
  History, Download, Upload, FileText, Plus, Search, 
  Clock, Shield, Layers, ChevronRight, GraduationCap, 
  TrendingUp, Calendar, User
} from 'lucide-react';
import api, { academicService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export default function GradesList() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Filter and Lookup states
  const [students, setStudents] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [evaluators, setEvaluators] = useState([]);
  const [studyFormations, setStudyFormations] = useState([]);
  const [curricula, setCurricula] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  
  const [filters, setFilters] = useState({
    student_id: '', discipline_id: '', academic_year_id: '',
    exam_session: '', min_date: '', max_date: '', graded_by: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    student_id: '', discipline_id: '', value: '', exam_session: '', grading_date: '', validated: false
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedGradeHistory, setSelectedGradeHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [showImportModal, setShowImportModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateForm, setTemplateForm] = useState({ academic_year_id: '', specialization_id: '', curriculum_id: '', discipline_id: '' });
  
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importResults, setImportResults] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addFormData, setAddFormData] = useState({ studentId: '', disciplineId: '', gradeValue: '', examSession: 'WINTER' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useKeyboardShortcuts({
    'Alt+F': () => setShowFilters(!showFilters),
    'Alt+R': () => handleClearFilters(),
    'Escape': () => { setShowFilters(false); setEditingId(null); setShowAddModal(false); setShowTemplateModal(false); }
  });

  useEffect(() => {
    loadLookupData();
    loadGrades();
  }, []);

  const loadLookupData = async () => {
    try {
      const [studentsRes, disciplinesRes, yearsRes, evaluatorsRes, formationsRes, curriculaRes, specsRes] = await Promise.all([
        api.get('/academic/students-dropdown'),
        api.get('/academic/disciplines'),
        api.get('/academic/academic-years'),
        api.get('/lookup/evaluators'),
        api.get('/lookup/study-formations'),
        api.get('/academic/curricula'),
        api.get('/academic/specializations')
      ]);
      setStudents(studentsRes.data.success ? studentsRes.data.students : []);
      setDisciplines(disciplinesRes.data.success ? disciplinesRes.data.disciplines : []);
      setAcademicYears(yearsRes.data.success ? yearsRes.data.academicYears : []);
      setEvaluators(evaluatorsRes.data.success ? evaluatorsRes.data.evaluators : []);
      setStudyFormations(formationsRes.data || []);
      setCurricula(curriculaRes.data.success ? curriculaRes.data.curricula : []);
      setSpecializations(specsRes.data.success ? specsRes.data.specializations : []);
    } catch (err) { console.error(err); }
  };

  const loadGrades = async (filterParams = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filterParams).forEach(([k, v]) => { if (v) params.append(k, v); });
      const response = await api.get(`/academic/grades?${params.toString()}`);
      setGrades(response.data.grades || []);
      setMessage({ type: '', text: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || (language === 'ro' ? 'Eroare la încărcarea notelor.' : 'Error loading grades.') });
    } finally { setLoading(false); }
  };

  const handleApplyFilters = () => { loadGrades(filters); setShowFilters(false); };
  const handleClearFilters = () => {
    const empty = { student_id: '', discipline_id: '', academic_year_id: '', exam_session: '', min_date: '', max_date: '', graded_by: '' };
    setFilters(empty); loadGrades(empty);
  };

  const handleStartEdit = (grade) => {
    setEditingId(grade.id);
    setEditForm({
      student_id: grade.student_id,
      discipline_id: grade.discipline_id,
      value: grade.value,
      exam_session: grade.exam_session || 'WINTER',
      grading_date: grade.grading_date ? new Date(grade.grading_date).toISOString().split('T')[0] : '',
      validated: grade.validated
    });
  };

  const handleSaveEdit = async (gradeId, shouldAdvance = false) => {
    if (editForm.value === '' || editForm.value < 0 || editForm.value > 10) {
      setMessage({ type: 'error', text: language === 'ro' ? 'Nota trebuie să fie între 0 și 10.' : 'Grade must be 0-10.' }); return;
    }
    try {
      await api.put(`/academic/grades/${gradeId}`, { ...editForm, value: parseFloat(editForm.value) });
      setMessage({ type: 'success', text: language === 'ro' ? 'Notă actualizată cu succes!' : 'Grade updated successfully!' });
      
      if (shouldAdvance) {
         const currentIndex = grades.findIndex(g => g.id === gradeId);
         if (currentIndex !== -1 && currentIndex < grades.length - 1) {
            const nextGrade = grades[currentIndex + 1];
            handleStartEdit(nextGrade);
         } else {
            setEditingId(null);
         }
      } else {
         setEditingId(null); 
      }
      
      loadGrades(filters);
    } catch (err) { setMessage({ type: 'error', text: language === 'ro' ? 'Actualizare eșuată.' : 'Update failed.' }); }
  };

  const handleDelete = async (gradeId) => {
    if (!confirm(t('confirm_delete'))) return;
    try {
      await api.delete(`/academic/grades/${gradeId}`);
      setMessage({ type: 'success', text: language === 'ro' ? 'Notă ștearsă.' : 'Grade deleted.' });
      loadGrades(filters);
    } catch (err) { setMessage({ type: 'error', text: language === 'ro' ? 'Ștergere eșuată.' : 'Delete failed.' }); }
  };

  const handleValidate = async (gradeId, currentValidated) => {
    try {
      await api.put(`/academic/grades/${gradeId}`, { validated: !currentValidated });
      loadGrades(filters);
    } catch (err) { setMessage({ type: 'error', text: language === 'ro' ? 'Validare eșuată.' : 'Validation failed.' }); }
  };

  const fetchHistory = async (gradeId) => {
    setHistoryLoading(true); setShowHistoryModal(true);
    try {
      const res = await api.get(`/academic/grades/${gradeId}/history`);
      setSelectedGradeHistory(res.data.history || []);
    } catch (err) { console.error(err); } finally { setHistoryLoading(false); }
  };

  const handleAddGradeSubmit = async (e) => {
    e.preventDefault();
    if (!addFormData.studentId || !addFormData.disciplineId || addFormData.gradeValue === '') {
      setMessage({ type: 'error', text: language === 'ro' ? 'Toate câmpurile sunt obligatorii.' : 'All fields are required.' });
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post('/academic/grades', addFormData);
      setMessage({ type: 'success', text: language === 'ro' ? 'Notă înregistrată în registru!' : 'Grade committed to registry!' });
      setShowAddModal(false);
      setAddFormData({ studentId: '', disciplineId: '', gradeValue: '', examSession: 'WINTER' });
      loadGrades(filters);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || (language === 'ro' ? 'Trimitere eșuată.' : 'Submission failed.'),
        suggestion: err.response?.data?.suggestion,
        hint: err.response?.data?.resolutionHint
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!importFile) return;
    setImportLoading(true);
    const formData = new FormData();
    formData.append('file', importFile);
    try {
      const res = await academicService.importGrades(formData);
      setImportResults(res.data);
      setMessage({ type: 'success', text: language === 'ro' ? 'Sarcina de import a fost procesată.' : 'Import task processed.' });
      setShowImportModal(false);
      loadGrades(filters);
    } catch (err) {
      setMessage({ type: 'error', text: language === 'ro' ? 'Import eșuat.' : 'Import failed.' });
    } finally {
      setImportLoading(false);
    }
  };

  const handleGenerateTemplate = async (e) => {
    e.preventDefault();
    if (!templateForm.discipline_id || !templateForm.curriculum_id) {
      setMessage({ type: 'error', text: language === 'ro' ? 'Curricula și Disciplina sunt obligatorii.' : 'Curriculum and Discipline are required.' });
      return;
    }
    try {
      const res = await api.get(`/academic/grades/template?discipline_id=${templateForm.discipline_id}&curriculum_id=${templateForm.curriculum_id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Grade_Template_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      setShowTemplateModal(false);
    } catch (err) { 
      setMessage({ type: 'error', text: err.response?.data?.message || (language === 'ro' ? 'Generarea șablonului a eșuat.' : 'Template generation failed.') }); 
    }
  };

  // Logic for cascading template filters
  const templateCurricula = curricula.filter(c => {
    if (templateForm.specialization_id && c.specialization_id !== templateForm.specialization_id) return false;
    return true;
  });

  const templateDisciplines = disciplines.filter(d => {
    if (d.curriculum_id !== templateForm.curriculum_id) return false;
    if (templateForm.academic_year_id) {
      const ay = academicYears.find(y => y.id === templateForm.academic_year_id);
      const curriculum = curricula.find(c => c.id === d.curriculum_id);
      if (ay && curriculum && curriculum.valid_from) {
        const startYear = new Date(curriculum.valid_from).getFullYear();
        const disciplineYear = Math.ceil(d.semester / 2);
        if ((startYear + disciplineYear) !== ay.year_end) return false;
      }
    }
    return true;
  });

  return (
    <div className="flex-1 bg-slate-50/50 min-h-screen p-8 lg:p-12 animate-in fade-in duration-500">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">{t('grades_title')}</h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
            <Shield size={16} className="text-blue-600" /> {t('grades_subtitle')}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setShowAddModal(true)} className="group bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center gap-3">
            <Plus size={18} /> {language === 'ro' ? 'Adăugare Notă' : 'Add Grade'}
          </button>
          <button onClick={() => setShowImportModal(true)} className="group bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 border border-slate-100 hover:bg-slate-900 hover:text-white transition-all flex items-center gap-3">
            <Upload size={18} /> {t('import_grades')}
          </button>
          <button onClick={() => setShowTemplateModal(true)} className="group bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 border border-slate-100 hover:bg-slate-900 hover:text-white transition-all flex items-center gap-3">
            <FileText size={18} /> {t('gen_template')}
          </button>
        </div>
      </header>

      {/* Stats & Filters Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
         <StatItem label={language === 'ro' ? 'Total Înregistrări' : "Total Records"} value={grades.length} icon={Layers} color="text-blue-600 bg-blue-50" />
         <StatItem label={language === 'ro' ? 'Validate' : "Validated"} value={grades.filter(g => g.validated).length} icon={CheckCircle} color="text-emerald-600 bg-emerald-50" />
         <StatItem label={language === 'ro' ? 'În așteptare' : "Pending"} value={grades.filter(g => !g.validated).length} icon={Clock} color="text-amber-600 bg-amber-50" />
         <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center justify-center gap-3 p-6 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${showFilters ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-600 shadow-xl shadow-slate-200/50 border border-slate-50'}`}>
            <Filter size={20} /> {showFilters ? (language === 'ro' ? 'Închide Filtre' : 'Close Filters') : (language === 'ro' ? 'Motor Filtrare' : 'Filter Engine')}
         </button>
      </div>

      {showFilters && (
        <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-50 mb-10 animate-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
             <FilterSelect label={t('th_student')} options={students.map(s => ({ value: s.id, label: `${s.last_name} ${s.first_name}` }))} value={filters.student_id} onChange={opt => setFilters({...filters, student_id: opt?.value || ''})} />
             <FilterSelect label={t('th_discipline')} options={disciplines.map(d => ({ value: d.id, label: `${d.code} - ${d.name}` }))} value={filters.discipline_id} onChange={opt => setFilters({...filters, discipline_id: opt?.value || ''})} />
             <FilterSelect label={language === 'ro' ? 'An Academic' : "Academic Year"} options={academicYears.map(y => ({ value: y.id, label: `${y.year_start}/${y.year_end}` }))} value={filters.academic_year_id} onChange={opt => setFilters({...filters, academic_year_id: opt?.value || ''})} />
             <FilterSelect label={t('th_session')} options={[{value:'WINTER', label:language === 'ro' ? 'Iarnă' : 'Winter'}, {value:'SUMMER', label:language === 'ro' ? 'Vară' : 'Summer'}, {value:'RETAKE', label:language === 'ro' ? 'Restanță' : 'Retake'}]} value={filters.exam_session} onChange={opt => setFilters({...filters, exam_session: opt?.value || ''})} />
          </div>
          <div className="flex justify-end gap-4">
             <button onClick={handleClearFilters} className="px-8 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">{language === 'ro' ? 'Resetează Tot' : 'Reset All'}</button>
             <button onClick={handleApplyFilters} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-slate-200">{language === 'ro' ? 'Execută Căutarea' : 'Execute Search'}</button>
          </div>
        </div>
      )}

      {message.text && (
        <div className={`p-6 rounded-3xl mb-8 flex flex-col gap-3 animate-in fade-in duration-300 ${message.type === 'error' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
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

      {/* Main Table */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <TableHead label={t('th_reg_num')} />
                <TableHead label={language === 'ro' ? 'Student / Identitate' : "Student / Identity"} />
                <TableHead label={language === 'ro' ? 'Modul' : "Module"} />
                <TableHead label={language === 'ro' ? 'Rezultat' : "Result"} />
                <TableHead label={language === 'ro' ? 'Ciclu Viață' : "Lifecycle"} />
                <TableHead label={language === 'ro' ? 'Validare' : "Validation"} />
                <TableHead label={t('th_actions')} />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="7" className="py-20 text-center"><LoadingPulse /></td></tr>
              ) : grades.length === 0 ? (
                <tr><td colSpan="7" className="py-20 text-center text-slate-300 font-black italic">{language === 'ro' ? 'Nicio înregistrare găsită.' : 'No records matching criteria.'}</td></tr>
              ) : grades.map((row, idx) => (
                <tr key={row.id} className={`group hover:bg-blue-50/30 transition-all ${editingId === row.id ? 'bg-blue-50 shadow-inner' : ''} ${row.validated ? 'bg-emerald-50/10' : ''}`}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] font-black text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl group-hover:bg-white group-hover:text-blue-600 transition-all">{row.registration_number}</span>
                      {row.validated && <Shield size={14} className="text-emerald-500" title="Validated & Locked" />}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {editingId === row.id ? (
                      <div className="max-w-[180px]">
                        <Select options={students.map(s => ({ value: s.id, label: `${s.last_name} ${s.first_name}` }))} value={{ value: editForm.student_id, label: students.find(s => s.id === editForm.student_id)?.last_name + ' ' + students.find(s => s.id === editForm.student_id)?.first_name }} onChange={opt => setEditForm({...editForm, student_id: opt?.value})} styles={miniSelectStyles} />
                      </div>
                    ) : (
                      <p className="font-black text-slate-900 text-sm">{row.student_name}</p>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    {editingId === row.id ? (
                      <div className="max-w-[220px]">
                        <Select options={disciplines.map(d => ({ value: d.id, label: d.name }))} value={{ value: editForm.discipline_id, label: disciplines.find(d => d.id === editForm.discipline_id)?.name }} onChange={opt => setEditForm({...editForm, discipline_id: opt?.value})} styles={miniSelectStyles} />
                      </div>
                    ) : (
                      <>
                        <p className="font-black text-slate-800 text-sm leading-tight">{row.discipline_name}</p>
                        <p className="text-[10px] text-blue-600 font-black uppercase mt-1">{row.discipline_code}</p>
                      </>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    {editingId === row.id ? (
                      <input 
                        type="number" 
                        step="0.01" 
                        autoFocus
                        className="w-16 bg-white border border-slate-200 rounded-lg p-2 font-black text-blue-600 text-sm" 
                        value={editForm.value} 
                        onChange={e => setEditForm({...editForm, value: e.target.value})} 
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(row.id, true);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                    ) : (
                      <span className={`text-xl font-black ${parseFloat(row.value) >= 5 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {parseFloat(row.value) === 0 ? 'Abs.' : row.value}
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{row.exam_session}</span>
                      <span className="text-[10px] font-bold text-slate-400">{new Date(row.grading_date).toLocaleDateString(language === 'en' ? 'en-US' : 'ro-RO')}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <button onClick={() => handleValidate(row.id, row.validated)} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${row.validated ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm' : 'bg-amber-50 text-amber-600 border-amber-100 shadow-sm animate-pulse'}`}>
                       {row.validated ? (language === 'ro' ? 'Validat' : 'Validated') : (language === 'ro' ? 'În așteptare' : 'Pending')}
                    </button>
                  </td>
                  <td className="px-8 py-6 min-w-[140px]">
                     <div className="flex gap-2">
                        {editingId === row.id ? (
                          <>
                            <button onClick={() => handleSaveEdit(row.id)} className="bg-emerald-600 text-white p-2 rounded-xl shadow-lg shadow-emerald-100"><Save size={16} /></button>
                            <button onClick={() => setEditingId(null)} className="bg-slate-200 text-slate-600 p-2 rounded-xl"><X size={16} /></button>
                          </>
                        ) : (
                          <>
                            <ActionButton icon={History} color="text-indigo-600 bg-indigo-50" onClick={() => fetchHistory(row.id)} />
                            <ActionButton 
                              icon={Edit2} 
                              color={row.validated && user?.role !== 'ADMIN' ? "text-slate-300 bg-slate-100 cursor-not-allowed" : "text-blue-600 bg-blue-50"} 
                              onClick={() => {
                                // Only ADMIN can edit validated grades; others can edit unvalidated
                                if (row.validated && user?.role !== 'ADMIN') {
                                  setMessage({ type: 'error', text: language === 'ro' ? 'Notă Validată (Blocată)' : 'Validated Grade (Locked)' });
                                  return;
                                }
                                handleStartEdit(row);
                              }}
                              title={row.validated && user?.role !== 'ADMIN' ? (language === 'ro' ? 'Notă Validată (Blocată)' : 'Validated Grade (Locked)') : (language === 'ro' ? 'Editează Notă' : 'Edit Grade')}
                            />
                            <ActionButton 
                              icon={Trash2} 
                              color={row.validated && user?.role !== 'ADMIN' ? "text-slate-300 bg-slate-100 cursor-not-allowed" : "text-rose-600 bg-rose-50"} 
                              onClick={() => {
                                // Only ADMIN can delete validated grades; others can delete unvalidated
                                if (row.validated && user?.role !== 'ADMIN') {
                                  setMessage({ type: 'error', text: language === 'ro' ? 'Notă Validată (Blocată)' : 'Validated Grade (Locked)' });
                                  return;
                                }
                                handleDelete(row.id);
                              }}
                              title={row.validated && user?.role !== 'ADMIN' ? (language === 'ro' ? 'Notă Validată (Blocată)' : 'Validated Grade (Locked)') : (language === 'ro' ? 'Șterge Notă' : 'Delete Grade')}
                            />
                          </>
                        )}
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <Modal title={language === 'ro' ? 'Înregistrare Securizată Notă' : "Secure Grade Entry"} onClose={() => setShowAddModal(false)}>
           <form onSubmit={handleAddGradeSubmit} className="space-y-6">
              <SelectField tabIndex="1" label={t('th_student')} options={students.map(s => ({ value: s.id, label: `${s.last_name} ${s.first_name}` }))} value={addFormData.studentId} onChange={opt => setAddFormData({...addFormData, studentId: opt?.value || ''})} />
              <SelectField tabIndex="2" label={t('th_discipline')} options={disciplines.map(d => ({ value: d.id, label: `${d.code} - ${d.name}` }))} value={addFormData.disciplineId} onChange={opt => setAddFormData({...addFormData, disciplineId: opt?.value || ''})} />
              <div className="grid grid-cols-2 gap-4">
                 <ModalInput tabIndex="3" label={language === 'ro' ? 'Valoare Notă (0-10)' : "Grade Value (0-10)"} type="number" step="0.01" value={addFormData.gradeValue} onChange={e => setAddFormData({...addFormData, gradeValue: e.target.value})} />
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('th_session')}</label>
                    <Select tabIndex="4" options={[{value:'WINTER', label:language === 'ro' ? 'Iarnă' : 'Winter'}, {value:'SUMMER', label:language === 'ro' ? 'Vară' : 'Summer'}, {value:'RETAKE', label:language === 'ro' ? 'Restanță' : 'Retake'}]} value={{value: addFormData.examSession, label: addFormData.examSession}} onChange={opt => setAddFormData({...addFormData, examSession: opt?.value})} styles={customSelectStyles} />
                 </div>
              </div>
              <button tabIndex="5" type="submit" disabled={isSubmitting} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                 {isSubmitting ? (language === 'ro' ? 'Se procesează...' : 'Processing...') : (language === 'ro' ? 'Salvează Notă' : 'Commit Grade')} <ChevronRight size={16} />
              </button>
           </form>
        </Modal>
      )}

      {showHistoryModal && (
        <Modal title={language === 'ro' ? 'Istoric Trasabilitate' : "Traceability Audit Trail"} onClose={() => setShowHistoryModal(false)}>
           <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {historyLoading ? <LoadingPulse /> : selectedGradeHistory.length === 0 ? <p className="text-center text-slate-400 italic font-bold">{language === 'ro' ? 'Nicio dată istorică disponibilă.' : 'No historical data available.'}</p> : selectedGradeHistory.map(log => (
                <div key={log.id} className="relative pl-6 pb-6 border-l-2 border-slate-100 last:pb-0">
                   <div className="absolute left-[-9px] top-0 h-4 w-4 rounded-full bg-blue-500 border-4 border-white shadow-sm" />
                   <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <div className="flex justify-between items-center mb-4">
                         <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{log.action_type}</span>
                         <span className="text-[10px] font-bold text-slate-400">{new Date(log.occurred_at).toLocaleString(language === 'en' ? 'en-US' : 'ro-RO')}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 mb-4 flex items-center gap-2"><User size={14} className="text-slate-400" /> {log.actor_name}</p>
                      <div className="grid grid-cols-2 gap-3">
                         <div className="bg-white p-3 rounded-xl border border-slate-100">
                            <p className="text-[8px] font-black text-slate-300 uppercase mb-1">{language === 'ro' ? 'Înainte' : 'Before'}</p>
                            <p className="text-lg font-black text-rose-500">{log.before_snapshot_json?.value === 0 ? 'Abs.' : log.before_snapshot_json?.value || 'N/A'}</p>
                         </div>
                         <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                            <p className="text-[8px] font-black text-slate-300 uppercase mb-1">{language === 'ro' ? 'După' : 'After'}</p>
                            <p className="text-lg font-black text-emerald-500">{log.after_snapshot_json?.value === 0 ? 'Abs.' : log.after_snapshot_json?.value || 'N/A'}</p>
                         </div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </Modal>
      )}

      {showImportModal && (
        <Modal title={language === 'ro' ? 'Import Inteligent Bulk' : "Bulk Intelligence Import"} onClose={() => setShowImportModal(false)}>
           <form onSubmit={handleImport} className="space-y-8">
              <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                 <Shield className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform" size={100} />
                 <h5 className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-4">{language === 'ro' ? 'Cerințe CSV' : 'CSV Requirements'}</h5>
                 <code className="block bg-black/20 p-4 rounded-xl text-[10px] font-mono mb-2">{language === 'ro' ? 'Nr. Matricol, Cod Disciplină, Notă, Sesiune' : 'Registration Number, Discipline Code, Grade, Session'}</code>
                 <p className="text-[9px] text-indigo-200 italic font-bold">{language === 'ro' ? '* Numărul matricol trebuie să corespundă exact cu registrul studenților.' : '* Registration Number must match student registry exactly.'}</p>
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:border-indigo-400 transition-all cursor-pointer relative group">
                 <input type="file" accept=".csv" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setImportFile(e.target.files[0])} />
                 <Upload size={40} className="mx-auto text-slate-300 mb-4 group-hover:text-indigo-400 group-hover:scale-110 transition-all" />
                 <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{importFile ? importFile.name : (language === 'ro' ? 'Plasați activul CSV aici' : 'Drop CSV Asset Here')}</p>
              </div>
              <button type="submit" disabled={importLoading} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black shadow-xl transition-all">
                 {importLoading ? (language === 'ro' ? 'Se procesează setul de date...' : 'Processing Dataset...') : (language === 'ro' ? 'Execută Importul' : 'Execute Import')}
              </button>
           </form>
        </Modal>
      )}

      {showTemplateModal && (
        <Modal title={language === 'ro' ? 'Generare Șablon Inteligent' : "Generate Intelligence Template"} onClose={() => setShowTemplateModal(false)}>
           <form onSubmit={handleGenerateTemplate} className="space-y-6">
              <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
                 <FileText className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform" size={100} />
                 <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">{language === 'ro' ? 'Motor Șabloane' : 'Template Engine'}</h5>
                 <p className="text-xs text-slate-300 font-bold leading-relaxed">{language === 'ro' ? 'Filtre cascadate pentru generarea CSV țintită. Selectați Anul și Planul pentru a bloca disciplinele.' : 'Cascading filters for targeted CSV generation. Select Year and Plan to lock in disciplines.'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <SelectField label={language === 'ro' ? 'An Academic' : "Academic Year"} options={academicYears.map(y => ({ value: y.id, label: `${y.year_start}/${y.year_end}` }))} value={templateForm.academic_year_id} onChange={opt => setTemplateForm({ ...templateForm, academic_year_id: opt?.value || '', specialization_id: '', curriculum_id: '', discipline_id: '' })} />
                <SelectField label={t('th_specialization')} options={specializations.map(s => ({ value: s.id, label: s.name }))} value={templateForm.specialization_id} onChange={opt => setTemplateForm({ ...templateForm, specialization_id: opt?.value || '', curriculum_id: '', discipline_id: '' })} />
              </div>

              <SelectField 
                label={language === 'ro' ? 'Plan de Studiu (Curricula)' : "Study Plan (Curriculum)"} 
                options={templateCurricula.map(c => ({ value: c.id, label: c.name }))} 
                value={templateForm.curriculum_id} 
                onChange={opt => setTemplateForm({ ...templateForm, curriculum_id: opt?.value || '', discipline_id: '' })} 
                isDisabled={!templateForm.specialization_id}
              />

              <SelectField 
                label={language === 'ro' ? 'Disciplină Țintă' : "Target Discipline"} 
                options={templateDisciplines.map(d => ({ value: d.id, label: `${d.code} - ${d.name} (Sem ${d.semester})` }))} 
                value={templateForm.discipline_id} 
                onChange={opt => setTemplateForm({ ...templateForm, discipline_id: opt?.value || '' })} 
                isDisabled={!templateForm.curriculum_id}
              />

              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                 {language === 'ro' ? 'Generează Șablon CSV' : 'Generate CSV Template'} <ChevronRight size={16} />
              </button>
           </form>
        </Modal>
      )}
    </div>
  );
}

// UI Components
function StatItem({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center justify-between group hover:-translate-y-1 transition-all">
       <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
          <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h4>
       </div>
       <div className={`${color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}><Icon size={24} /></div>
    </div>
  );
}

function TableHead({ label }) {
  return (
    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{label}</th>
  );
}

function ActionButton({ icon: Icon, color, onClick }) {
  return (
    <button onClick={onClick} className={`p-2.5 rounded-xl transition-all hover:scale-110 active:scale-95 ${color}`}>
       <Icon size={16} />
    </button>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
        <header className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-all text-slate-400"><X size={20} /></button>
        </header>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}

function ModalInput({ label, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <input className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none" {...props} />
    </div>
  );
}

function SelectField({ label, options, value, onChange, isDisabled, tabIndex }) {
  const { language } = useLanguage();
  return (
    <div className="space-y-2">
       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
       <Select tabIndex={tabIndex} options={options} value={value ? options.find(o => o.value === value) : null} onChange={onChange} styles={customSelectStyles} placeholder={language === 'ro' ? `-- Selectează ${label} --` : `-- Select ${label} --`} isDisabled={isDisabled} />
    </div>
  );
}

function FilterSelect({ label, options, value, onChange }) {
  const { language } = useLanguage();
  return (
    <div className="space-y-2">
       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
       <Select options={options} value={value ? options.find(o => o.value === value) : null} onChange={onChange} styles={customSelectStyles} isClearable placeholder={language === 'ro' ? 'Toate' : "All"} />
    </div>
  );
}

function LoadingPulse() {
  const { language } = useLanguage();
  return (
    <div className="flex flex-col items-center gap-4 py-12">
       <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full" />
       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{language === 'ro' ? 'Se procesează înregistrările academice' : 'Processing Academic Records'}</span>
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

const miniSelectStyles = {
  ...customSelectStyles,
  control: (base) => ({
    ...base,
    borderRadius: '0.75rem',
    padding: '0.1rem',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    fontSize: '0.75rem',
  })
};
