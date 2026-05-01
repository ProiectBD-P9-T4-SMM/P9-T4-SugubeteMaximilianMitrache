import { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import api from '../services/api';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useAuth } from '../context/AuthContext';

export default function AddGrades() {
  const { user } = useAuth();
  const studentRef = useRef(null);
  const disciplineRef = useRef(null);
  const gradeRef = useRef(null);
  
  const [students, setStudents] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [formData, setFormData] = useState({ studentId: '', disciplineId: '', gradeValue: '', examSession: 'WINTER' });
  const [message, setMessage] = useState({ type: '', text: '', hint: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentGrades, setRecentGrades] = useState([]);

  useKeyboardShortcuts({
    'Alt+S': () => studentRef.current?.focus(),
    'Alt+D': () => disciplineRef.current?.focus(),
    'Alt+N': () => gradeRef.current?.focus(),
    'Enter': (e) => {
      // Only submit if an input or select is focused (not global)
      if (['INPUT', 'SELECT'].includes(document.activeElement.tagName)) {
        handleSubmit(e);
      }
    }
  });

  useEffect(() => {
    // Fetch data for dropdowns
    Promise.all([
      api.get('/academic/students-dropdown'),
      api.get('/academic/disciplines')
    ]).then(([studentsRes, discRes]) => {
      setStudents(studentsRes.data.students || []);
      setDisciplines(discRes.data.disciplines || []);
    }).catch(() => {
      setMessage({ type: 'error', text: 'Error loading academic lists.' });
    });
  }, []);

  // Auto-select session based on discipline semester (Odd=Winter, Even=Summer)
  useEffect(() => {
    if (formData.disciplineId) {
      const disc = disciplines.find(d => d.id === formData.disciplineId);
      if (disc) {
        const autoSession = (disc.semester % 2 !== 0) ? 'WINTER' : 'SUMMER';
        setFormData(prev => ({ ...prev, examSession: autoSession }));
      }
    }
  }, [formData.disciplineId, disciplines]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '', hint: '' });

    // Client-Side Validation (NFR-AFSMS-SAFE-06)
    if (!formData.studentId || !formData.disciplineId) {
      setMessage({ 
        type: 'error', 
        text: 'Please select a student and a discipline.',
        hint: 'Complete both fields before saving.' 
      });
      return;
    }

    const gradeNum = parseFloat(formData.gradeValue);
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 10) {
      setMessage({ 
        type: 'error', 
        text: 'The grade must be a valid number between 1 and 10 (or 0 for Absent).', 
        hint: 'Enter a value between 1.00 and 10.00 or the digit 0.' 
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/academic/grades', {
        studentId: formData.studentId,
        disciplineId: formData.disciplineId,
        gradeValue: gradeNum,
        examSession: formData.examSession
      });
      
      const selectedStudent = students.find(s => s.id === formData.studentId);
      const selectedDiscipline = disciplines.find(d => d.id === formData.disciplineId);
      
      setMessage({ type: 'success', text: 'Grade added successfully!' });
      
      // Add to recent grades list
      setRecentGrades([{
        student: `${selectedStudent?.last_name} ${selectedStudent?.first_name}`,
        discipline: selectedDiscipline?.name,
        grade: gradeNum,
        session: formData.examSession,
        gradedBy: user?.fullName || 'Me',
        time: new Date().toLocaleTimeString('en-US')
      }, ...recentGrades.slice(0, 4)]);
      
      setFormData({ ...formData, gradeValue: '' }); // Reset only the grade, keep context
      setTimeout(() => studentRef.current?.focus(), 100);
    } catch (err) {
      const msg = err.response?.data?.message || 'Error saving grade.';
      let suggestion = "Check if the grade is valid and if you have selected all parameters.";
      
      if (err.response?.status === 400) {
        suggestion = "The grade must be a number between 1 and 10. Check if you have selected the correct discipline.";
      } else if (err.response?.status === 500) {
        suggestion = "Internal error. There might not be an ACTIVE Academic Year configured in the database.";
      }

      setMessage({ 
        type: 'error', 
        text: msg,
        hint: suggestion
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Add Grades (Electronic Catalog)</h2>
      
      {message.text && (
        <div className={`p-4 rounded-md mb-6 flex gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {message.type === 'error' ? <AlertCircle size={20} className="flex-shrink-0 mt-0.5" /> : <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />}
          <div>
            <p className="font-semibold">{message.text}</p>
            {message.hint && <p className="text-sm mt-1 opacity-90">💡 {message.hint}</p>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Dropdown (BR-AFSMS-05) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Select Student *</label>
                {formData.disciplineId && (
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">Filtered by discipline</span>
                )}
              </div>
              <Select 
                ref={studentRef}
                options={(formData.disciplineId 
                  ? students.filter(s => {
                      const disc = disciplines.find(d => d.id === formData.disciplineId);
                      return s.curriculum_ids && s.curriculum_ids.includes(disc?.curriculum_id);
                    })
                  : students
                ).map(s => ({ value: s.id, label: `${s.last_name} ${s.first_name} (${s.registration_number} - ${s.group_code})` }))}
                value={formData.studentId ? { value: formData.studentId, label: students.find(s => s.id === formData.studentId)?.last_name + ' ' + students.find(s => s.id === formData.studentId)?.first_name } : null}
                onChange={(option) => setFormData({...formData, studentId: option ? option.value : ''})}
                placeholder="-- Search Student --"
                isClearable
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: '0.5rem',
                    padding: '0.25rem',
                    border: '1px solid #e2e8f0',
                    boxShadow: 'none',
                    '&:hover': { border: '1px solid #cbd5e1' }
                  })
                }}
              />
            </div>

            {/* Discipline Dropdown (BR-AFSMS-05) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Select Discipline *</label>
                {formData.studentId && (
                  <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">Filtered by student plan</span>
                )}
              </div>
              <Select 
                ref={disciplineRef}
                options={(formData.studentId
                  ? disciplines.filter(d => {
                      const student = students.find(s => s.id === formData.studentId);
                      return student?.curriculum_ids && student.curriculum_ids.includes(d.curriculum_id);
                    })
                  : disciplines
                ).map(d => ({ value: d.id, label: `${d.name} (Sem. ${d.semester})` }))}
                value={formData.disciplineId ? { value: formData.disciplineId, label: disciplines.find(d => d.id === formData.disciplineId)?.name } : null}
                onChange={(option) => setFormData({...formData, disciplineId: option ? option.value : ''})}
                placeholder="-- Search Discipline --"
                isClearable
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: '0.5rem',
                    padding: '0.25rem',
                    border: '1px solid #e2e8f0',
                    boxShadow: 'none',
                    '&:hover': { border: '1px solid #cbd5e1' }
                  })
                }}
              />
              {(formData.studentId || formData.disciplineId) && (
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, studentId: '', disciplineId: '' })}
                  className="mt-2 text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  <X size={12} /> Reset selections to see the full list
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session *</label>
                <Select 
                  options={[
                    { value: 'WINTER', label: 'Winter (Regular)' },
                    { value: 'SUMMER', label: 'Summer (Regular)' },
                    { value: 'RETAKE', label: 'Retake' }
                  ]}
                  value={{ value: formData.examSession, label: formData.examSession }}
                  onChange={(option) => setFormData({...formData, examSession: option ? option.value : 'WINTER'})}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: '0.5rem',
                      padding: '0.25rem',
                      border: '1px solid #e2e8f0',
                      boxShadow: 'none',
                      '&:hover': { border: '1px solid #cbd5e1' }
                    })
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade (1 - 10) or 0 for Absent *</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="10" 
                  required
                  ref={gradeRef}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 border"
                  value={formData.gradeValue}
                  onChange={(e) => setFormData({...formData, gradeValue: e.target.value})}
                  placeholder="ex: 9.50 (or 0 for Abs.)"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-md transition"
            >
              {isSubmitting ? 'Saving...' : 'Save Official Grade'}
            </button>
          </form>
        </div>

        {/* Recent Grades Column */}
        <div className="col-span-1 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Recent Grades Added</h3>
          {recentGrades.length === 0 ? (
            <p className="text-xs text-gray-500">No grades added yet.</p>
          ) : (
            <div className="space-y-2">
              {recentGrades.map((g, idx) => (
                <div key={idx} className="bg-white p-2 rounded border border-slate-200 text-xs">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-slate-700">{g.grade}</p>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">{g.gradedBy}</span>
                  </div>
                  <p className="text-slate-600">{g.student}</p>
                  <p className="text-slate-500 truncate">{g.discipline}</p>
                  <p className="text-gray-400 text-[10px] mt-1">{g.session} • {g.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
