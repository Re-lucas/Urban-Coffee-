// src/components/RequireAuth.jsx
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RequireAuth = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // 如果 AuthContext 中有 loading 标志，表示正在异步获取登录状态
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        验证中…
      </div>
    );
  }

  // 如果 user 不存在，说明未登录，就跳转到 /login，并把当前路径存在 state
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 已登录，直接渲染子组件
  return children;
};

export default RequireAuth;
