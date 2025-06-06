// context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axiosConfig'; // 导入 API 实例

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // 从 localStorage 初始化购物车
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cartItems');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('解析 localStorage 中的 cartItems 失败：', e);
      return [];
    }
  });
  
  // 收货地址
  const [shippingAddress, setShippingAddress] = useState(() => {
    try {
      const stored = localStorage.getItem('shippingAddress');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error('解析收货地址失败：', e);
      return {};
    }
  });
  
  // 支付方式
  const [paymentMethod, setPaymentMethod] = useState(() => {
    try {
      return localStorage.getItem('paymentMethod') || '';
    } catch (e) {
      console.error('解析支付方式失败：', e);
      return '';
    }
  });
  
  // 当 cartItems 变化时，同步更新到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (e) {
      console.error('写入 cartItems 到 localStorage 出错：', e);
    }
  }, [cartItems]);
  
  // 保存收货地址到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
    } catch (e) {
      console.error('写入收货地址到 localStorage 出错：', e);
    }
  }, [shippingAddress]);
  
  // 保存支付方式到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem('paymentMethod', paymentMethod);
    } catch (e) {
      console.error('写入支付方式到 localStorage 出错：', e);
    }
  }, [paymentMethod]);

  // 添加商品到购物车
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      // 检查是否已存在该商品
      const existingItem = prevItems.find(item => item.product === product._id);
      
      if (existingItem) {
        // 更新现有商品的数量
        return prevItems.map(item => 
          item.product === product._id 
            ? { 
                ...item, 
                quantity: Math.min(item.quantity + quantity, product.countInStock)
              } 
            : item
        );
      } else {
        // 添加新商品
        return [
          ...prevItems, 
          { 
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            countInStock: product.countInStock,
            quantity
          }
        ];
      }
    });
  };

  // 从购物车移除商品
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.product !== productId));
  };

  // 更新商品数量
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.product === productId 
          ? { 
              ...item, 
              quantity: Math.min(quantity, item.countInStock)
            } 
          : item
      )
    );
  };

  // 保存收货地址
  const saveShippingAddress = (address) => {
    setShippingAddress(address);
  };

  // 保存支付方式
  const savePaymentMethod = (method) => {
    setPaymentMethod(method);
  };

  // 清空购物车
  const clearCart = () => {
    setCartItems([]);
  };

  // 计算总商品数
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  // 计算商品小计
  const itemsPrice = cartItems.reduce(
    (total, item) => total + (item.price * item.quantity), 
    0
  );
  
  // 计算运费（满100免运费，否则10元）
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  
  // 计算税费（假设10%）
  const taxPrice = Number((itemsPrice * 0.1).toFixed(2));
  
  // 计算总价
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  // 下单函数
  const placeOrder = async () => {
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item.product,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
      };
      
      const { data } = await api.post('/orders', orderData);
      return data; // 返回创建的订单数据
    } catch (error) {
      console.error('下单失败:', error);
      throw error; // 抛出错误供调用者处理
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
        placeOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};