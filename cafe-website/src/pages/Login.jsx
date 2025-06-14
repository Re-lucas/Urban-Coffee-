import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Link as ChakraLink,
  useToast,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { user, login, loading, error: authError } = useAuth();
  const from = location.state?.from || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [user, navigate, from]);

  const handleInputChange = (field, value) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
  };

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.trim()) {
      newErrors.email = '请输入邮箱';
      isValid = false;
    } else if (!emailPattern.test(email.trim())) {
      newErrors.email = '邮箱格式不正确';
      isValid = false;
    }
    
    if (!password) {
      newErrors.password = '请输入密码';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      await login(email.trim(), password);
    } catch (error) {
      toast({
        title: '登录失败',
        description: error.message || '请检查您的邮箱和密码',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        w="full"
        maxW="md"
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
      >
        <Heading as="h1" size="xl" mb={6} textAlign="center" color="brand.600">
          登录
        </Heading>

        {authError && (
          <Alert status="error" mb={4} borderRadius="md">
            <AlertIcon />
            {authError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormControl isInvalid={!!errors.email} mb={4}>
            <FormLabel>邮箱</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="请输入邮箱"
              focusBorderColor="brand.500"
            />
            {errors.email && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.email}
              </Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.password} mb={6}>
            <FormLabel>密码</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="请输入密码"
              focusBorderColor="brand.500"
            />
            {errors.password && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.password}
              </Text>
            )}
          </FormControl>

          <Button
            type="submit"
            colorScheme="brand"
            size="lg"
            w="full"
            isLoading={loading}
            loadingText="登录中..."
            mb={4}
          >
            登录
          </Button>
        </form>

        <Flex direction="column" align="center" gap={2}>
          <Text>
            没有账号？{' '}
            <ChakraLink as={Link} to="/register" color="brand.500" fontWeight="medium">
              注册新账号
            </ChakraLink>
          </Text>
          <Text>
            <ChakraLink as={Link} to="/forgot-password" color="brand.500" fontWeight="medium">
              忘记密码？
            </ChakraLink>
          </Text>
        </Flex>
      </MotionBox>
    </Flex>
  );
};

export default Login;