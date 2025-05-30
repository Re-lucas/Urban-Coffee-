// components/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import '../styles/navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">Urban Coffee</Link>
        
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>首页</Link>
          <Link to="/menu" onClick={() => setIsMenuOpen(false)}>菜单</Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)}>关于我们</Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)}>联系方式</Link>
          <Link to="/blog" onClick={() => setIsMenuOpen(false)}>博客</Link>
        </div>
        
        <div className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;