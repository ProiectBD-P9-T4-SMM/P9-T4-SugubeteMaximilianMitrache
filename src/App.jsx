import React, { useState, useEffect } from 'react';
import { 
  Search, User, LogOut, HelpCircle, FileText, Users, 
  BookOpen, FileBarChart, Settings, Edit, Eye, Trash, 
  Download, CheckCircle, Mail, Clock, Filter, Plus, FileSignature, Database, Activity
} from 'lucide-react';
import { authService, academicService, lookupService } from './services/api';

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
  const [loginError, setLoginError] = useState('');
  const [usernameInput, setUsernameInput] = useState('');

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

  const ViewLogin = () => (
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
  );

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
            <button className="p-3 text-left border border-slate-200 rounded-md hover:bg-slate-50 text-sm font-medium text-slate-700">
              New Announcement
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

  const ViewStudents = () => (
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
              {['Student ID', 'Name', 'Group', 'Year', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-6 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {mockStudents.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="px-6 py-4"><input type="checkbox" className="rounded border-slate-300" /></td>
                <td className="px-6 py-4 font-mono text-slate-500">{row.id}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{row.name}</td>
                <td className="px-6 py-4">{row.group}</td>
                <td className="px-6 py-4">{row.year}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
          <span>Pagination: 1 2 3 ...</span>
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
  );

  const ViewReports = () => (
    <div className="flex-1 container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Reports – e-Grade Centralizer</h2>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Academic Year</label>
          <select className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-blue-500"><option>2023-2024</option></select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Specialization</label>
          <select className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-blue-500"><option>Informatics</option></select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Study Year</label>
          <select className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-blue-500"><option>Year 2</option></select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Form of Education</label>
          <select className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-blue-500">
            <option>Full-time</option>
            <option>Distance Learning</option>
          </select>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition shadow-sm">
          Generate
        </button>
      </div>

      <div className="flex justify-between items-end mb-2">
        <h3 className="text-lg font-semibold text-slate-700">
          Preview Data <span className="text-xs font-normal text-slate-500 ml-2">(Sorted alphabetically)</span>
        </h3>
        <div className="flex space-x-2 items-center">
          <label className="text-sm font-medium text-slate-600">Export as:</label>
          <select className="border-slate-300 rounded-md shadow-sm p-1 border text-sm focus:ring-blue-500">
            <option>PDF</option>
            <option>XLS</option>
            <option>CSV</option>
            <option>XML</option>
          </select>
          <button className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-md text-sm font-medium transition flex items-center space-x-1">
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {['Student ID', 'Name', 'Discipline', 'Credits', 'Grade', 'Exam Date'].map(h => (
                <th key={h} className="px-6 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {mockReports.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono text-slate-500">{row.id}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{row.name}</td>
                <td className="px-6 py-4">{row.discipline}</td>
                <td className="px-6 py-4">{row.credits}</td>
                <td className="px-6 py-4 font-bold text-blue-600">{row.grade}</td>
                <td className="px-6 py-4 text-slate-500">{row.examDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-xs text-slate-400 text-right">
          Generation time: 0.24 sec
        </div>
      </div>
    </div>
  );

  const ViewDocuments = () => (
    <div className="flex-1 container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Documents & Workflow</h2>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Document type</label>
          <select className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-blue-500">
            <option>All Types</option>
            <option>Scholarship Request</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Created from / to</label>
          <input type="date" className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Author</label>
          <input type="text" placeholder="Name or ID" className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Full-text search</label>
          <input type="text" placeholder="Keywords..." className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-blue-500" />
        </div>
        <button className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded-md font-medium transition flex items-center justify-center space-x-2">
          <Search className="h-4 w-4" />
          <span>Search</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {['Doc ID', 'Type', 'Title', 'Author', 'Created Date', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-6 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {mockDocs.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono text-slate-500">{row.id}</td>
                <td className="px-6 py-4">{row.type}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{row.title}</td>
                <td className="px-6 py-4">{row.author}</td>
                <td className="px-6 py-4 whitespace-nowrap">{row.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    row.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-3">
                  <button className="text-slate-600 hover:text-slate-900 flex items-center space-x-1" title="View"><Eye className="h-4 w-4" /></button>
                  <button className="text-green-600 hover:text-green-900 flex items-center space-x-1" title="Approve"><CheckCircle className="h-4 w-4" /></button>
                  <button className="text-blue-600 hover:text-blue-900 flex items-center space-x-1" title="Send email to group"><Mail className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ViewAdmin = () => {
    const [adminTab, setAdminTab] = useState('users');

    return (
      <div className="flex-1 container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Administration & Audit</h2>

        {/* Inner Tabs */}
        <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
          {[
            { id: 'users', label: 'Users & Roles' },
            { id: 'audit', label: 'Audit Log' },
            { id: 'queries', label: 'Query Monitor (DBA)' },
            { id: 'backup', label: 'Backup / Rollback' },
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
        {adminTab === 'users' && (
          <div>
            <div className="flex justify-end mb-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2">
                <Plus className="h-4 w-4" /> <span>Add User</span>
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>{['Username', 'Name', 'Role(s)', 'Status', 'Actions'].map(h => <th key={h} className="px-6 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">{h}</th>)}</tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {mockUsers.map((u, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono font-medium text-slate-700">{u.username}</td>
                      <td className="px-6 py-4">{u.name}</td>
                      <td className="px-6 py-4"><span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">{u.roles}</span></td>
                      <td className="px-6 py-4"><span className="text-green-600 font-medium text-xs">{u.status}</span></td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 border border-blue-200 bg-blue-50 px-2 py-1 rounded text-xs">Edit Roles</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === 'audit' && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>{['Timestamp', 'User', 'Action', 'Entity', 'Before', 'After'].map(h => <th key={h} className="px-6 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">{h}</th>)}</tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {mockAudit.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{row.time}</td>
                    <td className="px-6 py-4 font-mono text-xs">{row.user}</td>
                    <td className="px-6 py-4 font-medium">{row.action}</td>
                    <td className="px-6 py-4">{row.entity}</td>
                    <td className="px-6 py-4 text-red-500 text-xs">{row.before}</td>
                    <td className="px-6 py-4 text-green-600 text-xs">{row.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {adminTab === 'queries' && (
          <div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-4 flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">Filter by Status</label>
                <select className="w-full border-slate-300 rounded-md shadow-sm p-2 border text-sm focus:ring-blue-500">
                  <option>All Queries</option>
                  <option>Running</option>
                  <option>Slow Queries (&gt;1000ms)</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">Search Query Text</label>
                <input type="text" placeholder="e.g. SELECT * FROM..." className="w-full border-slate-300 rounded-md shadow-sm p-2 border text-sm focus:ring-blue-500" />
              </div>
              <button className="bg-slate-800 text-white px-6 py-2 rounded-md text-sm font-medium transition flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Monitor</span>
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>{['Query ID', 'Time', 'User', 'Query Statement', 'Duration', 'Status'].map(h => <th key={h} className="px-6 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">{h}</th>)}</tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {mockQueries.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500 whitespace-nowrap">{row.id}</td>
                      <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{row.time}</td>
                      <td className="px-6 py-4 font-mono text-xs">{row.user}</td>
                      <td className="px-6 py-4 font-mono text-xs text-blue-600 bg-slate-50 break-all">{row.query}</td>
                      <td className="px-6 py-4 font-medium">{row.duration}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === 'backup' && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 font-medium text-slate-700">List of Recovery Points</div>
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>{['Date/Time', 'Created by', 'Description', 'Actions'].map(h => <th key={h} className="px-6 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">{h}</th>)}</tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {mockBackups.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium">{row.time}</td>
                    <td className="px-6 py-4 text-slate-500">{row.creator}</td>
                    <td className="px-6 py-4">{row.desc}</td>
                    <td className="px-6 py-4 text-sm font-medium flex space-x-2">
                      <button className="text-slate-600 hover:text-blue-600 border border-slate-200 bg-white px-2 py-1 rounded text-xs shadow-sm">Preview</button>
                      <button className="text-red-600 hover:text-white hover:bg-red-600 border border-red-200 bg-red-50 px-2 py-1 rounded text-xs transition">Rollback</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
      {currentPage === 'public' && <ViewPublicPortal />}
      {currentPage === 'dashboard' && <ViewDashboard />}
      {currentPage === 'students' && <ViewStudents />}
      {currentPage === 'reports' && <ViewReports />}
      {currentPage === 'documents' && <ViewDocuments />}
      {currentPage === 'admin' && <ViewAdmin />}
      
      <Footer />
    </div>
  );
}
