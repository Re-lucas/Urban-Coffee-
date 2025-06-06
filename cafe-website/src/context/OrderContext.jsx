// src/context/OrderContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axiosConfig'; // 用于调用后端接口

export const OrderContext = createContext();
export const useOrder = () => useContext(OrderContext);

export function OrderProvider({ children }) {
  // ── 1. “用户本地订单”状态（保存在 localStorage） ─────────────────────
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // 用户下单：新增一条本地订单
  const addOrder = ({ items, totalPrice, shippingFee }) => {
    const newOrder = {
      id: Date.now().toString(), // 时间戳作 ID
      items,                     // 购物车商品列表
      totalPrice,                // 总价
      shippingFee,               // 运费
      finalPrice: totalPrice + shippingFee,
      status: '待发货',
      createTime: new Date().toISOString(),
      trackingNumber: `UC${Date.now().toString().slice(-8)}`,
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder.id;
  };

  const getOrderById = (orderId) => {
    return orders.find((o) => o.id === orderId);
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };
  // ───────────────────────────────────────────────────────────────────

  // ── 2. “管理员拉取所有订单” —— 
  const [allOrders, setAllOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      // GET /api/orders 需要带上管理员的 JWT
      const { data } = await api.get('/orders');
      setAllOrders(data);
      return data;
    } catch (err) {
      console.error('获取订单列表失败：', err);
      return [];
    }
  };
  // ───────────────────────────────────────────────────────────────────

  return (
    <OrderContext.Provider
      value={{
        // —— 用户本地下单相关 —— 
        orders,
        addOrder,
        getOrderById,
        updateOrderStatus,

        // —— 管理员后台查询所有订单 —— 
        allOrders,
        fetchAllOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}
