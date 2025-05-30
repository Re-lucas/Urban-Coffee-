// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // 修复导入名称
import Home from './pages/Home'; // 修复导入路径
import Menu from './pages/Menu'; // 修复导入路径
import About from './pages/About'; // 修复导入路径
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Checkout from './pages/Checkout'; // 导入Checkout组件
import OrderConfirmation from './pages/OrderConfirmation'; // 导入OrderConfirmation组件
import './styles/main.css';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/checkout" element={<Checkout />} />
            {/* 修复路径参数 */}
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Urban Coffee. 保留所有权利</p>
        </footer>
      </div>
    </CartProvider>
  );
}

export default App;