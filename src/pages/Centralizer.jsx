import { useState, useEffect } from 'react';
import Select from 'react-select';
import { 
  Download, AlertCircle, CheckCircle, FileText, Filter, Users, 
  BookOpen, GraduationCap, Calendar, Layers, Hash, CheckSquare, 
  Search, TrendingUp, Shield, ChevronRight, FileCode, Printer, 
  Database, Table
} from 'lucide-react';
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
  
  // Filters state
  const [filters, setFilters] = useState({
    specialization_id: '', academic_year_id: '', study_year: '',
    education_form: '', curriculum_id: '', discipline_id: '',
    group_index: '', degree_level: '', semester: '',
    evaluation_type: '', cod: '', show_only_graded: false
  });

  useEffect(() => { loadLookupData(); }, []);

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
      if (years.length > 0) setFilters(f => ({ ...f, academic_year_id: years[0].id }));
    } catch (err) { setMessage({ type: 'error', text: 'Error loading configuration.' }); }
  };

  const handleGenerateReport = async () => {
    setMessage({ type: '', text: '' }); setLoading(true);
    try {
      const response = await api.post('/reports/e-grade-centralizer', filters);
      setCentralizedData(response.data);
      setStudents(response.data.students || []);
      setMessage({ type: 'success', text: `Intelligence report generated: ${response.data.student_count} records.` });
    } catch (err) { setMessage({ type: 'error', text: 'Error generating report.' }); }
    finally { setLoading(false); }
  };

  const handleExport = async (format) => {
    try {
      const response = await api.post(`/reports/e-grade-centralizer/export/${format}`, filters, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Centralizer_${new Date().getTime()}.${format}`);
      document.body.appendChild(link);
      link.click();
    } catch (err) { setMessage({ type: 'error', text: `Export to ${format} failed.` }); }
  };

  const handleExportPDF = () => {
    if (!centralizedData || students.length === 0) return;
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFontSize(22); doc.setTextColor(15, 23, 42); doc.text('Official Grade Centralizer', 14, 20);
    doc.setFontSize(8); doc.setTextColor(100, 116, 139); doc.text(`System Generated: ${new Date(centralizedData.generated_at).toLocaleString()}`, 14, 28);

    const tableRows = [];
    students.forEach((student, idx) => {
      const filtered = student.disciplines.filter(d => !filters.show_only_graded || d.grade);
      filtered.forEach((d, didx) => {
        tableRows.push([
          didx === 0 ? idx + 1 : '',
          didx === 0 ? student.registration_number : '',
          didx === 0 ? `${student.last_name} ${student.first_name}` : '',
          didx === 0 ? student.formation_code : '',
          d.discipline_name,
          d.semester,
          d.grade || '-',
          didx === 0 ? student.average_grade || '-' : '',
          didx === 0 ? student.total_ects : ''
        ]);
      });
    });

    autoTable(doc, {
      head: [['#', 'Reg. ID', 'Student', 'Group', 'Discipline', 'Sem.', 'Grade', 'GPA', 'ECTS']],
      body: tableRows, startY: 35, theme: 'grid',
      styles: { fontSize: 7, cellPadding: 3 },
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' }
    });
    doc.save(`Centralizer_Audit_${new Date().getTime()}.pdf`);
  };

  return (
    <div className="flex-1 bg-slate-50/50 min-h-screen p-8 lg:p-12 animate-in fade-in duration-500">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Grade Centralizer</h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
            <Shield size={16} className="text-blue-600" /> Advanced Academic Analytics & Reporting
          </p>
        </div>
        
        {centralizedData && (
          <div className="flex flex-wrap gap-2">
            <ExportButton icon={FileCode} label="XML" onClick={() => handleExport('xml')} color="text-orange-600 bg-orange-50" />
            <ExportButton icon={Database} label="CSV" onClick={() => handleExport('csv')} color="text-emerald-600 bg-emerald-50" />
            <ExportButton icon={Table} label="Excel" onClick={() => handleExport('xlsx')} color="bg-green-600 text-white shadow-xl shadow-green-100" />
            <ExportButton icon={Printer} label="PDF Report" onClick={handleExportPDF} color="bg-slate-900 text-white shadow-xl" />
          </div>
        )}
      </header>

      {/* Filter Matrix */}
      <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-50 mb-10">
         <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Filter size={20} /></div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Intelligence Filter Matrix</h3>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
            <FilterBox label="Academic Year" icon={Calendar} options={academicYears.map(y => ({ value: y.id, label: `${y.year_start}/${y.year_end}` }))} value={filters.academic_year_id} onChange={opt => setFilters({...filters, academic_year_id: opt?.value || ''})} />
            <FilterBox label="Specialization" icon={GraduationCap} options={specializations.map(s => ({ value: s.id, label: `${s.name} (${s.degree_level})` }))} value={filters.specialization_id} onChange={opt => setFilters({...filters, specialization_id: opt?.value || '', curriculum_id: ''})} />
            <FilterBox label="Study Plan" icon={Layers} options={curricula.filter(c => c.specialization_id === filters.specialization_id).map(c => ({ value: c.id, label: c.name }))} value={filters.curriculum_id} onChange={opt => setFilters({...filters, curriculum_id: opt?.value || ''})} disabled={!filters.specialization_id} />
            <FilterBox label="Discipline" icon={BookOpen} options={disciplines.filter(d => !filters.curriculum_id || d.curriculum_id === filters.curriculum_id).map(d => ({ value: d.id, label: d.name }))} value={filters.discipline_id} onChange={opt => setFilters({...filters, discipline_id: opt?.value || ''})} />
            <FilterBox label="Degree Level" options={['Bachelor', 'Master', 'PhD'].map(l => ({value:l, label:l}))} value={filters.degree_level} onChange={opt => setFilters({...filters, degree_level: opt?.value || ''})} />
            
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Study Year</label>
               <Select options={[1,2,3,4].map(y => ({value:String(y), label:`Year ${y}`}))} value={filters.study_year ? {value: filters.study_year, label: `Year ${filters.study_year}`} : null} onChange={opt => setFilters({...filters, study_year: opt?.value || ''})} styles={customSelectStyles} placeholder="All" isClearable />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Formation (Group)</label>
               <input type="number" placeholder="Group #" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none" value={filters.group_index} onChange={e => setFilters({...filters, group_index: e.target.value})} />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Evaluation Type</label>
               <Select options={['EXAM', 'COLLOQUIUM', 'PROJECT'].map(e => ({value:e, label:e}))} value={filters.evaluation_type ? {value: filters.evaluation_type, label: filters.evaluation_type} : null} onChange={opt => setFilters({...filters, evaluation_type: opt?.value || ''})} styles={customSelectStyles} placeholder="All" isClearable />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Internal Code</label>
               <input type="text" placeholder="Reg / Code" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none" value={filters.cod} onChange={e => setFilters({...filters, cod: e.target.value})} />
            </div>
            <div className="flex flex-col justify-end">
               <label className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl cursor-pointer hover:bg-blue-100 transition-all">
                  <input type="checkbox" checked={filters.show_only_graded} onChange={e => setFilters({...filters, show_only_graded: e.target.checked})} className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-[10px] font-black text-blue-700 uppercase tracking-[0.2em]">Only Graded</span>
               </label>
            </div>
         </div>

         <div className="mt-10 flex justify-end">
            <button onClick={handleGenerateReport} disabled={loading} className="bg-slate-900 text-white px-12 py-5 rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-black transition-all shadow-2xl flex items-center gap-3 disabled:opacity-50">
               {loading ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <TrendingUp size={18} />}
               Execute Analysis
            </button>
         </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl mb-8 flex items-center gap-3 animate-in fade-in duration-300 ${message.type === 'error' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
           <AlertCircle size={18} /> <p className="text-xs font-black uppercase tracking-widest">{message.text}</p>
        </div>
      )}

      {/* Results Display */}
      {students.length > 0 ? (
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <TableHead label="#" />
                  <TableHead label="Student Asset" />
                  <TableHead label="Contextual Metadata" />
                  <TableHead label="Academic Module" />
                  <TableHead label="Grade" />
                  <TableHead label="GPA / ECTS" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students
                  .map(s => ({ ...s, filteredD: s.disciplines.filter(d => !filters.show_only_graded || d.grade) }))
                  .filter(s => s.filteredD.length > 0)
                  .map((student, sIdx) => 
                    student.filteredD.map((discipline, dIdx) => (
                      <tr key={`${student.student_id}-${dIdx}`} className="group hover:bg-blue-50/30 transition-all">
                        {dIdx === 0 && (
                          <>
                            <td rowSpan={student.filteredD.length} className="px-8 py-6 align-top">
                               <div className="h-8 w-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[10px] font-black">{sIdx + 1}</div>
                            </td>
                            <td rowSpan={student.filteredD.length} className="px-8 py-6 align-top">
                               <p className="font-black text-slate-900 text-sm">{student.last_name} {student.first_name}</p>
                               <p className="font-mono text-[10px] text-blue-600 font-bold mt-1 uppercase">{student.registration_number}</p>
                            </td>
                            <td rowSpan={student.filteredD.length} className="px-8 py-6 align-top">
                               <p className="text-[11px] font-black text-slate-800 truncate max-w-[150px]">{student.spec_name}</p>
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{student.formation_code}</p>
                            </td>
                          </>
                        )}
                        <td className="px-8 py-6">
                           <p className="font-bold text-slate-700 text-xs">{discipline.discipline_name}</p>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{discipline.discipline_code} • SEM {discipline.semester}</p>
                        </td>
                        <td className="px-8 py-6">
                           {discipline.grade !== null ? (
                             <span className={`text-xl font-black ${parseFloat(discipline.grade) >= 5 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {parseFloat(discipline.grade) === 0 ? 'Abs.' : discipline.grade}
                             </span>
                           ) : <span className="text-slate-200">--</span>}
                        </td>
                        {dIdx === 0 && (
                          <td rowSpan={student.filteredD.length} className="px-8 py-6 align-top text-center border-l border-slate-50 bg-slate-50/30">
                             <div className="text-2xl font-black text-slate-900">{student.average_grade || '-'}</div>
                             <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">{student.total_ects} Credits</div>
                          </td>
                        )}
                      </tr>
                    ))
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        !loading && (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-200 border-dashed animate-in fade-in duration-700">
             <Table className="mx-auto text-slate-100 mb-6" size={80} />
             <h4 className="text-xl font-black text-slate-900">Intelligence Matrix Empty</h4>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Adjust filters and execute analysis to populate report</p>
          </div>
        )
      )}
    </div>
  );
}

// UI Components
function ExportButton({ icon: Icon, label, onClick, color }) {
  return (
    <button onClick={onClick} className={`${color} px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 hover:-translate-y-0.5`}>
       <Icon size={16} /> {label}
    </button>
  );
}

function FilterBox({ label, icon: Icon, options, value, onChange, disabled }) {
  return (
    <div className="space-y-2">
       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
          {Icon && <Icon size={14} className="text-blue-500" />} {label}
       </label>
       <Select options={options} value={value ? options.find(o => o.value === value) : null} onChange={onChange} isDisabled={disabled} styles={customSelectStyles} placeholder="All" isClearable />
    </div>
  );
}

function TableHead({ label }) {
  return (
    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{label}</th>
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
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#eff6ff' : 'white',
    color: state.isSelected ? 'white' : '#1e293b',
    fontWeight: 'bold',
    fontSize: '0.875rem',
  })
};
