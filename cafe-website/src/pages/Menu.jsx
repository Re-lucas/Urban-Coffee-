import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../utils/axiosConfig';
import {
  Flex,
  Box,
  Heading,
  Input,
  Select,
  Button,
  Text,
  SimpleGrid,
  Spinner,
  Alert,
  AlertIcon,
  ButtonGroup,
  IconButton,
  useToast
} from '@chakra-ui/react';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const toast = useToast();

  const initialSearch = queryParams.get('search') || '';
  const initialCategory = queryParams.get('category') || 'All';
  const initialMinPrice = queryParams.get('minPrice') || '';
  const initialMaxPrice = queryParams.get('maxPrice') || '';
  const initialPage = queryParams.get('page') || 1;

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [currentPage, setCurrentPage] = useState(Number(initialPage));

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          search: searchQuery,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          page: currentPage,
          pageSize: 12
        };

        const { data } = await api.get('/products', { params });

        if (Array.isArray(data.products)) {
          const cats = Array.from(new Set(data.products.map(p => p.category)));
          setCategories(cats);
        }

        let fetchedProducts = [];
        let fetchedTotalPages = 1;
        let fetchedTotalProducts = 0;

        if (Array.isArray(data)) {
          fetchedProducts = data;
          fetchedTotalProducts = data.length;
        } else if (Array.isArray(data.products)) {
          fetchedProducts = data.products;
          fetchedTotalPages = data.totalPages ?? 1;
          fetchedTotalProducts = data.totalProducts ?? data.products.length;
        } else if (Array.isArray(data.docs)) {
          fetchedProducts = data.docs;
          fetchedTotalPages = data.totalPages ?? 1;
          fetchedTotalProducts = data.totalDocs ?? data.docs.length;
        } else {
          fetchedProducts = Array.isArray(data.products)
            ? data.products
            : Array.isArray(data.docs)
            ? data.docs
            : [];
        }

        setProducts(fetchedProducts);
        setTotalPages(fetchedTotalPages);
        setTotalProducts(fetchedTotalProducts);
      } catch (err) {
        console.error('获取商品失败：', err);
        setError(err.response?.data?.message || '获取商品失败');
        toast({
          title: '加载失败',
          description: err.response?.data?.message || '获取商品列表时出错',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const newQueryParams = new URLSearchParams();
    if (searchQuery) newQueryParams.set('search', searchQuery);
    if (selectedCategory !== 'All') newQueryParams.set('category', selectedCategory);
    if (minPrice) newQueryParams.set('minPrice', minPrice);
    if (maxPrice) newQueryParams.set('maxPrice', maxPrice);
    if (currentPage > 1) newQueryParams.set('page', currentPage);
    navigate(`?${newQueryParams.toString()}`, { replace: true });
  }, [searchQuery, selectedCategory, minPrice, maxPrice, currentPage, navigate, toast]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setCurrentPage(1);
  };

  return (
    <Box maxW="container.xl" mx="auto" px={4} py={8}>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Heading as="h1" size="xl" mb={8} textAlign="center" color="brand.600">
          咖啡菜单
        </Heading>

        {totalProducts > 0 && (
          <Text fontSize="lg" mb={4} color="gray.600">
            找到 {totalProducts} 个商品
          </Text>
        )}

        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={4}
          mb={8}
          p={4}
          bg="white"
          borderRadius="lg"
          boxShadow="sm"
        >
          <Flex flex={1} alignItems="center">
            <Input
              placeholder="搜索咖啡名称或描述..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="lg"
              focusBorderColor="brand.500"
            />
            <IconButton
              icon={<FiSearch />}
              aria-label="搜索"
              ml={2}
              colorScheme="brand"
              size="lg"
              onClick={() => setCurrentPage(1)}
            />
          </Flex>

          <Select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            maxW={{ base: 'full', md: '200px' }}
            size="lg"
            focusBorderColor="brand.500"
          >
            <option value="All">全部分类</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>

          <Flex gap={2} alignItems="center">
            <Input
              type="number"
              placeholder="最低价"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min="0"
              step="0.01"
              size="lg"
              w="120px"
              focusBorderColor="brand.500"
            />
            <Text>至</Text>
            <Input
              type="number"
              placeholder="最高价"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
              step="0.01"
              size="lg"
              w="120px"
              focusBorderColor="brand.500"
            />
          </Flex>

          <Button
            leftIcon={<FiRefreshCw />}
            onClick={resetFilters}
            size="lg"
            variant="outline"
            colorScheme="gray"
          >
            重置
          </Button>
        </Flex>

        {loading ? (
          <Flex justify="center" py={12}>
            <Spinner size="xl" color="brand.500" />
          </Flex>
        ) : error ? (
          <Alert status="error" borderRadius="md" mb={6}>
            <AlertIcon />
            {error}
          </Alert>
        ) : products.length === 0 ? (
          <Text textAlign="center" py={12} fontSize="lg" color="gray.500">
            没有符合条件的商品。
          </Text>
        ) : (
          <>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6} mb={8}>
              {products.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  searchQuery={searchQuery}
                />
              ))}
            </SimpleGrid>

            {totalPages > 1 && (
              <Flex justify="center" mt={8}>
                <ButtonGroup isAttached variant="outline">
                  <Button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    上一页
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <Button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      colorScheme={currentPage === pageNum ? 'brand' : 'gray'}
                    >
                      {pageNum}
                    </Button>
                  ))}
                  <Button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    下一页
                  </Button>
                </ButtonGroup>
              </Flex>
            )}
          </>
        )}
      </MotionBox>
    </Box>
  );
};

export default Menu;