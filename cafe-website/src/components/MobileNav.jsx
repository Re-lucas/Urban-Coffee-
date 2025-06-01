// components/MobileNav.jsx (新建)
import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiCoffee, FiCalendar, FiShoppingCart, FiUser } from 'react-icons/fi';
import '../styles/mobile-nav.css';

const MobileNav = () => {
  return (
    <div className="mobile-bottom-nav">
      <Link to="/" className="nav-icon">
        <FiHome size={20} />
        <span>首页</span>
      </Link>
      <Link to="/menu" className="nav-icon">
        <FiCoffee size={20} />
        <span>菜单</span>
      </Link>
      <Link to="/reservation" className="nav-icon">
        <FiCalendar size={20} />
        <span>预约</span>
      </Link>
      <Link to="/cart" className="nav-icon">
        <FiShoppingCart size={20} />
        <span>购物车</span>
      </Link>
      <Link to="/account" className="nav-icon">
        <FiUser size={20} />
        <span>我的</span>
      </Link>
    </div>
  );
};

export default MobileNav;