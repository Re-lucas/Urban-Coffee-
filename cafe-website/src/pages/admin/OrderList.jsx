// src/pages/admin/OrderList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/axiosConfig';
import '../../styles/admin-orderlist.css';

const OrderList = () => {
  const { user } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 获取订单列表（只要能进来就是管理员了）
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/orders');
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || '获取订单列表失败');
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // 处理订单发货
  const handleDeliver = async (orderId) => {
    if (window.confirm('确认将此订单标记为已发货？')) {
      try {
        setLoading(true);
        await api.put(`/orders/${orderId}/deliver`);
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, isDelivered: true } : order
        ));
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || '标记发货失败');
        setLoading(false);
      }
    }
  };

  // 过滤订单
  const filteredOrders = orders.filter(order => {
    if (!searchText.trim()) return true;
    const searchLower = searchText.toLowerCase();
    return (
      order._id.toLowerCase().includes(searchLower) ||
      (order.user?.name && order.user.name.toLowerCase().includes(searchLower)) ||
      (order.user?.email && order.user.email.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="admin-orderlist">
      <h2>订单管理</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="搜索订单号、用户姓名或邮箱"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      {loading && <div className="loading">加载中...</div>}
      {error && <div className="error">{error}</div>}

      <table>
        <thead>
          <tr>
            <th>订单号</th>
            <th>用户</th>
            <th>下单时间</th>
            <th>总金额</th>
            <th>支付状态</th>
            <th>发货状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>
                {loading ? '加载中...' : '无匹配订单'}
              </td>
            </tr>
          ) : (
            filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.slice(0, 8)}...</td>
                <td>
                  {order.user?.name || '未知用户'}
                  {order.user?.email && <div className="user-email">{order.user.email}</div>}
                </td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>¥{order.totalPrice.toFixed(2)}</td>
                <td>
                  <span className={order.isPaid ? 'status-paid' : 'status-unpaid'}>
                    {order.isPaid ? '已支付' : '未支付'}
                  </span>
                </td>
                <td>
                  <span className={order.isDelivered ? 'status-delivered' : 'status-undelivered'}>
                    {order.isDelivered ? '已发货' : '待发货'}
                  </span>
                </td>
                <td className="actions">
                  <Link to={`/admin/orders/${order._id}`} className="btn-detail">
                    详情
                  </Link>
                  {!order.isDelivered && (
                    <button 
                      onClick={() => handleDeliver(order._id)} 
                      className="btn-deliver"
                    >
                      标记发货
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
