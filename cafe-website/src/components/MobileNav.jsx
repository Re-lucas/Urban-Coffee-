// components/MobileNav.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, Flex, Text, Icon 
} from '@chakra-ui/react';
import { 
  FiHome, FiCoffee, FiCalendar, 
  FiShoppingCart, FiUser 
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const MobileNav = () => {
  const navItems = [
    { path: "/", icon: FiHome, label: "首页" },
    { path: "/menu", icon: FiCoffee, label: "菜单" },
    { path: "/reservation", icon: FiCalendar, label: "预约" },
    { path: "/cart", icon: FiShoppingCart, label: "购物车" },
    { path: "/account", icon: FiUser, label: "我的" }
  ];

  return (
    <MotionBox
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      zIndex="sticky"
      bg="white"
      boxShadow="0 -2px 10px rgba(0, 0, 0, 0.1)"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Flex justify="space-around" p={2}>
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Flex 
              direction="column" 
              align="center" 
              p={2}
              color="gray.600"
              _hover={{ color: 'brand.500' }}
              transition="color 0.2s"
            >
              <Icon as={item.icon} boxSize={5} />
              <Text fontSize="xs" mt={1}>{item.label}</Text>
            </Flex>
          </Link>
        ))}
      </Flex>
    </MotionBox>
  );
};

export default MobileNav;