import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('afsms_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Configurăm Axios să trimită token-ul automat la fiecare request
  axios.defaults.baseURL = 'http://localhost:3000/api';
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  // La încărcarea paginii, dacă avem token, îl decodăm (în producție faci un request la /api/auth/me)
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.userId, role: payload.role });
      } catch (e) {
        logout();
      }
    }
    setIsLoading(false);
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem('afsms_token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('afsms_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
