// src/pages/Wishlist.jsx
import React from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  SimpleGrid,
  Image,
  useToast,
  Container,
  useColorModeValue,
  VStack
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiTrash2, FiHeart } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.700');
  const accentColor = useColorModeValue('brand.500', 'brand.300');

  const handleAddAndRemove = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
    toast({
      title: '已添加到购物车',
      description: `${product.name} 已添加到您的购物车`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleRemove = (product) => {
    removeFromWishlist(product._id);
    toast({
      title: '已移除',
      description: `${product.name} 已从心愿单移除`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="6xl" py={8}>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Heading as="h1" size="xl" mb={8} display="flex" alignItems="center">
          <FiHeart style={{ marginRight: '12px', color: accentColor }} />
          我的心愿单
        </Heading>

        {wishlist.length === 0 ? (
          <VStack spacing={6} py={12} textAlign="center">
            <Box fontSize="6xl" color="gray.300">
              <FiHeart />
            </Box>
            <Text fontSize="xl">心愿单空空如也</Text>
            <Text color="gray.500">快去选购心仪商品吧~</Text>
            <MotionButton
              colorScheme="brand"
              onClick={() => navigate('/menu')}
              rightIcon={<FiShoppingCart />}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              去逛逛
            </MotionButton>
          </VStack>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
            {wishlist.map((product, index) => (
              <MotionBox
                key={product._id}
                bg={cardBg}
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ shadow: 'lg', y: -5 }}
              >
                <Box
                  h="200px"
                  overflow="hidden"
                  position="relative"
                  cursor="pointer"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    objectFit="cover"
                    w="100%"
                    h="100%"
                    transition="transform 0.3s"
                    _hover={{ transform: 'scale(1.05)' }}
                  />
                </Box>

                <Stack p={4} spacing={3}>
                  <Heading as="h3" size="md" noOfLines={1}>
                    {product.name}
                  </Heading>
                  <Text fontSize="xl" fontWeight="bold" color={accentColor}>
                    ¥{product.price.toFixed(2)}
                  </Text>

                  <Stack direction="row" spacing={2} mt={2}>
                    <MotionButton
                      flex={1}
                      colorScheme="brand"
                      size="sm"
                      leftIcon={<FiShoppingCart />}
                      onClick={() => handleAddAndRemove(product)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      加入购物车
                    </MotionButton>
                    <MotionButton
                      flex={1}
                      variant="outline"
                      colorScheme="red"
                      size="sm"
                      leftIcon={<FiTrash2 />}
                      onClick={() => handleRemove(product)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      移除
                    </MotionButton>
                  </Stack>
                </Stack>
              </MotionBox>
            ))}
          </SimpleGrid>
        )}
      </MotionBox>
    </Container>
  );
};

export default Wishlist;