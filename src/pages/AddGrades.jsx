import { useState, useEffect } from 'react';
import { academicService, lookupService } from '../services/api';

export default function AddGrades() {
  const [students, setStudents] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [gradeValue, setGradeValue] = useState('');
  const [examSession, setExamSession] = useState('WINTER');
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, disciplinesRes] = await Promise.all([
          academicService.getStudents(),
          lookupService.getDisciplines()
        ]);
        setStudents(studentsRes.data);
        setDisciplines(disciplinesRes.data);
      } catch (err) {
        console.error("Failed to load lookups", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await academicService.addGrade({
        student_id: selectedStudent,
        discipline_id: selectedDiscipline,
        value: parseInt(gradeValue),
        exam_session: examSession
      });
      setSubmitStatus({ success: true, message: 'Grade added successfully! (Audited)' });
      setGradeValue('');
    } catch (err) {
      setSubmitStatus({ 
        success: false, 
        message: err.response?.data?.message || 'Failed to add grade' 
      });
    }
  };

  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Add Grade (Selection-Only)</h2>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 max-w-2xl mx-auto">
        {loading ? (
          <div className="text-center text-slate-500 py-4">Loading data...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {submitStatus && (
              <div className={`p-4 rounded-md ${submitStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {submitStatus.message}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Student</label>
              <select 
                required
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full border-slate-300 rounded-md shadow-sm p-3 border focus:ring-blue-500 bg-slate-50"
              >
                <option value="">-- Select Student --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.last_name} {s.first_name} ({s.registration_number})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Discipline</label>
              <select 
                required
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                className="w-full border-slate-300 rounded-md shadow-sm p-3 border focus:ring-blue-500 bg-slate-50"
              >
                <option value="">-- Select Discipline --</option>
                {disciplines.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Grade (1-10)</label>
                <input 
                  type="number" 
                  min="1" max="10" 
                  required
                  value={gradeValue}
                  onChange={(e) => setGradeValue(e.target.value)}
                  className="w-full border-slate-300 rounded-md shadow-sm p-3 border focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Exam Session</label>
                <select 
                  value={examSession}
                  onChange={(e) => setExamSession(e.target.value)}
                  className="w-full border-slate-300 rounded-md shadow-sm p-3 border focus:ring-blue-500"
                >
                  <option value="WINTER">Winter</option>
                  <option value="SUMMER">Summer</option>
                  <option value="AUTUMN">Autumn (Re-take)</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              Submit Grade
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
