import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/axiosConfig';
import {
  Box,
  Heading,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  IconButton,
  useToast,
  Badge,
  Stack,
  Text
} from '@chakra-ui/react';
import { FiSearch, FiTruck, FiEye } from 'react-icons/fi';

const OrderList = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/orders');
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || '获取订单列表失败');
        toast({
          title: '加载失败',
          description: err.response?.data?.message || '获取订单列表时出错',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [toast]);

  const handleDeliver = async (orderId) => {
    if (window.confirm('确认将此订单标记为已发货？')) {
      try {
        setLoading(true);
        await api.put(`/orders/${orderId}/deliver`);
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, isDelivered: true } : order
        ));
        toast({
          title: '操作成功',
          description: '订单已标记为已发货',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        setError(err.response?.data?.message || '标记发货失败');
        toast({
          title: '操作失败',
          description: err.response?.data?.message || '标记发货时出错',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!searchText.trim()) return true;
    const searchLower = searchText.toLowerCase();
    return (
      order._id.toLowerCase().includes(searchLower) ||
      (order.user?.name && order.user.name.toLowerCase().includes(searchLower)) ||
      (order.user?.email && order.user.email.toLowerCase().includes(searchLower))
    );
  });

  return (
    <Box>
      <Heading as="h2" size="lg" mb={6}>
        订单管理
      </Heading>

      <Flex mb={6}>
        <Input
          placeholder="搜索订单号、用户姓名或邮箱"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          mr={2}
          focusBorderColor="brand.500"
        />
        <IconButton
          icon={<FiSearch />}
          aria-label="搜索"
          colorScheme="brand"
        />
      </Flex>

      {loading && (
        <Flex justify="center" py={12}>
          <Spinner size="xl" />
        </Flex>
      )}

      {error && (
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <Box overflowX="auto">
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>订单号</Th>
              <Th>用户</Th>
              <Th>下单时间</Th>
              <Th isNumeric>总金额</Th>
              <Th>支付状态</Th>
              <Th>发货状态</Th>
              <Th>操作</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredOrders.length === 0 ? (
              <Tr>
                <Td colSpan={7} textAlign="center" py={8}>
                  {loading ? '加载中...' : '无匹配订单'}
                </Td>
              </Tr>
            ) : (
              filteredOrders.map((order) => (
                <Tr key={order._id}>
                  <Td fontSize="sm">{order._id.slice(0, 8)}...</Td>
                  <Td>
                    <Text fontWeight="medium">{order.user?.name || '未知用户'}</Text>
                    {order.user?.email && (
                      <Text fontSize="sm" color="gray.500">{order.user.email}</Text>
                    )}
                  </Td>
                  <Td>{new Date(order.createdAt).toLocaleString()}</Td>
                  <Td isNumeric>¥{order.totalPrice.toFixed(2)}</Td>
                  <Td>
                    <Badge
                      colorScheme={order.isPaid ? 'green' : 'red'}
                      variant="subtle"
                    >
                      {order.isPaid ? '已支付' : '未支付'}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={order.isDelivered ? 'green' : 'orange'}
                      variant="subtle"
                    >
                      {order.isDelivered ? '已发货' : '待发货'}
                    </Badge>
                  </Td>
                  <Td>
                    <Stack direction="row" spacing={2}>
                      <IconButton
                        as={Link}
                        to={`/admin/orders/${order._id}`}
                        icon={<FiEye />}
                        aria-label="查看详情"
                        colorScheme="blue"
                        size="sm"
                      />
                      {!order.isDelivered && (
                        <IconButton
                          icon={<FiTruck />}
                          aria-label="标记发货"
                          colorScheme="orange"
                          size="sm"
                          onClick={() => handleDeliver(order._id)}
                        />
                      )}
                    </Stack>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default OrderList;