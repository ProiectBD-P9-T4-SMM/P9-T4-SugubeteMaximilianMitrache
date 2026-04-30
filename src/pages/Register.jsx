import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', fullName: '' });
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Create Account</h1>
        <form onSubmit={async (e) => {
          e.preventDefault();
          setStatus({ loading: true });
          try {
            await authService.register(formData);
            setStatus({ success: true, message: 'Account created! Please log in.' });
            setTimeout(() => navigate('/login'), 2000);
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
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
