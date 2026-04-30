import React, { useState, useEffect } from 'react';
import { Search, User, LogOut, HelpCircle, FileText, Users, BookOpen, FileBarChart, Settings, Edit, Eye, Trash, Download, CheckCircle, Mail, Clock, Filter, Plus, FileSignature, Database, Activity } from 'lucide-react';
import { authService, academicService, lookupService, reportsService, documentsService, notificationsService, auditService, adminService } from './services/api';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
        
        <form onSubmit={async (e) => {
          e.preventDefault();
          setLoginError('');
          try {
            const res = await authService.login(usernameInput || 'secretariat.ace');
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            navigate('dashboard');
          } catch (err) {
            setLoginError(err.response?.data?.message || 'Login failed');
          }
        }}>
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
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md flex justify-center items-center space-x-2"
          >
            <User className="h-5 w-5" />
            <span>Login with University SSO</span>
          </button>
        </form>
        <div className="mt-4 flex flex-col items-center space-y-3">
          <p className="text-xs text-slate-400">
            Use your institutional credentials to access the portal.
          </p>
          <div className="w-full border-t border-slate-100"></div>
          <div className="flex space-x-4">
            <button 
              onClick={() => navigate('register')}
              className="text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
            >
              Don't have an account? Register
            </button>
            <span className="text-slate-300">|</span>
            <button 
              onClick={() => navigate('public')}
              className="text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
            >
              View Public Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  )};

  const ViewRegister = () => {
    const [formData, setFormData] = useState({ username: '', email: '', fullName: '' });
    const [status, setStatus] = useState(null);

    return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Create Account</h1>
        <form onSubmit={async (e) => {
          e.preventDefault();
          setStatus({ loading: true });
          try {
            await authService.register(formData);
            setStatus({ success: true, message: 'Account created! Please log in.' });
            setTimeout(() => navigate('login'), 2000);
          } catch (err) {
            setStatus({ error: err.response?.data?.message || 'Registration failed' });
          }
        }}>
          <input 
            type="text" placeholder="Username" required
            value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})}
            className="w-full border-slate-300 rounded-md shadow-sm p-3 border focus:ring-blue-500 mb-4"
          />
          <input 
            type="email" placeholder="Email" required
            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
            className="w-full border-slate-300 rounded-md shadow-sm p-3 border focus:ring-blue-500 mb-4"
          />
          <input 
            type="text" placeholder="Full Name" required
            value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})}
            className="w-full border-slate-300 rounded-md shadow-sm p-3 border focus:ring-blue-500 mb-4"
          />

          {status?.error && <div className="text-red-500 text-sm mb-4">{status.error}</div>}
          {status?.success && <div className="text-green-500 text-sm mb-4">{status.message}</div>}

          <button 
            type="submit" disabled={status?.loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md"
          >
            {status?.loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="mt-6 border-t border-slate-100 pt-4">
          <button 
            onClick={() => navigate('login')}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  )};

  const ViewPublicPortal = () => {
    const [curricula, setCurricula] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const fetchCurricula = async () => {
        setLoading(true);
        try {
          const res = await publicService.getCurricula();
          setCurricula(res.data);
        } catch (err) {
          console.error("Failed to load public curricula", err);
        } finally {
          setLoading(false);
        }
      };
      fetchCurricula();
    }, []);

    return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Public Portal – Curricula Overview</h2>
          <p className="text-sm text-slate-500">Browse publicly available curricula information. No login required.</p>
        </div>
        <button 
          onClick={() => navigate('login')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition"
        >
          Login to Private Portal
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {['Specialization', 'Year', 'Semester', 'Discipline', 'Credits', 'Type'].map((h) => (
                <th key={h} className="px-6 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {loading ? (
              <tr><td colSpan="6" className="text-center py-4 text-slate-500">Loading curricula...</td></tr>
            ) : curricula.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-4 text-slate-500">No curricula data available.</td></tr>
            ) : curricula.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{row.specialization_name}</td>
                <td className="px-6 py-4">Year {row.study_year}</td>
                <td className="px-6 py-4">Sem {row.semester}</td>
                <td className="px-6 py-4">{row.discipline_name}</td>
                <td className="px-6 py-4">{row.ects_credits} ECTS</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800`}>
                    {row.evaluation_type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )};

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
    const [formations, setFormations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [studentForm, setStudentForm] = useState({
      first_name: '', last_name: '', email: '', study_formation_id: '', status: 'ENROLLED'
    });
    // 6-level cascading selection
    const [sel, setSel] = useState({ degreeLevel: '', specCode: '', eduForm: '', year: '', group: '', sub: '' });

    useEffect(() => { fetchStudents(); fetchFormations(); }, []);

    const fetchStudents = async () => {
      setLoading(true);
      try { const res = await academicService.getStudents(); setStudents(res.data); }
      catch (err) { console.error("Failed to load students", err); }
      finally { setLoading(false); }
    };

    const fetchFormations = async () => {
      try {
        const res = await lookupService.getStudyFormations();
        setFormations(res.data);
      } catch (err) { console.error("Failed to load formations", err); }
    };

    // Derived lists for each dropdown level (cascade filtering)
    const degreeLevels = [...new Set(formations.map(f => f.degree_level))].sort();
    const filteredSpecs = formations
      .filter(f => !sel.degreeLevel || f.degree_level === sel.degreeLevel)
      .reduce((acc, f) => { if (!acc.find(s => s.spec_code === f.spec_code)) acc.push({ spec_code: f.spec_code, specialization_name: f.specialization_name }); return acc; }, []);
    const filteredEduForms = [...new Set(
      formations.filter(f => f.spec_code === sel.specCode).map(f => f.education_form)
    )].sort();
    const filteredYears = [...new Set(
      formations.filter(f => f.spec_code === sel.specCode && f.education_form === sel.eduForm).map(f => f.study_year)
    )].sort();
    const filteredGroups = [...new Set(
      formations.filter(f => f.spec_code === sel.specCode && f.education_form === sel.eduForm && f.study_year === parseInt(sel.year)).map(f => f.group_index)
    )].sort();
    const filteredSubs = formations
      .filter(f => f.spec_code === sel.specCode && f.education_form === sel.eduForm && f.study_year === parseInt(sel.year) && f.group_index === parseInt(sel.group))
      .map(f => f.code.slice(-1)); // Last char of code is A or B

    // Auto-resolve formation ID when all 6 fields selected
    useEffect(() => {
      if (sel.specCode && sel.eduForm && sel.year && sel.group && sel.sub) {
        const match = formations.find(f =>
          f.spec_code === sel.specCode &&
          f.education_form === sel.eduForm &&
          f.study_year === parseInt(sel.year) &&
          f.group_index === parseInt(sel.group) &&
          f.code.endsWith(sel.sub)
        );
        setStudentForm(prev => ({ ...prev, study_formation_id: match?.id || '' }));
      }
    }, [sel, formations]);

    const handleSaveStudent = async (e) => {
      e.preventDefault();
      if (!studentForm.study_formation_id) {
        alert('Please complete the Study Formation selection (all 6 fields).');
        return;
      }
      try {
        if (editingStudent) { await academicService.updateStudent(editingStudent.id, studentForm); }
        else { await academicService.addStudent(studentForm); }
        setShowModal(false); fetchStudents();
      } catch (err) { alert(err.response?.data?.message || 'Failed to save student'); }
    };

    const handleDeleteStudent = async (id) => {
      if (!window.confirm("Confirm soft-delete (mark as INACTIVE)?")) return;
      try { await academicService.deleteStudent(id); fetchStudents(); }
      catch (err) { alert('Failed to delete student'); }
    };

    const openEditModal = (student) => {
      setEditingStudent(student);
      const formation = formations.find(f => f.name === student.formation_name);
      const emptySel = { degreeLevel: '', specCode: '', eduForm: '', year: '', group: '', sub: '' };
      const decoded = formation ? {
        degreeLevel: formation.degree_level || '',
        specCode: formation.spec_code || '',
        eduForm: formation.education_form || '',
        year: String(formation.study_year || ''),
        group: String(formation.group_index || ''),
        sub: formation.code?.slice(-1) || ''
      } : emptySel;
      setSel(decoded);
      setStudentForm({ first_name: student.first_name, last_name: student.last_name, email: student.email || '', study_formation_id: formation?.id || '', status: student.status || 'ENROLLED' });
      setShowModal(true);
    };

    const openAddModal = () => {
      setEditingStudent(null);
      setSel({ degreeLevel: '', specCode: '', eduForm: '', year: '', group: '', sub: '' });
      setStudentForm({ first_name: '', last_name: '', email: '', study_formation_id: '', status: 'ENROLLED' });
      setShowModal(true);
    };

    const filteredStudents = students.filter(s => 
      s.status !== 'INACTIVE' &&
      (s.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       s.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       s.registration_number.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Students & Curricula Management</h2>
        <div className="flex space-x-2">
          <label className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition flex items-center space-x-2 cursor-pointer">
            <Database className="h-4 w-4" />
            <span>Import Excel</span>
            <input type="file" accept=".xlsx, .xls, .csv" className="hidden" onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              
              const reader = new FileReader();
              reader.onload = async (evt) => {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                
                try {
                  const res = await academicService.addStudentsBulk(data);
                  alert(res.data.message);
                  fetchStudents();
                } catch (err) {
                  alert(err.response?.data?.message || 'Failed to import bulk students.');
                }
              };
              reader.readAsBinaryString(file);
              e.target.value = null; // reset
            }} />
          </label>
          <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-800 mb-4">{editingStudent ? 'Edit Student' : 'Add Student'}</h3>
            <form onSubmit={handleSaveStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <input required type="text" value={studentForm.first_name} onChange={e => setStudentForm({...studentForm, first_name: e.target.value})} className="w-full p-2 border border-slate-300 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <input required type="text" value={studentForm.last_name} onChange={e => setStudentForm({...studentForm, last_name: e.target.value})} className="w-full p-2 border border-slate-300 rounded" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input required type="email" value={studentForm.email} onChange={e => setStudentForm({...studentForm, email: e.target.value})} className="w-full p-2 border border-slate-300 rounded" />
              </div>

              {/* --- 6 Cascading Dropdowns --- */}
              <div className="border border-blue-200 rounded-md p-4 bg-blue-50 space-y-3">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Study Formation</p>

                {/* Row 1: Degree Level */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Ciclu studii</label>
                    <select
                      value={sel.degreeLevel}
                      onChange={e => setSel({ degreeLevel: e.target.value, specCode: '', eduForm: '', year: '', group: '', sub: '' })}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
                    >
                      <option value="">-- Licență / Masterat --</option>
                      {degreeLevels.map(dl => <option key={dl} value={dl}>{dl}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Specializare</label>
                    <select
                      value={sel.specCode}
                      disabled={!sel.degreeLevel}
                      onChange={e => setSel(prev => ({ ...prev, specCode: e.target.value, eduForm: '', year: '', group: '', sub: '' }))}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-sm disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value="">-- Specializare --</option>
                      {filteredSpecs.map(s => <option key={s.spec_code} value={s.spec_code}>{s.specialization_name} ({s.spec_code})</option>)}
                    </select>
                  </div>
                </div>

                {/* Row 2: Education Form + Year + Group + Subgroup */}
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Frecvență</label>
                    <select
                      value={sel.eduForm}
                      disabled={!sel.specCode}
                      onChange={e => setSel(prev => ({ ...prev, eduForm: e.target.value, year: '', group: '', sub: '' }))}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-sm disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value="">--</option>
                      {filteredEduForms.map(f => <option key={f} value={f}>{f === 'IF' ? 'IF (cu frecvență)' : 'IFR (fără frecvență)'}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">An</label>
                    <select
                      value={sel.year}
                      disabled={!sel.eduForm}
                      onChange={e => setSel(prev => ({ ...prev, year: e.target.value, group: '', sub: '' }))}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-sm disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value="">--</option>
                      {filteredYears.map(y => <option key={y} value={y}>An {y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Grupă</label>
                    <select
                      value={sel.group}
                      disabled={!sel.year}
                      onChange={e => setSel(prev => ({ ...prev, group: e.target.value, sub: '' }))}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-sm disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value="">--</option>
                      {filteredGroups.map(g => <option key={g} value={g}>Gr. {g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Subgrupă</label>
                    <select
                      value={sel.sub}
                      disabled={!sel.group}
                      onChange={e => setSel(prev => ({ ...prev, sub: e.target.value }))}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-sm disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value="">--</option>
                      {filteredSubs.map(s => <option key={s} value={s}>Sgr. {s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Indicator */}
                {studentForm.study_formation_id ? (
                  <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 rounded px-2 py-1">
                    ✓ {sel.degreeLevel} · {sel.specCode} · {sel.eduForm} · An {sel.year} · Gr.{sel.group} · Sgr.{sel.sub}
                  </p>
                ) : sel.sub ? (
                  <p className="text-xs text-red-600 font-medium">⚠ No matching formation found.</p>
                ) : (
                  <p className="text-xs text-slate-400">Selectează toate câmpurile pentru a identifica formația.</p>
                )}
              </div>


              {editingStudent && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select value={studentForm.status} onChange={e => setStudentForm({...studentForm, status: e.target.value})} className="w-full p-2 border border-slate-300 rounded">
                    <option value="ENROLLED">ENROLLED</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="GRADUATED">GRADUATED</option>
                    <option value="ACTIVE">ACTIVE</option>
                  </select>
                </div>
              )}
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex-2 min-w-[300px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Search Student name or ID</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="e.g. Popescu..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-slate-300 rounded-md shadow-sm p-2 pl-8 border focus:ring-blue-500" 
            />
            <Search className="h-4 w-4 text-slate-400 absolute left-2 top-3" />
          </div>
        </div>
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
            ) : filteredStudents.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-4 text-slate-500">No students found</td></tr>
            ) : filteredStudents.map((row) => (
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
                  <button onClick={() => openEditModal(row)} className="text-blue-600 hover:text-blue-900" title="Edit"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => handleDeleteStudent(row.id)} className="text-red-600 hover:text-red-900" title="Hide/Delete"><Trash className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-sm text-slate-500">
          <span>Showing {filteredStudents.length} active students</span>
        </div>
      </div>
    </div>
  );
  };

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

    // New states for Phase 7
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [queries, setQueries] = useState([]);

    useEffect(() => {
      if (adminTab === 'audit') fetchAuditLogs();
      if (adminTab === 'users') {
        fetchUsers();
        fetchRoles();
      }
      if (adminTab === 'queries') fetchQueries();
    }, [adminTab]);

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await adminService.getUsers();
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRoles = async () => {
      try {
        const res = await adminService.getRoles();
        setRoles(res.data);
      } catch (err) {
        console.error("Failed to fetch roles", err);
      }
    };

    const fetchQueries = async () => {
      setLoading(true);
      try {
        const res = await adminService.getQueries();
        setQueries(res.data);
      } catch (err) {
        console.error("Failed to fetch queries", err);
      } finally {
        setLoading(false);
      }
    };

    const handleRoleChange = async (userId, roleId) => {
      try {
        await adminService.updateUserRole(userId, roleId);
        fetchUsers(); // Refresh to reflect change
      } catch (err) {
        alert('Failed to update role');
      }
    };



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
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>{['Name', 'Email', 'SSO Subject', 'Status', 'Role'].map(h => <th key={h} className="px-6 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">{h}</th>)}</tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-4 text-slate-500">Loading users...</td></tr>
                ) : users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium">{user.full_name}</td>
                    <td className="px-6 py-4 text-slate-500">{user.email}</td>
                    <td className="px-6 py-4 font-mono text-xs">{user.sso_subject}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.account_status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.account_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        className="border border-slate-300 rounded p-1 text-sm bg-white focus:ring-blue-500"
                        value={user.role_id || ''}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      >
                        <option value="" disabled>-- Select Role --</option>
                        {roles.map(r => (
                          <option key={r.id} value={r.id}>{r.name} ({r.code})</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {adminTab === 'queries' && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-semibold text-slate-800">Active PostgreSQL Queries</h3>
              <button onClick={fetchQueries} className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-medium flex items-center space-x-1">
                <Activity className="h-3 w-3" />
                <span>Refresh Monitor</span>
              </button>
            </div>
            <div className="overflow-x-auto max-w-full">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>{['PID', 'User', 'State', 'Last Change', 'Query'].map(h => <th key={h} className="px-6 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">{h}</th>)}</tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-4 text-slate-500">Loading queries...</td></tr>
                  ) : queries.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-4 text-slate-500">No active queries.</td></tr>
                  ) : queries.map((q) => (
                    <tr key={q.pid} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-xs">{q.pid}</td>
                      <td className="px-6 py-4">{q.username}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${q.state === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                          {q.state}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500">{new Date(q.state_change).toLocaleTimeString()}</td>
                      <td className="px-6 py-4 font-mono text-xs max-w-md truncate text-slate-700" title={q.query}>
                        {q.query}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
      {currentPage === 'register' && <ViewRegister />}
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
