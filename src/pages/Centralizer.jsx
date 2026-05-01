import { useState, useEffect } from 'react';
import { Download, AlertCircle, CheckCircle, FileText, Filter, Users, BookOpen, GraduationCap, Calendar, Layers, Hash, CheckSquare, Search } from 'lucide-react';
import api from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Centralizer() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [centralizedData, setCentralizedData] = useState(null);
  
  // Lookup data
  const [specializations, setSpecializations] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [curricula, setCurricula] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [educationForms] = useState(['IF', 'IFR']);
  
  // Filters state
  const [filters, setFilters] = useState({
    specialization_id: '',
    academic_year_id: '',
    study_year: '',
    education_form: '',
    curriculum_id: '',
    discipline_id: '',
    group_index: '',
    degree_level: '',
    semester: '',
    evaluation_type: '',
    cod: '',
    show_only_graded: false
  });

  useEffect(() => {
    loadLookupData();
  }, []);

  const loadLookupData = async () => {
    try {
      const [specsRes, yearsRes, currRes, discRes] = await Promise.all([
        api.get('/academic/specializations'),
        api.get('/academic/academic-years'),
        api.get('/academic/curricula'),
        api.get('/lookup/disciplines')
      ]);
      
      setSpecializations(specsRes.data.success ? specsRes.data.specializations : []);
      const years = yearsRes.data.success ? yearsRes.data.academicYears : [];
      setAcademicYears(years);
      setCurricula(currRes.data.success ? currRes.data.curricula : []);
      setDisciplines(discRes.data.success ? discRes.data.disciplines : []);
      
      if (years.length > 0) {
        setFilters(f => ({ ...f, academic_year_id: years[0].id }));
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Eroare la încărcarea datelor de configurare.' });
    }
  };

  const handleGenerateReport = async () => {
    setMessage({ type: '', text: '' });


    setLoading(true);
    try {
      const response = await api.post('/reports/e-grade-centralizer', filters);
      setCentralizedData(response.data);
      setStudents(response.data.students || []);
      setMessage({ 
        type: 'success', 
        text: `Raport generat cu succes! ${response.data.student_count} studenți găsiți.` 
      });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Eroare la generarea raportului.' });
    } finally {
      setLoading(false);
    }
  };
  const handleExportCSV = async () => {
    try {
      const response = await api.post('/reports/e-grade-centralizer/export/csv', filters, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Centralizator_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (err) { setMessage({ type: 'error', text: 'Eroare la export CSV.' }); }
  };

  const handleExportXLSX = async () => {
    try {
      const response = await api.post('/reports/e-grade-centralizer/export/xlsx', filters, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Centralizator_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
    } catch (err) { setMessage({ type: 'error', text: 'Eroare la export Excel.' }); }
  };

  const handleExportPDF = () => {
    if (!centralizedData || students.length === 0) return;
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFontSize(18);
    doc.text('e-Centralizatorul de Note', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generat la: ${new Date(centralizedData.generated_at).toLocaleString('ro-RO')}`, 14, 22);

    const stripDiacritics = (text) => {
      if (!text) return '';
      const map = {
        'ă': 'a', 'â': 'a', 'î': 'i', 'ș': 's', 'ț': 't',
        'Ă': 'A', 'Â': 'A', 'Î': 'I', 'Ș': 'S', 'Ț': 'T'
      };
      return text.toString().replace(/[ăâîșțĂÂÎȘȚ]/g, m => map[m]);
    };

    const tableColumn = ['#', 'Matricol', 'Nume Student', 'Specializare', 'Grupa', 'Disciplina', 'Sem.', 'ECTS', 'Nota', 'Medie', 'Total ECTS'].map(h => stripDiacritics(h));
    const tableRows = [];

    students.forEach((student, idx) => {
      const filtered = student.disciplines.filter(d => !filters.show_only_graded || d.grade);
      if (filtered.length === 0) return;
      
      filtered.forEach((d, didx) => {
        tableRows.push([
          didx === 0 ? idx + 1 : '',
          didx === 0 ? student.registration_number : '',
          didx === 0 ? stripDiacritics(`${student.last_name} ${student.first_name}`) : '',
          didx === 0 ? stripDiacritics(student.spec_name) : '',
          didx === 0 ? stripDiacritics(student.formation_code) : '',
          stripDiacritics(d.discipline_name),
          d.semester,
          d.ects_credits,
          d.grade || '-',
          didx === 0 ? student.average_grade || '-' : '',
          didx === 0 ? student.total_ects : ''
        ]);
      });
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      styles: { 
        fontSize: 7,
        cellPadding: 2,
        valign: 'middle',
        halign: 'left',
        overflow: 'linebreak',
        font: 'helvetica',
        lineWidth: 0.1
      },
      headStyles: { 
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontSize: 7,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' }, // #
        1: { cellWidth: 15 }, // Matricol
        2: { cellWidth: 35 }, // Nume Student
        3: { cellWidth: 40 }, // Specializare
        4: { cellWidth: 20 }, // Grupa
        5: { cellWidth: 60 }, // Disciplina
        6: { cellWidth: 10, halign: 'center' }, // Sem
        7: { cellWidth: 10, halign: 'center' }, // ECTS
        8: { cellWidth: 10, halign: 'center' }, // Nota
        9: { cellWidth: 15, halign: 'center' }, // Medie
        10: { cellWidth: 15, halign: 'center' } // Total ECTS
      },
      margin: { top: 30, left: 10, right: 10 }
    });
    doc.save(`Centralizator_${new Date().getTime()}.pdf`);
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
               e-Centralizator Note
            </h2>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Sistem de Raportare și Analiză Academică</p>
          </div>
          {centralizedData && (
            <div className="flex gap-3">
                <button onClick={handleExportCSV} className="bg-emerald-50 text-emerald-600 px-6 py-4 rounded-2xl font-black text-xs hover:bg-emerald-100 transition-all flex items-center gap-2">
                   <FileText size={18} /> CSV
                </button>
                <button onClick={handleExportXLSX} className="bg-green-600 text-white px-6 py-4 rounded-2xl font-black text-xs hover:bg-green-700 shadow-xl shadow-green-100 transition-all flex items-center gap-2">
                   <Download size={18} /> Excel (.xlsx)
                </button>
                <button onClick={handleExportPDF} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs hover:bg-black shadow-xl transition-all flex items-center gap-2">
                   <Download size={18} /> PDF
                </button>
            </div>
          )}
        </div>

        {/* Filter Engine */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200">
           <div className="flex items-center gap-2 mb-8">
                <Filter size={20} className="text-blue-600" />
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Motor de Filtrare Dinamică</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Required Filter */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <Calendar size={12} className="text-blue-600" /> An Academic
                    </label>
                    <select 
                        value={filters.academic_year_id} 
                        onChange={e => setFilters({...filters, academic_year_id: e.target.value})}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-800 outline-none focus:ring-4 focus:ring-blue-50 ring-offset-2 transition-all"
                    >
                        <option value="">-- Toți anii (Transcript) --</option>
                        {academicYears.map(y => <option key={y.id} value={y.id}>{y.year_start}/{y.year_end}</option>)}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <GraduationCap size={12} /> Specializare
                    </label>
                    <select 
                        value={filters.specialization_id} 
                        onChange={e => setFilters({...filters, specialization_id: e.target.value, curriculum_id: ''})}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                    >
                        <option value="">-- Toate Specializările --</option>
                        {specializations.map(s => <option key={s.id} value={s.id}>{s.name} ({s.degree_level})</option>)}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <Layers size={12} /> Plan Învățământ
                    </label>
                    <select 
                        value={filters.curriculum_id} 
                        onChange={e => setFilters({...filters, curriculum_id: e.target.value})}
                        disabled={!filters.specialization_id}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all disabled:opacity-50"
                    >
                        <option value="">-- Toate Planurile --</option>
                        {curricula.filter(c => c.specialization_id === filters.specialization_id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <BookOpen size={12} /> Disciplină (Materie)
                    </label>
                    <select 
                        value={filters.discipline_id} 
                        onChange={e => setFilters({...filters, discipline_id: e.target.value})}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                    >
                        <option value="">-- Toate Disciplinele --</option>
                        {disciplines
                            .filter(d => !filters.curriculum_id || d.curriculum_id === filters.curriculum_id)
                            .map(d => <option key={d.id} value={d.id}>{d.name} ({d.code})</option>)
                        }
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ciclu Studii</label>
                    <select 
                        value={filters.degree_level} 
                        onChange={e => setFilters({...filters, degree_level: e.target.value})}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                    >
                        <option value="">-- Toate Ciclurile --</option>
                        <option value="Licență">Licență</option>
                        <option value="Masterat">Masterat</option>
                        <option value="Doctorat">Doctorat</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">An Studiu</label>
                    <select value={filters.study_year} onChange={e => setFilters({...filters, study_year: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-50">
                        <option value="">-- Toți Anii --</option>
                        <option value="1">Anul 1</option>
                        <option value="2">Anul 2</option>
                        <option value="3">Anul 3</option>
                        <option value="4">Anul 4</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <Users size={12} /> Grupă (Index)
                    </label>
                    <input 
                        type="number" 
                        placeholder="Ex: 1" 
                        value={filters.group_index}
                        onChange={e => setFilters({...filters, group_index: e.target.value})}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <Hash size={12} /> Semestru
                    </label>
                    <select 
                        value={filters.semester} 
                        onChange={e => setFilters({...filters, semester: e.target.value})}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                    >
                        <option value="">-- Toate --</option>
                        {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semestrul {s}</option>)}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <CheckSquare size={12} /> Tip Evaluare
                    </label>
                    <select 
                        value={filters.evaluation_type} 
                        onChange={e => setFilters({...filters, evaluation_type: e.target.value})}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                    >
                        <option value="">-- Toate --</option>
                        <option value="EXAMEN">Examen</option>
                        <option value="COLOVIU">Coloviu</option>
                        <option value="PROIECT">Proiect</option>
                        <option value="VERIFICARE">Verificare</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <Search size={12} /> Căutare Cod
                    </label>
                    <input 
                        type="text"
                        placeholder="Matricol / Disciplină"
                        value={filters.cod} 
                        onChange={e => setFilters({...filters, cod: e.target.value})}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                    />
                </div>

                <div className="space-y-2 flex flex-col justify-end">
                    <label className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl cursor-pointer hover:bg-blue-100 transition-all">
                        <input 
                            type="checkbox" 
                            checked={filters.show_only_graded}
                            onChange={e => setFilters({...filters, show_only_graded: e.target.checked})}
                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Doar Materii cu Note</span>
                    </label>
                </div>
           </div>

           <div className="mt-10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                     {loading && <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>}
                     <span className="text-xs font-bold text-slate-400">{loading ? 'Se procesează volume mari de date...' : 'Lăsați câmpurile necompletate pentru a include toate înregistrările.'}</span>
                </div>
                <button 
                    onClick={handleGenerateReport} 
                    disabled={loading}
                    className="bg-blue-600 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-blue-700 shadow-2xl shadow-blue-100 transition-all flex items-center gap-3"
                >
                    <FileText size={18} /> Generează Raport Detaliat
                </button>
           </div>
        </div>

        {message.text && (
          <div className={`p-6 rounded-[2rem] flex items-center gap-4 animate-in slide-in-from-top-4 duration-500 ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
            {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            <p className="font-bold">{message.text}</p>
          </div>
        )}

        {/* Data Grid */}
        {students.length > 0 ? (
          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/50">
                <tr>
                  {['#', 'Identitate Student', 'Context Academic', 'Disciplină', 'Sem.', 'ECTS', 'Nota', 'Media Generală / Credite Acumulate'].map((h) => (
                    <th key={h} className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students
                  .map(student => ({
                    ...student,
                    filteredDisciplines: student.disciplines.filter(d => !filters.show_only_graded || d.grade)
                  }))
                  .filter(student => student.filteredDisciplines.length > 0)
                  .map((student, sIdx) =>
                  student.filteredDisciplines.map((discipline, dIdx) => (
                    <tr key={`${student.student_id}-${dIdx}`} className="hover:bg-slate-50/30 transition-all">
                      {dIdx === 0 ? (
                        <>
                          <td rowSpan={student.filteredDisciplines.length} className="px-8 py-6 align-top">
                            <span className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-500">{sIdx + 1}</span>
                          </td>
                          <td rowSpan={student.filteredDisciplines.length} className="px-8 py-6 align-top">
                            <div className="font-black text-slate-900 leading-none mb-1">{student.last_name} {student.first_name}</div>
                            <div className="text-[10px] font-mono text-blue-600 font-bold tracking-tighter">{student.registration_number}</div>
                          </td>
                          <td rowSpan={student.filteredDisciplines.length} className="px-8 py-6 align-top">
                            <div className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{student.spec_name}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase">{student.formation_code} • {student.degree_level}</div>
                          </td>
                        </>
                      ) : null}
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-slate-700">{discipline.discipline_name}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{discipline.discipline_code}</div>
                      </td>
                      <td className="px-8 py-6 text-center font-bold text-slate-500">{discipline.semester}</td>
                      <td className="px-8 py-6 text-center font-black text-blue-600">{discipline.ects_credits}</td>
                      <td className="px-8 py-6 text-center">
                        {discipline.grade !== null ? (
                          <div className={`text-lg font-black ${parseFloat(discipline.grade) >= 5 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {parseFloat(discipline.grade) === 0 ? 'Abs.' : discipline.grade}
                          </div>
                        ) : (
                          <span className="text-slate-200">--</span>
                        )}
                      </td>
                      {dIdx === 0 ? (
                        <td rowSpan={student.filteredDisciplines.length} className="px-8 py-6 align-top text-center border-l border-slate-50">
                           <div className="text-xl font-black text-blue-600 mb-1">{student.average_grade || '-'}</div>
                           <div className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1 rounded-full">{student.total_ects} PC Acumulate</div>
                        </td>
                      ) : null}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
           !loading && (
            <div className="text-center py-40 bg-white rounded-[3rem] border border-slate-200 border-dashed">
                <Users className="mx-auto text-slate-100 mb-6" size={80} />
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-sm">Nu există date pentru selecția curentă</p>
                <p className="text-slate-300 text-xs mt-2">Ajustați filtrele pentru a vizualiza înregistrările.</p>
            </div>
           )
        )}
      </div>
    </div>
  );
}
