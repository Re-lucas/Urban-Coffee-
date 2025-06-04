// components/Navbar.jsx
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import CartIcon from './CartIcon';
import styles from './Navbar.module.css'; // 引入 CSS Module

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo} onClick={() => setIsMenuOpen(false)}>
          Urban Coffee
        </Link>

        <div className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>首页</Link>
          <Link to="/menu" onClick={() => setIsMenuOpen(false)}>菜单</Link>
          <Link to="/reservation" onClick={() => setIsMenuOpen(false)}>预约</Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)}>关于我们</Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)}>联系方式</Link>
          <Link to="/blog" onClick={() => setIsMenuOpen(false)}>博客</Link>
          <Link to="/account" onClick={() => setIsMenuOpen(false)}>我的账户</Link>
          {/* 新增心愿单链接 */}
          <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>心愿单</Link>
          <Link to="/login" onClick={() => setIsMenuOpen(false)}>登录</Link>

          {/* 移动端显示的主题切换按钮 */}
          <button
            onClick={() => {
              toggleTheme();
              setIsMenuOpen(false);
            }}
            className={styles['themeToggle']}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        <div className={styles.navRight}>
          <CartIcon />
          {/* 桌面端显示的主题切换按钮 */}
          <button
            onClick={toggleTheme}
            className={styles['themeToggle']}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <div className={styles.mobileToggle} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;