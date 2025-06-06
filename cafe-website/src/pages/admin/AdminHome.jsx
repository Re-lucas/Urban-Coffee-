// src/pages/admin/AdminHome.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import { Link } from 'react-router-dom';

const AdminHome = () => {
  const { allUsers, fetchAllUsers } = useAuth();
  const { allOrders, fetchAllOrders } = useOrder();
  const [loading, setLoading] = useState(true);

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchAllUsers();
      await fetchAllOrders();
      setLoading(false);
    };
    
    loadData();
  }, []);

  if (loading) {
    return <div>加载中...</div>;
  }

  // 统计数据
  const totalUsers = allUsers.length;
  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter(order => 
    order.status === '待发货' || 
    order.status === 'processing' // 根据你的实际状态字段调整
  ).length;

  return (
    <div>
      <h2>仪表板 / 数据概览</h2>
      <div style={{ marginTop: '1rem' }}>
        <p>注册用户总数：<strong>{totalUsers}</strong></p>
        <p>订单总数：<strong>{totalOrders}</strong></p>
        <p>待处理订单数：<strong>{pendingOrders}</strong></p>
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
