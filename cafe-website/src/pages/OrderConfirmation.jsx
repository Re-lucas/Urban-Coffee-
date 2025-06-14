// src/pages/OrderConfirmation.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Box, 
  Heading, 
  Text, 
  Stack, 
  HStack, 
  VStack, 
  Divider, 
  Button, 
  Textarea, 
  useToast,
  Badge,
  Container,
  useColorModeValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiShoppingBag, FiHome, FiStar } from 'react-icons/fi';
import { useOrder } from '../context/OrderContext';
import { useReview } from '../context/ReviewContext';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { getOrderById } = useOrder();
  const { addReview, getReviewsByProduct } = useReview();
  const [order, setOrder] = useState(null);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.700');
  const accentColor = useColorModeValue('brand.500', 'brand.300');

  useEffect(() => {
    const o = getOrderById(orderId);
    setOrder(o || null);

    if (o && o.status === '已完成') {
      const allReviewed = o.items.every(item => {
        const reviews = getReviewsByProduct(item.id);
        return reviews.some(r => r.orderId === o.id);
      });
      setHasReviewed(allReviewed);
    }
  }, [orderId, getOrderById, getReviewsByProduct]);

  if (!order) {
    return (
      <Container maxW="6xl" py={12} textAlign="center">
        <Text fontSize="xl">正在加载订单详情…</Text>
      </Container>
    );
  }

  const safeTotalPrice = typeof order.totalPrice === 'number' ? order.totalPrice : 0;
  const safeShippingFee = typeof order.shippingFee === 'number' ? order.shippingFee : 0;
  const safeFinalPrice = typeof order.finalPrice === 'number' ? order.finalPrice : safeTotalPrice + safeShippingFee;

  const handleRatingChange = (productId, value) => {
    setRatings(prev => ({ ...prev, [productId]: Number(value) }));
  };

  const handleCommentChange = (productId, text) => {
    setComments(prev => ({ ...prev, [productId]: text }));
  };

  const handleSubmitReviews = async () => {
    const missingRatingItem = order.items.find(item => !ratings[item.id]);
    if (missingRatingItem) {
      toast({
        title: '请完成评价',
        description: `请为商品 "${missingRatingItem.name}" 选择星级`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await Promise.all(order.items.map(item => 
        addReview({
          productId: item.id,
          orderId: order.id,
          rating: ratings[item.id],
          comment: comments[item.id] || ''
        })
      ));
      setHasReviewed(true);
      toast({
        title: '评价提交成功',
        description: '感谢您的反馈！',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: '评价提交失败',
        description: '请稍后重试',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('评价提交错误:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProductReview = (productId) => {
    const reviews = getReviewsByProduct(productId);
    return reviews.find(r => r.orderId === order.id);
  };

  const renderStars = (rating) => {
    return (
      <HStack spacing={0}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Box
            key={star}
            as="span"
            color={rating >= star ? accentColor : 'gray.300'}
            fontSize="lg"
          >
            ★
          </Box>
        ))}
      </HStack>
    );
  };

  return (
    <Container maxW="6xl" py={8}>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Stack spacing={8} align="center" textAlign="center" mb={10}>
          <Box color={accentColor}>
            <FiCheckCircle size={60} />
          </Box>
          <Heading as="h1" size="xl">
            订单已确认
          </Heading>
          <Text fontSize="lg">感谢您的购买！您的订单号：</Text>
          <Badge 
            fontSize="xl" 
            px={4} 
            py={2} 
            colorScheme="brand"
            borderRadius="full"
          >
            {order.id}
          </Badge>
          <Text color="gray.500">
            下单时间：{new Date(order.createTime).toLocaleString()}
          </Text>
        </Stack>

        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={8}>
          <GridItem>
            <Stack spacing={6}>
              {/* 订单商品列表 */}
              <Box bg={cardBg} p={6} borderRadius="md" boxShadow="md">
                <Heading as="h3" size="md" mb={4}>
                  商品列表
                </Heading>
                <Stack spacing={4} divider={<Divider />}>
                  {order.items.map((item) => (
                    <HStack key={item.id} justify="space-between">
                      <Text>{item.name} × {item.quantity}</Text>
                      <Text fontWeight="bold">
                        ¥{(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </HStack>
                  ))}
                </Stack>
              </Box>

              {/* 评价区域 */}
              {order.status === '已完成' && !hasReviewed && (
                <MotionBox
                  bg={cardBg}
                  p={6}
                  borderRadius="md"
                  boxShadow="md"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Heading as="h3" size="md" mb={4}>
                    请对商品进行评价
                  </Heading>
                  <Stack spacing={6}>
                    {order.items.map((item) => (
                      <Box key={`review-${item.id}`}>
                        <HStack justify="space-between" mb={2}>
                          <Text fontWeight="medium">{item.name}</Text>
                          <HStack spacing={1}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Box
                                key={star}
                                as="button"
                                type="button"
                                onClick={() => handleRatingChange(item.id, star)}
                                color={ratings[item.id] >= star ? accentColor : 'gray.300'}
                                fontSize="xl"
                                _hover={{ color: accentColor }}
                                aria-label={`${star}星`}
                              >
                                ★
                              </Box>
                            ))}
                          </HStack>
                        </HStack>
                        <Textarea
                          placeholder="分享您的使用体验（可选）"
                          value={comments[item.id] || ''}
                          onChange={(e) => handleCommentChange(item.id, e.target.value)}
                          rows={3}
                        />
                      </Box>
                    ))}
                    <MotionButton
                      colorScheme="brand"
                      onClick={handleSubmitReviews}
                      isLoading={isSubmitting}
                      loadingText="提交中..."
                      rightIcon={<FiStar />}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      提交评价
                    </MotionButton>
                  </Stack>
                </MotionBox>
              )}

              {/* 已评价状态 */}
              {order.status === '已完成' && hasReviewed && (
                <MotionBox
                  bg={cardBg}
                  p={6}
                  borderRadius="md"
                  boxShadow="md"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Heading as="h3" size="md" mb={4}>
                    您的评价
                  </Heading>
                  <Stack spacing={6}>
                    {order.items.map((item) => {
                      const review = getProductReview(item.id);
                      return (
                        <Box key={`reviewed-${item.id}`}>
                          <HStack justify="space-between" mb={2}>
                            <Text fontWeight="medium">{item.name}</Text>
                            {review ? (
                              renderStars(review.rating)
                            ) : (
                              <Text color="gray.500">暂无评价</Text>
                            )}
                          </HStack>
                          {review?.comment && (
                            <Text mt={2} p={3} bg={useColorModeValue('gray.50', 'gray.600')} borderRadius="md">
                              {review.comment}
                            </Text>
                          )}
                          {review?.date && (
                            <Text mt={1} fontSize="sm" color="gray.500">
                              评价日期: {new Date(review.date).toLocaleDateString()}
                            </Text>
                          )}
                        </Box>
                      );
                    })}
                  </Stack>
                </MotionBox>
              )}
            </Stack>
          </GridItem>

          <GridItem>
            <Stack spacing={6} position="sticky" top="20px">
              {/* 订单摘要 */}
              <Box bg={cardBg} p={6} borderRadius="md" boxShadow="md">
                <Heading as="h3" size="md" mb={4}>
                  订单摘要
                </Heading>
                <Stack spacing={3}>
                  <HStack justify="space-between">
                    <Text>商品合计：</Text>
                    <Text>¥{safeTotalPrice.toFixed(2)}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text>运费：</Text>
                    <Text>
                      {safeShippingFee === 0 ? (
                        <Text as="span" color="green.500">包邮</Text>
                      ) : (
                        `¥${safeShippingFee.toFixed(2)}`
                      )}
                    </Text>
                  </HStack>
                  <Divider />
                  <HStack justify="space-between" fontSize="lg" fontWeight="bold">
                    <Text>支付金额：</Text>
                    <Text>¥{safeFinalPrice.toFixed(2)}</Text>
                  </HStack>
                </Stack>
              </Box>

              {/* 订单状态 */}
              <Box bg={cardBg} p={6} borderRadius="md" boxShadow="md">
                <Heading as="h3" size="md" mb={2}>
                  订单状态
                </Heading>
                <Badge 
                  colorScheme={
                    order.status === '已完成' ? 'green' : 
                    order.status === '已取消' ? 'red' : 'blue'
                  }
                  fontSize="md"
                  px={3}
                  py={1}
                >
                  {order.status}
                </Badge>
              </Box>

              {/* 操作按钮 */}
              <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
                <MotionButton
                  as={Link}
                  to="/order-history"
                  leftIcon={<FiShoppingBag />}
                  variant="outline"
                  colorScheme="brand"
                  width="full"
                  whileHover={{ scale: 1.02 }}
                >
                  查看我的订单
                </MotionButton>
                <MotionButton
                  as={Link}
                  to="/"
                  leftIcon={<FiHome />}
                  colorScheme="brand"
                  width="full"
                  whileHover={{ scale: 1.02 }}
                >
                  返回首页
                </MotionButton>
              </Stack>
            </Stack>
          </GridItem>
        </Grid>
      </MotionBox>
    </Container>
  );
};

export default OrderConfirmation;