// components/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, Flex, Text, Button, IconButton, 
  Image, Badge, useToast, Tooltip,
  Skeleton, SkeletonCircle
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  FaHeart, FaRegHeart, 
  FaStar, FaStarHalfAlt, FaRegStar 
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useReview } from '../context/ReviewContext';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const ProductCard = ({ product, searchQuery }) => {
  const toast = useToast();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { getReviewsByProduct } = useReview();
  
  const [inWishlist, setInWishlist] = useState(false);
  const [stock, setStock] = useState(product.countInStock ?? 10);
  const [isAdding, setIsAdding] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // 初始化数据
  useEffect(() => {
    setInWishlist(wishlist.some(item => item._id === product._id));
    
    const reviews = getReviewsByProduct(product._id);
    const count = reviews.length;
    setReviewCount(count);
    setAvgRating(count > 0 ? 
      reviews.reduce((total, review) => total + review.rating, 0) / count : 0
    );
  }, [wishlist, product._id, getReviewsByProduct]);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, 1);
    toast({
      title: '已加入购物车',
      status: 'success',
      duration: 1500,
      position: 'top-right',
    });
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product._id);
      toast({
        title: '已从心愿单移除',
        status: 'info',
        duration: 1000,
      });
    } else {
      addToWishlist(product);
      toast({
        title: '已加入心愿单',
        status: 'success',
        duration: 1000,
      });
    }
  };

  const renderStars = () => {
    return Array(5).fill(0).map((_, i) => {
      const starValue = i + 1;
      if (avgRating >= starValue) {
        return <FaStar key={i} color="gold" />;
      } else if (avgRating >= starValue - 0.5) {
        return <FaStarHalfAlt key={i} color="gold" />;
      }
      return <FaRegStar key={i} color="gold" />;
    });
  };

  return (
    <MotionBox
      as="article"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      boxShadow="md"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", damping: 10 }}
      position="relative"
      opacity={stock === 0 ? 0.7 : 1}
    >
      {/* 库存标签 */}
      {stock < 5 && stock > 0 && (
        <Badge 
          position="absolute" 
          top={2} 
          right={2} 
          colorScheme="red" 
          borderRadius="full"
          px={2}
          zIndex="1"
        >
          仅剩{stock}件
        </Badge>
      )}

      {/* 商品图片 */}
      <Box position="relative" h="180px" bg="gray.100">
        {!isImageLoaded && (
          <Skeleton h="full" w="full" />
        )}
        <Image
          src={product.image}
          alt={product.name}
          objectFit="cover"
          w="full"
          h="full"
          onLoad={() => setIsImageLoaded(true)}
          opacity={isImageLoaded ? 1 : 0}
          transition="opacity 0.3s"
        />
        
        {/* 心愿按钮 */}
        <Tooltip label={inWishlist ? "从心愿单移除" : "加入心愿单"} placement="top">
          <IconButton
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            icon={inWishlist ? <FaHeart color="crimson" /> : <FaRegHeart color="crimson" />}
            onClick={handleWishlistToggle}
            position="absolute"
            top={2}
            left={2}
            size="sm"
            bg="whiteAlpha.700"
            _hover={{ bg: "whiteAlpha.900" }}
          />
        </Tooltip>
      </Box>

      {/* 商品信息 */}
      <Box p={4}>
        <Link to={`/product/${product._id}`}>
          <Text 
            fontWeight="semibold" 
            fontSize="lg" 
            color="coffee.800"
            noOfLines={2}
            mb={2}
          >
            {product.name}
          </Text>
          
          <Flex align="center" mb={2}>
            <Flex mr={2}>
              {renderStars()}
            </Flex>
            <Text fontSize="sm" color="gray.600">
              {reviewCount > 0 ? `(${reviewCount})` : '暂无评价'}
            </Text>
          </Flex>
          
          <Text 
            fontSize="sm" 
            color="gray.600" 
            noOfLines={3}
            mb={3}
          >
            {product.description}
          </Text>
        </Link>

        <Flex justify="space-between" align="center">
          <Text fontWeight="bold" color="coffee.700">
            ¥{product.price.toFixed(2)}
          </Text>
          
          <MotionButton
            colorScheme="brand"
            size="sm"
            onClick={handleAddToCart}
            disabled={stock === 0 || isAdding}
            loadingText={isAdding ? "加入中..." : null}
            whileTap={{ scale: 0.95 }}
          >
            {stock === 0 ? '已售罄' : '加入购物车'}
          </MotionButton>
        </Flex>
      </Box>
    </MotionBox>
  );
};

export default ProductCard;