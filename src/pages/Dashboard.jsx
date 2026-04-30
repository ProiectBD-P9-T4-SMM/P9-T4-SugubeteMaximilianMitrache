import { useNavigate } from 'react-router-dom';
import { Users, FileText, FileSignature, Clock } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Welcome, User!</h2>
      
      {/* Rând 1: 3 carduri mari */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div 
          onClick={() => navigate('/students')}
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
          onClick={() => navigate('/centralizer')}
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
          onClick={() => navigate('/documents')}
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
              onClick={() => navigate('/centralizer')}
              className="p-3 text-left border border-slate-200 rounded-md hover:bg-slate-50 text-sm font-medium text-blue-600"
            >
              Generate Centralizer
            </button>
            <button className="p-3 text-left border border-slate-200 rounded-md hover:bg-slate-50 text-sm font-medium text-slate-700">
              Import Excel Data
            </button>
            <button 
              onClick={() => navigate('/grades/add')}
              className="p-3 text-left border border-slate-200 rounded-md hover:bg-slate-50 text-sm font-medium text-slate-700">
              Add Grade (Selection-Only)
            </button>
            <button 
              onClick={() => navigate('/students')}
              className="p-3 text-left border border-slate-200 rounded-md hover:bg-slate-50 text-sm font-medium text-slate-700"
            >
              Add Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
