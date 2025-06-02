// src/context/OrderContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const OrderContext = createContext();
export const useOrder = () => useContext(OrderContext);

export function OrderProvider({ children }) {
  // 从 localStorage 读取已有订单（如果没有，则为空数组）
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  // 当 orders 变化时写回 localStorage
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // addOrder：必须解构接收 totalPrice 和 shippingFee，并把它们写入 newOrder
  const addOrder = ({ items, totalPrice, shippingFee }) => {
    const newOrder = {
      id: uuidv4(),
      items,                                 // 购物车商品列表
      totalPrice,                            // 一定要赋值
      shippingFee,                           // 一定要赋值
      finalPrice: totalPrice + shippingFee,  // 最终支付金额
      status: '待发货',
      createTime: new Date().toISOString(),
      trackingNumber: `UC${Date.now().toString().slice(-8)}`,
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder.id;
  };

  const getOrderById = (orderId) => orders.find((o) => o.id === orderId);
  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, getOrderById, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
}
