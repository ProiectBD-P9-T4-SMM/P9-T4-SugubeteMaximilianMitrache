import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, User, HelpCircle, LogOut, FileBarChart, Users, FileText, FileSignature, Settings, BookMarked, List } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define menu items based on role
  const menuItems = [
    { id: '/dashboard', label: 'Dashboard', icon: FileBarChart, roles: ['STUDENT', 'PROFESSOR', 'SECRETARIAT', 'ADMIN'] },
    { id: '/my-grades', label: 'My Grades', icon: BookOpen, roles: ['STUDENT'] },
    { id: '/students', label: 'Students & Curricula', icon: Users, roles: ['PROFESSOR', 'SECRETARIAT', 'ADMIN'] },
    { id: '/disciplines', label: 'Disciplines', icon: BookMarked, roles: ['ADMIN', 'SECRETARIAT'] },
    { id: '/grades/add', label: 'Add Grades', icon: FileText, roles: ['PROFESSOR', 'ADMIN'] },
    { id: '/grades/list', label: 'Grades List', icon: List, roles: ['PROFESSOR', 'ADMIN', 'SECRETARIAT'] },
    { id: '/centralizer', label: 'Centralizer', icon: FileText, roles: ['SECRETARIAT', 'ADMIN'] },
    { id: '/documents', label: 'Documents & Workflow', icon: FileSignature, roles: ['STUDENT', 'PROFESSOR', 'SECRETARIAT', 'ADMIN'] },
    { id: '/groups', label: 'User Groups', icon: Users, roles: ['SECRETARIAT', 'ADMIN'] },
    { id: '/audit', label: 'Admin & Audit', icon: Settings, roles: ['ADMIN'] },
  ];

  const visibleMenu = menuItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-slate-900 text-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <BookOpen className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold tracking-wider">AFSMS</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                <span className="text-slate-300 font-medium">{user?.fullName}</span>
                <User className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-slate-500 font-bold tracking-tighter uppercase">{user?.role}</span>
              </div>
              <button 
                onClick={() => navigate('/help')}
                className="text-slate-300 hover:text-white" 
                title="Help"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
              <button 
                onClick={handleLogout} 
                className="text-slate-300 hover:text-red-400 flex items-center space-x-1"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          <nav className="flex space-x-1 overflow-x-auto pb-2">
            {visibleMenu.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  location.pathname === item.id || location.pathname.startsWith(item.id + '/')
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      <footer className="bg-slate-100 border-t border-slate-200 mt-auto py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; 2026 AFSMS University System. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <button onClick={() => navigate('/privacy')} className="hover:text-blue-600 cursor-pointer transition-colors">Privacy / GDPR</button>
            <button onClick={() => navigate('/contact')} className="hover:text-blue-600 cursor-pointer transition-colors">Contact</button>
            <button onClick={() => navigate('/help')} className="hover:text-blue-600 cursor-pointer transition-colors">Help</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
