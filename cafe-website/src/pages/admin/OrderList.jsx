// src/pages/admin/OrderList.jsx
import React, { useState, useMemo } from 'react';
import { useOrder } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin-orderlist.css';

const OrderList = () => {
  const { orders, updateOrderStatus } = useOrder();
  const { users } = useAuth();
  const [searchText, setSearchText] = useState('');

  // 过滤订单：可以按订单号、用户邮箱或用户名搜索
  const filtered = useMemo(() => {
    if (!searchText.trim()) return orders;
    return orders.filter((o) => {
      const user = users.find((u) => u.id === o.userId);
      const username = user ? user.name : '';
      const useremail = user ? user.email : '';
      return (
        o.id.includes(searchText.trim()) ||
        username.toLowerCase().includes(searchText.toLowerCase()) ||
        useremail.toLowerCase().includes(searchText.toLowerCase())
      );
    });
  }, [searchText, orders, users]);

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="admin-orderlist">
      <h2>订单管理</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="搜索 订单号 或 用户名称/邮箱"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>订单号</th>
            <th>用户</th>
            <th>下单时间</th>
            <th>状态</th>
            <th>总金额</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                无匹配订单
              </td>
            </tr>
          ) : (
            filtered.map((o) => {
              const user = users.find((u) => u.id === o.userId);
              return (
                <tr key={o.id}>
                  <td>{o.id.slice(0, 8)}</td>
                  <td>{user ? user.name : '未知用户'}</td>
                  <td>{new Date(o.createTime).toLocaleString()}</td>
                  <td>
                    <select
                      value={o.status}
                      onChange={(e) =>
                        handleStatusChange(o.id, e.target.value)
                      }
                    >
                      <option value="待发货">待发货</option>
                      <option value="已发货">已发货</option>
                      <option value="已完成">已完成</option>
                    </select>
                  </td>
                  <td>¥{(o.finalPrice ?? 0).toFixed(2)}</td>
                  <td>—</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
