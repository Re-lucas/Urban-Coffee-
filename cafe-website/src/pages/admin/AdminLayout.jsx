import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Flex,
  Box,
  VStack,
  Heading,
  Link,
  Button,
  Text,
  useColorModeValue,
  IconButton
} from '@chakra-ui/react';
import { FiLogOut, FiHome, FiUsers, FiCoffee, FiShoppingBag } from 'react-icons/fi';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const sidebarBg = useColorModeValue('gray.50', 'gray.800');
  const activeBg = useColorModeValue('brand.100', 'brand.900');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLink = ({ to, icon, children }) => (
    <Link
      as={Link}
      to={to}
      w="full"
      p={3}
      borderRadius="md"
      _hover={{ bg: 'brand.50' }}
      _activeLink={{ bg: activeBg, color: 'brand.600', fontWeight: 'semibold' }}
      display="flex"
      alignItems="center"
    >
      <Box mr={2}>{icon}</Box>
      {children}
    </Link>
  );

  return (
    <Flex minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <Box
        w={{ base: 'full', md: '240px' }}
        bg={sidebarBg}
        borderRightWidth="1px"
        p={4}
        position={{ base: 'static', md: 'fixed' }}
        h={{ base: 'auto', md: '100vh' }}
      >
        <VStack align="stretch" spacing={6}>
          <Heading size="lg" mb={6} px={2}>
            管理后台
          </Heading>

          <VStack align="stretch" spacing={1}>
            <NavLink to="/admin" icon={<FiHome />}>
              仪表盘
            </NavLink>
            <NavLink to="/admin/users" icon={<FiUsers />}>
              用户管理
            </NavLink>
            <NavLink to="/admin/products" icon={<FiCoffee />}>
              商品管理
            </NavLink>
            <NavLink to="/admin/orders" icon={<FiShoppingBag />}>
              订单管理
            </NavLink>
          </VStack>

          <Box mt="auto" pt={4} borderTopWidth="1px">
            <Text fontSize="sm" mb={2} px={2}>
              管理员: {user?.email}
            </Text>
            <Button
              leftIcon={<FiLogOut />}
              onClick={handleLogout}
              size="sm"
              w="full"
              variant="outline"
              colorScheme="red"
            >
              注销
            </Button>
          </Box>
        </VStack>
      </Box>

      <Box
        flex={1}
        ml={{ base: 0, md: '240px' }}
        p={{ base: 4, md: 8 }}
        minH="100vh"
      >
        <Outlet />
      </Box>
    </Flex>
  );
};

export default AdminLayout;