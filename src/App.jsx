import React, { useState, useEffect } from 'react';
import { 
  Search, User, LogOut, HelpCircle, FileText, Users, 
  BookOpen, FileBarChart, Settings, Edit, Eye, Trash, 
  Download, CheckCircle, Mail, Clock, Filter, Plus, FileSignature, Database, Activity
} from 'lucide-react';
import { authService, academicService, lookupService, reportsService, documentsService, notificationsService, auditService } from './services/api';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// --- Bază de Date Fictivă (Mock Data) ---
const mockPublicData = [
  { id: 1, year: '1', spec: 'Informatics', discipline: 'Programming 101', credits: 6, hours: 4, form: 'Full-time' },
  { id: 2, year: '2', spec: 'Mathematics', discipline: 'Calculus II', credits: 5, hours: 3, form: 'Full-time' },
  { id: 3, year: '3', spec: 'Physics', discipline: 'Quantum Mechanics', credits: 6, hours: 4, form: 'Part-time' },
];

const mockStudents = [
  { id: '1001', name: 'Popescu Ion', group: '321A', year: '2', status: 'Active' },
  { id: '1002', name: 'Ionescu Maria', group: '321B', year: '2', status: 'Suspended' },
  { id: '1003', name: 'Dumitru Andrei', group: '311C', year: '1', status: 'Active' },
];

const mockReports = [
  { id: '1001', name: 'Popescu Ion', discipline: 'Web Development', credits: 5, grade: '9', examDate: '2024-01-15' },
  { id: '1001', name: 'Popescu Ion', discipline: 'Databases', credits: 6, grade: '10', examDate: '2024-01-20' },
];

const mockDocs = [
  { id: 'DOC-101', type: 'Scholarship Request', title: 'Merit Scholarship Q1', author: 'Popescu Ion', date: '2024-10-12', status: 'Pending' },
  { id: 'DOC-102', type: 'Medical Exemption', title: 'Absence Motivation', author: 'Ionescu Maria', date: '2024-10-15', status: 'Approved' },
];

const mockUsers = [
  { username: 'admin.sys', name: 'System Admin', roles: 'Administrator', status: 'Active' },
  { username: 'prof.smith', name: 'John Smith', roles: 'Professor', status: 'Active' },
  { username: 'reg.office', name: 'Jane Doe', roles: 'Registrar', status: 'Active' },
];

const mockAudit = [
  { time: '2024-10-24 10:23', user: 'prof.smith', action: 'Update Grade', entity: 'Student 1001', before: 'Grade: 8', after: 'Grade: 9' },
  { time: '2024-10-24 09:15', user: 'admin.sys', action: 'Create User', entity: 'User prof.smith', before: '-', after: 'Created' },
];

const mockBackups = [
  { time: '2024-10-24 00:00', creator: 'System', desc: 'Daily Auto-Backup' },
  { time: '2024-10-17 00:00', creator: 'System', desc: 'Weekly Full Backup' },
];

