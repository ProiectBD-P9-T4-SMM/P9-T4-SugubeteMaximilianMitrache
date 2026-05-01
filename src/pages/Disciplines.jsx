import { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import api from '../services/api';
import { 
  Trash2, Edit2, Plus, X, AlertCircle, CheckCircle, BookOpen, 
  Layers, GraduationCap, Shield, ChevronRight, Settings, 
  Search, Filter, Clock, Archive
} from 'lucide-react';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export default function Disciplines() {
  const specRef = useRef(null);
  const planRef = useRef(null);
  
  const [specializations, setSpecializations] = useState([]);
  const [curricula, setCurricula] = useState([]);
  const [disciplines, setDisciplines] = useState([]);

  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedCurriculum, setSelectedCurriculum] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '', hint: '' });
  
  // Form Visibility
  const [showSpecForm, setShowSpecForm] = useState(false);
  const [showCurriculumForm, setShowCurriculumForm] = useState(false);
  const [showDisciplineForm, setShowDisciplineForm] = useState(false);

  // Form Data
  const [specFormData, setSpecFormData] = useState({ code: '', name: '', degree_level: 'BACHELOR' });
  const [curriculumFormData, setCurriculumFormData] = useState({ code: '', name: '', startYear: new Date().getFullYear().toString() });
  const [isEditingDiscipline, setIsEditingDiscipline] = useState(false);
  const [editingDisciplineId, setEditingDisciplineId] = useState(null);
  const [disciplineFormData, setDisciplineFormData] = useState({
    code: '', name: '', year: '1', semester_in_year: '1',
    evaluation_type: 'EXAM', ects_credits: '5', contact_hours: '56',
  });

  useKeyboardShortcuts({
    'Alt+S': () => specRef.current?.focus(),
    'Alt+P': () => planRef.current?.focus(),
    'Alt+D': () => { if (selectedCurriculum) { resetDisciplineForm(); setShowDisciplineForm(!showDisciplineForm); } },
    'Escape': () => { setShowSpecForm(false); setShowCurriculumForm(false); setShowDisciplineForm(false); }
  });

  useEffect(() => { loadSpecializations(); }, []);

  useEffect(() => {
    if (selectedSpecialization) {
      loadCurriculaForSpecialization(selectedSpecialization);
      setSelectedCurriculum('');
      setDisciplines([]);
      setMessage({ type: '', text: '' });
    }
  }, [selectedSpecialization]);

  useEffect(() => {
    if (selectedCurriculum) {
      fetchDisciplines(selectedCurriculum);
      setMessage({ type: '', text: '' });
    }
  }, [selectedCurriculum]);

  const loadSpecializations = async () => {
    try {
      const res = await api.get('/academic/specializations');
      if (res.data.success) setSpecializations(res.data.specializations);
    } catch (err) { console.error(err); }
  };

  const loadCurriculaForSpecialization = async (specId) => {
    setLoading(true);
    try {
      const res = await api.get(`/academic/curricula?specialization_id=${specId}`);
      if (res.data.success) setCurricula(res.data.curricula);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchDisciplines = async (curriculumId) => {
    setLoading(true);
    try {
      const res = await api.get(`/academic/disciplines?curriculum_id=${curriculumId}`);
      if (res.data.success) setDisciplines(res.data.disciplines);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreateSpecialization = async (e) => {
    e.preventDefault();
    try {
      await api.post('/academic/specializations', specFormData);
      setMessage({ type: 'success', text: 'Domain registered successfully.' });
      setShowSpecForm(false); setSpecFormData({ code:'', name:'', degree_level:'BACHELOR'});
      loadSpecializations();
    } catch (err) { setMessage({ type: 'error', text: 'Registration failed.' }); }
  };

  const handleCreateCurriculum = async (e) => {
    e.preventDefault();
    try {
      await api.post('/academic/curricula', {
        specialization_id: selectedSpecialization,
        code: curriculumFormData.code,
        name: curriculumFormData.name,
        valid_from: `${curriculumFormData.startYear}-09-01`
      });
      setMessage({ type: 'success', text: 'Study plan deployed.' });
      setShowCurriculumForm(false);
      loadCurriculaForSpecialization(selectedSpecialization);
    } catch (err) { setMessage({ type: 'error', text: 'Plan creation failed.' }); }
  };

  const resetDisciplineForm = () => {
    setDisciplineFormData({ code:'', name:'', year:'1', semester_in_year:'1', evaluation_type:'EXAM', ects_credits:'5', contact_hours:'56' });
    setIsEditingDiscipline(false); setEditingDisciplineId(null);
  };

  const handleEditDiscipline = (d) => {
    setDisciplineFormData({
      code: d.code, name: d.name,
      year: Math.ceil(d.semester / 2).toString(),
      semester_in_year: (d.semester % 2 === 0 ? 2 : 1).toString(),
      evaluation_type: d.evaluation_type,
      ects_credits: d.ects_credits.toString(),
      contact_hours: d.contact_hours.toString(),
    });
    setIsEditingDiscipline(true); setEditingDisciplineId(d.id); setShowDisciplineForm(true);
  };

  const handleDisciplineSubmit = async (e) => {
    e.preventDefault();
    const absoluteSemester = (parseInt(disciplineFormData.year) - 1) * 2 + parseInt(disciplineFormData.semester_in_year);
    const payload = {
      curriculum_id: selectedCurriculum,
      code: disciplineFormData.code.trim(),
      name: disciplineFormData.name.trim(),
      semester: absoluteSemester,
      evaluation_type: disciplineFormData.evaluation_type,
      ects_credits: parseInt(disciplineFormData.ects_credits),
      contact_hours: parseInt(disciplineFormData.contact_hours),
    };
    try {
      if (isEditingDiscipline) await api.put(`/academic/disciplines/${editingDisciplineId}`, payload);
      else await api.post('/academic/disciplines', payload);
      setMessage({ type: 'success', text: 'Module saved successfully.' });
      resetDisciplineForm(); setShowDisciplineForm(false);
      fetchDisciplines(selectedCurriculum);
    } catch (err) { setMessage({ type: 'error', text: 'Save failed.' }); }
  };

  const handleDeleteDiscipline = async (id) => {
    if (!confirm('Delete module?')) return;
    try {
      await api.delete(`/academic/disciplines/${id}`);
      fetchDisciplines(selectedCurriculum);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex-1 bg-slate-50/50 min-h-screen p-8 lg:p-12 animate-in fade-in duration-500">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Curricula & Disciplines</h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
            <Shield size={16} className="text-blue-600" /> Strategic Academic Architecture Management
          </p>
        </div>
      </header>

      {message.text && (
        <div className={`p-4 rounded-2xl mb-10 flex items-center gap-3 animate-in fade-in duration-300 ${message.type === 'error' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
           <AlertCircle size={18} /> <p className="text-xs font-black uppercase tracking-widest">{message.text}</p>
        </div>
      )}

      {/* Step 1: Specialization Matrix */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 mb-8 relative group">
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-4">
             <div className="h-10 w-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black">1</div>
             <h3 className="text-lg font-black text-slate-900 tracking-tight">Institutional Domains</h3>
          </div>
          <button onClick={() => setShowSpecForm(!showSpecForm)} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-all">
            {showSpecForm ? 'Cancel' : 'Register Domain'}
          </button>
        </div>

        {showSpecForm ? (
          <form onSubmit={handleCreateSpecialization} className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-3xl animate-in slide-in-from-top-4 duration-300">
             <FormInput label="Domain Code" placeholder="e.g. CTI" value={specFormData.code} onChange={e => setSpecFormData({...specFormData, code: e.target.value})} />
             <FormInput label="Full Designation" placeholder="e.g. Computer Engineering" value={specFormData.name} onChange={e => setSpecFormData({...specFormData, name: e.target.value})} />
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Degree</label>
                <Select options={['BACHELOR', 'MASTER', 'PHD'].map(l => ({value:l, label:l}))} value={{value:specFormData.degree_level, label:specFormData.degree_level}} onChange={opt => setSpecFormData({...specFormData, degree_level: opt?.value})} styles={customSelectStyles} />
             </div>
             <div className="md:col-span-3 flex justify-end">
                <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Commit Specialization</button>
             </div>
          </form>
        ) : (
          <Select 
            ref={specRef}
            options={specializations.map(s => ({ value: s.id, label: `${s.name} (${s.code}) - ${s.degree_level}` }))}
            value={selectedSpecialization ? { value: selectedSpecialization, label: specializations.find(s => s.id === selectedSpecialization)?.name } : null}
            onChange={opt => setSelectedSpecialization(opt?.value || '')}
            styles={customSelectStyles}
            placeholder="-- Select Institutional Domain --"
            isClearable
          />
        )}
      </div>

      {/* Step 2: Curriculum Deployment */}
      <div className={`bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 mb-8 transition-all duration-700 ${!selectedSpecialization ? 'opacity-30 grayscale pointer-events-none' : ''}`}>
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black">2</div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Active Study Plans</h3>
           </div>
           {selectedSpecialization && (
             <button onClick={() => setShowCurriculumForm(!showCurriculumForm)} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-100 transition-all">
                {showCurriculumForm ? 'Cancel' : 'Deploy New Plan'}
             </button>
           )}
        </div>

        {showCurriculumForm ? (
          <form onSubmit={handleCreateCurriculum} className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-3xl animate-in slide-in-from-top-4 duration-300">
             <FormInput label="Plan Identifier" placeholder="e.g. CURR-2026-V1" value={curriculumFormData.code} onChange={e => setCurriculumFormData({...curriculumFormData, code: e.target.value})} />
             <FormInput label="Official Name" placeholder="e.g. Curriculum v1.0" value={curriculumFormData.name} onChange={e => setCurriculumFormData({...curriculumFormData, name: e.target.value})} />
             <FormInput label="Deployment Year" type="number" value={curriculumFormData.startYear} onChange={e => setCurriculumFormData({...curriculumFormData, startYear: e.target.value})} />
             <div className="md:col-span-3 flex justify-end">
                <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Activate Curriculum</button>
             </div>
          </form>
        ) : (
          <Select 
            ref={planRef}
            options={curricula.map(c => ({ value: c.id, label: `${c.name} (${c.code})` }))}
            value={selectedCurriculum ? { value: selectedCurriculum, label: curricula.find(c => c.id === selectedCurriculum)?.name } : null}
            onChange={opt => setSelectedCurriculum(opt?.value || '')}
            styles={customSelectStyles}
            placeholder="-- Search Available Curricula --"
            isClearable
          />
        )}
      </div>

      {/* Step 3: Module Engineering */}
      {selectedCurriculum && (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black">3</div>
                 <h3 className="text-lg font-black text-slate-900 tracking-tight">Academic Module Inventory</h3>
              </div>
              <button onClick={() => { resetDisciplineForm(); setShowDisciplineForm(!showDisciplineForm); }} className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 flex items-center gap-3 transition-all">
                 {showDisciplineForm ? <X size={18} /> : <Plus size={18} />}
                 {showDisciplineForm ? 'Cancel Engineering' : 'Add New Module'}
              </button>
           </div>

           {showDisciplineForm && (
             <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-50 mb-10 animate-in zoom-in-95 duration-500">
                <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                   <Settings className="text-emerald-500" size={24} /> Module Configuration Specification
                </h4>
                <form onSubmit={handleDisciplineSubmit} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput label="Module Code" placeholder="e.g. CS-201" value={disciplineFormData.code} onChange={e => setDisciplineFormData({...disciplineFormData, code: e.target.value})} />
                      <FormInput label="Module Full Designation" placeholder="e.g. Applied Cryptography" value={disciplineFormData.name} onChange={e => setDisciplineFormData({...disciplineFormData, name: e.target.value})} />
                   </div>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Study Year</label>
                        <Select options={[1,2,3,4].map(y => ({value:String(y), label:`Year ${y}`}))} value={{value: disciplineFormData.year, label:`Year ${disciplineFormData.year}`}} onChange={opt => setDisciplineFormData({...disciplineFormData, year: opt?.value})} styles={customSelectStyles} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Semester</label>
                        <Select options={[{value:'1', label:'Sem 1'}, {value:'2', label:'Sem 2'}]} value={{value: disciplineFormData.semester_in_year, label:`Sem ${disciplineFormData.semester_in_year}`}} onChange={opt => setDisciplineFormData({...disciplineFormData, semester_in_year: opt?.value})} styles={customSelectStyles} />
                      </div>
                      <FormInput label="ECTS Credits" type="number" value={disciplineFormData.ects_credits} onChange={e => setDisciplineFormData({...disciplineFormData, ects_credits: e.target.value})} />
                      <FormInput label="Contact Hours" type="number" value={disciplineFormData.contact_hours} onChange={e => setDisciplineFormData({...disciplineFormData, contact_hours: e.target.value})} />
                   </div>
                   <div className="flex justify-end gap-4 pt-4 border-t border-slate-50">
                      <button type="button" onClick={() => setShowDisciplineForm(false)} className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Discard</button>
                      <button type="submit" className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all">Save Academic Module</button>
                   </div>
                </form>
             </div>
           )}

           <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-50 overflow-hidden">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50">
                       <TableHead label="Code" />
                       <TableHead label="Module Designation" />
                       <TableHead label="Timeline" />
                       <TableHead label="Evaluation" />
                       <TableHead label="ECTS" />
                       <TableHead label="Actions" />
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {disciplines.length === 0 ? (
                      <tr><td colSpan="6" className="py-20 text-center text-slate-300 font-black italic">No modules registered in this plan.</td></tr>
                    ) : disciplines.map(d => (
                      <tr key={d.id} className="group hover:bg-blue-50/30 transition-all">
                         <td className="px-8 py-6">
                            <span className="font-mono text-[11px] font-black text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl group-hover:bg-white group-hover:text-blue-600 transition-all">{d.code}</span>
                         </td>
                         <td className="px-8 py-6">
                            <p className="font-black text-slate-900 text-sm leading-tight">{d.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 flex items-center gap-2"><Clock size={10} /> {d.contact_hours} Lab/Course Hours</p>
                         </td>
                         <td className="px-8 py-6">
                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Year {Math.ceil(d.semester / 2)} • Sem {d.semester % 2 === 0 ? 2 : 1}</span>
                         </td>
                         <td className="px-8 py-6">
                            <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">{d.evaluation_type}</span>
                         </td>
                         <td className="px-8 py-6 font-black text-slate-900">{d.ects_credits}</td>
                         <td className="px-8 py-6">
                            <div className="flex gap-2">
                               <button onClick={() => handleEditDiscipline(d)} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit2 size={16} /></button>
                               <button onClick={() => handleDeleteDiscipline(d.id)} className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {!selectedSpecialization && (
        <div className="py-32 text-center animate-in fade-in duration-1000">
           <Archive className="mx-auto text-slate-100 mb-6" size={100} strokeWidth={1} />
           <h4 className="text-xl font-black text-slate-300 uppercase tracking-[0.3em]">Institutional Repository</h4>
           <p className="text-xs font-bold text-slate-300 mt-4 uppercase tracking-[0.2em]">Select a domain above to initialize structural view</p>
        </div>
      )}
    </div>
  );
}

// UI Components
function TableHead({ label }) {
  return (
    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{label}</th>
  );
}

function FormInput({ label, type = "text", ...props }) {
  return (
    <div className="space-y-2">
       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
       <input type={type} className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none shadow-sm" {...props} />
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
  menu: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#eff6ff' : 'white',
    color: state.isSelected ? 'white' : '#1e293b',
    fontWeight: 'bold',
    fontSize: '0.875rem',
  })
};
