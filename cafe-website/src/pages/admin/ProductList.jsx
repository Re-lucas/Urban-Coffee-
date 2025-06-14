import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../utils/axiosConfig';
import {
  Box,
  Heading,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  IconButton,
  useToast,
  Badge,
  ButtonGroup,
  Stack,
  Text
} from '@chakra-ui/react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const ProductList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const query = new URLSearchParams(location.search);
  const keyword = query.get('keyword') || '';
  const pageNumber = Number(query.get('pageNumber')) || 1;
  
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState(keyword);
  const [page, setPage] = useState(pageNumber);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(
          `/products?keyword=${keyword}&pageNumber=${pageNumber}`
        );
        setProducts(data.products);
        setPage(data.page);
        setPages(data.pages);
      } catch (err) {
        setError(err.response?.data?.message || '获取商品列表失败');
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
  }, [keyword, pageNumber, toast]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/admin/products?keyword=${searchText}&pageNumber=1`);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('确定要删除此商品吗？')) {
      try {
        setLoading(true);
        await api.delete(`/products/${productId}`);
        const { data } = await api.get(
          `/products?keyword=${keyword}&pageNumber=${pageNumber}`
        );
        setProducts(data.products);
        setPage(data.page);
        setPages(data.pages);
        toast({
          title: '删除成功',
          description: '商品已删除',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        setError(err.response?.data?.message || '删除商品失败');
        toast({
          title: '删除失败',
          description: err.response?.data?.message || '删除商品时出错',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h2" size="lg">
          商品库存管理
        </Heading>
        <Button
          as={Link}
          to="/admin/products/create"
          leftIcon={<FiPlus />}
          colorScheme="brand"
        >
          添加新商品
        </Button>
      </Flex>

      <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mb={6}>
        <Flex as="form" onSubmit={handleSearch} flex={1}>
          <Input
            placeholder="搜索商品名称..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            focusBorderColor="brand.500"
          />
          <IconButton
            icon={<FiSearch />}
            aria-label="搜索"
            ml={2}
            colorScheme="brand"
            type="submit"
          />
        </Flex>
      </Stack>

      {loading && (
        <Flex justify="center" py={12}>
          <Spinner size="xl" />
        </Flex>
      )}

      {error && (
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>名称</Th>
              <Th>分类</Th>
              <Th isNumeric>价格 (¥)</Th>
              <Th isNumeric>库存</Th>
              <Th>状态</Th>
              <Th>操作</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.length === 0 ? (
              <Tr>
                <Td colSpan={7} textAlign="center" py={8}>
                  {loading ? '加载中...' : '无匹配商品'}
                </Td>
              </Tr>
            ) : (
              products.map((p) => (
                <Tr key={p._id}>
                  <Td fontSize="sm">{p._id.slice(0, 8)}</Td>
                  <Td fontWeight="medium">{p.name}</Td>
                  <Td>{p.category}</Td>
                  <Td isNumeric>{p.price.toFixed(2)}</Td>
                  <Td isNumeric>
                    <Badge
                      colorScheme={p.countInStock <= 0 ? 'red' : 'green'}
                      variant="subtle"
                    >
                      {p.countInStock}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={p.isAvailable ? 'green' : 'red'}
                      variant="subtle"
                    >
                      {p.isAvailable ? '在售' : '下架'}
                    </Badge>
                  </Td>
                  <Td>
                    <ButtonGroup size="sm" variant="outline">
                      <IconButton
                        as={Link}
                        to={`/admin/products/${p._id}/edit`}
                        icon={<FiEdit2 />}
                        aria-label="编辑"
                        colorScheme="blue"
                      />
                      <IconButton
                        icon={<FiTrash2 />}
                        aria-label="删除"
                        colorScheme="red"
                        onClick={() => handleDelete(p._id)}
                      />
                    </ButtonGroup>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      {pages > 1 && (
        <Flex justify="center" mt={8}>
          <ButtonGroup isAttached variant="outline">
            {[...Array(pages).keys()].map((x) => (
              <Button
                key={x + 1}
                as={Link}
                to={`/admin/products?keyword=${keyword}&pageNumber=${x + 1}`}
                colorScheme={x + 1 === page ? 'brand' : 'gray'}
              >
                {x + 1}
              </Button>
            ))}
          </ButtonGroup>
        </Flex>
      )}
    </Box>
  );
};

export default ProductList;