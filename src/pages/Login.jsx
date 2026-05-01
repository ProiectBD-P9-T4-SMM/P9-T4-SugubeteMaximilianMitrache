import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Use our central API instance
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [simulationType, setSimulationType] = useState('user'); // 'user' or 'role'
  const [roleSimulation, setRoleSimulation] = useState('STUDENT');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/mock-sso/users');
        setUsers(res.data);
        if (res.data.length > 0) setSelectedUserId(res.data[0].id);
      } catch (err) {
        console.error("Failed to fetch simulation users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleSSOLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Simulam logarea la UCV (Mock SSO)
      const payload = simulationType === 'user' 
        ? { user_id: selectedUserId } 
        : { role_simulation: roleSimulation };

      const ssoRes = await api.post('/mock-sso/login', payload);
      const ssoToken = ssoRes.data.ssoToken;

      // 2. Trimitem tokenul extern către AFSMS Exchange Gateway
      const afsmsRes = await api.post('/auth/exchange-token', { ssoToken });
      
      // 3. Salvăm sesiunea și intrăm în portal
      login(afsmsRes.data.token, afsmsRes.data.user);
      navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-indigo-100/50 rounded-full blur-3xl"></div>

      <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/20 z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 mb-6 transform -rotate-3 transition hover:rotate-0 duration-300">
            <span className="text-white text-3xl font-black">A</span>
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-900">
            AFSMS Portal
          </h1>
          <p className="text-slate-500 mt-2 font-medium">University Unified Authentication</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-8 text-sm flex items-center gap-3 animate-shake">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSSOLogin} className="space-y-6">
          <div className="bg-slate-100/50 p-1.5 rounded-2xl flex gap-1 mb-2">
            <button
              type="button"
              onClick={() => setSimulationType('user')}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl transition ${simulationType === 'user' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Real Users
            </button>
            <button
              type="button"
              onClick={() => setSimulationType('role')}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl transition ${simulationType === 'role' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Legacy Roles
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
              {simulationType === 'user' ? 'Select Identity from Registry' : 'Simulate Global Role'}
            </label>
            
            {simulationType === 'user' ? (
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl shadow-sm p-4 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition appearance-none"
                value={selectedUserId} 
                onChange={(e) => setSelectedUserId(e.target.value)}
                required
              >
                {users.length > 0 ? users.map(u => (
                  <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
                )) : (
                  <option value="">No users found</option>
                )}
              </select>
            ) : (
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl shadow-sm p-4 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition appearance-none"
                value={roleSimulation} 
                onChange={(e) => setRoleSimulation(e.target.value)}
              >
                <option value="STUDENT">Student Fictiv</option>
                <option value="PROFESSOR">Profesor</option>
                <option value="SECRETARIAT">Secretariat</option>
                <option value="ADMIN">Administrator IT</option>
              </select>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2 group`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Secure SSO Sign In</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-xs">
            Powered by <strong>UCV Identity Management</strong> &copy; 2026
          </p>
        </div>
      </div>
    </div>
  );
}
