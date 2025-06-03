// src/pages/admin/UserDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useOrder } from '../../context/OrderContext';
import '../../styles/admin-userdetail.css';

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { users, updateProfile, addPoints, updatePreferences, updateNotifications } = useAdminAuth();
  const { orders } = useOrder();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const found = users.find((u) => u.id === userId);
    if (!found) {
      // 如果没找到该用户，就跳回用户列表
      navigate('/admin/users');
      return;
    }
    setUser(found);
  }, [userId, users]);

  if (!user) {
    return <p>正在加载用户信息……</p>;
  }

  // 从 orders 里筛选出该用户的订单
  const userOrders = orders.filter((o) => o.userId === user.id);

  return (
    <div className="admin-userdetail">
      <h2>用户详情 - {user.name}</h2>

      <section className="section-basic">
        <h3>基础信息</h3>
        <p>
          <strong>姓名：</strong> {user.name}
        </p>
        <p>
          <strong>邮箱：</strong> {user.email}
        </p>
        <p>
          <strong>加入时间：</strong> {new Date(user.joinDate).toLocaleString()}
        </p>
        <p>
          <strong>等级：</strong> {user.level}
        </p>
        <p>
          <strong>积分：</strong> {user.points}
        </p>
        <p>
          <strong>管理员权限：</strong> {user.isAdmin ? '是' : '否'}
        </p>
        <div style={{ marginTop: '0.8rem' }}>
          <Link to="/admin/users" className="btn back-btn">
            ← 返回用户列表
          </Link>
        </div>
      </section>

      <section className="section-address">
        <h3>收货地址</h3>
        {user.addresses && user.addresses.length > 0 ? (
          <ul>
            {user.addresses.map((addr) => (
              <li key={addr.id}>
                <p>{addr.name}，{addr.phone}</p>
                <p>{addr.street}, {addr.city}, {addr.postalCode}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>尚无地址</p>
        )}
      </section>

      <section className="section-preferences">
        <h3>口味偏好</h3>
        {user.preferences && user.preferences.length > 0 ? (
          <p>{user.preferences.join('，')}</p>
        ) : (
          <p>未设置偏好</p>
        )}
      </section>

      <section className="section-notifications">
        <h3>通知设置</h3>
        <p>
          订单状态提醒：{user.notifications.orderStatus ? '开启' : '关闭'}
        </p>
        <p>
          营销推广提醒：{user.notifications.marketing ? '开启' : '关闭'}
        </p>
      </section>

      <section className="section-orders">
        <h3>订单历史</h3>
        {userOrders.length === 0 ? (
          <p>该用户尚未下过订单</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>订单号</th>
                <th>下单时间</th>
                <th>状态</th>
                <th>总金额</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {userOrders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id.slice(0, 8)}</td>
                  <td>{new Date(o.createTime).toLocaleString()}</td>
                  <td>{o.status}</td>
                  <td>¥{(o.finalPrice ?? 0).toFixed(2)}</td>
                  <td>
                    <Link to={`/admin/orders?orderId=${o.id}`}>查看</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default UserDetail;