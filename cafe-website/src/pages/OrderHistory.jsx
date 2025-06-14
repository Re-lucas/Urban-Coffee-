// src/pages/OrderHistory.jsx
import React, { useEffect, useState, useContext } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Stack, 
  HStack, 
  VStack, 
  Divider, 
  Button, 
  Badge, 
  Container,
  useToast,
  Spinner,
  Link as ChakraLink
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiClock, FiDollarSign, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axiosConfig';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const OrderHistory = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.700');
  const accentColor = useColorModeValue('brand.500', 'brand.300');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/orders/myorders');
        setOrders(response.data);
      } catch (err) {
        toast({
          title: '获取订单失败',
          description: err.response?.data.message || '请稍后重试',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, toast]);

  const getStatusColorScheme = (status) => {
    switch (status) {
      case '已完成': return 'green';
      case '已取消': return 'red';
      case '已发货': return 'blue';
      default: return 'gray';
    }
  };

  if (!user) {
    return (
      <Container maxW="6xl" py={12} textAlign="center">
        <Heading as="h1" size="xl" mb={6}>
          我的订单
        </Heading>
        <Text fontSize="lg" mb={4}>
          请先登录后查看订单历史
        </Text>
        <Button 
          as={Link} 
          to="/login" 
          colorScheme="brand"
          size="lg"
        >
          前往登录
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={8}>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Heading as="h1" size="xl" mb={8} display="flex" alignItems="center">
          <FiShoppingBag style={{ marginRight: '12px' }} />
          我的订单
        </Heading>

        {loading ? (
          <Stack align="center" py={20}>
            <Spinner size="xl" color={accentColor} />
            <Text mt={4}>加载中...</Text>
          </Stack>
        ) : orders.length === 0 ? (
          <Stack align="center" py={12} spacing={6}>
            <Box color="gray.400" fontSize="6xl">
              <FiShoppingBag />
            </Box>
            <Text fontSize="xl">您还没有下过任何订单</Text>
            <Button 
              as={Link} 
              to="/menu" 
              colorScheme="brand"
              size="lg"
              rightIcon={<FiArrowRight />}
            >
              去菜单看看
            </Button>
          </Stack>
        ) : (
          <Stack spacing={6}>
            {orders.map((order, index) => {
              const safeTotal = order.total ? order.total.toFixed(2) : '0.00';
              
              return (
                <MotionBox
                  key={order._id}
                  bg={cardBg}
                  p={6}
                  borderRadius="md"
                  boxShadow="md"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ shadow: 'lg' }}
                >
                  <Stack spacing={4}>
                    <HStack justify="space-between" wrap="wrap">
                      <VStack align="flex-start" spacing={1}>
                        <Text fontSize="sm" color="gray.500">
                          订单号: {order._id}
                        </Text>
                        <Badge 
                          colorScheme={getStatusColorScheme(order.status)}
                          fontSize="sm"
                          px={2}
                          py={1}
                        >
                          {order.status}
                        </Badge>
                      </VStack>
                      
                      <Text fontSize="xl" fontWeight="bold" color={accentColor}>
                        ${safeTotal}
                      </Text>
                    </HStack>

                    <Divider />

                    <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={4}>
                      <HStack>
                        <FiClock size={18} color={useColorModeValue('gray.500', 'gray.400')} />
                        <VStack align="flex-start" spacing={0}>
                          <Text fontSize="sm" color="gray.500">下单时间</Text>
                          <Text fontSize="sm">{new Date(order.createdAt).toLocaleString()}</Text>
                        </VStack>
                      </HStack>

                      <HStack>
                        <FiDollarSign size={18} color={useColorModeValue('gray.500', 'gray.400')} />
                        <VStack align="flex-start" spacing={0}>
                          <Text fontSize="sm" color="gray.500">支付方式</Text>
                          <Text fontSize="sm">{order.paymentMethod}</Text>
                        </VStack>
                      </HStack>

                      <HStack>
                        <FiCheckCircle size={18} color={useColorModeValue('gray.500', 'gray.400')} />
                        <VStack align="flex-start" spacing={0}>
                          <Text fontSize="sm" color="gray.500">支付状态</Text>
                          {order.isPaid ? (
                            <Badge colorScheme="green" fontSize="sm" px={2} py={0.5}>
                              已支付
                            </Badge>
                          ) : (
                            <Badge colorScheme="red" fontSize="sm" px={2} py={0.5}>
                              未支付
                            </Badge>
                          )}
                        </VStack>
                      </HStack>

                      <Box alignSelf="center" justifySelf={{ base: 'start', sm: 'end' }}>
                        <Button
                          as={Link}
                          to={`/order/${order._id}`}
                          size="sm"
                          variant="outline"
                          colorScheme="brand"
                          rightIcon={<FiArrowRight />}
                        >
                          查看详情
                        </Button>
                      </Box>
                    </Grid>
                  </Stack>
                </MotionBox>
              );
            })}
          </Stack>
        )}
      </MotionBox>
    </Container>
  );
};

export default OrderHistory;