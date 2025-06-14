// src/pages/OrderDetail.jsx
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
  Grid,
  GridItem,
  Link as ChakraLink
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCreditCard, FiCheckCircle, FiTruck } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axiosConfig';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.700');
  const accentColor = useColorModeValue('brand.500', 'brand.300');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (err) {
        toast({
          title: '获取订单详情失败',
          description: err.response?.data.message || '请稍后重试',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      navigate('/login');
    } else {
      fetchOrder();
    }
  }, [id, user, navigate, toast]);

  const handlePayNow = () => {
    navigate(`/payment/${id}`);
  };

  if (!user) {
    return null;
  }

  const getStatusColorScheme = (status) => {
    switch (status) {
      case '已完成': return 'green';
      case '已取消': return 'red';
      case '已发货': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <Container maxW="6xl" py={8}>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ChakraLink 
          as={Link} 
          to="/order-history" 
          display="flex" 
          alignItems="center" 
          mb={6}
          color={accentColor}
        >
          <FiArrowLeft /> 
          <Text ml={2}>返回订单历史</Text>
        </ChakraLink>

        <Heading as="h1" size="xl" mb={8}>
          订单详情
        </Heading>

        {loading ? (
          <Stack align="center" py={20}>
            <Spinner size="xl" color={accentColor} />
            <Text mt={4}>加载中...</Text>
          </Stack>
        ) : order ? (
          <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={8}>
            <GridItem>
              <Stack spacing={6}>
                {/* 订单信息 */}
                <MotionBox
                  bg={cardBg}
                  p={6}
                  borderRadius="md"
                  boxShadow="md"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Heading as="h2" size="md" mb={4}>
                    订单信息
                  </Heading>
                  <Stack spacing={3}>
                    <HStack>
                      <Text fontWeight="bold">订单号：</Text>
                      <Text>{order._id}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="bold">下单时间：</Text>
                      <Text>{new Date(order.createdAt).toLocaleString()}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="bold">订单状态：</Text>
                      <Badge 
                        colorScheme={getStatusColorScheme(order.status)}
                        fontSize="md"
                        px={3}
                        py={1}
                      >
                        {order.status}
                      </Badge>
                    </HStack>
                    {order.isPaid && (
                      <HStack>
                        <Text fontWeight="bold">支付时间：</Text>
                        <Text>{new Date(order.paidAt).toLocaleString()}</Text>
                      </HStack>
                    )}
                  </Stack>
                </MotionBox>

                {/* 收货信息 */}
                <MotionBox
                  bg={cardBg}
                  p={6}
                  borderRadius="md"
                  boxShadow="md"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Heading as="h2" size="md" mb={4}>
                    收货信息
                  </Heading>
                  <Stack spacing={3}>
                    <HStack>
                      <Text fontWeight="bold">姓名：</Text>
                      <Text>{order.customerInfo.name}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="bold">邮箱：</Text>
                      <Text>{order.customerInfo.email}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="bold">地址：</Text>
                      <Text>{order.customerInfo.address}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="bold">城市：</Text>
                      <Text>{order.customerInfo.city}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="bold">邮编：</Text>
                      <Text>{order.customerInfo.postalCode}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="bold">电话：</Text>
                      <Text>{order.customerInfo.phone}</Text>
                    </HStack>
                  </Stack>
                </MotionBox>

                {/* 商品清单 */}
                <MotionBox
                  bg={cardBg}
                  p={6}
                  borderRadius="md"
                  boxShadow="md"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Heading as="h2" size="md" mb={4}>
                    商品清单
                  </Heading>
                  <Stack spacing={4} divider={<Divider />}>
                    {order.items.map((item) => (
                      <HStack key={item._id} justify="space-between">
                        <Box>
                          <Text fontWeight="medium">{item.name}</Text>
                          <Text fontSize="sm" color="gray.500">
                            x {item.quantity}
                          </Text>
                        </Box>
                        <Text fontWeight="bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </Text>
                      </HStack>
                    ))}
                  </Stack>
                </MotionBox>
              </Stack>
            </GridItem>

            <GridItem>
              <Stack spacing={6} position="sticky" top="20px">
                {/* 支付信息 */}
                <MotionBox
                  bg={cardBg}
                  p={6}
                  borderRadius="md"
                  boxShadow="md"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Heading as="h2" size="md" mb={4}>
                    支付信息
                  </Heading>
                  <Stack spacing={3}>
                    <HStack>
                      <Text fontWeight="bold">支付方式：</Text>
                      <Text>{order.paymentMethod}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="bold">支付状态：</Text>
                      {order.isPaid ? (
                        <Badge colorScheme="green" px={2} py={1}>
                          已支付
                        </Badge>
                      ) : (
                        <Badge colorScheme="red" px={2} py={1}>
                          未支付
                        </Badge>
                      )}
                    </HStack>
                  </Stack>
                </MotionBox>

                {/* 价格明细 */}
                <MotionBox
                  bg={cardBg}
                  p={6}
                  borderRadius="md"
                  boxShadow="md"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Heading as="h2" size="md" mb={4}>
                    价格明细
                  </Heading>
                  <Stack spacing={3}>
                    <HStack justify="space-between">
                      <Text>商品小计:</Text>
                      <Text>${order.totalPrice.toFixed(2)}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text>运费:</Text>
                      <Text>
                        {order.shippingFee === 0 ? (
                          <Text as="span" color="green.500">免费</Text>
                        ) : (
                          `$${order.shippingFee.toFixed(2)}`
                        )}
                      </Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text>税费 (12%):</Text>
                      <Text>${order.tax.toFixed(2)}</Text>
                    </HStack>
                    <Divider />
                    <HStack justify="space-between" fontSize="lg" fontWeight="bold">
                      <Text>总计:</Text>
                      <Text>${order.total.toFixed(2)}</Text>
                    </HStack>
                  </Stack>
                </MotionBox>

                {/* 支付操作 */}
                {!order.isPaid && (
                  <MotionBox
                    bg={cardBg}
                    p={6}
                    borderRadius="md"
                    boxShadow="md"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <Stack spacing={4}>
                      <Text color="orange.500" fontWeight="medium">
                        此订单尚未支付，请点击"立即支付"完成付款
                      </Text>
                      <MotionButton
                        colorScheme="brand"
                        size="lg"
                        onClick={handlePayNow}
                        rightIcon={<FiCreditCard />}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        立即支付
                      </MotionButton>
                    </Stack>
                  </MotionBox>
                )}

                {/* 订单跟踪 */}
                {order.isPaid && (
                  <MotionBox
                    bg={cardBg}
                    p={6}
                    borderRadius="md"
                    boxShadow="md"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <Stack spacing={4}>
                      <HStack>
                        <FiTruck size={20} />
                        <Text fontWeight="bold">订单跟踪</Text>
                      </HStack>
                      <Stack spacing={2} pl={6}>
                        <HStack color={order.status === '已完成' ? accentColor : 'inherit'}>
                          <FiCheckCircle />
                          <Text>订单已确认</Text>
                        </HStack>
                        <HStack color={order.status === '已发货' || order.status === '已完成' ? accentColor : 'gray.400'}>
                          <FiCheckCircle />
                          <Text>商品已发货</Text>
                        </HStack>
                        <HStack color={order.status === '已完成' ? accentColor : 'gray.400'}>
                          <FiCheckCircle />
                          <Text>订单已完成</Text>
                        </HStack>
                      </Stack>
                    </Stack>
                  </MotionBox>
                )}
              </Stack>
            </GridItem>
          </Grid>
        ) : null}
      </MotionBox>
    </Container>
  );
};

export default OrderDetail;