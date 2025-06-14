import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Alert,
  AlertIcon,
  useToast
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const Register = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, registerUser, loading, error: authError } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPwd: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPwd: ''
  });

  useEffect(() => {
    if (user) {
      navigate('/account', { replace: true });
    }
  }, [user, navigate]);

  const handleInputChange = (field, value) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors = { name: '', email: '', password: '', confirmPwd: '' };
    let valid = true;

    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名';
      valid = false;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱';
      valid = false;
    } else if (!emailRe.test(formData.email.trim())) {
      newErrors.email = '邮箱格式不正确';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = '请输入密码';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = '密码长度至少为6位';
      valid = false;
    }

    if (!formData.confirmPwd) {
      newErrors.confirmPwd = '请再次输入密码';
      valid = false;
    } else if (formData.password !== formData.confirmPwd) {
      newErrors.confirmPwd = '两次输入的密码不一致';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { success, message } = await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      if (!success) {
        toast({
          title: '注册失败',
          description: message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: '注册失败',
        description: error.message || '注册过程中出现错误',
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
        <Heading as="h2" size="xl" mb={6} textAlign="center" color="brand.600">
          注册账号
        </Heading>

        {authError && (
          <Alert status="error" mb={4} borderRadius="md">
            <AlertIcon />
            {authError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormControl isInvalid={!!errors.name} mb={4}>
            <FormLabel>姓名</FormLabel>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="请输入您的姓名"
              focusBorderColor="brand.500"
            />
            {errors.name && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.name}
              </Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.email} mb={4}>
            <FormLabel>邮箱</FormLabel>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="请输入您的邮箱"
              focusBorderColor="brand.500"
            />
            {errors.email && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.email}
              </Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.password} mb={4}>
            <FormLabel>密码</FormLabel>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="请输入密码（至少6位）"
              focusBorderColor="brand.500"
            />
            {errors.password && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.password}
              </Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.confirmPwd} mb={6}>
            <FormLabel>确认密码</FormLabel>
            <Input
              type="password"
              value={formData.confirmPwd}
              onChange={(e) => handleInputChange('confirmPwd', e.target.value)}
              placeholder="请再次输入密码"
              focusBorderColor="brand.500"
            />
            {errors.confirmPwd && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.confirmPwd}
              </Text>
            )}
          </FormControl>

          <Button
            type="submit"
            colorScheme="brand"
            size="lg"
            w="full"
            isLoading={loading}
            loadingText="注册中..."
            mb={4}
          >
            注册并登录
          </Button>
        </form>

        <Text textAlign="center">
          已有账号？{' '}
          <ChakraLink as={Link} to="/login" color="brand.500" fontWeight="medium">
            去登录
          </ChakraLink>
        </Text>
      </MotionBox>
    </Flex>
  );
};

export default Register;