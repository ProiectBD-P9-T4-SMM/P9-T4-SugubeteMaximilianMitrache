import { useState, useEffect } from 'react';
import api from '../services/api';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

export default function AddGrades() {
  const [students, setStudents] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [formData, setFormData] = useState({ studentId: '', disciplineId: '', gradeValue: '', examSession: 'WINTER' });
  const [message, setMessage] = useState({ type: '', text: '', hint: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentGrades, setRecentGrades] = useState([]);

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
        time: new Date().toLocaleTimeString('en-US')
      }, ...recentGrades.slice(0, 4)]);
      
      setFormData({ ...formData, gradeValue: '' }); // Reset only the grade, keep context
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
              <select 
                required
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 border"
                value={formData.studentId}
                onChange={(e) => setFormData({...formData, studentId: e.target.value})}
              >
                <option value="">-- Choose a student --</option>
                {(formData.disciplineId 
                  ? students.filter(s => {
                      const disc = disciplines.find(d => d.id === formData.disciplineId);
                      return s.curriculum_ids && s.curriculum_ids.includes(disc?.curriculum_id);
                    })
                  : students
                ).map(s => (
                  <option key={s.id} value={s.id}>{s.last_name} {s.first_name} ({s.registration_number} - {s.group_code})</option>
                ))}
              </select>
            </div>

            {/* Discipline Dropdown (BR-AFSMS-05) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Select Discipline *</label>
                {formData.studentId && (
                  <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">Filtered by student plan</span>
                )}
              </div>
              <select 
                required
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 border"
                value={formData.disciplineId}
                onChange={(e) => setFormData({...formData, disciplineId: e.target.value})}
              >
                <option value="">-- Choose discipline --</option>
                {(formData.studentId
                  ? disciplines.filter(d => {
                      const student = students.find(s => s.id === formData.studentId);
                      return student?.curriculum_ids && student.curriculum_ids.includes(d.curriculum_id);
                    })
                  : disciplines
                ).map(d => (
                  <option key={d.id} value={d.id}>{d.name} (Sem. {d.semester})</option>
                ))}
              </select>
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
                <select 
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 border"
                  value={formData.examSession}
                  onChange={(e) => setFormData({...formData, examSession: e.target.value})}
                >
                  <option value="WINTER">Winter (Regular)</option>
                  <option value="SUMMER">Summer (Regular)</option>
                  <option value="RETAKE">Retake</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade (1 - 10) or 0 for Absent *</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="10" 
                  required
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
                  <p className="font-medium text-slate-700">{g.grade}</p>
                  <p className="text-slate-600">{g.student}</p>
                  <p className="text-slate-500 truncate">{g.discipline}</p>
                  <p className="text-gray-400 text-xs">{g.session} • {g.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
