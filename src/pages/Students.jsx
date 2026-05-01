import { useState, useEffect } from 'react';
import { Database, Plus, Search, Edit, Trash } from 'lucide-react';
import * as XLSX from 'xlsx';
import { academicService, lookupService } from '../services/api';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formations, setFormations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({
    first_name: '', last_name: '', email: '', study_formation_id: '', status: 'ENROLLED'
  });
  // 6-level cascading selection
  const [sel, setSel] = useState({ degreeLevel: '', specCode: '', eduForm: '', year: '', group: '', sub: '' });

  useEffect(() => { fetchStudents(); fetchFormations(); }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try { const res = await academicService.getStudents(); setStudents(res.data); }
    catch (err) { console.error("Failed to load students", err); }
    finally { setLoading(false); }
  };

  const fetchFormations = async () => {
    try {
      const res = await lookupService.getStudyFormations();
      setFormations(res.data);
    } catch (err) { console.error("Failed to load formations", err); }
  };

  // Derived lists for each dropdown level (cascade filtering)
  const degreeLevels = [...new Set(formations.map(f => f.degree_level))].sort();
  const filteredSpecs = formations
    .filter(f => !sel.degreeLevel || f.degree_level === sel.degreeLevel)
    .reduce((acc, f) => { if (!acc.find(s => s.spec_code === f.spec_code)) acc.push({ spec_code: f.spec_code, specialization_name: f.specialization_name }); return acc; }, []);
  const filteredEduForms = [...new Set(
    formations.filter(f => f.spec_code === sel.specCode).map(f => f.education_form)
  )].sort();
  const filteredYears = [...new Set(
    formations.filter(f => f.spec_code === sel.specCode && f.education_form === sel.eduForm).map(f => f.study_year)
  )].sort();
  const filteredGroups = [...new Set(
    formations.filter(f => f.spec_code === sel.specCode && f.education_form === sel.eduForm && f.study_year === parseInt(sel.year)).map(f => f.group_index)
  )].sort();
  const filteredSubs = formations
    .filter(f => f.spec_code === sel.specCode && f.education_form === sel.eduForm && f.study_year === parseInt(sel.year) && f.group_index === parseInt(sel.group))
    .map(f => f.code.slice(-1)); // Last char of code is A or B

  // Auto-resolve formation ID when all 6 fields selected
  useEffect(() => {
    if (sel.specCode && sel.eduForm && sel.year && sel.group && sel.sub) {
      const match = formations.find(f =>
        f.spec_code === sel.specCode &&
        f.education_form === sel.eduForm &&
        f.study_year === parseInt(sel.year) &&
        f.group_index === parseInt(sel.group) &&
        f.code.endsWith(sel.sub)
      );
      setStudentForm(prev => ({ ...prev, study_formation_id: match?.id || '' }));
    }
  }, [sel, formations]);

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    // When adding, formation is required. When editing, it's optional (user may only change name/email/status).
    if (!editingStudent && !studentForm.study_formation_id) {
      alert('Please complete the Study Formation selection (all 6 fields).');
      return;
    }
    try {
      // Build only the fields that are actually set
      const payload = {
        first_name: studentForm.first_name,
        last_name: studentForm.last_name,
        email: studentForm.email,
        status: studentForm.status,
      };
      if (studentForm.study_formation_id) {
        payload.study_formation_id = studentForm.study_formation_id;
      }

      if (editingStudent) { await academicService.updateStudent(editingStudent.id, payload); }
      else { await academicService.addStudent(studentForm); }
      setShowModal(false); fetchStudents();
    } catch (err) { 
      const msg = err.response?.data?.message || 'Failed to save student';
      const suggestion = err.response?.status === 400 ? "\n\n💡 Sugestie: Verifică dacă toate câmpurile obligatorii sunt completate corect și dacă formația de studiu a fost identificată." : "";
      alert(msg + suggestion); 
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Confirm soft-delete (mark as INACTIVE)?")) return;
    try { await academicService.deleteStudent(id); fetchStudents(); }
    catch (err) { alert('Failed to delete student'); }
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    const formation = formations.find(f => f.name === student.formation_name);
    const emptySel = { degreeLevel: '', specCode: '', eduForm: '', year: '', group: '', sub: '' };
    const decoded = formation ? {
      degreeLevel: formation.degree_level || '',
      specCode: formation.spec_code || '',
      eduForm: formation.education_form || '',
      year: String(formation.study_year || ''),
      group: String(formation.group_index || ''),
      sub: formation.code?.slice(-1) || ''
    } : emptySel;
    setSel(decoded);
    setStudentForm({ first_name: student.first_name, last_name: student.last_name, email: student.email || '', study_formation_id: formation?.id || '', status: student.status || 'ENROLLED' });
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingStudent(null);
    setSel({ degreeLevel: '', specCode: '', eduForm: '', year: '', group: '', sub: '' });
    setStudentForm({ first_name: '', last_name: '', email: '', study_formation_id: '', status: 'ENROLLED' });
    setShowModal(true);
  };

  const filteredStudents = students.filter(s => 
    s.status !== 'INACTIVE' &&
    (s.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     s.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     s.registration_number.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Students & Curricula Management</h2>
        <div className="flex space-x-2">
          <label className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition flex items-center space-x-2 cursor-pointer">
            <Database className="h-4 w-4" />
            <span>Import Excel</span>
            <input type="file" accept=".xlsx, .xls, .csv" className="hidden" onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              
              const reader = new FileReader();
              reader.onload = async (evt) => {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                
                try {
                  const res = await academicService.addStudentsBulk(data);
                  alert(res.data.message);
                  fetchStudents();
                } catch (err) {
                  const msg = err.response?.data?.message || 'Failed to import bulk students.';
                  const suggestion = "\n\n💡 Sugestie: Asigură-te că fișierul Excel are coloanele: first_name, last_name, email și study_formation_id.";
                  alert(msg + suggestion);
                }
              };
              reader.readAsBinaryString(file);
              e.target.value = null; // reset
            }} />
          </label>
          <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-800 mb-4">{editingStudent ? 'Edit Student' : 'Add Student'}</h3>
            <form onSubmit={handleSaveStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <input required type="text" value={studentForm.first_name} onChange={e => setStudentForm({...studentForm, first_name: e.target.value})} className="w-full p-2 border border-slate-300 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <input required type="text" value={studentForm.last_name} onChange={e => setStudentForm({...studentForm, last_name: e.target.value})} className="w-full p-2 border border-slate-300 rounded" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input required type="email" value={studentForm.email} onChange={e => setStudentForm({...studentForm, email: e.target.value})} className="w-full p-2 border border-slate-300 rounded" />
              </div>

              {/* --- 6 Cascading Dropdowns --- */}
              <div className="border border-blue-200 rounded-md p-4 bg-blue-50 space-y-3">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Study Formation</p>

                {/* Row 1: Degree Level */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Ciclu studii</label>
                    <select
                      value={sel.degreeLevel}
                      onChange={e => setSel({ degreeLevel: e.target.value, specCode: '', eduForm: '', year: '', group: '', sub: '' })}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
                    >
                      <option value="">-- Licență / Masterat --</option>
                      {degreeLevels.map(dl => <option key={dl} value={dl}>{dl}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Specializare</label>
                    <select
                      value={sel.specCode}
                      disabled={!sel.degreeLevel}
                      onChange={e => setSel(prev => ({ ...prev, specCode: e.target.value, eduForm: '', year: '', group: '', sub: '' }))}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-sm disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value="">-- Specializare --</option>
                      {filteredSpecs.map(s => <option key={s.spec_code} value={s.spec_code}>{s.specialization_name} ({s.spec_code})</option>)}
                    </select>
                  </div>
                </div>

                {/* Row 2: Education Form + Year + Group + Subgroup */}
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Frecvență</label>
                    <select
                      value={sel.eduForm}
                      disabled={!sel.specCode}
                      onChange={e => setSel(prev => ({ ...prev, eduForm: e.target.value, year: '', group: '', sub: '' }))}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-sm disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value="">--</option>
                      {filteredEduForms.map(f => <option key={f} value={f}>{f === 'IF' ? 'IF (cu frecvență)' : 'IFR (fără frecvență)'}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">An</label>
                    <select
                      value={sel.year}
                      disabled={!sel.eduForm}
                      onChange={e => setSel(prev => ({ ...prev, year: e.target.value, group: '', sub: '' }))}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-sm disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value="">--</option>
                      {filteredYears.map(y => <option key={y} value={y}>An {y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Grupă</label>
                    <select
                      value={sel.group}
                      disabled={!sel.year}
                      onChange={e => setSel(prev => ({ ...prev, group: e.target.value, sub: '' }))}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-sm disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value="">--</option>
                      {filteredGroups.map(g => <option key={g} value={g}>Gr. {g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Subgrupă</label>
                    <select
                      value={sel.sub}
                      disabled={!sel.group}
                      onChange={e => setSel(prev => ({ ...prev, sub: e.target.value }))}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-sm disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value="">--</option>
                      {filteredSubs.map(s => <option key={s} value={s}>Sgr. {s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Indicator */}
                {studentForm.study_formation_id ? (
                  <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 rounded px-2 py-1">
                    ✓ {sel.degreeLevel} · {sel.specCode} · {sel.eduForm} · An {sel.year} · Gr.{sel.group} · Sgr.{sel.sub}
                  </p>
                ) : sel.sub ? (
                  <p className="text-xs text-red-600 font-medium">⚠ No matching formation found.</p>
                ) : (
                  <p className="text-xs text-slate-400">Selectează toate câmpurile pentru a identifica formația.</p>
                )}
              </div>


              {editingStudent && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select value={studentForm.status} onChange={e => setStudentForm({...studentForm, status: e.target.value})} className="w-full p-2 border border-slate-300 rounded">
                    <option value="ENROLLED">ENROLLED</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="GRADUATED">GRADUATED</option>
                    <option value="ACTIVE">ACTIVE</option>
                  </select>
                </div>
              )}
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex-2 min-w-[300px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Search Student name or ID</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="e.g. Popescu..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-slate-300 rounded-md shadow-sm p-2 pl-8 border focus:ring-blue-500" 
            />
            <Search className="h-4 w-4 text-slate-400 absolute left-2 top-3" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left w-12"><input type="checkbox" className="rounded border-slate-300" /></th>
              {['Reg. Number', 'Name', 'Group', 'Year', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-6 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {loading ? (
              <tr><td colSpan="7" className="text-center py-4 text-slate-500">Loading students...</td></tr>
            ) : filteredStudents.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-4 text-slate-500">No students found</td></tr>
            ) : filteredStudents.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="px-6 py-4"><input type="checkbox" className="rounded border-slate-300" /></td>
                <td className="px-6 py-4 font-mono text-slate-500">{row.registration_number}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{row.first_name} {row.last_name}</td>
                <td className="px-6 py-4">{row.formation_name || 'N/A'}</td>
                <td className="px-6 py-4">{row.study_year || 'N/A'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    row.status === 'ENROLLED' || row.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex space-x-2">
                  <button onClick={() => openEditModal(row)} className="text-blue-600 hover:text-blue-900" title="Edit"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => handleDeleteStudent(row.id)} className="text-red-600 hover:text-red-900" title="Hide/Delete"><Trash className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-sm text-slate-500">
          <span>Showing {filteredStudents.length} active students</span>
        </div>
      </div>
    </div>
  );
}
