// src/pages/admin/AdminHome.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import { Link } from 'react-router-dom';

const AdminHome = () => {
  const { users } = useAuth();
  const { orders } = useOrder();

  // 例如：统计用户数、订单数、待发货订单数
  const totalUsers = users.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === '待发货').length;

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
