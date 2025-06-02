/* src/context/OrderContext.jsx */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // 生成订单 ID

// 1. 创建 Context
const OrderContext = createContext();
export const useOrder = () => useContext(OrderContext);

export function OrderProvider({ children }) {
  // 2. 从 localStorage 读取已有订单记录
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  // 3. 当 orders 改变时，写回 localStorage
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // 4. addOrder: 在结算后调用，创建一条新的订单记录
  //    订单内容包括： id、items 数组、totalPrice、shippingFee、status、createTime、trackingNumber 等
  const addOrder = ({ items, totalPrice, shippingFee }) => {
    const newOrder = {
      id: uuidv4(),
      items,             // 格式：[{ id, name, price, quantity, … }, …]
      totalPrice,        // 商品总价（不含运费）
      shippingFee,       // 运费
      finalPrice: totalPrice + shippingFee,
      status: '待发货',  // 初始状态：可模拟流程“待发货→已发货→已完成”
      createTime: new Date().toISOString(),
      trackingNumber: `UC${Date.now().toString().slice(-8)}`, // 模拟快递单号
    };
    setOrders((prev) => [newOrder, ...prev]); // 新单插到最前面
    return newOrder.id;
  };

  // 5. updateOrderStatus: 模拟“发货”和“完成”，更新某笔订单的 status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // 6. getOrderById: 查询单笔订单详情
  const getOrderById = (orderId) => {
    return orders.find((order) => order.id === orderId);
  };

  return (
    <OrderContext.Provider
      value={{ orders, addOrder, updateOrderStatus, getOrderById }}
    >
      {children}
    </OrderContext.Provider>
  );
}
