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
// 新增：
import Reservation      from './pages/Reservation';
import Account          from './pages/Account';
// 如果日后需要 Admin 页面，也可以在此处 import：
// import Admin       from './pages/Admin';

import './styles/main.css';

import { CartProvider }  from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

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
              <Route path="/reservation" element={<Reservation />} />     {/* 新增 */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
              <Route path="/account" element={<Account />} />            {/* 新增 */}
              {/* 如果还要加 Admin 页面，就再写一行：
                  <Route path="/admin" element={<Admin />} /> 
              */}
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
