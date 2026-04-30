import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import api from '../services/api';

export default function MyGrades() {
  const [record, setRecord] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await api.get('/academic/my-grades');
        setStudentInfo(response.data.studentInfo);
        setRecord(response.data.academicRecord);
      } catch (err) {
        setError(err.response?.data?.message || 'Eroare la preluarea datelor academice.');
      }
    };
    fetchGrades();
  }, []);

  const handleDownloadTranscript = () => {
    if (!studentInfo || record.length === 0) return;

    const doc = new jsPDF();

    // Titlu Document
    doc.setFontSize(18);
    doc.text('e-Registru Matricol (e-Transcript)', 14, 22);
    
    // Date Student
    doc.setFontSize(11);
    doc.text(`Nume: ${studentInfo.last_name} ${studentInfo.first_name}`, 14, 32);
    doc.text(`Matricol: ${studentInfo.registration_number}`, 14, 38);
    doc.text(`Generat la: ${new Date().toLocaleDateString('ro-RO')}`, 14, 44);

    // Tabelul Autotable
    const tableColumn = ["Semestru", "Materia", "Credite (ECTS)", "Evaluare", "Nota", "Data"];
    const tableRows = [];

    record.forEach(row => {
      const rowData = [
        row.semester,
        row.discipline_name,
        row.ects_credits,
        row.evaluation_type,
        row.grade_value || '-',
        row.grading_date ? new Date(row.grading_date).toLocaleDateString('ro-RO') : '-'
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 }
    });

    doc.save(`eTranscript_${studentInfo.registration_number}.pdf`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Situația Mea Academică</h2>
          {studentInfo && (
            <p className="text-slate-500">
              Student: {studentInfo.first_name} {studentInfo.last_name} | Matricol: {studentInfo.registration_number}
            </p>
          )}
        </div>
        
        {/* Butoanele de Export pentru Student (REQ-AFSMS-29) */}
        <div className="flex gap-2">
          <button onClick={handleDownloadTranscript} className="bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-100 transition">
            Export PDF
          </button>
        </div>
      </div>

      {error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-xs tracking-wider">
                <th className="p-4">Semestru</th>
                <th className="p-4">Materie (Disciplină)</th>
                <th className="p-4">Credite (ECTS)</th>
                <th className="p-4">Tip Evaluare</th>
                <th className="p-4">Notă</th>
                <th className="p-4">Data Evaluării</th>
              </tr>
            </thead>
            <tbody>
              {record.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-700">Sem. {row.semester}</td>
                  <td className="p-4">{row.discipline_name}</td>
                  <td className="p-4">{row.ects_credits}</td>
                  <td className="p-4 text-xs">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{row.evaluation_type}</span>
                  </td>
                  <td className="p-4">
                    {row.grade_value ? (
                      <span className={`font-bold ${row.grade_value >= 5 ? 'text-green-600' : 'text-red-600'}`}>
                        {row.grade_value}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Fără notă</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {row.grading_date ? new Date(row.grading_date).toLocaleDateString('ro-RO') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {record.length === 0 && <p className="text-center text-gray-500 mt-4">Nu există materii în planul tău de învățământ.</p>}
        </div>
      )}
    </div>
  );
}
