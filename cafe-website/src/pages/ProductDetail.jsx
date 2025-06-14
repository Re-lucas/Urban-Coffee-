// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { 
  Box, Flex, Stack, Heading, Text, Button, 
  Tabs, TabList, Tab, TabPanels, TabPanel,
  Image, Badge, Select, useToast, 
  Skeleton, SkeletonCircle, SkeletonText,
  Avatar, Divider, useBreakpointValue
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useReview } from '../context/ReviewContext';
import { useCart } from '../context/CartContext';
import api from '../utils/axiosConfig';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { getReviewsByProduct } = useReview();
  const { addToCart } = useCart();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  const [product, setProduct] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  // 获取商品详情
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || '获取商品详情失败');
        toast({
          title: '加载失败',
          description: '无法获取商品信息',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, toast]);

  // 获取商品评价
  useEffect(() => {
    if (product) {
      const reviews = getReviewsByProduct(product._id);
      setAllReviews(reviews);
    }
  }, [product, getReviewsByProduct]);

  // 计算平均评分
  const avgRating = allReviews.length > 0 
    ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length 
    : 0;

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => {
      if (rating >= i + 1) {
        return <FaStar key={i} color="gold" />;
      } else if (rating >= i + 0.5) {
        return <FaStarHalfAlt key={i} color="gold" />;
      }
      return <FaRegStar key={i} color="gray.300" />;
    });
  };

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast({
      title: '已加入购物车',
      status: 'success',
      duration: 1500,
      position: 'top-right',
    });
    navigate('/cart');
  };

  if (loading) {
    return (
      <Box maxW="1200px" mx="auto" p={4}>
        <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
          <Box flex={1}>
            <Skeleton height="400px" borderRadius="lg" />
          </Box>
          <Box flex={1}>
            <SkeletonText mt="4" noOfLines={10} spacing="4" />
          </Box>
        </Flex>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={10}>
        <Text color="red.500" fontSize="xl">{error}</Text>
        <Button mt={4} onClick={() => window.location.reload()}>
          重新加载
        </Button>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="xl">未找到该商品</Text>
        <Button mt={4} as="a" href="/menu">
          浏览其他商品
        </Button>
      </Box>
    );
  }

  return (
    <Box maxW="1200px" mx="auto" p={4}>
      {/* 商品基本信息区 */}
      <Flex direction={{ base: 'column', md: 'row' }} gap={8} mb={10}>
        {/* 商品图片 */}
        <Box flex={1}>
          <Image
            src={product.image}
            alt={product.name}
            borderRadius="lg"
            objectFit="cover"
            w="full"
            loading="lazy"
            fallback={<Skeleton height="400px" />}
          />
        </Box>

        {/* 商品详情 */}
        <Box flex={1}>
          <Heading as="h1" size="xl" mb={2}>
            {product.name}
          </Heading>

          <Flex align="center" mb={4}>
            {renderStars(avgRating)}
            <Text ml={2} color="gray.600">
              ({allReviews.length}条评价)
            </Text>
          </Flex>

          <Text fontSize="2xl" color="brand.500" fontWeight="bold" mb={4}>
            ¥{product.price.toFixed(2)}
          </Text>

          <Text mb={6}>{product.description}</Text>

          <Divider my={6} />

          {/* 商品状态 */}
          <Stack spacing={3} mb={6}>
            <Flex>
              <Text w="80px" color="gray.600">烘焙度：</Text>
              <Text>{product.roast}</Text>
            </Flex>
            <Flex>
              <Text w="80px" color="gray.600">库存：</Text>
              <Badge 
                colorScheme={product.countInStock > 0 ? 'green' : 'red'}
                px={2}
                borderRadius="md"
              >
                {product.countInStock > 0 ? `${product.countInStock}件` : '无库存'}
              </Badge>
            </Flex>
            <Flex>
              <Text w="80px" color="gray.600">状态：</Text>
              <Text color={product.isAvailable ? 'green.500' : 'red.500'}>
                {product.isAvailable ? '在售中' : '已下架'}
              </Text>
            </Flex>
          </Stack>

          {/* 购买操作区 */}
          {product.countInStock > 0 && product.isAvailable && (
            <Flex align="center" gap={4} mb={8}>
              <Select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                maxW="120px"
              >
                {[...Array(Math.min(10, product.countInStock)).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </Select>
              <MotionButton
                colorScheme="brand"
                px={8}
                onClick={handleAddToCart}
                whileTap={{ scale: 0.95 }}
              >
                加入购物车
              </MotionButton>
            </Flex>
          )}

          {(!product.isAvailable || product.countInStock <= 0) && (
            <Button 
              colorScheme="gray" 
              isDisabled 
              mb={8}
            >
              暂时无法购买
            </Button>
          )}
        </Box>
      </Flex>

      {/* 标签式内容区 */}
      <Tabs variant="enclosed" isLazy>
        <TabList>
          <Tab fontWeight="semibold">商品详情</Tab>
          <Tab fontWeight="semibold">用户评价({allReviews.length})</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <Text whiteSpace="pre-line">
              {product.fullDescription || '暂无更多商品详情'}
            </Text>
          </TabPanel>
          <TabPanel px={0}>
            {allReviews.length === 0 ? (
              <Text color="gray.500" textAlign="center" py={10}>
                暂时还没有人评价哦~
              </Text>
            ) : (
              <Stack spacing={6}>
                {allReviews.map((review) => (
                  <Box key={review.id} borderWidth="1px" borderRadius="md" p={4}>
                    <Flex align="center" mb={3}>
                      <Avatar name={review.user} size="sm" mr={3} />
                      <Box>
                        <Text fontWeight="medium">{review.user}</Text>
                        <Flex align="center">
                          {renderStars(review.rating)}
                          <Text ml={2} fontSize="sm" color="gray.500">
                            {new Date(review.date).toLocaleDateString()}
                          </Text>
                        </Flex>
                      </Box>
                    </Flex>
                    <Text mt={2}>{review.comment || '（用户未填写文字评价）'}</Text>
                  </Box>
                ))}
              </Stack>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ProductDetail;