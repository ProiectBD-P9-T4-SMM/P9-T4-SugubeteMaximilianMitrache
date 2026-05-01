import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, FileSignature, Clock } from 'lucide-react';
import { auditService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        // Only admins, professors and secretariat can see global audit logs
        if (user && ['ADMIN', 'PROFESSOR', 'SECRETARIAT'].includes(user.role)) {
          const res = await auditService.getLogs();
          setRecentActivity(res.data.slice(0, 5));
        } else {
          // Students don't see global activity for privacy
          setRecentActivity([]);
        }
      } catch (error) {
        console.error("Failed to load recent activity", error);
      }
    };
    fetchActivity();
  }, [user]);

  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Welcome, {user?.fullName || 'User'}!</h2>
      
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
            {recentActivity.length > 0 ? recentActivity.map((act) => (
              <li key={act.id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2 last:border-0">
                <div className="flex flex-col">
                  <span className="text-slate-700 font-medium">
                    {act.action_type === 'UPDATE' ? 'Update' : act.action_type === 'INSERT' ? 'Addition' : act.action_type === 'DELETE' ? 'Deletion' : act.action_type} {act.entity_type === 'STUDENT' ? 'Student' : act.entity_type === 'GRADE' ? 'Grade' : act.entity_type === 'DOCUMENT' ? 'Document' : act.entity_type}
                  </span>
                  <span className="text-slate-400 text-xs">by {act.actor_name || act.actor_username || 'System'}</span>
                </div>
                <span className="text-slate-400 text-xs">{new Date(act.occurred_at).toLocaleString('en-US')}</span>
              </li>
            )) : (
              <li className="text-sm text-slate-500 py-4 text-center italic">
                {user?.role === 'STUDENT' ? 'Welcome to your portal! Check your grades and documents.' : 'No recent activity found.'}
              </li>
            )}
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
