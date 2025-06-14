/* src/context/OrderContext.jsx */
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import { useToast } from '@chakra-ui/react';

export const OrderContext = createContext();
export const useOrder = () => useContext(OrderContext);

export function OrderProvider({ children }) {
  const toast = useToast();
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = ({ items, totalPrice, shippingFee }) => {
    const newOrder = {
      id: Date.now().toString(),
      items,
      totalPrice,
      shippingFee,
      finalPrice: totalPrice + shippingFee,
      status: '待发货',
      createTime: new Date().toISOString(),
      trackingNumber: `UC${Date.now().toString().slice(-8)}`,
    };
    setOrders(prev => [newOrder, ...prev]);
    toast({
      title: '订单创建成功',
      description: `订单号: ${newOrder.id}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    return newOrder.id;
  };

  const getOrderById = orderId => orders.find(o => o.id === orderId);
  const updateOrderStatus = (orderId, status) => setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status } : o)));
  const [allOrders, setAllOrders] = useState([]);
  const fetchAllOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setAllOrders(data);
      return data;
    } catch (err) {
      console.error('获取订单列表失败：', err);
      return [];
    }
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, getOrderById, updateOrderStatus, allOrders, fetchAllOrders }}>
      {children}
    </OrderContext.Provider>
  );
}