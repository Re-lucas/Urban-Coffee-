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
  Text,
  Tooltip
} from '@chakra-ui/react';
import { FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';

const UserList = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/users');
        setUsers(data);
      } catch (err) {
        setError(err.response?.data?.message || '获取用户列表失败');
        toast({
          title: '加载失败',
          description: err.response?.data?.message || '获取用户列表时出错',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [toast]);

  const handleDelete = async (userId) => {
    if (window.confirm('确定要删除此用户吗？此操作不可撤销！')) {
      try {
        setLoading(true);
        await api.delete(`/users/${userId}`);
        setUsers(users.filter(u => u._id !== userId));
        toast({
          title: '删除成功',
          description: '用户已删除',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        setError(err.response?.data?.message || '删除用户失败');
        toast({
          title: '删除失败',
          description: err.response?.data?.message || '删除用户时出错',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredUsers = users.filter(u => {
    if (!searchText.trim()) return true;
    const searchLower = searchText.toLowerCase();
    return (
      u.name.toLowerCase().includes(searchLower) ||
      u.email.toLowerCase().includes(searchLower) ||
      (u._id && u._id.toLowerCase().includes(searchLower))
    );
  });

  return (
    <Box>
      <Heading as="h2" size="lg" mb={6}>
        用户管理
      </Heading>

      <Flex mb={6}>
        <Input
          placeholder="搜索用户名、邮箱或ID"
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
              <Th>ID</Th>
              <Th>姓名</Th>
              <Th>邮箱</Th>
              <Th>管理员</Th>
              <Th>注册时间</Th>
              <Th>操作</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredUsers.length === 0 ? (
              <Tr>
                <Td colSpan={6} textAlign="center" py={8}>
                  {loading ? '加载中...' : '无匹配用户'}
                </Td>
              </Tr>
            ) : (
              filteredUsers.map((u) => (
                <Tr key={u._id}>
                  <Td fontSize="sm">{u._id.slice(0, 8)}...</Td>
                  <Td fontWeight="medium">{u.name}</Td>
                  <Td>{u.email}</Td>
                  <Td>
                    <Badge
                      colorScheme={u.isAdmin ? 'purple' : 'gray'}
                      variant="subtle"
                    >
                      {u.isAdmin ? '是' : '否'}
                    </Badge>
                  </Td>
                  <Td>{new Date(u.createdAt).toLocaleDateString()}</Td>
                  <Td>
                    <Stack direction="row" spacing={2}>
                      <Tooltip label="编辑用户">
                        <IconButton
                          as={Link}
                          to={`/admin/users/${u._id}`}
                          icon={<FiEdit2 />}
                          aria-label="编辑用户"
                          colorScheme="blue"
                          size="sm"
                        />
                      </Tooltip>
                      <Tooltip label="删除用户">
                        <IconButton
                          icon={<FiTrash2 />}
                          aria-label="删除用户"
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleDelete(u._id)}
                          disabled={u._id === user?._id}
                        />
                      </Tooltip>
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

export default UserList;