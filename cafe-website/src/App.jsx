// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import Home             from './pages/Home';
import Menu             from './pages/Menu';
import About            from './pages/About';
import Contact          from './pages/Contact';
import Blog             from './pages/Blog';
import Checkout         from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Reservation      from './pages/Reservation';
import Account          from './pages/Account';
import Login           from './pages/Login';
// 新增：导入 Wishlist 页面
import Wishlist         from './pages/Wishlist';
import OrderHistory from './pages/OrderHistory';

import './styles/main.css';

import { CartProvider }  from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import ProductDetail from './pages/ProductDetail';

import Register        from './pages/Register';
import ForgotPassword  from './pages/ForgotPassword';

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/"   element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/product/:productId"   element={<ProductDetail />} />
              <Route path="/reservation" element={<Reservation />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
              <Route path="/account" element={<Account />} />
              <Route path="/login"   element={<Login />} />
              {/* 新增 wishlist 路由 */}
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/order-history" element={<OrderHistory />} />
              <Route path="/register"             element={<Register />} />
              <Route path="/forgot-password"      element={<ForgotPassword />} />
            </Routes>
          </main>
          <footer className="footer">
            <p>© {new Date().getFullYear()} Urban Coffee. 保留所有权利</p>
          </footer>
        </div>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;