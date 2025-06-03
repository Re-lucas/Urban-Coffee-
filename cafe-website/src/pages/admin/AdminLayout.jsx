// src/pages/admin/AdminLayout.jsx
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin-layout.css';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
          {/* 你还可以加“系统设置”、“营销活动”、“数据报表”等更多菜单 */}
        </nav>
        <div className="sidebar-footer">
          <p>管理员：{user?.name || user?.email}</p>
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
