// components/ContactForm.jsx
import React from 'react';
import { 
  Box, FormControl, FormLabel, Input, 
  Textarea, Button, useToast, Stack,
  FormErrorMessage, Flex
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const ContactForm = () => {
  const toast = useToast();
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset 
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: '留言成功',
        description: '感谢您的留言！我们会尽快回复',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      reset();
    } catch (error) {
      toast({
        title: '提交失败',
        description: '请稍后重试',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box 
        as="form" 
        onSubmit={handleSubmit(onSubmit)}
        p={6} 
        borderWidth="1px" 
        borderRadius="lg"
        boxShadow="md"
      >
        <Stack spacing={5}>
          {/* 姓名字段 */}
          <FormControl isInvalid={errors.name}>
            <FormLabel htmlFor="name">姓名</FormLabel>
            <Input
              id="name"
              type="text"
              {...register('name', { required: '请输入您的姓名' })}
            />
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>

          {/* 邮箱字段 */}
          <FormControl isInvalid={errors.email}>
            <FormLabel htmlFor="email">邮箱</FormLabel>
            <Input
              id="email"
              type="email"
              {...register('email', { 
                required: '请输入您的邮箱',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: '无效的邮箱格式'
                }
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>

          {/* 留言字段 */}
          <FormControl isInvalid={errors.message}>
            <FormLabel htmlFor="message">留言内容</FormLabel>
            <Textarea
              id="message"
              rows={5}
              {...register('message', { 
                required: '请输入留言内容',
                minLength: {
                  value: 10,
                  message: '留言至少需要10个字符'
                }
              })}
            />
            <FormErrorMessage>
              {errors.message && errors.message.message}
            </FormErrorMessage>
          </FormControl>

          <Flex justify="flex-end">
            <Button
              colorScheme="brand"
              isLoading={isSubmitting}
              type="submit"
              px={8}
              loadingText="提交中..."
            >
              发送留言
            </Button>
          </Flex>
        </Stack>
      </Box>
    </MotionBox>
  );
};

export default ContactForm;