import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, RoleRoute } from './components/AuthRoutes';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import PublicPortal from './pages/PublicPortal';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import AddGrades from './pages/AddGrades';
import Disciplines from './pages/Disciplines';
import Centralizer from './pages/Centralizer';
import GradesList from './pages/GradesList';
import Documents from './pages/Documents';
import AuditLogs from './pages/AuditLogs';
import MyGrades from './pages/MyGrades';
import UserGroups from './pages/UserGroups';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import Help from './pages/Help';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/public" element={<PublicPortal />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Protected Routes inside Layout */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            
            <Route 
              path="/my-grades" 
              element={<RoleRoute allowed={['STUDENT']}><MyGrades /></RoleRoute>} 
            />
            
            <Route 
              path="/students" 
              element={<RoleRoute allowed={['PROFESSOR', 'SECRETARIAT', 'ADMIN']}><Students /></RoleRoute>} 
            />
            
            <Route 
              path="/disciplines" 
              element={<RoleRoute allowed={['ADMIN', 'SECRETARIAT']}><Disciplines /></RoleRoute>} 
            />
            
            <Route 
              path="/grades/add" 
              element={<RoleRoute allowed={['PROFESSOR', 'ADMIN']}><AddGrades /></RoleRoute>} 
            />
            
            <Route 
              path="/grades/list" 
              element={<RoleRoute allowed={['PROFESSOR', 'ADMIN', 'SECRETARIAT']}><GradesList /></RoleRoute>} 
            />
            
            <Route 
              path="/centralizer" 
              element={<RoleRoute allowed={['SECRETARIAT', 'ADMIN']}><Centralizer /></RoleRoute>} 
            />
            
            <Route 
              path="/documents" 
              element={<Documents />} // Documents route handles its own logic, or we can enforce roles here
            />
            
            <Route 
              path="/groups" 
              element={<RoleRoute allowed={['SECRETARIAT', 'ADMIN']}><UserGroups /></RoleRoute>} 
            />
            
            <Route 
              path="/audit" 
              element={<RoleRoute allowed={['ADMIN']}><AuditLogs /></RoleRoute>} 
            />

            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    </AuthProvider>
  );
}
