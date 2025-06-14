import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axiosConfig';
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
  useToast,
  Stack
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const ForgotPassword = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { resetPassword } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmNewPwd, setConfirmNewPwd] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckEmail = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('请输入您的注册邮箱。');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.get('/auth/check-email', {
        params: { email: email.trim().toLowerCase() },
      });
      if (!data.exists) {
        setError('该邮箱尚未注册，请检查输入或先去注册。');
        return;
      }
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || '校验邮箱失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPwd = async (e) => {
    e.preventDefault();
    setError('');
    if (!newPwd) {
      setError('请输入新密码。');
      return;
    }
    if (newPwd.length < 6) {
      setError('新密码长度至少6位。');
      return;
    }
    if (newPwd !== confirmNewPwd) {
      setError('两次输入密码不一致。');
      return;
    }

    setIsLoading(true);
    try {
      const { success, message } = await resetPassword({
        email: email.trim().toLowerCase(),
        newPassword: newPwd,
      });

      if (success) {
        toast({
          title: '密码重置成功',
          description: message,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/login');
      } else {
        setError(message);
      }
    } catch (err) {
      setError(err.message || '密码重置失败');
    } finally {
      setIsLoading(false);
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
          忘记密码
        </Heading>

        {error && (
          <Alert status="error" mb={4} borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {step === 1 && (
          <form onSubmit={handleCheckEmail}>
            <FormControl mb={6}>
              <FormLabel>注册邮箱</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入您的注册邮箱"
                focusBorderColor="brand.500"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="brand"
              size="lg"
              w="full"
              isLoading={isLoading}
              loadingText="验证中..."
              mb={4}
            >
              下一步
            </Button>

            <Text textAlign="center">
              记得密码了？{' '}
              <ChakraLink as={Link} to="/login" color="brand.500" fontWeight="medium">
                去登录
              </ChakraLink>
            </Text>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPwd}>
            <Stack spacing={4} mb={6}>
              <FormControl>
                <FormLabel>新密码</FormLabel>
                <Input
                  type="password"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="请输入新密码（至少6位）"
                  focusBorderColor="brand.500"
                />
              </FormControl>

              <FormControl>
                <FormLabel>确认新密码</FormLabel>
                <Input
                  type="password"
                  value={confirmNewPwd}
                  onChange={(e) => setConfirmNewPwd(e.target.value)}
                  placeholder="请再次输入新密码"
                  focusBorderColor="brand.500"
                />
              </FormControl>
            </Stack>

            <Button
              type="submit"
              colorScheme="brand"
              size="lg"
              w="full"
              isLoading={isLoading}
              loadingText="提交中..."
              mb={4}
            >
              提交新密码
            </Button>

            <Text textAlign="center">
              忘了邮箱？{' '}
              <ChakraLink as={Link} to="/register" color="brand.500" fontWeight="medium">
                去注册新账号
              </ChakraLink>
            </Text>
          </form>
        )}
      </MotionBox>
    </Flex>
  );
};

export default ForgotPassword;