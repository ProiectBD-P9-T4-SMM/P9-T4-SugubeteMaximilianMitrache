import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { reportsService, lookupService } from '../services/api';

export default function Centralizer() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filters state
  const [academicYears, setAcademicYears] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  
  const [filters, setFilters] = useState({
    academicYear: '',
    specializationId: '',
    studyYear: ''
  });

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [yearsRes, specsRes] = await Promise.all([
          lookupService.getAcademicYears(),
          lookupService.getSpecializations()
        ]);
        setAcademicYears(yearsRes.data);
        setSpecializations(specsRes.data);
      } catch (err) {
        console.error("Failed to load filters", err);
      }
    };
    loadFilters();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await reportsService.getCentralizer(filters);
      setReportData(res.data);
    } catch (err) {
      console.error("Failed to load report", err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const csv = Papa.unparse(reportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'e-grade-centralizer.csv';
    link.click();
  };

  const exportXLS = () => {
    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Centralizer");
    XLSX.writeFile(workbook, "e-grade-centralizer.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("e-Grade Centralizer", 14, 15);
    
    const tableColumn = ["Reg. Num", "First Name", "Last Name", "Avg Grade", "Credits", "Exams"];
    const tableRows = [];

    reportData.forEach(student => {
      const rowData = [
        student.registration_number,
        student.first_name,
        student.last_name,
        student.average_grade || 'N/A',
        student.accumulated_credits || '0',
        student.exams_taken || '0'
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("e-grade-centralizer.pdf");
  };

  const exportXML = () => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<centralizer>\n';
    reportData.forEach(row => {
      xml += '  <student>\n';
      for (const [key, value] of Object.entries(row)) {
        xml += `    <${key}>${value}</${key}>\n`;
      }
      xml += '  </student>\n';
    });
    xml += '</centralizer>';
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'e-grade-centralizer.xml';
    link.click();
  };

  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Reports – e-Grade Centralizer</h2>

      {/* Control Panel */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Academic Year</label>
          <select 
            value={filters.academicYear}
            onChange={(e) => setFilters({...filters, academicYear: e.target.value})}
            className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-blue-500"
          >
            <option value="">All</option>
            {academicYears.map(ay => <option key={ay.code} value={ay.code}>{ay.code}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Specialization</label>
          <select 
            value={filters.specializationId}
            onChange={(e) => setFilters({...filters, specializationId: e.target.value})}
            className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-blue-500"
          >
            <option value="">All</option>
            {specializations.map(sp => <option key={sp.id} value={sp.id}>{sp.name}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Study Year</label>
          <select 
            value={filters.studyYear}
            onChange={(e) => setFilters({...filters, studyYear: e.target.value})}
            className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-blue-500"
          >
            <option value="">All</option>
            {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
          </select>
        </div>
        <button 
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition"
        >
          Generate Report
        </button>
      </div>

      {/* Main Report Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-medium text-slate-800">Generated Centralizer</h3>
          <div className="flex space-x-3">
            <button onClick={exportCSV} className="text-sm font-medium text-slate-600 border border-slate-300 px-3 py-1 rounded bg-white hover:bg-slate-50">CSV</button>
            <button onClick={exportXML} className="text-sm font-medium text-slate-600 border border-slate-300 px-3 py-1 rounded bg-white hover:bg-slate-50">XML</button>
            <button onClick={exportXLS} className="text-sm font-medium text-green-600 border border-green-300 px-3 py-1 rounded bg-green-50 hover:bg-green-100 flex items-center space-x-1">
              <Download className="h-4 w-4" /> <span>XLS</span>
            </button>
            <button onClick={exportPDF} className="text-sm font-medium text-red-600 border border-red-300 px-3 py-1 rounded bg-red-50 hover:bg-red-100 flex items-center space-x-1">
              <Download className="h-4 w-4" /> <span>PDF</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-white">
              <tr>
                {['#', 'Reg. Num', 'Last Name', 'First Name', 'Average Grade', 'Total Credits', 'Exams Taken'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left font-semibold text-slate-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4 text-slate-500">Loading report...</td></tr>
              ) : reportData.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-4 text-slate-500">No data found. Adjust filters and generate.</td></tr>
              ) : reportData.map((row, idx) => (
                <tr key={row.student_id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-500">{idx + 1}</td>
                  <td className="px-6 py-4 font-mono text-slate-500">{row.registration_number}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{row.last_name}</td>
                  <td className="px-6 py-4">{row.first_name}</td>
                  <td className="px-6 py-4 font-bold text-blue-600">{row.average_grade || 'N/A'}</td>
                  <td className="px-6 py-4">{row.accumulated_credits}</td>
                  <td className="px-6 py-4">{row.exams_taken}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-sm text-slate-500">
          Generated {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}
