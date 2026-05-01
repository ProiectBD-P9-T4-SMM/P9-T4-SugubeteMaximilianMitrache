import { useState, useEffect } from 'react';
import Select from 'react-select';
import { Trash2, Edit2, CheckCircle, AlertCircle, Filter, X, Save, History, Download, Upload, FileText, Plus } from 'lucide-react';
import api, { academicService } from '../services/api';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export default function GradesList() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useKeyboardShortcuts({
    'Alt+F': () => setShowFilters(!showFilters),
    'Alt+R': () => handleClearFilters(),
    'Escape': () => {
      setShowFilters(false);
      setEditingId(null);
    }
  });
  
  // Filter and Lookup states
  const [students, setStudents] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [evaluators, setEvaluators] = useState([]);
  const [studyFormations, setStudyFormations] = useState([]);
  const [curricula, setCurricula] = useState([]);
  
  const [filters, setFilters] = useState({
    student_id: '',
    discipline_id: '',
    academic_year_id: '',
    exam_session: '',
    min_date: '',
    max_date: '',
    graded_by: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    student_id: '',
    discipline_id: '',
    value: '',
    exam_session: '',
    grading_date: '',
    validated: false
  });
  
  const [showFilters, setShowFilters] = useState(false);
  
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedGradeHistory, setSelectedGradeHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [showImportModal, setShowImportModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateForm, setTemplateForm] = useState({ curriculum_id: '', formation_id: '', discipline_id: '' });
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importResults, setImportResults] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addFormData, setAddFormData] = useState({ studentId: '', disciplineId: '', gradeValue: '', examSession: 'WINTER' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleExport = async () => {
    try {
      const response = await academicService.exportGrades(filters);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `grades-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to export grades.' });
    }
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!importFile) return;

    setImportLoading(true);
    setImportResults(null);
    try {
      const formData = new FormData();
      formData.append('file', importFile);
      const res = await academicService.importGrades(formData);
      setImportResults(res.data.summary);
      setMessage({ type: 'success', text: res.data.message });
      loadGrades(filters);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Import failed.' });
    } finally {
      setImportLoading(false);
    }
  };

  const handleGenerateTemplate = async (e) => {
    e.preventDefault();
    if (!templateForm.curriculum_id || !templateForm.discipline_id) return;

    try {
      const response = await academicService.getGradeTemplate(templateForm);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `import-template-${disciplines.find(d => d.id === templateForm.discipline_id)?.code || 'grade'}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setShowTemplateModal(false);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to generate template.' });
    }
  };

  const handleAddGradeSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!addFormData.studentId || !addFormData.disciplineId) {
      setMessage({ type: 'error', text: 'Please select a student and a discipline.' });
      return;
    }

    const gradeNum = parseFloat(addFormData.gradeValue);
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 10) {
      setMessage({ type: 'error', text: 'Grade must be between 0 and 10.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/academic/grades', {
        studentId: addFormData.studentId,
        disciplineId: addFormData.disciplineId,
        gradeValue: gradeNum,
        examSession: addFormData.examSession
      });
      
      setMessage({ type: 'success', text: 'Grade added successfully!' });
      setAddFormData({ ...addFormData, gradeValue: '' });
      setShowAddModal(false);
      loadGrades(filters);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error saving grade.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    loadLookupData();
    loadGrades();
  }, []);

  const loadLookupData = async () => {
    try {
      const [studentsRes, disciplinesRes, yearsRes, evaluatorsRes, formationsRes, curriculaRes] = await Promise.all([
        api.get('/academic/students-dropdown'),
        api.get('/academic/disciplines'),
        api.get('/academic/academic-years'),
        api.get('/lookup/evaluators'),
        api.get('/lookup/study-formations'),
        api.get('/academic/curricula')
      ]);
      
      setStudents(studentsRes.data.success ? studentsRes.data.students : []);
      setDisciplines(disciplinesRes.data.success ? disciplinesRes.data.disciplines : []);
      setAcademicYears(yearsRes.data.success ? yearsRes.data.academicYears : []);
      setEvaluators(evaluatorsRes.data.success ? evaluatorsRes.data.evaluators : []);
      setStudyFormations(formationsRes.data || []);
      setCurricula(curriculaRes.data.success ? curriculaRes.data.curricula : []);
    } catch (err) {
      console.error('Failed to load lookup data:', err);
    }
  };

  const loadGrades = async (filterParams = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (filterParams.student_id) params.append('student_id', filterParams.student_id);
      if (filterParams.discipline_id) params.append('discipline_id', filterParams.discipline_id);
      if (filterParams.academic_year_id) params.append('academic_year_id', filterParams.academic_year_id);
      if (filterParams.exam_session) params.append('exam_session', filterParams.exam_session);
      if (filterParams.min_date) params.append('min_date', filterParams.min_date);
      if (filterParams.max_date) params.append('max_date', filterParams.max_date);
      if (filterParams.graded_by) params.append('graded_by', filterParams.graded_by);

      const response = await api.get(`/academic/grades?${params.toString()}`);
      setGrades(response.data.grades || []);
      setMessage({ type: '', text: '' });
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Error loading grades.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleApplyFilters = () => {
    loadGrades(filters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilters({
      student_id: '',
      discipline_id: '',
      academic_year_id: '',
      exam_session: '',
      min_date: '',
      max_date: '',
      graded_by: ''
    });
    loadGrades({});
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

  const handleSaveEdit = async (gradeId) => {
    if (editForm.value === undefined || editForm.value === null || editForm.value === '' || editForm.value < 0 || editForm.value > 10) {
      setMessage({ 
        type: 'error', 
        text: 'The grade must be between 1 and 10 (or 0 for Absent).' 
      });
      return;
    }

    try {
      await api.put(`/academic/grades/${gradeId}`, {
        student_id: editForm.student_id,
        discipline_id: editForm.discipline_id,
        value: parseFloat(editForm.value),
        exam_session: editForm.exam_session,
        grading_date: editForm.grading_date,
        validated: editForm.validated
      });
      
      setMessage({ type: 'success', text: 'Grade updated successfully!' });
      setEditingId(null);
      loadGrades(filters);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Error updating grade.' 
      });
    }
  };

  const handleDelete = async (gradeId) => {
    if (!confirm('Are you sure you want to delete this grade?')) return;

    try {
      await api.delete(`/academic/grades/${gradeId}`);
      setMessage({ type: 'success', text: 'Grade deleted successfully!' });
      loadGrades(filters);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Error deleting grade.' 
      });
    }
  };

  const handleValidate = async (gradeId, currentValidated) => {
    try {
      await api.put(`/academic/grades/${gradeId}`, { validated: !currentValidated });
      setMessage({ 
        type: 'success', 
        text: `Grade ${!currentValidated ? 'validated' : 'invalidated'} successfully!` 
      });
      loadGrades(filters);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Error validating grade.' 
      });
    }
  };
  
  const fetchHistory = async (gradeId) => {
    setHistoryLoading(true);
    setShowHistoryModal(true);
    try {
      const res = await api.get(`/academic/grades/${gradeId}/history`);
      setSelectedGradeHistory(res.data.history || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Grades List</h2>

      {message.text && (
        <div className={`p-4 rounded-md mb-6 flex gap-3 ${
          message.type === 'error' 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {message.type === 'error' && <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />}
          <div>
            <p className="font-semibold">{message.text}</p>
          </div>
        </div>
      )}

      {/* Filter Toggle & Data Actions */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition font-bold text-sm"
          >
            <Filter size={16} /> {showFilters ? 'Hide' : 'Show'} Filters
          </button>
          {(filters.student_id || filters.discipline_id || filters.academic_year_id || filters.exam_session || filters.min_date || filters.max_date || filters.graded_by) && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition font-bold text-sm"
            >
              <X size={16} /> Reset
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => { setShowAddModal(true); setMessage({ type: '', text: '' }); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-bold text-sm shadow-md shadow-blue-100"
          >
            <Plus size={16} /> Add Grade
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-md hover:bg-emerald-100 transition font-bold text-sm"
          >
            <Download size={16} /> Export to CSV
          </button>
          <button
            onClick={() => { setShowImportModal(true); setImportResults(null); }}
            className="flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-md hover:bg-indigo-100 transition font-bold text-sm"
          >
            <Upload size={16} /> Import
          </button>
          <button
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 px-4 py-2 rounded-md hover:bg-amber-100 transition font-bold text-sm"
          >
            <FileText size={16} /> Generate Template
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Student</label>
              <Select
                options={students.map(s => ({ value: s.id, label: `${s.last_name} ${s.first_name}` }))}
                value={filters.student_id ? { value: filters.student_id, label: students.find(s => s.id === filters.student_id)?.last_name + ' ' + students.find(s => s.id === filters.student_id)?.first_name } : null}
                onChange={(option) => handleFilterChange('student_id', option ? option.value : '')}
                placeholder="-- All Students --"
                isClearable
                className="text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Discipline</label>
              <Select
                options={disciplines.map(d => ({ value: d.id, label: `${d.code} - ${d.name}` }))}
                value={filters.discipline_id ? { value: filters.discipline_id, label: disciplines.find(d => d.id === filters.discipline_id)?.name } : null}
                onChange={(option) => handleFilterChange('discipline_id', option ? option.value : '')}
                placeholder="-- All Disciplines --"
                isClearable
                className="text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Academic Year</label>
              <Select
                options={academicYears.map(y => ({ value: y.id, label: `${y.year_start}/${y.year_end}` }))}
                value={filters.academic_year_id ? { value: filters.academic_year_id, label: academicYears.find(y => y.id === filters.academic_year_id)?.year_start + '/' + academicYears.find(y => y.id === filters.academic_year_id)?.year_end } : null}
                onChange={(option) => handleFilterChange('academic_year_id', option ? option.value : '')}
                placeholder="-- All Years --"
                isClearable
                className="text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Exam Session</label>
              <Select
                options={[
                  { value: 'WINTER', label: 'Winter (January-February)' },
                  { value: 'SUMMER', label: 'Summer (June-July)' },
                  { value: 'RETAKE', label: 'Retake (August-September)' }
                ]}
                value={filters.exam_session ? { value: filters.exam_session, label: filters.exam_session } : null}
                onChange={(option) => handleFilterChange('exam_session', option ? option.value : '')}
                placeholder="-- All Sessions --"
                isClearable
                className="text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">From:</label>
              <input
                type="date"
                value={filters.min_date}
                onChange={(e) => handleFilterChange('min_date', e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">To:</label>
              <input
                type="date"
                value={filters.max_date}
                onChange={(e) => handleFilterChange('max_date', e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Graded By (Evaluator)</label>
              <Select
                options={evaluators.map(e => ({ value: e.id, label: e.full_name }))}
                value={filters.graded_by ? { value: filters.graded_by, label: evaluators.find(e => e.id === filters.graded_by)?.full_name } : null}
                onChange={(option) => handleFilterChange('graded_by', option ? option.value : '')}
                placeholder="-- All Evaluators --"
                isClearable
                className="text-sm"
              />
            </div>
          </div>

          <button
            onClick={handleApplyFilters}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition"
          >
            Apply Filters
          </button>
        </div>
      )}

      {/* Grades Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading...</p>
        ) : grades.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No grades found. Adjust filters and try again.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase text-xs tracking-wider">
                <th className="p-4">#</th>
                <th className="p-4">Student</th>
                <th className="p-4">Discipline</th>
                <th className="p-4">Grade</th>
                <th className="p-4">Session</th>
                <th className="p-4">Grading Date</th>
                <th className="p-4">Graded By</th>
                <th className="p-4">Validation</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade, idx) => (
                <tr key={grade.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${editingId === grade.id ? 'bg-blue-50/50' : ''}`}>
                  <td className="p-4 font-semibold text-slate-700">{idx + 1}</td>
                  
                  {/* STUDENT EDIT */}
                  <td className="p-4">
                    {editingId === grade.id ? (
                      <Select 
                        options={students.map(s => ({ value: s.id, label: `${s.last_name} ${s.first_name}` }))}
                        value={{ value: editForm.student_id, label: students.find(s => s.id === editForm.student_id)?.last_name + ' ' + students.find(s => s.id === editForm.student_id)?.first_name }}
                        onChange={(option) => setEditForm({...editForm, student_id: option ? option.value : ''})}
                        className="text-xs min-w-[150px]"
                      />
                    ) : (
                      <>
                        <div className="font-mono text-xs text-blue-600 font-bold">{grade.registration_number}</div>
                        <div className="font-medium text-slate-900">{grade.student_name}</div>
                      </>
                    )}
                  </td>

                  {/* DISCIPLINE EDIT */}
                  <td className="p-4">
                    {editingId === grade.id ? (
                      <Select 
                        options={disciplines.map(d => ({ value: d.id, label: `${d.code} - ${d.name}` }))}
                        value={{ value: editForm.discipline_id, label: disciplines.find(d => d.id === editForm.discipline_id)?.name }}
                        onChange={(option) => setEditForm({...editForm, discipline_id: option ? option.value : ''})}
                        className="text-xs min-w-[150px]"
                      />
                    ) : (
                      <>
                        <div className="font-medium">{grade.discipline_name}</div>
                        <div className="text-xs text-slate-500">{grade.discipline_code}</div>
                      </>
                    )}
                  </td>

                  {/* VALUE EDIT */}
                  <td className="p-4">
                    {editingId === grade.id ? (
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.01"
                        value={editForm.value}
                        onChange={(e) => setEditForm({...editForm, value: e.target.value})}
                        className="w-16 border-gray-300 rounded-md p-1 border font-bold text-blue-600"
                        placeholder="0=Abs"
                      />
                    ) : (
                      <span className={`font-bold text-lg ${parseFloat(grade.value) >= 5 ? 'text-green-600' : 'text-red-600'}`}>
                        {parseFloat(grade.value) === 0 ? 'Abs.' : grade.value}
                      </span>
                    )}
                  </td>

                  {/* SESSION EDIT */}
                  <td className="p-4">
                    {editingId === grade.id ? (
                      <Select 
                        options={[
                          { value: 'WINTER', label: 'Winter' },
                          { value: 'SUMMER', label: 'Summer' },
                          { value: 'RETAKE', label: 'Retake' }
                        ]}
                        value={{ value: editForm.exam_session, label: editForm.exam_session }}
                        onChange={(option) => setEditForm({...editForm, exam_session: option ? option.value : 'WINTER'})}
                        className="text-xs min-w-[100px]"
                      />
                    ) : (
                      <span className="text-sm">{grade.exam_session || '-'}</span>
                    )}
                  </td>

                  {/* DATE EDIT */}
                  <td className="p-4">
                    {editingId === grade.id ? (
                      <input 
                        type="date"
                        value={editForm.grading_date}
                        onChange={(e) => setEditForm({...editForm, grading_date: e.target.value})}
                        className="w-full p-1 text-xs border border-slate-300 rounded"
                      />
                    ) : (
                      <span className="text-sm">{new Date(grade.grading_date).toLocaleDateString('en-US')}</span>
                    )}
                  </td>

                  {/* GRADED BY */}
                  <td className="p-4 text-sm text-slate-600">
                    {grade.graded_by_name || '-'}
                  </td>

                  {/* VALIDATED EDIT */}
                  <td className="p-4">
                    {editingId === grade.id ? (
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={editForm.validated}
                          onChange={(e) => setEditForm({...editForm, validated: e.target.checked})}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-xs font-medium text-slate-600">Valid</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleValidate(grade.id, grade.validated)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded text-sm font-medium transition ${
                          grade.validated
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                      >
                        <CheckCircle size={14} />
                        {grade.validated ? 'Validated' : 'Pending'}
                      </button>
                    )}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      {editingId === grade.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(grade.id)}
                            className="bg-emerald-600 text-white p-1.5 rounded-md hover:bg-emerald-700 transition flex items-center gap-1 shadow-sm"
                            title="Save All"
                          >
                            <Save size={16} /> <span className="text-xs font-bold px-1">Save</span>
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-slate-200 text-slate-700 p-1.5 rounded-md hover:bg-slate-300 transition"
                            title="Cancel"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => fetchHistory(grade.id)}
                            className="text-slate-400 hover:text-slate-600 p-2 rounded-md hover:bg-slate-50 transition"
                            title="View History"
                          >
                            <History size={16} />
                          </button>
                          <button
                            onClick={() => handleStartEdit(grade)}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-50 transition border border-transparent hover:border-blue-100"
                            title="Full Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(grade.id)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-50 transition border border-transparent hover:border-red-100"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {grades.length > 0 && (
        <div className="mt-6 text-sm text-gray-600 border-t border-gray-200 pt-4 flex justify-between items-center">
          <div className="flex gap-6">
            <p>Total grades: <strong>{grades.length}</strong></p>
            <p className="text-emerald-600">Validated: <strong>{grades.filter(g => g.validated).length}</strong></p>
            <p className="text-amber-600">Pending: <strong>{grades.filter(g => !g.validated).length}</strong></p>
          </div>
          <div className="text-xs text-slate-400 italic">
            * Use the edit button to modify any field of the grade.
          </div>
        </div>
      )}
      
      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <History className="text-blue-600" size={24} /> Grade Audit Trail
              </h3>
              <button onClick={() => setShowHistoryModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition">
                <X size={20} />
              </button>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {historyLoading ? (
                <p className="text-center py-8 text-slate-500 italic">Reconstructing audit records...</p>
              ) : selectedGradeHistory.length === 0 ? (
                <p className="text-center py-8 text-slate-500 italic">No historical records found for this entry.</p>
              ) : (
                <div className="space-y-4">
                  {selectedGradeHistory.map((log) => (
                    <div key={log.id} className="border-l-4 border-blue-500 bg-slate-50 p-4 rounded-r-xl">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-black uppercase tracking-widest text-blue-600">{log.action_type}</span>
                        <span className="text-xs text-slate-400 font-medium">{new Date(log.occurred_at).toLocaleString()}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-700 mb-1">
                        Performed by: <span className="text-slate-900">{log.actor_name}</span>
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div className="bg-red-50/50 p-2 rounded border border-red-100">
                          <p className="text-[10px] font-black uppercase text-red-400 mb-1">Previous State</p>
                          <p className="text-xs font-mono font-bold text-red-600">
                            {log.before_snapshot_json?.value === 0 ? 'Abs.' : (log.before_snapshot_json?.value ?? 'N/A')}
                          </p>
                        </div>
                        <div className="bg-emerald-50/50 p-2 rounded border border-emerald-100">
                          <p className="text-[10px] font-black uppercase text-emerald-400 mb-1">New State</p>
                          <p className="text-xs font-mono font-bold text-emerald-600">
                            {log.after_snapshot_json?.value === 0 ? 'Abs.' : (log.after_snapshot_json?.value ?? 'N/A')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-black transition-all"
              >
                Close Traceability Log
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Upload className="text-indigo-600" size={24} /> Import Grades from CSV
              </h3>
              <button onClick={() => setShowImportModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition">
                <X size={20} />
              </button>
            </div>

            {!importResults ? (
              <form onSubmit={handleImport} className="space-y-6">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-4">
                  <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                    <FileText size={16} /> CSV Format Requirements
                  </h4>
                  <p className="text-xs text-blue-600 leading-relaxed mb-2">
                    The CSV must contain the following headers (order doesn't matter):
                  </p>
                  <code className="text-[10px] bg-white p-2 rounded block border border-blue-100 text-slate-700">
                    Registration Number, Discipline Code, Grade, Session
                  </code>
                  <p className="text-[10px] mt-2 text-blue-500 italic">
                    * Use 'Abs.' for absent students or 0.
                  </p>
                </div>

                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-indigo-300 transition-colors bg-slate-50">
                  <input 
                    type="file" 
                    accept=".csv"
                    onChange={e => setImportFile(e.target.files[0])}
                    className="hidden"
                    id="import-file-input"
                  />
                  <label htmlFor="import-file-input" className="cursor-pointer">
                    <Upload size={40} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-sm font-bold text-slate-600 mb-1">
                      {importFile ? importFile.name : 'Click to select or drag CSV file'}
                    </p>
                    <p className="text-xs text-slate-400">Max size: 5MB</p>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowImportModal(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={importLoading || !importFile}
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 disabled:opacity-50"
                  >
                    {importLoading ? 'Processing Records...' : 'Start Import'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center">
                    <p className="text-xs font-black uppercase text-emerald-400 mb-1">Successful</p>
                    <p className="text-3xl font-black text-emerald-600">{importResults.success}</p>
                  </div>
                  <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-center">
                    <p className="text-xs font-black uppercase text-red-400 mb-1">Failed</p>
                    <p className="text-3xl font-black text-red-600">{importResults.failed}</p>
                  </div>
                </div>

                {importResults.details.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-black uppercase text-slate-400 mb-2 ml-1">Failure Details</p>
                    <div className="max-h-[200px] overflow-y-auto bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
                      {importResults.details.map((detail, idx) => (
                        <div key={idx} className="text-[11px] flex justify-between gap-4 border-b border-slate-100 pb-1 last:border-0">
                          <span className="font-mono text-slate-500 truncate max-w-[150px]">
                            {detail.row['Registration Number'] || detail.row['Nr. Matricol'] || 'Unknown'}
                          </span>
                          <span className="text-red-500 font-bold">{detail.error}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => { setShowImportModal(false); setImportResults(null); setImportFile(null); }}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition shadow-xl"
                >
                  Return to Registry
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <FileText className="text-amber-600" size={24} /> Generate Import Template
              </h3>
              <button onClick={() => setShowTemplateModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleGenerateTemplate} className="space-y-4">
              <p className="text-sm text-slate-500 mb-4">
                Generate a pre-filled CSV for all students enrolled in a specific study plan and taking a chosen discipline.
              </p>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">1. Study Plan (Curriculum)</label>
                <Select
                  options={curricula.map(c => ({ value: c.id, label: `${c.code} - ${c.name}` }))}
                  value={templateForm.curriculum_id ? { value: templateForm.curriculum_id, label: curricula.find(c => c.id === templateForm.curriculum_id)?.code } : null}
                  onChange={(opt) => setTemplateForm({ ...templateForm, curriculum_id: opt?.value || '', discipline_id: '' })}
                  placeholder="Select Plan..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">2. Discipline</label>
                <Select
                  options={disciplines.filter(d => d.curriculum_id === templateForm.curriculum_id).map(d => ({ value: d.id, label: `${d.code} - ${d.name}` }))}
                  value={templateForm.discipline_id ? { value: templateForm.discipline_id, label: disciplines.find(d => d.id === templateForm.discipline_id)?.name } : null}
                  onChange={(opt) => setTemplateForm({ ...templateForm, discipline_id: opt?.value || '' })}
                  placeholder={templateForm.curriculum_id ? "Select Discipline..." : "Select Plan First"}
                  disabled={!templateForm.curriculum_id}
                />
              </div>

              <hr className="my-6 border-slate-100" />

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">3. Specific Group (Optional)</label>
                <Select
                  options={studyFormations.map(f => ({ value: f.id, label: `${f.code} - Year ${f.study_year}` }))}
                  onChange={(opt) => setTemplateForm({ ...templateForm, formation_id: opt?.value || '' })}
                  placeholder="All Groups"
                  isClearable
                />
                <p className="text-[10px] text-slate-400 mt-1 italic">Leave empty to include all students on this study plan.</p>
              </div>

              <div className="pt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowTemplateModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!templateForm.curriculum_id || !templateForm.discipline_id}
                  className="flex-1 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition shadow-lg shadow-amber-100 disabled:opacity-50"
                >
                  Download CSV Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Grade Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Plus className="text-blue-600" size={24} /> Add Official Grade
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddGradeSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Student</label>
                  <Select 
                    options={(addFormData.disciplineId 
                      ? students.filter(s => {
                          const disc = disciplines.find(d => d.id === addFormData.disciplineId);
                          return s.curriculum_ids && s.curriculum_ids.includes(disc?.curriculum_id);
                        })
                      : students
                    ).map(s => ({ value: s.id, label: `${s.last_name} ${s.first_name} (${s.registration_number})` }))}
                    value={addFormData.studentId ? { value: addFormData.studentId, label: students.find(s => s.id === addFormData.studentId)?.last_name + ' ' + students.find(s => s.id === addFormData.studentId)?.first_name } : null}
                    onChange={(option) => setAddFormData({...addFormData, studentId: option ? option.value : ''})}
                    placeholder="Search Student..."
                    isClearable
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Discipline</label>
                  <Select 
                    options={(addFormData.studentId
                      ? disciplines.filter(d => {
                          const student = students.find(s => s.id === addFormData.studentId);
                          return student?.curriculum_ids && student.curriculum_ids.includes(d.curriculum_id);
                        })
                      : disciplines
                    ).map(d => ({ value: d.id, label: `${d.name} (Sem. ${d.semester})` }))}
                    value={addFormData.disciplineId ? { value: addFormData.disciplineId, label: disciplines.find(d => d.id === addFormData.disciplineId)?.name } : null}
                    onChange={(option) => {
                      const disc = disciplines.find(d => d.id === option?.value);
                      const autoSession = disc ? (disc.semester % 2 !== 0 ? 'WINTER' : 'SUMMER') : addFormData.examSession;
                      setAddFormData({...addFormData, disciplineId: option ? option.value : '', examSession: autoSession});
                    }}
                    placeholder="Search Discipline..."
                    isClearable
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Session</label>
                    <Select 
                      options={[
                        { value: 'WINTER', label: 'Winter' },
                        { value: 'SUMMER', label: 'Summer' },
                        { value: 'RETAKE', label: 'Retake' }
                      ]}
                      value={{ value: addFormData.examSession, label: addFormData.examSession }}
                      onChange={(option) => setAddFormData({...addFormData, examSession: option ? option.value : 'WINTER'})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Grade (0-10)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      max="10" 
                      required
                      className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border font-bold text-blue-600"
                      value={addFormData.gradeValue}
                      onChange={(e) => setAddFormData({...addFormData, gradeValue: e.target.value})}
                      placeholder="0=Abs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Official Grade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
