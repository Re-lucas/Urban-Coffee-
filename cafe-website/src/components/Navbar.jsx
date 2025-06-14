// components/Navbar.jsx
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, Flex, Text, Button, IconButton, 
  useDisclosure, useBreakpointValue, 
  useColorMode, useColorModeValue 
} from '@chakra-ui/react';
import { FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi';
import { motion } from 'framer-motion';
import CartIcon from './CartIcon';
import { ThemeContext } from '../context/ThemeContext';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const { theme } = useContext(ThemeContext);
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  const bgColor = useColorModeValue('brand.500', 'coffee.800');
  const textColor = useColorModeValue('white', 'whiteAlpha.900');
  const hoverBg = useColorModeValue('brand.600', 'coffee.700');

  const navLinks = [
    { path: "/", label: "首页" },
    { path: "/menu", label: "菜单" },
    { path: "/reservation", label: "预约" },
    { path: "/about", label: "关于我们" },
    { path: "/contact", label: "联系方式" },
    { path: "/blog", label: "博客" },
    { path: "/account", label: "我的账户" },
    { path: "/wishlist", label: "心愿单" },
    { path: "/login", label: "登录" }
  ];

  return (
    <Box 
      as="nav" 
      position="sticky" 
      top="0" 
      zIndex="sticky"
      bg={bgColor}
      color={textColor}
      boxShadow="md"
    >
      <Flex
        maxW="1200px"
        mx="auto"
        px={{ base: 4, md: 6 }}
        py={3}
        align="center"
        justify="space-between"
      >
        {/* Logo */}
        <MotionBox
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Link to="/" onClick={() => isOpen && onToggle()}>
            <Text fontSize="xl" fontWeight="bold" fontFamily="heading">
              Urban Coffee
            </Text>
          </Link>
        </MotionBox>

        {/* 桌面导航链接 */}
        <Flex 
          display={{ base: 'none', md: 'flex' }} 
          align="center" 
          gap={6}
        >
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              onClick={() => isOpen && onToggle()}
            >
              <Text 
                fontWeight="medium"
                _hover={{ opacity: 0.8 }}
                transition="opacity 0.2s"
              >
                {link.label}
              </Text>
            </Link>
          ))}
        </Flex>

        {/* 右侧功能区 */}
        <Flex align="center" gap={4}>
          <CartIcon />
          
          {/* 主题切换按钮 */}
          <IconButton
            aria-label="Toggle theme"
            icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
            variant="ghost"
            color="current"
            fontSize="lg"
          />
          
          {/* 移动端菜单按钮 */}
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            aria-label="Toggle menu"
            icon={isOpen ? <FiX /> : <FiMenu />}
            onClick={onToggle}
            variant="ghost"
            color="current"
            fontSize="xl"
          />
        </Flex>
      </Flex>

      {/* 移动端菜单 */}
      <MotionBox
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isOpen ? 1 : 0,
          height: isOpen ? 'auto' : 0
        }}
        transition={{ duration: 0.3 }}
        overflow="hidden"
        display={{ md: 'none' }}
        bg={hoverBg}
      >
        <Flex 
          direction="column" 
          px={4} 
          py={2}
          gap={2}
        >
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              onClick={onToggle}
            >
              <Box 
                py={3}
                px={2}
                borderRadius="md"
                _hover={{ bg: 'rgba(255,255,255,0.1)' }}
              >
                <Text>{link.label}</Text>
              </Box>
            </Link>
          ))}
        </Flex>
      </MotionBox>
    </Box>
  );
};

export default Navbar;