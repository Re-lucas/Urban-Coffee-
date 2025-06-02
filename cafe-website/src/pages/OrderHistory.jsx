// src/pages/OrderHistory.jsx
import React, { useEffect, useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { Link } from 'react-router-dom';
import '../styles/order-history.css';

const OrderHistory = () => {
  const { orders } = useOrder();
  const [myOrders, setMyOrders] = useState([]);

  useEffect(() => {
    setMyOrders(orders);
  }, [orders]);

  return (
    <div className="order-history-page">
      <h1>我的订单</h1>
      {myOrders.length === 0 ? (
        <p>您还没有下过任何订单，快去逛逛吧！</p>
      ) : (
        <div className="history-list">
          {myOrders.map((order) => (
            <div key={order.id} className="history-item">
              <div>
                <strong>订单号：</strong> {order.id}
              </div>
              <div>
                <strong>下单时间：</strong>{' '}
                {new Date(order.createTime).toLocaleString()}
              </div>
              <div>
                <strong>状态：</strong> {order.status}
              </div>
              <div>
                <strong>总金额：</strong> ¥{order.finalPrice.toFixed(2)}
              </div>
              <Link to={`/order-confirmation/${order.id}`} className="btn detail-btn">
                查看详情
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
