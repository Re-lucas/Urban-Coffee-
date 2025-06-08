// src/components/RequireAdmin.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RequireAdmin = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // 只判断 user 和权限，不管 loading
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!user.isAdmin) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>无管理员权限！</div>;
  }
  return children;
};

export default RequireAdmin;
