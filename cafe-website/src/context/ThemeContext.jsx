/* src/context/ThemeContext.jsx */
import React, { createContext, useEffect } from 'react';
import { useColorMode } from '@chakra-ui/react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    localStorage.setItem('theme', colorMode);
  }, [colorMode]);

  return (
    <ThemeContext.Provider value={{ theme: colorMode, toggleTheme: toggleColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
}