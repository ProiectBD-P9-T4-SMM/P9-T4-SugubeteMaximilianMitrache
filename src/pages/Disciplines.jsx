import { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import api from '../services/api';
import { Trash2, Edit2, Plus, X, AlertCircle, CheckCircle, BookOpen, Layers, GraduationCap } from 'lucide-react';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export default function Disciplines() {
  const specRef = useRef(null);
  const planRef = useRef(null);
  
  const [specializations, setSpecializations] = useState([]);
  const [curricula, setCurricula] = useState([]);
  const [disciplines, setDisciplines] = useState([]);

  useKeyboardShortcuts({
    'Alt+S': () => specRef.current?.focus(),
    'Alt+P': () => planRef.current?.focus(),
    'Alt+D': () => {
      if (selectedCurriculum) {
        resetDisciplineForm();
        setShowDisciplineForm(!showDisciplineForm);
      }
    },
    'Escape': () => {
      setShowSpecForm(false);
      setShowCurriculumForm(false);
      setShowDisciplineForm(false);
    }
  });

  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedCurriculum, setSelectedCurriculum] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '', hint: '' });
  
  // Specialization Form State
  const [showSpecForm, setShowSpecForm] = useState(false);
  const [specFormData, setSpecFormData] = useState({
    code: '',
    name: '',
    degree_level: 'BACHELOR'
  });

  // Curriculum Form State
  const [showCurriculumForm, setShowCurriculumForm] = useState(false);
  const [curriculumFormData, setCurriculumFormData] = useState({
    code: '',
    name: '',
    startYear: new Date().getFullYear().toString()
  });

  // Discipline Form State
  const [showDisciplineForm, setShowDisciplineForm] = useState(false);
  const [isEditingDiscipline, setIsEditingDiscipline] = useState(false);
  const [editingDisciplineId, setEditingDisciplineId] = useState(null);
  const [disciplineFormData, setDisciplineFormData] = useState({
    code: '',
    name: '',
    year: '1',
    semester_in_year: '1',
    evaluation_type: 'EXAM',
    ects_credits: '5',
    contact_hours: '56',
  });

  // Step 1: Load specializations on mount
  useEffect(() => {
    loadSpecializations();
  }, []);

  // Step 2: When specialization changes, load curricula for it
  useEffect(() => {
    if (selectedSpecialization) {
      loadCurriculaForSpecialization(selectedSpecialization);
      setSelectedCurriculum('');
      setDisciplines([]);
      setMessage({ type: '', text: '' });
    }
  }, [selectedSpecialization]);

  // Step 3: When curriculum changes, load disciplines for it
  useEffect(() => {
    if (selectedCurriculum) {
      fetchDisciplines(selectedCurriculum);
      setMessage({ type: '', text: '' });
    }
  }, [selectedCurriculum]);

  const loadSpecializations = async () => {
    try {
      const response = await api.get('/academic/specializations');
      if (response.data.success) {
        setSpecializations(response.data.specializations);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error loading specializations.',
        hint: error.response?.data?.resolutionHint,
      });
    }
  };

  const loadCurriculaForSpecialization = async (specId) => {
    try {
      setLoading(true);
      const response = await api.get(`/academic/curricula?specialization_id=${specId}`);
      if (response.data.success) {
        setCurricula(response.data.curricula);
        if (response.data.curricula.length === 0) {
          setMessage({
            type: 'warning',
            text: 'No study plans available for this specialization.',
          });
        }
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error loading study plans.',
        hint: error.response?.data?.resolutionHint,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDisciplines = async (curriculumId) => {
    try {
      setLoading(true);
      const response = await api.get(`/academic/disciplines?curriculum_id=${curriculumId}`);
      if (response.data.success) {
        setDisciplines(response.data.disciplines);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error loading disciplines.',
        hint: error.response?.data?.resolutionHint,
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Specialization Actions ---
  const handleCreateSpecialization = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/academic/specializations', specFormData);
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Specialization created successfully!' });
        setShowSpecForm(false);
        setSpecFormData({ code: '', name: '', degree_level: 'BACHELOR' });
        loadSpecializations();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error creating specialization.' });
    }
  };

  // --- Curriculum Actions ---
  const handleCreateCurriculum = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/academic/curricula', {
        specialization_id: selectedSpecialization,
        code: curriculumFormData.code,
        name: curriculumFormData.name,
        valid_from: `${curriculumFormData.startYear}-09-01`
      });
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Study plan created successfully!' });
        setShowCurriculumForm(false);
        setCurriculumFormData({ code: '', name: '', startYear: new Date().getFullYear().toString() });
        loadCurriculaForSpecialization(selectedSpecialization);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error creating plan.' });
    }
  };

  // --- Discipline Actions ---
  const resetDisciplineForm = () => {
    setDisciplineFormData({
      code: '',
      name: '',
      year: '1',
      semester_in_year: '1',
      evaluation_type: 'EXAM',
      ects_credits: '5',
      contact_hours: '56',
    });
    setIsEditingDiscipline(false);
    setEditingDisciplineId(null);
  };

  const handleEditDiscipline = (d) => {
    const year = Math.ceil(d.semester / 2);
    const semInYear = d.semester % 2 === 0 ? 2 : 1;
    
    setDisciplineFormData({
      code: d.code,
      name: d.name,
      year: year.toString(),
      semester_in_year: semInYear.toString(),
      evaluation_type: d.evaluation_type,
      ects_credits: d.ects_credits.toString(),
      contact_hours: d.contact_hours.toString(),
    });
    setIsEditingDiscipline(true);
    setEditingDisciplineId(d.id);
    setShowDisciplineForm(true);
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
      if (isEditingDiscipline) {
        await api.put(`/academic/disciplines/${editingDisciplineId}`, payload);
        setMessage({ type: 'success', text: 'Discipline updated successfully.' });
      } else {
        await api.post('/academic/disciplines', payload);
        setMessage({ type: 'success', text: 'Discipline created successfully.' });
      }
      resetDisciplineForm();
      setShowDisciplineForm(false);
      fetchDisciplines(selectedCurriculum);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error saving discipline.' });
    }
  };

  const handleDeleteDiscipline = async (id) => {
    if (!confirm('Delete this discipline?')) return;
    try {
      await api.delete(`/academic/disciplines/${id}`);
      setMessage({ type: 'success', text: 'Discipline deleted successfully.' });
      fetchDisciplines(selectedCurriculum);
    } catch (err) {
      setMessage({ type: 'error', text: 'Error deleting discipline.' });
    }
  };

  return (
    <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <BookOpen size={24} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Academic Structure & Disciplines</h2>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl mb-8 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
          message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' :
          message.type === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
          'bg-emerald-50 text-emerald-700 border border-emerald-100'
        }`}>
          {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          <div>
            <p className="font-bold text-sm">{message.text}</p>
            {message.hint && <p className="text-xs mt-1 opacity-80">{message.hint}</p>}
          </div>
        </div>
      )}

      {/* STEP 1: SPECIALIZATION */}
      <div className="mb-8 p-6 bg-slate-50/50 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Step 1</div>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide italic">Specialization (Domain)</h3>
          </div>
          {!showSpecForm && (
            <button 
              onClick={() => setShowSpecForm(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
            >
              <Plus size={14} /> New Specialization
            </button>
          )}
        </div>

        {showSpecForm ? (
          <form onSubmit={handleCreateSpecialization} className="bg-white p-5 rounded-xl border border-blue-200 shadow-lg shadow-blue-50 animate-in zoom-in-95 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Code</label>
                <input required type="text" value={specFormData.code} onChange={e => setSpecFormData({...specFormData, code: e.target.value})} placeholder="ex: CTI" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
                <input required type="text" value={specFormData.name} onChange={e => setSpecFormData({...specFormData, name: e.target.value})} placeholder="ex: Computer Science" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Degree Level</label>
                <Select 
                  options={[
                    { value: 'BACHELOR', label: 'Bachelor' },
                    { value: 'MASTER', label: 'Master' },
                    { value: 'PHD', label: 'PhD' }
                  ]}
                  value={{ value: specFormData.degree_level, label: specFormData.degree_level.charAt(0) + specFormData.degree_level.slice(1).toLowerCase() }}
                  onChange={option => setSpecFormData({...specFormData, degree_level: option ? option.value : 'BACHELOR'})}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: '0.5rem',
                      border: '1px solid #e2e8f0',
                      boxShadow: 'none',
                      '&:hover': { border: '1px solid #3b82f6' }
                    })
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowSpecForm(false)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition">Save Specialization</button>
            </div>
          </form>
        ) : (
          <Select
            ref={specRef}
            options={specializations.map(s => ({ 
              value: s.id, 
              label: `${s.name} (${s.code}) - ${s.degree_level}` 
            }))}
            value={selectedSpecialization ? { 
              value: selectedSpecialization, 
              label: specializations.find(s => s.id === selectedSpecialization)?.name + ' (' + specializations.find(s => s.id === selectedSpecialization)?.code + ')' 
            } : null}
            onChange={(option) => setSelectedSpecialization(option ? option.value : '')}
            placeholder="-- Search Specialization --"
            isClearable
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: '0.75rem',
                padding: '0.25rem',
                border: '1px solid #e2e8f0',
                boxShadow: 'none',
                '&:hover': { border: '1px solid #cbd5e1' }
              })
            }}
          />
        )}
      </div>

      {/* STEP 2: CURRICULUM */}
      <div className={`mb-8 p-6 bg-slate-50/50 rounded-2xl border border-slate-200 transition-all ${!selectedSpecialization ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Step 2</div>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide italic">Study Plan (Curriculum)</h3>
          </div>
          {selectedSpecialization && !showCurriculumForm && (
            <button 
              onClick={() => setShowCurriculumForm(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
            >
              <Plus size={14} /> New Plan
            </button>
          )}
        </div>

        {showCurriculumForm ? (
          <form onSubmit={handleCreateCurriculum} className="bg-white p-5 rounded-xl border border-blue-200 shadow-lg shadow-blue-50 animate-in zoom-in-95 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Plan Code</label>
                <input required type="text" value={curriculumFormData.code} onChange={e => setCurriculumFormData({...curriculumFormData, code: e.target.value})} placeholder="ex: CURR-2024-AC" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Plan Name</label>
                <input required type="text" value={curriculumFormData.name} onChange={e => setCurriculumFormData({...curriculumFormData, name: e.target.value})} placeholder="ex: Study Plan 2024" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Start Year</label>
                <input required type="number" min="2000" max="2100" value={curriculumFormData.startYear} onChange={e => setCurriculumFormData({...curriculumFormData, startYear: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowCurriculumForm(false)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition">Create Plan</button>
            </div>
          </form>
        ) : (
          <Select
            ref={planRef}
            options={curricula.map(c => ({ value: c.id, label: `${c.name} (${c.code})` }))}
            value={selectedCurriculum ? { 
              value: selectedCurriculum, 
              label: curricula.find(c => c.id === selectedCurriculum)?.name + ' (' + curricula.find(c => c.id === selectedCurriculum)?.code + ')' 
            } : null}
            onChange={(option) => setSelectedCurriculum(option ? option.value : '')}
            placeholder="-- Search Study Plan --"
            isClearable
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: '0.75rem',
                padding: '0.25rem',
                border: '1px solid #e2e8f0',
                boxShadow: 'none',
                '&:hover': { border: '1px solid #cbd5e1' }
              })
            }}
          />
        )}
      </div>

      {/* STEP 3: DISCIPLINES */}
      <div className={`transition-all ${!selectedCurriculum ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Step 3</div>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide italic">Manage Disciplines</h3>
          </div>
          <button 
            onClick={() => { resetDisciplineForm(); setShowDisciplineForm(!showDisciplineForm); }}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-md shadow-blue-100"
          >
            {showDisciplineForm ? <X size={16} /> : <Plus size={16} />}
            {showDisciplineForm ? 'Close Form' : 'Add Discipline'}
          </button>
        </div>

        {showDisciplineForm && (
          <div className="bg-white p-8 rounded-2xl border-2 border-blue-100 shadow-xl shadow-blue-50/50 mb-8 animate-in slide-in-from-top-4 duration-300">
            <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              {isEditingDiscipline ? <Edit2 className="text-blue-600" size={20} /> : <Plus className="text-blue-600" size={20} />}
              {isEditingDiscipline ? 'Edit Discipline' : 'Add New Discipline to Plan'}
            </h4>
            <form onSubmit={handleDisciplineSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subject Code</label>
                  <input required type="text" value={disciplineFormData.code} onChange={e => setDisciplineFormData({...disciplineFormData, code: e.target.value})} placeholder="ex: CS-101" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subject Name</label>
                  <input required type="text" value={disciplineFormData.name} onChange={e => setDisciplineFormData({...disciplineFormData, name: e.target.value})} placeholder="ex: Mathematical Analysis" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition shadow-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Study Year</label>
                  <Select
                    options={[
                      { value: '1', label: 'Year 1' },
                      { value: '2', label: 'Year 2' },
                      { value: '3', label: 'Year 3' },
                      { value: '4', label: 'Year 4' }
                    ]}
                    value={{ value: disciplineFormData.year, label: `Year ${disciplineFormData.year}` }}
                    onChange={option => setDisciplineFormData({...disciplineFormData, year: option ? option.value : '1'})}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: '0.75rem',
                        border: '1px solid #e2e8f0',
                        boxShadow: 'none',
                        '&:hover': { border: '1px solid #3b82f6' }
                      })
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Semester</label>
                  <Select
                    options={[
                      { value: '1', label: 'Semester 1' },
                      { value: '2', label: 'Semester 2' }
                    ]}
                    value={{ value: disciplineFormData.semester_in_year, label: `Semester ${disciplineFormData.semester_in_year}` }}
                    onChange={option => setDisciplineFormData({...disciplineFormData, semester_in_year: option ? option.value : '1'})}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: '0.75rem',
                        border: '1px solid #e2e8f0',
                        boxShadow: 'none',
                        '&:hover': { border: '1px solid #3b82f6' }
                      })
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Credits (ECTS)</label>
                  <input required type="number" min="1" max="20" value={disciplineFormData.ects_credits} onChange={e => setDisciplineFormData({...disciplineFormData, ects_credits: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Contact Hours</label>
                  <input required type="number" min="1" value={disciplineFormData.contact_hours} onChange={e => setDisciplineFormData({...disciplineFormData, contact_hours: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm focus:border-blue-500 outline-none" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowDisciplineForm(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition">Cancel</button>
                <button type="submit" className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100">
                  {isEditingDiscipline ? 'Save Changes' : 'Add Discipline'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table of Disciplines */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Discipline</th>
                <th className="px-6 py-4 text-center">Year / Sem</th>
                <th className="px-6 py-4 text-center">Eval. Type</th>
                <th className="px-6 py-4 text-center">ECTS</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {disciplines.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-12 text-slate-400 italic font-medium">No disciplines registered in this plan.</td></tr>
              ) : disciplines.map(d => {
                const year = Math.ceil(d.semester / 2);
                const sem = d.semester % 2 === 0 ? 2 : 1;
                return (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-mono font-bold text-blue-600 text-xs">{d.code}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700">{d.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium italic">{d.contact_hours} contact hours</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-bold text-[10px]">
                        Year {year} / Sem {sem}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded text-[10px] font-black">
                        {d.evaluation_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-black text-slate-600">{d.ects_credits}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEditDiscipline(d)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit2 size={16} /></button>
                        <button onClick={() => handleDeleteDiscipline(d.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {!selectedSpecialization && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-300">
          <Layers size={64} strokeWidth={1} className="mb-4 opacity-50" />
          <p className="font-medium text-slate-400">Start by selecting a Specialization in Step 1</p>
        </div>
      )}
    </div>
  );
}
