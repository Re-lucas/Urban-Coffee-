import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/axiosConfig';
import {
  Box,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Textarea,
  useToast,
  Alert,
  AlertIcon,
  Flex,
  Spinner,
  Stack,
  Text,
  IconButton
} from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';

const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isAdmin: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/users/${id}`);
        setUser(data);
        setFormData({
          name: data.name,
          email: data.email,
          isAdmin: data.isAdmin
        });
      } catch (err) {
        setError(err.response?.data?.message || '获取用户信息失败');
        toast({
          title: '加载失败',
          description: err.response?.data?.message || '获取用户信息时出错',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, toast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.put(`/users/${id}`, formData);
      toast({
        title: '更新成功',
        description: '用户信息已更新',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.message || '更新用户信息失败');
      toast({
        title: '更新失败',
        description: err.response?.data?.message || '更新用户信息时出错',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <Flex justify="center" py={12}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!user) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        无法加载用户信息
      </Alert>
    );
  }

  return (
    <Box>
      <Flex align="center" mb={6}>
        <IconButton
          as={Link}
          to="/admin/users"
          icon={<FiArrowLeft />}
          aria-label="返回"
          mr={2}
        />
        <Heading as="h2" size="lg">
          编辑用户 - {user.name}
        </Heading>
      </Flex>

      {error && (
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <Box
        bg="white"
        p={6}
        borderRadius="lg"
        boxShadow="sm"
        mb={8}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={6}>
            <FormControl isRequired>
              <FormLabel>用户名</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="请输入用户名"
                focusBorderColor="brand.500"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>邮箱</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="请输入邮箱"
                focusBorderColor="brand.500"
              />
            </FormControl>

            <FormControl>
              <Checkbox
                name="isAdmin"
                isChecked={formData.isAdmin}
                onChange={handleChange}
                colorScheme="brand"
              >
                管理员权限
              </Checkbox>
            </FormControl>

            <Button
              type="submit"
              colorScheme="brand"
              size="lg"
              isLoading={loading}
              loadingText="更新中..."
            >
              更新用户信息
            </Button>
          </Stack>
        </form>
      </Box>

      <Box
        bg="white"
        p={6}
        borderRadius="lg"
        boxShadow="sm"
      >
        <Heading size="md" mb={4}>
          用户信息
        </Heading>
        <Stack spacing={3}>
          <Text><strong>注册时间：</strong> {new Date(user.createdAt).toLocaleString()}</Text>
          <Text><strong>最后登录：</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '从未登录'}</Text>
          <Text><strong>用户ID：</strong> {user._id}</Text>
        </Stack>
      </Box>
    </Box>
  );
};

export default UserDetail;