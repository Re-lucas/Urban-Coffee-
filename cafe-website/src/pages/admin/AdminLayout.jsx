// src/pages/admin/AdminLayout.jsx
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import '../../styles/admin-layout.css';

const AdminLayout = () => {
  const { logoutAdmin, adminUser } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <div className="admin-container">
      {/* 左侧侧边栏 */}
      <aside className="admin-sidebar">
        <h2 className="sidebar-title">管理后台</h2>
        <nav>
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'active' : '')}>
            仪表盘
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => (isActive ? 'active' : '')}>
            用户管理
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => (isActive ? 'active' : '')}>
            商品管理
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? 'active' : '')}>
            订单管理
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <p>管理员：{adminUser?.email}</p>
          <button className="btn logout-btn" onClick={handleLogout}>
            注销
          </button>
        </div>
      </aside>

      {/* 右侧内容区，通过 <Outlet /> 渲染子路由 */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;