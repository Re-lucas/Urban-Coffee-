// src/pages/admin/AdminHome.jsx
import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import { Link } from 'react-router-dom';

const AdminHome = () => {
  // 从 AuthContext 获取所有用户列表 + 拉取方法
  const { allUsers, fetchAllUsers } = useAuth();
  // 从 OrderContext 获取所有订单列表 + 拉取方法
  const { allOrders, fetchAllOrders } = useOrder();

  // 组件挂载时同时拉取“所有用户”和“所有订单”
  useEffect(() => {
    fetchAllUsers();
    fetchAllOrders();
  }, []);

  // 防御性判断，确保 allUsers 和 allOrders 始终是数组
  const totalUsers = Array.isArray(allUsers) ? allUsers.length : 0;
  const totalOrders = Array.isArray(allOrders) ? allOrders.length : 0;
  const pendingOrders = Array.isArray(allOrders)
    ? allOrders.filter((o) => o.status === '待发货').length
    : 0;

  return (
    <div>
      <h2>仪表板 / 数据概览</h2>
      <div style={{ marginTop: '1rem' }}>
        <p>注册用户总数：<strong>{totalUsers}</strong></p>
        <p>订单总数：<strong>{totalOrders}</strong></p>
        <p>待发货订单数：<strong>{pendingOrders}</strong></p>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <p>快速链接：</p>
        <ul>
          <li><Link to="/admin/users">查看所有用户</Link></li>
          <li><Link to="/admin/products">查看所有商品</Link></li>
          <li><Link to="/admin/orders">查看所有订单</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default AdminHome;
