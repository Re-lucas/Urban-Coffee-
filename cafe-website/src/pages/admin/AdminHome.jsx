import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Link as ChakraLink,
  Spinner,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue
} from '@chakra-ui/react';
import { FiUsers, FiShoppingBag, FiTruck } from 'react-icons/fi';

const AdminHome = () => {
  const { allUsers, fetchAllUsers } = useAuth();
  const { allOrders, fetchAllOrders } = useOrder();
  const [loading, setLoading] = useState(true);
  const cardBg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchAllUsers(), fetchAllOrders()]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchAllUsers, fetchAllOrders]);

  const totalUsers = Array.isArray(allUsers) ? allUsers.length : 0;
  const totalOrders = Array.isArray(allOrders) ? allOrders.length : 0;
  const pendingOrders = Array.isArray(allOrders)
    ? allOrders.filter((o) => o.status === '待发货').length
    : 0;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={12}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box>
      <Heading as="h2" size="xl" mb={8}>
        仪表板 / 数据概览
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
        <Stat bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
          <StatLabel display="flex" alignItems="center">
            <FiUsers style={{ marginRight: '8px' }} />
            注册用户总数
          </StatLabel>
          <StatNumber>{totalUsers}</StatNumber>
          <StatHelpText>所有注册用户数量</StatHelpText>
        </Stat>

        <Stat bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
          <StatLabel display="flex" alignItems="center">
            <FiShoppingBag style={{ marginRight: '8px' }} />
            订单总数
          </StatLabel>
          <StatNumber>{totalOrders}</StatNumber>
          <StatHelpText>历史订单总数</StatHelpText>
        </Stat>

        <Stat bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
          <StatLabel display="flex" alignItems="center">
            <FiTruck style={{ marginRight: '8px' }} />
            待发货订单
          </StatLabel>
          <StatNumber color="orange.500">{pendingOrders}</StatNumber>
          <StatHelpText>需要处理的订单</StatHelpText>
        </Stat>
      </SimpleGrid>

      <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
        <Heading size="md" mb={4}>
          快速链接
        </Heading>
        <Stack spacing={3}>
          <ChakraLink as={Link} to="/admin/users" color="blue.500">
            查看所有用户
          </ChakraLink>
          <ChakraLink as={Link} to="/admin/products" color="blue.500">
            查看所有商品
          </ChakraLink>
          <ChakraLink as={Link} to="/admin/orders" color="blue.500">
            查看所有订单
          </ChakraLink>
        </Stack>
      </Box>
    </Box>
  );
};

export default AdminHome;