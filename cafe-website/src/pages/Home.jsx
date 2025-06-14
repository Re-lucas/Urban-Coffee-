// pages/Home.jsx
import React, { useEffect, useRef, useState } from 'react';
import { 
  Box, Flex, Text, Button, Grid, 
  Stack, Heading, useBreakpointValue, 
  useToast, Skeleton
} from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../utils/axiosConfig';
import ProductCard from '../components/ProductCard';

const MotionBox = motion(Box);
const MotionGrid = motion(Grid);

const Home = () => {
  const controls = useAnimation();
  const toast = useToast();
  const sectionsRef = useRef([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useBreakpointValue({ base: true, md: false });

  // 获取特色商品数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/products/featured');
        setFeaturedProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.message || '加载失败');
        toast({
          title: '获取商品失败',
          status: 'error',
          position: 'top'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  // 滚动动画逻辑（使用Framer Motion优化）
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            controls.start({
              opacity: 1,
              y: 0,
              transition: { duration: 0.6 }
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [controls]);

  // 英雄区域组件
  const HeroSection = () => (
    <Box
      as="section"
      minH={{ base: '70vh', md: '100vh' }}
      bgGradient="linear(to-r, rgba(111, 78, 55, 0.9), rgba(111, 78, 55, 0.7))"
      bgImage="url('https://images.unsplash.com/photo-1498804103079-a6351b050096?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80')"
      bgSize="cover"
      bgPosition="center"
      display="flex"
      alignItems="center"
      justifyContent="center"
      color="white"
      textAlign="center"
      px={4}
      py={20}
    >
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        maxW="800px"
      >
        <Heading 
          as="h1" 
          fontSize={{ base: '3xl', md: '5xl' }}
          mb={6}
          textShadow="0 2px 4px rgba(0,0,0,0.3)"
        >
          欢迎来到 Urban Coffee
        </Heading>
        <Text 
          fontSize={{ base: 'xl', md: '2xl' }}
          mb={8}
          textShadow="0 2px 4px rgba(0,0,0,0.3)"
        >
          发现精品咖啡的独特风味
        </Text>
        <Button
          as={Link}
          to="/menu"
          colorScheme="brand"
          size="lg"
          px={8}
          _hover={{ transform: 'translateY(-3px)', shadow: 'lg' }}
          transition="all 0.3s"
        >
          查看菜单
        </Button>
      </MotionBox>
    </Box>
  );

  // 特色产品区域组件
  const FeaturedSection = () => (
    <MotionBox
      ref={el => sectionsRef.current[0] = el}
      initial={{ opacity: 0, y: 30 }}
      animate={controls}
      as="section"
      py={16}
      bg="coffee.50"
    >
      <Box maxW="1200px" mx="auto" px={4}>
        <Heading 
          as="h2" 
          textAlign="center" 
          color="coffee.800"
          mb={12}
          position="relative"
          _after={{
            content: '""',
            display: 'block',
            width: '80px',
            height: '3px',
            bg: 'coffee.600',
            mx: 'auto',
            mt: 4
          }}
        >
          特色咖啡
        </Heading>

        {loading ? (
          <Grid 
            templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
            gap={8}
          >
            {[...Array(3)].map((_, i) => (
              <Box key={i} bg="white" p={4} borderRadius="lg">
                <Skeleton height="180px" mb={4} />
                <Skeleton height="20px" mb={2} />
                <Skeleton height="16px" width="80%" mb={4} />
                <Skeleton height="40px" width="100%" />
              </Box>
            ))}
          </Grid>
        ) : error ? (
          <Text textAlign="center" color="red.500">{error}</Text>
        ) : (
          <MotionGrid
            templateColumns={{ 
              base: 'repeat(1, 1fr)', 
              md: 'repeat(2, 1fr)', 
              lg: 'repeat(3, 1fr)' 
            }}
            gap={8}
            initial="hidden"
            animate="visible"
          >
            {featuredProducts.map((product, index) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                customAnimation={{ delay: index * 0.1 }}
              />
            ))}
          </MotionGrid>
        )}
      </Box>
    </MotionBox>
  );

  return (
    <Box as="main">
      <HeroSection />
      <FeaturedSection />
      
      {/* 其他区块示例 - 保持类似结构改造 */}
      <ProcessSection />
      <TestimonialsSection />
      {/* ... */}
    </Box>
  );
};

export default Home;