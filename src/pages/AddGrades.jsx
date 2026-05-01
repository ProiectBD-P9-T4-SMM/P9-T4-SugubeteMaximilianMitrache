import { useState, useEffect } from 'react';
import api from '../services/api';

export default function AddGrades() {
  const [students, setStudents] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [formData, setFormData] = useState({ studentId: '', disciplineId: '', gradeValue: '', examSession: 'WINTER' });
  const [message, setMessage] = useState({ type: '', text: '', hint: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Extragem datele pentru Dropdown-uri
    Promise.all([
      api.get('/academic/students-dropdown'),
      api.get('/academic/disciplines')
    ]).then(([studentsRes, discRes]) => {
      setStudents(studentsRes.data.students);
      setDisciplines(discRes.data.disciplines);
    }).catch(() => {
      setMessage({ type: 'error', text: 'Eroare la încărcarea listelor academice.' });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '', hint: '' });

    // Validare Client-Side conform SRS (NFR-AFSMS-SAFE-06)
    const gradeNum = parseFloat(formData.gradeValue);
    if (isNaN(gradeNum) || gradeNum < 1 || gradeNum > 10) {
      setMessage({ type: 'error', text: 'Nota trebuie să fie un număr valid între 1 și 10.', hint: 'Introduceți o valoare cu zecimale, ex: 9.50' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/academic/grades', formData);
      setMessage({ type: 'success', text: res.data.message });
      setFormData({ ...formData, gradeValue: '' }); // Resetăm doar nota
    } catch (err) {
      const msg = err.response?.data?.message || 'Eroare la salvarea notei.';
      let suggestion = "Verificați dacă nota este validă și dacă ați selectat toți parametrii.";
      
      if (err.response?.status === 400) {
        suggestion = "Nota trebuie să fie un număr între 1 și 10. Verificați dacă ați selectat disciplina corectă.";
      } else if (err.response?.status === 500) {
        suggestion = "Eroare internă. S-ar putea să nu existe un An Academic ACTIV configurat în baza de date.";
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
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Adăugare Note (Catalog Electronic)</h2>
      
      {message.text && (
        <div className={`p-4 rounded-md mb-6 ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          <p className="font-semibold">{message.text}</p>
          {message.hint && <p className="text-sm mt-1 opacity-90">Sfat: {message.hint}</p>}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dropdown Studenți (BR-AFSMS-05) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Selectează Studentul</label>
          <select 
            required
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
            value={formData.studentId}
            onChange={(e) => setFormData({...formData, studentId: e.target.value})}
          >
            <option value="">-- Alege un student --</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.last_name} {s.first_name} ({s.registration_number} - {s.group_code})</option>
            ))}
          </select>
        </div>

        {/* Dropdown Materii (BR-AFSMS-05) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Selectează Disciplina</label>
          <select 
            required
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
            value={formData.disciplineId}
            onChange={(e) => setFormData({...formData, disciplineId: e.target.value})}
          >
            <option value="">-- Alege materia --</option>
            {disciplines.map(d => (
              <option key={d.id} value={d.id}>{d.name} (Semestrul {d.semester})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sesiune</label>
            <select 
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
              value={formData.examSession}
              onChange={(e) => setFormData({...formData, examSession: e.target.value})}
            >
              <option value="WINTER">Iarnă (Normală)</option>
              <option value="SUMMER">Vară (Normală)</option>
              <option value="RETAKE">Restanță</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nota (1 - 10)</label>
            <input 
              type="number" step="0.01" min="1" max="10" required
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
              value={formData.gradeValue}
              onChange={(e) => setFormData({...formData, gradeValue: e.target.value})}
              placeholder="ex: 9.50"
            />
          </div>
        </div>

        <button 
          type="submit" disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition disabled:opacity-50"
        >
          {isSubmitting ? 'Se salvează...' : 'Salvează Nota Oficială'}
        </button>
      </form>
    </div>
  );
}
