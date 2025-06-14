// pages/Blog.jsx
import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Container,
  useColorModeValue,
  Stack,
  Divider
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const Blog = () => {
  const [posts] = useState([
    {
      id: 1,
      title: "咖啡烘焙的艺术",
      date: "2025-05-15",
      excerpt: "探索从浅焙到深焙如何影响咖啡的风味特征...",
      readTime: "5分钟阅读"
    },
    {
      id: 2,
      title: "手冲咖啡技巧指南",
      date: "2025-04-28",
      excerpt: "掌握完美手冲咖啡的五个关键步骤...",
      readTime: "7分钟阅读"
    },
    {
      id: 3,
      title: "单一产地 vs 混合咖啡",
      date: "2025-04-10",
      excerpt: "了解不同咖啡豆来源的独特风味特点...",
      readTime: "6分钟阅读"
    }
  ]);

  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const accentColor = useColorModeValue('brand.500', 'brand.300');

  return (
    <Container maxW="7xl" py={12}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        textAlign="center"
        mb={12}
      >
        <Heading as="h1" size="2xl" mb={4} color={accentColor}>
          咖啡博客
        </Heading>
        <Text fontSize="xl" color="gray.500">
          探索咖啡世界的最新资讯、冲泡技巧和行业趋势
        </Text>
      </MotionBox>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
        {posts.map((post, index) => (
          <MotionBox
            key={post.id}
            bg={cardBg}
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            borderWidth="1px"
            borderColor={borderColor}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: 'lg' }}
          >
            <Stack spacing={4} p={6}>
              <Box>
                <Text fontSize="sm" color="gray.500" mb={1}>
                  {post.date} · {post.readTime}
                </Text>
                <Heading as="h2" size="md" mb={2}>
                  {post.title}
                </Heading>
                <Text color="gray.600" noOfLines={3}>
                  {post.excerpt}
                </Text>
              </Box>
              
              <Divider borderColor={borderColor} />
              
              <MotionButton
                rightIcon={<FiArrowRight />}
                variant="ghost"
                colorScheme="brand"
                alignSelf="flex-end"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                阅读更多
              </MotionButton>
            </Stack>
          </MotionBox>
        ))}
      </SimpleGrid>

      {/* 加载更多按钮 */}
      <MotionBox
        textAlign="center"
        mt={12}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <MotionButton
          colorScheme="brand"
          size="lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          加载更多文章
        </MotionButton>
      </MotionBox>
    </Container>
  );
};

export default Blog;