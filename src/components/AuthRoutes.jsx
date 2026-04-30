import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="flex h-screen items-center justify-center">Se încarcă sesiunea...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children ? children : <Outlet />;
};

export const RoleRoute = ({ allowed, children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="flex h-screen items-center justify-center">Se încarcă sesiunea...</div>;
  if (!user || !allowed.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children ? children : <Outlet />;
};
