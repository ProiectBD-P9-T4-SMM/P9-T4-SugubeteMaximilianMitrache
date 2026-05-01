import { useState, useEffect } from 'react';
import { Database, Plus, Search, Edit, Trash, BookOpen, X, Check, MapPin, Calendar, Users, Save, ChevronRight, Layers } from 'lucide-react';
import * as XLSX from 'xlsx';
import { academicService, lookupService } from '../services/api';

export default function Students() {
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
    }
    catch (err) { console.error("Failed to load students", err); }
    finally { setLoading(false); }
  };

  const fetchFormations = async () => {
    try {
      const res = await lookupService.getStudyFormations();
      setFormations(res.data);
    } catch (err) { console.error("Failed to load formations", err); }
  };

  const fetchCurricula = async () => {
    try {
      const res = await academicService.getCurricula();
      if (res.data.success) setCurricula(res.data.curricula);
    } catch (err) { console.error("Failed to load curricula", err); }
  };

  const fetchSpecializations = async () => {
    try {
      const res = await lookupService.getSpecializations();
      if (res.data.success) setSpecializations(res.data.specializations);
    } catch (err) { console.error("Failed to load specializations", err); }
  };

  const fetchStudentEnrollments = async (studentId) => {
    try {
      const res = await academicService.getStudentEnrollments(studentId);
      if (res.data.success) setStudentEnrollments(res.data.enrollments);
    } catch (err) { console.error("Failed to load student enrollments", err); }
  };

  const handleEnrollStudent = async () => {
    if (!selectedCurriculumId || !editingStudent || !enrollmentFormationId) {
      alert('Te rugăm să completezi toate selecțiile (Plan + Formație).');
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
    } catch (err) { alert('Eroare la înrolare.'); }
  };

  const handleUpdateEnrollment = async (currId) => {
    if (!enrollmentFormationId) {
        alert('Te rugăm să finalizezi selecția formației.');
        return;
    }
    try {
        await academicService.updateEnrollmentFormation({
            student_id: editingStudent.id,
            curriculum_id: currId,
            study_formation_id: enrollmentFormationId
        });
        fetchStudentEnrollments(editingStudent.id);
        resetEnrollmentForm();
    } catch (err) { alert('Eroare la actualizare.'); }
  };

  const resetEnrollmentForm = () => {
    setIsAddingPlan(false);
    setEditingEnrollmentId(null);
    setSelectedSpecId('');
    setSelectedCurriculumId('');
    setEnrollmentFormationId('');
    setFormationSel({ eduForm: '', year: '', group: '', sub: '' });
  };

  const handleUnenrollStudent = async (currId) => {
    if (!window.confirm("Elimini acest plan academic pentru student?")) return;
    try {
      await academicService.unenrollStudent(editingStudent.id, currId);
      fetchStudentEnrollments(editingStudent.id);
    } catch (err) { alert('Eroare la eliminarea planului.'); }
  };

  // Helper to find spec code from spec ID
  const activeSpec = specializations.find(s => s.id === selectedSpecId);
  const specCode = activeSpec?.code || '';

  // Cascading filters based on selectedSpecId
  const filteredCurricula = curricula.filter(c => c.specialization_id === selectedSpecId);
  
  const filteredEduForms = [...new Set(
    formations.filter(f => f.spec_code === specCode).map(f => f.education_form)
  )].sort();
  const filteredYears = [...new Set(
    formations.filter(f => f.spec_code === specCode && f.education_form === formationSel.eduForm).map(f => f.study_year)
  )].sort();
  const filteredGroups = [...new Set(
    formations.filter(f => f.spec_code === specCode && f.education_form === formationSel.eduForm && f.study_year === parseInt(formationSel.year)).map(f => f.group_index)
  )].sort();
  const filteredSubs = formations
    .filter(f => f.spec_code === specCode && f.education_form === formationSel.eduForm && f.study_year === parseInt(formationSel.year) && f.group_index === parseInt(formationSel.group))
    .map(f => f.code.slice(-1));

  useEffect(() => {
    if (specCode && formationSel.eduForm && formationSel.year && formationSel.group && formationSel.sub) {
      const match = formations.find(f =>
        f.spec_code === specCode &&
        f.education_form === formationSel.eduForm &&
        f.study_year === parseInt(formationSel.year) &&
        f.group_index === parseInt(formationSel.group) &&
        f.code.endsWith(formationSel.sub)
      );
      setEnrollmentFormationId(match?.id || '');
    }
  }, [formationSel, specCode, formations]);

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        first_name: studentForm.first_name,
        last_name: studentForm.last_name,
        email: studentForm.email,
        status: studentForm.status,
      };
      if (editingStudent) { await academicService.updateStudent(editingStudent.id, payload); }
      else { await academicService.addStudent(studentForm); }
      setShowModal(false); fetchStudents();
    } catch (err) { alert('Eroare la salvare.'); }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Ștergi acest student?")) return;
    try { await academicService.deleteStudent(id); fetchStudents(); } catch (err) { alert('Eroare la ștergere.'); }
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    fetchStudentEnrollments(student.id);
    resetEnrollmentForm();
    setStudentForm({ first_name: student.first_name, last_name: student.last_name, email: student.email || '', status: student.status || 'ENROLLED' });
    setShowModal(true);
  };

  const startEditEnrollment = (enr) => {
    // Find spec ID from curriculum linked to this enrollment
    const curr = curricula.find(c => c.id === enr.curriculum_id);
    const formation = formations.find(f => f.id === enr.study_formation_id);
    
    setEditingEnrollmentId(enr.curriculum_id);
    setIsAddingPlan(false);
    setSelectedSpecId(curr?.specialization_id || '');
    setSelectedCurriculumId(enr.curriculum_id);
    
    if (formation) {
        setFormationSel({
            eduForm: formation.education_form,
            year: String(formation.study_year),
            group: String(formation.group_index),
            sub: formation.code.slice(-1)
        });
    }
  };

  const filteredStudents = students.filter(s => 
    s.status !== 'INACTIVE' &&
    (s.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     s.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     s.registration_number.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 container mx-auto px-4 py-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-12">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             Registru Studenți
          </h2>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Sistem Integrat de Gestiune Academică</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-3xl font-black shadow-2xl shadow-blue-200 transition-all flex items-center space-x-3">
            <Plus size={20} />
            <span>Adaugă Student</span>
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-7xl max-h-[94vh] overflow-hidden flex flex-col border border-white/20">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-white/50">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600">
                    <Users size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900">{editingStudent ? 'Dosar Academic' : 'Înmatriculare Nouă'}</h3>
                  {editingStudent && (
                    <div className="flex items-center gap-2 mt-1">
                         <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{editingStudent.registration_number}</span>
                         <span className="text-slate-400 font-bold text-sm">{editingStudent.first_name} {editingStudent.last_name}</span>
                    </div>
                  )}
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-4 hover:bg-slate-100 rounded-3xl transition-all text-slate-400"><X size={28} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Side: Identity & Status (4 cols) */}
              <div className="lg:col-span-4 space-y-8">
                 <section className="space-y-6">
                    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] ml-2">Identitate Student</h4>
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Nume</label>
                                <input required type="text" value={studentForm.last_name} onChange={e => setStudentForm({...studentForm, last_name: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-slate-700" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Prenume</label>
                                <input required type="text" value={studentForm.first_name} onChange={e => setStudentForm({...studentForm, first_name: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-slate-700" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Email Instituțional</label>
                            <input required type="email" value={studentForm.email} onChange={e => setStudentForm({...studentForm, email: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-slate-700" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Status Academic</label>
                            <select value={studentForm.status} onChange={e => setStudentForm({...studentForm, status: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none transition-all font-black text-slate-800">
                                <option value="ENROLLED">ÎNMATRICULAT</option>
                                <option value="ACTIVE">ACTIV</option>
                                <option value="SUSPENDED">SUSPENDAT</option>
                                <option value="GRADUATED">ABSOLVIT</option>
                            </select>
                        </div>
                    </div>
                 </section>
              </div>

              {/* Right Side: Enrollments (8 cols) */}
              <div className="lg:col-span-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-purple-600 uppercase tracking-[0.3em] ml-2">Planuri & Specializări</h4>
                  {editingStudent && !isAddingPlan && !editingEnrollmentId && (
                    <button 
                      onClick={() => { setIsAddingPlan(true); setEditingEnrollmentId(null); }}
                      className="bg-purple-50 text-purple-600 px-6 py-3 rounded-2xl font-black text-xs hover:bg-purple-100 transition-all flex items-center gap-2"
                    >
                      <Plus size={16} /> Înrolează în Plan Nou
                    </button>
                  )}
                </div>

                {editingStudent ? (
                  <div className="space-y-6">
                    {(isAddingPlan || editingEnrollmentId) && (
                      <div className="bg-slate-50 p-10 rounded-[3rem] border border-blue-100 shadow-2xl shadow-blue-50 space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="text-xl font-black text-slate-900">{isAddingPlan ? 'Configurare Înrolare Nouă' : 'Actualizare Formație'}</h5>
                            <p className="text-xs font-bold text-blue-500 uppercase mt-1">Alege Specializarea și Planul de Studiu</p>
                          </div>
                          <button onClick={resetEnrollmentForm} className="p-3 hover:bg-white rounded-2xl transition-all text-slate-400"><X size={20} /></button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 ml-1">1. Specializare</label>
                            <select 
                              value={selectedSpecId} 
                              disabled={!!editingEnrollmentId}
                              onChange={e => { setSelectedSpecId(e.target.value); setSelectedCurriculumId(''); }}
                              className="w-full p-5 bg-white border border-slate-200 rounded-[1.5rem] font-black text-slate-800 outline-none focus:ring-4 focus:ring-blue-50 disabled:opacity-50"
                            >
                              <option value="">-- Alege Specializarea --</option>
                              {specializations.map(s => <option key={s.id} value={s.id}>{s.name} ({s.degree_level})</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 ml-1">2. Plan de Învățământ</label>
                            <select 
                              value={selectedCurriculumId} 
                              disabled={!selectedSpecId || !!editingEnrollmentId}
                              onChange={e => setSelectedCurriculumId(e.target.value)}
                              className="w-full p-5 bg-white border border-slate-200 rounded-[1.5rem] font-black text-slate-800 outline-none focus:ring-4 focus:ring-blue-50 disabled:opacity-50"
                            >
                              <option value="">-- Alege Planul --</option>
                              {filteredCurricula.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                           <div className="flex items-center gap-2 mb-2">
                                <MapPin size={16} className="text-blue-600" />
                                <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3. Configurare Locală (An & Grupă)</h6>
                           </div>
                           <div className="grid grid-cols-4 gap-4">
                              <select value={formationSel.eduForm} disabled={!selectedCurriculumId} onChange={e => setFormationSel({...formationSel, eduForm: e.target.value, year: '', group: '', sub: ''})} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-blue-50">
                                <option value="">Forma</option>
                                {filteredEduForms.map(f => <option key={f} value={f}>{f}</option>)}
                              </select>
                              <select value={formationSel.year} disabled={!formationSel.eduForm} onChange={e => setFormationSel({...formationSel, year: e.target.value, group: '', sub: ''})} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-blue-50">
                                <option value="">An</option>
                                {filteredYears.map(y => <option key={y} value={y}>{y}</option>)}
                              </select>
                              <select value={formationSel.group} disabled={!formationSel.year} onChange={e => setFormationSel({...formationSel, group: e.target.value, sub: ''})} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-blue-50">
                                <option value="">Gr</option>
                                {filteredGroups.map(g => <option key={g} value={g}>{g}</option>)}
                              </select>
                              <select value={formationSel.sub} disabled={!formationSel.group} onChange={e => setFormationSel({...formationSel, sub: e.target.value})} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-blue-50">
                                <option value="">Sgr</option>
                                {filteredSubs.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                           </div>
                        </div>

                        <div className="flex gap-4">
                           <button onClick={resetEnrollmentForm} className="flex-1 py-5 bg-white text-slate-400 font-black rounded-3xl hover:bg-slate-100 transition-all uppercase tracking-widest text-[10px]">Anulează</button>
                           <button 
                             onClick={() => isAddingPlan ? handleEnrollStudent() : handleUpdateEnrollment(editingEnrollmentId)}
                             className="flex-[3] py-5 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 shadow-2xl shadow-blue-100 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-3"
                           >
                             <Check size={18} /> {isAddingPlan ? 'Finalizează Înrolarea' : 'Actualizează Detalii'}
                           </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {studentEnrollments.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-slate-100 border-dashed">
                          <Layers className="mx-auto text-slate-200 mb-6" size={64} />
                          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Dosar Fără Planuri Active</p>
                        </div>
                      ) : (
                        studentEnrollments.map(enr => (
                          <div key={enr.curriculum_id} className={`p-8 rounded-[2.5rem] border transition-all flex flex-col md:flex-row justify-between items-center gap-6 group ${editingEnrollmentId === enr.curriculum_id ? 'bg-blue-50 border-blue-200 ring-4 ring-blue-50' : 'bg-white border-slate-100 shadow-sm hover:shadow-xl'}`}>
                             <div className="flex items-center gap-6 flex-1">
                                <div className="h-16 w-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white font-black text-xl">
                                    {enr.specialization_name.charAt(0)}
                                </div>
                                <div className="space-y-1">
                                    <h5 className="font-black text-slate-900 text-lg leading-tight">{enr.curriculum_name}</h5>
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{enr.specialization_name}</p>
                                </div>
                             </div>
                             
                             <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                        <Calendar size={12} /> Progres Curent
                                    </div>
                                    <p className="text-sm font-black text-slate-800">An {enr.study_year} | {enr.formation_name}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => startEditEnrollment(enr)} className={`p-4 rounded-2xl transition-all ${editingEnrollmentId === enr.curriculum_id ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-slate-50 text-slate-400 hover:text-blue-600'}`}><Edit size={18} /></button>
                                    <button onClick={() => handleUnenrollStudent(enr.curriculum_id)} className="p-4 bg-slate-50 text-slate-400 hover:text-red-600 rounded-2xl transition-all"><Trash size={18} /></button>
                                </div>
                             </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 p-12 rounded-[3rem] border border-amber-100 text-center">
                     <p className="text-amber-700 font-bold">⚠️ Salvează profilul studentului înainte de a-l înrola în planuri de învățământ.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-10 border-t border-slate-50 bg-white flex justify-end gap-6">
               <button onClick={() => setShowModal(false)} className="text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-600">Închide</button>
               <button onClick={handleSaveStudent} className="bg-slate-900 text-white px-12 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-black shadow-2xl transition-all">Salvează Profil</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Table View */}
      <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-200 mb-10 flex items-center justify-between">
        <div className="relative w-full max-w-xl">
          <input 
            type="text" 
            placeholder="Nume, Email, Nr. Matricol..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-[2rem] p-6 pl-16 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-slate-700 text-lg shadow-inner" 
          />
          <Search className="h-7 w-7 text-slate-300 absolute left-6 top-6" />
        </div>
        <div className="flex items-center gap-10">
            <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Studenți înregistrați</p>
                <div className="text-3xl font-black text-slate-900">{filteredStudents.length}</div>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/50">
            <tr>
              {['Nr. Matricol', 'Identitate Student', 'Program Academic', 'Status', ''].map((h) => (
                <th key={h} className="px-12 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-32"><div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto shadow-2xl shadow-blue-100"></div></td></tr>
            ) : filteredStudents.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/30 transition-all group">
                <td className="px-12 py-8">
                    <span className="font-mono text-xs font-black text-slate-400 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl group-hover:bg-white transition-all">{row.registration_number}</span>
                </td>
                <td className="px-12 py-8">
                  <div className="font-black text-slate-900 text-xl leading-none mb-2">{row.last_name} {row.first_name}</div>
                  <div className="text-xs text-slate-400 font-bold">{row.email}</div>
                </td>
                <td className="px-12 py-8">
                   <div className="flex items-center gap-4">
                        <div className={`${Number(row.plan_count) > 0 ? 'bg-blue-600' : 'bg-slate-200'} text-white p-2.5 rounded-2xl shadow-lg shadow-blue-100`}>
                            <BookOpen size={16} />
                        </div>
                        <div className="space-y-0.5">
                            <span className={`text-sm font-black block ${Number(row.plan_count) > 0 ? 'text-slate-800' : 'text-slate-300 italic'}`}>
                                {Number(row.plan_count) === 1 ? row.first_plan_name : Number(row.plan_count) > 1 ? `Programe Multiple (${row.plan_count})` : 'Neînrolat'}
                            </span>
                            {Number(row.plan_count) > 0 && <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Plan Validat</span>}
                        </div>
                   </div>
                </td>
                <td className="px-12 py-8">
                  <span className={`px-5 py-2 text-[10px] font-black rounded-full border tracking-widest uppercase ${
                    row.status === 'ENROLLED' || row.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-12 py-8 text-right opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => openEditModal(row)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs hover:bg-black shadow-xl shadow-slate-200 transition-all flex items-center gap-2">
                       <ChevronRight size={18} /> Deschide Dosar
                    </button>
                    <button onClick={() => handleDeleteStudent(row.id)} className="p-4 bg-red-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
