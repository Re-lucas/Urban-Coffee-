/* src/context/CartContext.jsx */
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import { useToast } from '@chakra-ui/react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const toast = useToast();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cartItems');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('解析 localStorage 中的 cartItems 失败：', e);
      return [];
    }
  });
  const [shippingAddress, setShippingAddress] = useState(() => {
    try {
      const stored = localStorage.getItem('shippingAddress');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error('解析收货地址失败：', e);
      return {};
    }
  });
  const [paymentMethod, setPaymentMethod] = useState(() => {
    try {
      return localStorage.getItem('paymentMethod') || '';
    } catch (e) {
      console.error('解析支付方式失败：', e);
      return '';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (e) {
      console.error('写入 cartItems 到 localStorage 出错：', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
    } catch (e) {
      console.error('写入收货地址到 localStorage 出错：', e);
    }
  }, [shippingAddress]);

  useEffect(() => {
    try {
      localStorage.setItem('paymentMethod', paymentMethod);
    } catch (e) {
      console.error('写入支付方式到 localStorage 出错：', e);
    }
  }, [paymentMethod]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product === product._id);
      if (existingItem) {
        return prevItems.map(item =>
          item.product === product._id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.countInStock) }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            countInStock: product.countInStock,
            quantity,
          },
        ];
      }
    });
    toast({
      title: '已添加到购物车',
      description: `${product.name} × ${quantity}`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.product !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product === productId
          ? { ...item, quantity: Math.min(quantity, item.countInStock) }
          : item
      )
    );
  };

  const saveShippingAddress = (address) => setShippingAddress(address);
  const savePaymentMethod = (method) => setPaymentMethod(method);
  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const itemsPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((itemsPrice * 0.1).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  const placeOrder = async () => {
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item.product,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };
      const { data } = await api.post('/orders', orderData);
      return data;
    } catch (error) {
      console.error('下单失败:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        shippingAddress,
        saveShippingAddress,
        paymentMethod,
        savePaymentMethod,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};