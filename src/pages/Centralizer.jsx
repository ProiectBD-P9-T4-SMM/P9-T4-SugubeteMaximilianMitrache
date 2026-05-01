import { useState, useEffect } from 'react';
import Select from 'react-select';
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
      setMessage({ type: 'error', text: 'Error loading configuration data.' });
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
        text: `Report generated successfully! ${response.data.student_count} students found.` 
      });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error generating report.' });
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
      link.setAttribute('download', `Centralizer_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (err) { setMessage({ type: 'error', text: 'Error exporting CSV.' }); }
  };

  const handleExportXLSX = async () => {
    try {
      const response = await api.post('/reports/e-grade-centralizer/export/xlsx', filters, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Centralizer_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
    } catch (err) { setMessage({ type: 'error', text: 'Error exporting Excel.' }); }
  };

  const handleExportXML = async () => {
    try {
      const response = await api.post('/reports/e-grade-centralizer/export/xml', filters, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Centralizer_${new Date().getTime()}.xml`);
      document.body.appendChild(link);
      link.click();
    } catch (err) { setMessage({ type: 'error', text: 'Error exporting XML.' }); }
  };

  const handleExportPDF = () => {
    if (!centralizedData || students.length === 0) return;
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFontSize(18);
    doc.text('e-Grade Centralizer', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated at: ${new Date(centralizedData.generated_at).toLocaleString('en-US')}`, 14, 22);

    const tableColumn = ['#', 'Registration #', 'Student Name', 'Specialization', 'Group', 'Discipline', 'Sem.', 'ECTS', 'Grade', 'Average', 'Total ECTS'];
    const tableRows = [];

    students.forEach((student, idx) => {
      const filtered = student.disciplines.filter(d => !filters.show_only_graded || d.grade);
      if (filtered.length === 0) return;
      
      filtered.forEach((d, didx) => {
        tableRows.push([
          didx === 0 ? idx + 1 : '',
          didx === 0 ? student.registration_number : '',
          didx === 0 ? `${student.last_name} ${student.first_name}` : '',
          didx === 0 ? student.spec_name : '',
          didx === 0 ? student.formation_code : '',
          d.discipline_name,
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
        1: { cellWidth: 15 }, // Registration #
        2: { cellWidth: 35 }, // Student Name
        3: { cellWidth: 40 }, // Specialization
        4: { cellWidth: 20 }, // Group
        5: { cellWidth: 60 }, // Discipline
        6: { cellWidth: 10, halign: 'center' }, // Sem
        7: { cellWidth: 10, halign: 'center' }, // ECTS
        8: { cellWidth: 10, halign: 'center' }, // Grade
        9: { cellWidth: 15, halign: 'center' }, // Average
        10: { cellWidth: 15, halign: 'center' } // Total ECTS
      },
      margin: { top: 30, left: 10, right: 10 }
    });
    doc.save(`Centralizer_${new Date().getTime()}.pdf`);
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen p-6">
      <div className="w-full space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
               e-Grade Centralizer
            </h2>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-0.5">Academic Reporting & Analysis System</p>
          </div>
          {centralizedData && (
            <div className="flex flex-wrap gap-2">
                <button onClick={handleExportCSV} className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-black text-[10px] hover:bg-emerald-100 transition-all flex items-center gap-2">
                   <FileText size={16} /> CSV
                </button>
                <button onClick={handleExportXLSX} className="bg-green-600 text-white px-4 py-2 rounded-xl font-black text-[10px] hover:bg-green-700 shadow-lg shadow-green-100 transition-all flex items-center gap-2">
                   <Download size={16} /> Excel
                </button>
                <button onClick={handleExportXML} className="bg-orange-500 text-white px-4 py-2 rounded-xl font-black text-[10px] hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all flex items-center gap-2">
                   <FileText size={16} /> XML
                </button>
                <button onClick={handleExportPDF} className="bg-slate-900 text-white px-6 py-2 rounded-xl font-black text-[10px] hover:bg-black shadow-lg transition-all flex items-center gap-2">
                   <Download size={16} /> PDF
                </button>
            </div>
          )}
        </div>

        {/* Filter Engine */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
           <div className="flex items-center gap-2 mb-6">
                <Filter size={18} className="text-blue-600" />
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dynamic Filter Engine</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Required Filter */}
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <Calendar size={12} className="text-blue-600" /> Academic Year
                    </label>
                    <Select 
                        options={academicYears.map(y => ({ value: y.id, label: `${y.year_start}/${y.year_end}` }))}
                        value={filters.academic_year_id ? { value: filters.academic_year_id, label: academicYears.find(y => y.id === filters.academic_year_id)?.year_start + '/' + academicYears.find(y => y.id === filters.academic_year_id)?.year_end } : null}
                        onChange={option => setFilters({...filters, academic_year_id: option ? option.value : ''})}
                        placeholder="-- All Years --"
                        isClearable
                        styles={{ control: base => ({ ...base, borderRadius: '0.75rem', border: '1px solid #f1f5f9', fontSize: '12px' }) }}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <GraduationCap size={12} /> Specialization
                    </label>
                    <Select 
                        options={specializations.map(s => ({ value: s.id, label: `${s.name} (${s.degree_level})` }))}
                        value={filters.specialization_id ? { value: filters.specialization_id, label: specializations.find(s => s.id === filters.specialization_id)?.name } : null}
                        onChange={option => setFilters({...filters, specialization_id: option ? option.value : '', curriculum_id: ''})}
                        placeholder="-- All Specializations --"
                        isClearable
                        styles={{ control: base => ({ ...base, borderRadius: '0.75rem', border: '1px solid #f1f5f9', fontSize: '12px' }) }}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <Layers size={12} /> Study Plan
                    </label>
                    <Select 
                        options={curricula.filter(c => c.specialization_id === filters.specialization_id).map(c => ({ value: c.id, label: c.name }))}
                        value={filters.curriculum_id ? { value: filters.curriculum_id, label: curricula.find(c => c.id === filters.curriculum_id)?.name } : null}
                        onChange={option => setFilters({...filters, curriculum_id: option ? option.value : ''})}
                        isDisabled={!filters.specialization_id}
                        placeholder="-- All Plans --"
                        isClearable
                        styles={{ control: base => ({ ...base, borderRadius: '0.75rem', border: '1px solid #f1f5f9', fontSize: '12px' }) }}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <BookOpen size={12} /> Discipline
                    </label>
                    <Select 
                        options={disciplines
                            .filter(d => !filters.curriculum_id || d.curriculum_id === filters.curriculum_id)
                            .map(d => ({ value: d.id, label: `${d.name} (${d.code})` }))}
                        value={filters.discipline_id ? { value: filters.discipline_id, label: disciplines.find(d => d.id === filters.discipline_id)?.name } : null}
                        onChange={option => setFilters({...filters, discipline_id: option ? option.value : ''})}
                        placeholder="-- All Disciplines --"
                        isClearable
                        styles={{ control: base => ({ ...base, borderRadius: '0.75rem', border: '1px solid #f1f5f9', fontSize: '12px' }) }}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Degree Level</label>
                    <Select 
                        options={[
                            { value: 'Bachelor', label: 'Bachelor' },
                            { value: 'Master', label: 'Master' },
                            { value: 'PhD', label: 'PhD' }
                        ]}
                        value={filters.degree_level ? { value: filters.degree_level, label: filters.degree_level } : null}
                        onChange={option => setFilters({...filters, degree_level: option ? option.value : ''})}
                        placeholder="-- All Levels --"
                        isClearable
                        styles={{ control: base => ({ ...base, borderRadius: '0.75rem', border: '1px solid #f1f5f9', fontSize: '12px' }) }}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Study Year</label>
                    <Select 
                        options={[
                            { value: '1', label: 'Year 1' },
                            { value: '2', label: 'Year 2' },
                            { value: '3', label: 'Year 3' },
                            { value: '4', label: 'Year 4' }
                        ]}
                        value={filters.study_year ? { value: filters.study_year, label: `Year ${filters.study_year}` } : null}
                        onChange={option => setFilters({...filters, study_year: option ? option.value : ''})}
                        placeholder="-- All --"
                        isClearable
                        styles={{ control: base => ({ ...base, borderRadius: '0.75rem', border: '1px solid #f1f5f9', fontSize: '12px' }) }}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <Users size={12} /> Group
                    </label>
                    <input 
                        type="number" 
                        placeholder="Ex: 1" 
                        value={filters.group_index}
                        onChange={e => setFilters({...filters, group_index: e.target.value})}
                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs text-slate-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <Hash size={12} /> Semester
                    </label>
                    <Select 
                        options={[1,2,3,4,5,6,7,8].map(s => ({ value: String(s), label: `Semester ${s}` }))}
                        value={filters.semester ? { value: filters.semester, label: `Semester ${filters.semester}` } : null}
                        onChange={option => setFilters({...filters, semester: option ? option.value : ''})}
                        placeholder="-- All --"
                        isClearable
                        styles={{ control: base => ({ ...base, borderRadius: '0.75rem', border: '1px solid #f1f5f9', fontSize: '12px' }) }}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <CheckSquare size={12} /> Evaluation
                    </label>
                    <Select 
                        options={[
                            { value: 'EXAM', label: 'Exam' },
                            { value: 'COLLOQUIUM', label: 'Colloquium' },
                            { value: 'PROJECT', label: 'Project' },
                            { value: 'VERIFICATION', label: 'Verification' }
                        ]}
                        value={filters.evaluation_type ? { value: filters.evaluation_type, label: filters.evaluation_type } : null}
                        onChange={option => setFilters({...filters, evaluation_type: option ? option.value : ''})}
                        placeholder="-- All --"
                        isClearable
                        styles={{ control: base => ({ ...base, borderRadius: '0.75rem', border: '1px solid #f1f5f9', fontSize: '12px' }) }}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <Search size={12} /> Search
                    </label>
                    <input 
                        type="text"
                        placeholder="Registration / Code"
                        value={filters.cod} 
                        onChange={e => setFilters({...filters, cod: e.target.value})}
                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs text-slate-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                    />
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                    <label className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-100 transition-all">
                        <input 
                            type="checkbox" 
                            checked={filters.show_only_graded}
                            onChange={e => setFilters({...filters, show_only_graded: e.target.checked})}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-[9px] font-black text-blue-700 uppercase tracking-widest">Only Graded</span>
                    </label>
                </div>
           </div>

           <div className="mt-8 flex justify-between items-center">
                <div className="flex items-center gap-3">
                     {loading && <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>}
                     <span className="text-[10px] font-bold text-slate-400">{loading ? 'Processing data...' : 'Adjust filters to refine records.'}</span>
                </div>
                <button 
                    onClick={handleGenerateReport} 
                    disabled={loading}
                    className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center gap-2"
                >
                    <FileText size={16} /> Generate Report
                </button>
           </div>
        </div>

        {message.text && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-500 ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
            {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
            <p className="font-bold text-sm">{message.text}</p>
          </div>
        )}

        {/* Data Grid */}
        {students.length > 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/50">
                <tr>
                  {['#', 'Student Identity', 'Context', 'Discipline', 'Sem.', 'ECTS', 'Grade', 'GPA / Credits'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
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
                          <td rowSpan={student.filteredDisciplines.length} className="px-4 py-3 align-top">
                            <span className="h-6 w-6 bg-slate-100 rounded-full flex items-center justify-center text-[9px] font-black text-slate-500">{sIdx + 1}</span>
                          </td>
                          <td rowSpan={student.filteredDisciplines.length} className="px-4 py-3 align-top">
                            <div className="font-black text-slate-900 text-sm leading-none mb-1">{student.last_name} {student.first_name}</div>
                            <div className="text-[9px] font-mono text-blue-600 font-bold">{student.registration_number}</div>
                          </td>
                          <td rowSpan={student.filteredDisciplines.length} className="px-4 py-3 align-top">
                            <div className="text-[10px] font-bold text-slate-700 truncate max-w-[120px]">{student.spec_name}</div>
                            <div className="text-[8px] font-black text-slate-400 uppercase">{student.formation_code}</div>
                          </td>
                        </>
                      ) : null}
                      <td className="px-4 py-3">
                        <div className="text-xs font-bold text-slate-700">{discipline.discipline_name}</div>
                        <div className="text-[9px] font-black text-slate-400 uppercase">{discipline.discipline_code}</div>
                      </td>
                      <td className="px-4 py-3 text-center text-xs font-bold text-slate-500">{discipline.semester}</td>
                      <td className="px-4 py-3 text-center text-xs font-black text-blue-600">{discipline.ects_credits}</td>
                      <td className="px-4 py-3 text-center">
                        {discipline.grade !== null ? (
                          <div className={`text-base font-black ${parseFloat(discipline.grade) >= 5 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {parseFloat(discipline.grade) === 0 ? 'Abs.' : discipline.grade}
                          </div>
                        ) : (
                          <span className="text-slate-200">--</span>
                        )}
                      </td>
                      {dIdx === 0 ? (
                        <td rowSpan={student.filteredDisciplines.length} className="px-4 py-3 align-top text-center border-l border-slate-50">
                           <div className="text-lg font-black text-blue-600 mb-0.5">{student.average_grade || '-'}</div>
                           <div className="text-[8px] font-black text-slate-400 uppercase bg-slate-50 px-2 py-0.5 rounded-full inline-block">{student.total_ects} ECTS</div>
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
            <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 border-dashed">
                <Users className="mx-auto text-slate-100 mb-4" size={64} />
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No records found</p>
                <p className="text-slate-300 text-[9px] mt-1">Adjust filters to view data.</p>
            </div>
           )
        )}
      </div>
    </div>
  );
}