const mockQueries = [
  { id: 'Q-991', time: '10:24:01', user: 'prof.smith', query: 'SELECT * FROM grades WHERE student_id=1001', duration: '12ms', status: 'Success' },
  { id: 'Q-992', time: '10:24:05', user: 'admin.sys', query: 'UPDATE users SET roles="Admin" WHERE id=5', duration: '45ms', status: 'Success' },
  { id: 'Q-993', time: '10:25:00', user: 'System', query: 'BACKUP DATABASE afsms_db', duration: '1500ms', status: 'Running' },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);

  // Funcție de navigare
  const navigate = (page) => setCurrentPage(page);

  // --- Componente Structurale ---
  
  const Header = () => (
    <header className="bg-slate-900 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('login')}>
            <BookOpen className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold tracking-wider">AFSMS</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentPage === 'login' ? (
              <button 
                onClick={() => navigate('public')}
                className="text-sm font-medium hover:text-blue-300 transition-colors"
              >
                Public Portal
              </button>
            ) : currentPage === 'public' ? (
              <button 
                onClick={() => navigate('login')}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </button>
            ) : (
              <>
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4" />
                  <span>{user ? user.fullName : 'logged_in_user'}</span>
                </div>
                <button className="text-slate-300 hover:text-white" title="Help">
                  <HelpCircle className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => {
                    localStorage.removeItem('token');
                    setUser(null);
                    navigate('login');
                  }} 
                  className="text-slate-300 hover:text-red-400 flex items-center space-x-1"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            )}
            {/* SUGU Diagrams Link - always visible */}
            <a
              className="text-sm font-medium hover:text-blue-300 transition-colors"
              href="#/sugu-diagrams"
              style={{ marginLeft: 8 }}
            >
              SUGU Diagrams
            </a>
          </div>
        </div>

        {/* Meniu Privat - vizibil doar dacă nu suntem în login/public */}
        {currentPage !== 'login' && currentPage !== 'public' && (
          <nav className="flex space-x-1 overflow-x-auto pb-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: FileBarChart },
              { id: 'students', label: 'Students & Curricula', icon: Users },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'documents', label: 'Documents & Workflow', icon: FileSignature },
              { id: 'admin', label: 'Admin & Audit', icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  currentPage === item.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );

  const Footer = () => (
    <footer className="bg-slate-100 border-t border-slate-200 mt-auto py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
        <p>&copy; 2024 AFSMS University System. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-blue-600">Privacy / GDPR</a>
          <a href="#" className="hover:text-blue-600">Contact</a>
          <a href="#" className="hover:text-blue-600">Help</a>
        </div>
      </div>
    </footer>
  );

  // --- Ecrane Specifice (Views) ---

  const ViewLogin = () => {
    const [loginError, setLoginError] = useState('');
    const [usernameInput, setUsernameInput] = useState('');

    return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <BookOpen className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">AFSMS</h1>
        <h2 className="text-sm font-medium text-slate-500 mb-8 uppercase tracking-wide">
          Automated Faculty Student Management System
        </h2>
        
        <input 
          type="text" 
          placeholder="SSO Username (e.g. secretariat.ace)"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          className="w-full border-slate-300 rounded-md shadow-sm p-3 border focus:ring-blue-500 mb-4"
        />

        {loginError && (
          <div className="text-red-500 text-sm mb-4">{loginError}</div>
        )}

        <button 
          onClick={async () => {
            setLoginError('');
            try {
              const res = await authService.login(usernameInput || 'secretariat.ace');
              localStorage.setItem('token', res.data.token);
              setUser(res.data.user);
              navigate('dashboard');
            } catch (err) {
              setLoginError(err.response?.data?.message || 'Login failed');
            }
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md flex justify-center items-center space-x-2"
        >
          <User className="h-5 w-5" />
          <span>Login with University SSO</span>
        </button>
        <div className="mt-4 flex flex-col items-center space-y-3">
          <p className="text-xs text-slate-400">
            Use your institutional credentials to access the portal.
          </p>
          <div className="w-full border-t border-slate-100"></div>
          <button 
            onClick={() => navigate('dashboard')}
            className="text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            Alternative Staff / Local Login
          </button>
        </div>
      </div>
    </div>
  )};

  const ViewPublicPortal = () => (
    <div className="flex-1 container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Public Portal – Curricula Overview</h2>
      <p className="text-sm text-slate-500 mb-6">Browse publicly available curricula information. No login required.</p>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Specialization</label>
          <select className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-blue-500">
            <option>All</option>
            <option>Informatics</option>
            <option>Mathematics</option>
            <option>Physics</option>
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Study Year</label>
          <select className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-blue-500">
            <option>All</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Form of Education</label>
          <select className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-blue-500">
            <option>All</option>
            <option>Full-time</option>
            <option>Part-time</option>
          </select>
        </div>
        <button className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded-md font-medium transition">
          Filter
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {['Year', 'Specialization', 'Discipline', 'Credits', 'Hours/Week', 'Form'].map((h) => (
                <th key={h} className="px-6 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {mockPublicData.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">{row.year}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{row.spec}</td>
                <td className="px-6 py-4">{row.discipline}</td>
                <td className="px-6 py-4">{row.credits}</td>
                <td className="px-6 py-4">{row.hours}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    row.form === 'Full-time' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {row.form}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ViewDashboard = () => (
    <div className="flex-1 container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Welcome, User!</h2>
      
      {/* Rând 1: 3 carduri mari */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div 
          onClick={() => navigate('students')}
          className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition cursor-pointer group"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-600 transition">
              <Users className="h-6 w-6 text-blue-600 group-hover:text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Students & Curricula</h3>
          </div>
          <p className="text-sm text-slate-500">Manage students, groups, curricula and individual academic paths.</p>
        </div>

        <div 
          onClick={() => navigate('reports')}
          className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-green-300 transition cursor-pointer group"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-600 transition">
              <FileText className="h-6 w-6 text-green-600 group-hover:text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Reports</h3>
          </div>
          <p className="text-sm text-slate-500">Generate e-Transcript and e-Grade Centralizer with ease.</p>
        </div>

        <div 
          onClick={() => navigate('documents')}
          className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-purple-300 transition cursor-pointer group"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-600 transition">
              <FileSignature className="h-6 w-6 text-purple-600 group-hover:text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Documents & Workflow</h3>
          </div>
          <p className="text-sm text-slate-500">Search and approve documents, manage standard student requests.</p>
        </div>
      </div>

      {/* Rând 2: Activitate & Linkuri */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
            <Clock className="h-5 w-5 text-slate-400" />
            <span>Recent Activity</span>
          </h3>
          <ul className="space-y-4">
            {[
              { text: 'Approved Document DOC-102', time: '10 mins ago' },
              { text: 'Generated e-Grade Centralizer (Informatics Y2)', time: '1 hour ago' },
              { text: 'Updated grades for Student 1001', time: '3 hours ago' },
              { text: 'Added 5 new students to group 311C', time: '1 day ago' },
            ].map((act, i) => (
              <li key={i} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2 last:border-0">
                <span className="text-slate-700">{act.text}</span>
                <span className="text-slate-400 text-xs">{act.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('reports')}
              className="p-3 text-left border border-slate-200 rounded-md hover:bg-slate-50 text-sm font-medium text-blue-600"
            >
              Generate Centralizer
            </button>
            <button className="p-3 text-left border border-slate-200 rounded-md hover:bg-slate-50 text-sm font-medium text-slate-700">
              Import Excel Data
            </button>
            <button 
              onClick={() => navigate('add-grade')}
              className="p-3 text-left border border-slate-200 rounded-md hover:bg-slate-50 text-sm font-medium text-slate-700">
              Add Grade (Selection-Only)
            </button>
            <button 
              onClick={() => navigate('students')}
              className="p-3 text-left border border-slate-200 rounded-md hover:bg-slate-50 text-sm font-medium text-slate-700"
            >
              Add Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ViewStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchStudents = async () => {
        try {
          const res = await academicService.getStudents();
          setStudents(res.data);
        } catch (err) {
          console.error("Failed to load students", err);
        } finally {
          setLoading(false);
        }
      };
      fetchStudents();
    }, []);

    return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Students & Curricula Management</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Student</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Academic Year</label>
          <select className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-blue-500">
            <option>2023-2024</option>
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Specialization</label>
          <select className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-blue-500">
            <option>All</option>
            <option>Informatics</option>
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Study Group</label>
          <select className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-blue-500">
            <option>All</option>
            <option>321A</option>
          </select>
        </div>
        <div className="flex-2 min-w-[200px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Student name / ID</label>
          <div className="relative">
            <input type="text" placeholder="Search..." className="w-full border-slate-300 rounded-md shadow-sm p-2 pl-8 border focus:ring-blue-500" />
            <Search className="h-4 w-4 text-slate-400 absolute left-2 top-3" />
          </div>
        </div>
        <button className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded-md font-medium transition">
          Search
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left w-12"><input type="checkbox" className="rounded border-slate-300" /></th>
              {['Reg. Number', 'Name', 'Group', 'Year', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-6 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {loading ? (
              <tr><td colSpan="7" className="text-center py-4 text-slate-500">Loading students...</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-4 text-slate-500">No students found</td></tr>
            ) : students.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="px-6 py-4"><input type="checkbox" className="rounded border-slate-300" /></td>
                <td className="px-6 py-4 font-mono text-slate-500">{row.registration_number}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{row.first_name} {row.last_name}</td>
                <td className="px-6 py-4">{row.formation_name || 'N/A'}</td>
                <td className="px-6 py-4">{row.study_year || 'N/A'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    row.status === 'ENROLLED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-900" title="Edit"><Edit className="h-4 w-4" /></button>
                  <button className="text-slate-600 hover:text-slate-900" title="View"><Eye className="h-4 w-4" /></button>
                  <button className="text-red-600 hover:text-red-900" title="Delete"><Trash className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Footer actions */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-sm text-slate-500">
          <span>Total students: {students.length}</span>
          <div className="flex space-x-2">
            <span className="py-1">Export as:</span>
            {['CSV', 'XML', 'XLS', 'PDF'].map(ext => (
              <button key={ext} className="px-2 py-1 border border-slate-300 rounded bg-white hover:bg-slate-100 text-xs font-medium text-slate-700">
                {ext}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )};

  const ViewAddGrade = () => {
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
  };

  const ViewReports = () => {
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

      doc.autoTable({
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
  )};

  const ViewDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
      type: '', author_id: '', startDate: '', endDate: '', contentKeyword: ''
    });

    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailForm, setEmailForm] = useState({ groupId: '', subject: '', body: '' });
    const [studyFormations, setStudyFormations] = useState([]);
    const [emailStatus, setEmailStatus] = useState(null);

    useEffect(() => {
      fetchDocuments();
      loadFormations();
    }, []);

    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const res = await documentsService.getDocuments(filters);
        setDocuments(res.data);
      } catch (err) {
        console.error("Failed to load documents", err);
      } finally {
        setLoading(false);
      }
    };

    const loadFormations = async () => {
      try {
        const res = await lookupService.getStudyFormations();
        setStudyFormations(res.data);
      } catch (err) {
        console.error("Failed to load formations", err);
      }
    };

    const handleUpdateStatus = async (id, newStatus) => {
      try {
        await documentsService.updateStatus(id, newStatus);
        fetchDocuments(); // refresh list
      } catch (err) {
        console.error("Failed to update status", err);
      }
    };

    const handleSendEmail = async (e) => {
      e.preventDefault();
      setEmailStatus({ loading: true });
      try {
        const res = await notificationsService.sendGroupEmail(emailForm);
        setEmailStatus({ success: true, message: res.data.message });
        setTimeout(() => setShowEmailModal(false), 2000);
      } catch (err) {
        setEmailStatus({ success: false, message: err.response?.data?.message || 'Failed to send' });
      }
    };

    return (
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Documents & Workflow</h2>
          <button 
            onClick={() => { setShowEmailModal(true); setEmailStatus(null); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition flex items-center space-x-2"
          >
            <Mail className="h-4 w-4" />
            <span>Send Group Email (Outlook)</span>
          </button>
        </div>

        {/* Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Compose Group Email</h3>
              {emailStatus && (
                <div className={`p-3 rounded mb-4 text-sm ${emailStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {emailStatus.loading ? 'Sending via Nodemailer...' : emailStatus.message}
                </div>
              )}
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Target Group</label>
                  <select required value={emailForm.groupId} onChange={e => setEmailForm({...emailForm, groupId: e.target.value})} className="w-full p-2 border border-slate-300 rounded">
                    <option value="">-- Select Group --</option>
                    {studyFormations.map(f => <option key={f.id} value={f.id}>{f.name} (Year {f.study_year})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <input required type="text" value={emailForm.subject} onChange={e => setEmailForm({...emailForm, subject: e.target.value})} className="w-full p-2 border border-slate-300 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Message Body</label>
                  <textarea required rows="4" value={emailForm.body} onChange={e => setEmailForm({...emailForm, body: e.target.value})} className="w-full p-2 border border-slate-300 rounded"></textarea>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={() => setShowEmailModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled={emailStatus?.loading}>Send Email</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Document type</label>
            <input type="text" placeholder="e.g. Cerere bursa" value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Start Date</label>
            <input type="date" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">End Date</label>
            <input type="date" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Full-text search</label>
            <input type="text" placeholder="Keywords..." value={filters.contentKeyword} onChange={e => setFilters({...filters, contentKeyword: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 text-sm" />
          </div>
          <button onClick={fetchDocuments} className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded-md font-medium transition flex items-center justify-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Type', 'Title', 'Author', 'Created Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-4 text-slate-500">Loading documents...</td></tr>
              ) : documents.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4 text-slate-500">No documents found matching filters.</td></tr>
              ) : documents.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">{row.type}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{row.title}</td>
                  <td className="px-6 py-4">{row.author_name || 'System'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(row.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      row.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                      row.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-3">
                    <button className="text-slate-600 hover:text-slate-900" title="View"><Eye className="h-4 w-4" /></button>
                    {row.status !== 'APPROVED' && (
                      <button onClick={() => handleUpdateStatus(row.id, 'APPROVED')} className="text-green-600 hover:text-green-900" title="Approve"><CheckCircle className="h-4 w-4" /></button>
                    )}
                    {row.status !== 'REJECTED' && (
                      <button onClick={() => handleUpdateStatus(row.id, 'REJECTED')} className="text-red-600 hover:text-red-900" title="Reject"><Trash className="h-4 w-4" /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const ViewAdmin = () => {
    const [adminTab, setAdminTab] = useState('audit');
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rollbackStatus, setRollbackStatus] = useState(null);

    useEffect(() => {
      if (adminTab === 'audit') {
        fetchAuditLogs();
      }
    }, [adminTab]);

    const fetchAuditLogs = async () => {
      setLoading(true);
      try {
        const res = await auditService.getLogs();
        setAuditLogs(res.data);
      } catch (err) {
        console.error("Failed to load audit logs", err);
      } finally {
        setLoading(false);
      }
    };

    const handleRollback = async (log) => {
      if (!window.confirm(`Are you sure you want to rollback this ${log.entity_type} UPDATE?`)) return;
      
      try {
        const res = await auditService.rollback(log.id);
        setRollbackStatus({ success: true, message: res.data.message });
        fetchAuditLogs(); // refresh
        setTimeout(() => setRollbackStatus(null), 3000);
      } catch (err) {
        setRollbackStatus({ success: false, message: err.response?.data?.message || 'Rollback failed' });
        setTimeout(() => setRollbackStatus(null), 3000);
      }
    };

    return (
      <div className="flex-1 container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Administration & Audit</h2>

        {rollbackStatus && (
          <div className={`p-4 rounded-md mb-4 ${rollbackStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {rollbackStatus.message}
          </div>
        )}

        {/* Inner Tabs */}
        <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
          {[
            { id: 'audit', label: 'Audit Log & Rollback' },
            { id: 'users', label: 'Users & Roles' },
            { id: 'queries', label: 'Query Monitor (DBA)' },
          ].map(t => (
            <button 
              key={t.id}
              onClick={() => setAdminTab(t.id)}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${adminTab === t.id ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {adminTab === 'audit' && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>{['Timestamp', 'User', 'Action', 'Entity', 'Before', 'After', 'Rollback'].map(h => <th key={h} className="px-6 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">{h}</th>)}</tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-4">Loading...</td></tr>
                ) : auditLogs.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{new Date(row.occurred_at).toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono text-xs">{row.actor_name || 'System'}</td>
                    <td className="px-6 py-4 font-medium">{row.action_type}</td>
                    <td className="px-6 py-4">{row.entity_type}</td>
                    <td className="px-6 py-4 text-red-500 text-xs max-w-xs truncate" title={JSON.stringify(row.before_snapshot_json)}>
                      {row.before_snapshot_json ? JSON.stringify(row.before_snapshot_json).substring(0, 50) + '...' : '-'}
                    </td>
                    <td className="px-6 py-4 text-green-600 text-xs max-w-xs truncate" title={JSON.stringify(row.after_snapshot_json)}>
                      {row.after_snapshot_json ? JSON.stringify(row.after_snapshot_json).substring(0, 50) + '...' : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {row.action_type === 'UPDATE' && row.before_snapshot_json && (
                        <button 
                          onClick={() => handleRollback(row)}
                          className="text-red-600 hover:text-white hover:bg-red-600 border border-red-200 bg-red-50 px-2 py-1 rounded text-xs transition"
                        >
                          Rollback
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {adminTab === 'users' && (
          <div className="p-4 text-center text-slate-500 bg-white rounded-lg border border-slate-200">User management is out of scope for this demo.</div>
        )}

        {adminTab === 'queries' && (
          <div className="p-4 text-center text-slate-500 bg-white rounded-lg border border-slate-200">Query monitor is out of scope for this demo.</div>
        )}

      </div>
    );
  };

  // --- Router Principal ---
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Header />
      
      {/* Randare condiționată pe baza stării `currentPage` */}
      {currentPage === 'login' && <ViewLogin />}
      {currentPage === 'public' && <ViewPublicPortal />}
      {currentPage === 'dashboard' && <ViewDashboard />}
      {currentPage === 'students' && <ViewStudents />}
      {currentPage === 'add-grade' && <ViewAddGrade />}
      {currentPage === 'reports' && <ViewReports />}
      {currentPage === 'documents' && <ViewDocuments />}
      {currentPage === 'admin' && <ViewAdmin />}
      
      <Footer />
    </div>
  );
}
