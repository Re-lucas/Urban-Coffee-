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
  Select,
  Textarea,
  useToast,
  Alert,
  AlertIcon,
  Flex,
  Spinner,
  IconButton
} from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';

const ProductEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    brand: '',
    category: '',
    description: '',
    image: '',
    countInStock: 0,
    isAvailable: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const { data } = await api.get(`/products/${id}`);
          setFormData({
            name: data.name,
            price: data.price,
            brand: data.brand,
            category: data.category,
            description: data.description,
            image: data.image,
            countInStock: data.countInStock,
            isAvailable: data.isAvailable
          });
        } catch (err) {
          setError(err.response?.data?.message || '获取商品信息失败');
          toast({
            title: '加载失败',
            description: err.response?.data?.message || '获取商品信息时出错',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isAvailable' ? value === 'true' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        countInStock: Number(formData.countInStock)
      };

      if (isEditMode) {
        await api.put(`/products/${id}`, productData);
        toast({
          title: '更新成功',
          description: '商品信息已更新',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await api.post('/products', productData);
        toast({
          title: '创建成功',
          description: '新商品已添加',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || '保存失败，请重试');
      toast({
        title: '操作失败',
        description: err.response?.data?.message || '保存商品信息时出错',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" py={12}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box maxW="container.md" mx="auto" p={4}>
      <Flex align="center" mb={6}>
        <IconButton
          as={Link}
          to="/admin/products"
          icon={<FiArrowLeft />}
          aria-label="返回"
          mr={2}
        />
        <Heading as="h2" size="lg">
          {isEditMode ? '编辑商品' : '添加新商品'}
        </Heading>
      </Flex>

      {error && (
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <Box
        as="form"
        onSubmit={handleSubmit}
        bg="white"
        p={6}
        borderRadius="lg"
        boxShadow="sm"
      >
        <Stack spacing={6}>
          <FormControl isRequired>
            <FormLabel>商品名称</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="请输入商品名称"
              focusBorderColor="brand.500"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>价格 (¥)</FormLabel>
            <Input
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              focusBorderColor="brand.500"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>品牌</FormLabel>
            <Input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="请输入品牌"
              focusBorderColor="brand.500"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>分类</FormLabel>
            <Input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="请输入分类"
              focusBorderColor="brand.500"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>图片 URL</FormLabel>
            <Input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="请输入图片URL"
              focusBorderColor="brand.500"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>库存数量</FormLabel>
            <Input
              type="number"
              name="countInStock"
              min="0"
              value={formData.countInStock}
              onChange={handleChange}
              placeholder="0"
              focusBorderColor="brand.500"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>在售状态</FormLabel>
            <Select
              name="isAvailable"
              value={formData.isAvailable}
              onChange={handleChange}
              focusBorderColor="brand.500"
            >
              <option value={true}>在售</option>
              <option value={false}>下架</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>商品描述</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="请输入商品描述"
              focusBorderColor="brand.500"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="brand"
            size="lg"
            isLoading={isSubmitting}
            loadingText={isEditMode ? '更新中...' : '创建中...'}
            mt={4}
          >
            {isEditMode ? '更新商品' : '创建商品'}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ProductEdit;