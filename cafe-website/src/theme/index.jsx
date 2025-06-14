// 优化后的 ThemeContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorMode } from '@chakra-ui/react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const { colorMode, toggleColorMode } = useColorMode();
  
  // 同步 Chakra UI 的 colorMode 与本地 theme
  const [theme, setTheme] = useState(colorMode);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 统一切换函数
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    toggleColorMode(); // 同时切换 Chakra UI 的主题
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 自定义 hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};