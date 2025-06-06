// src/context/OrderContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axiosConfig'; // 用来调用后端接口

const OrderContext = createContext();
export const useOrder = () => useContext(OrderContext);

export function OrderProvider({ children }) {
  // ── 1. “用户本地订单”状态（存到 localStorage） ─────────────────────
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
      id: Date.now().toString(),          // 简单用时间戳作 ID
      items,                              // 购物车商品列表
      totalPrice,                         // 总价
      shippingFee,                        // 运费
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

  // ── 2. “管理员获取所有订单”状态 ──────────────────────────────────
  const [allOrders, setAllOrders] = useState([]);

  // 从后端拉取所有订单（仅限管理员，需带 token）
  const fetchAllOrders = async () => {
    try {
      const { data } = await api.get('/orders'); // GET /api/orders
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
        // 两套订单逻辑都导出给子组件使用

        // —— 用户本地下单相关
        orders,           // 本地保存在 localStorage 的订单列表
        addOrder,         // 用户下单时调用
        getOrderById,     // 根据 ID 查询本地订单
        updateOrderStatus,// 更新某个本地订单的状态

        // —— 管理员查询所有订单相关
        allOrders,        // 后端拉回来的所有订单
        fetchAllOrders,   // 管理员在后台调用此方法去后端拉取订单
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}
