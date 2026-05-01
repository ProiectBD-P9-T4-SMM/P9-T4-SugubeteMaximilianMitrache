import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [roleSimulation, setRoleSimulation] = useState('STUDENT');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSSOLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Simulam logarea la UCV (Mock SSO)
      const ssoRes = await axios.post('/mock-sso/login', { role_simulation: roleSimulation });
      const ssoToken = ssoRes.data.ssoToken;

      // 2. Trimitem tokenul extern către AFSMS Exchange Gateway
      const afsmsRes = await axios.post('/auth/exchange-token', { ssoToken });
      
      // 3. Salvăm sesiunea și intrăm în portal
      login(afsmsRes.data.token, afsmsRes.data.user);
      navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'Eroare la autentificarea SSO.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold text-blue-800 mb-2">AFSMS Login</h1>
        <p className="text-gray-500 mb-6">Autentificare prin SSO Universitate</p>
        
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSSOLogin}>
          <label className="block text-left text-sm font-medium text-gray-700 mb-2">
            Simulează identitatea (SSO Mock):
          </label>
          <select 
            className="w-full border-gray-300 rounded-md shadow-sm p-2 mb-4"
            value={roleSimulation} 
            onChange={(e) => setRoleSimulation(e.target.value)}
          >
            <option value="STUDENT">Student Fictiv</option>
            <option value="PROFESSOR">Profesor</option>
            <option value="SECRETARIAT">Secretariat</option>
            <option value="ADMIN">Administrator IT</option>
          </select>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Conectare Secure SSO
          </button>
        </form>
      </div>
    </div>
  );
}
