// pages/About.jsx
import React from 'react';
import { 
  Box,
  Heading,
  Text,
  VStack,
  Container,
  useColorModeValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const About = () => {
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      bg={bgColor}
      minH="calc(100vh - 80px)"
      py={8}
    >
      <Container maxW="container.lg">
        <VStack spacing={8} align="stretch">
          <Heading 
            as="h1" 
            size="xl" 
            textAlign="center"
            color="brand.500"
            mb={6}
          >
            关于我们
          </Heading>

          <Text fontSize="lg" color={textColor} lineHeight="tall">
            我们的咖啡故事始于2010年...
          </Text>

          {/* 可以添加更多内容区块 */}
          <Box mt={8}>
            <Heading as="h2" size="lg" mb={4} color="coffee.700">
              我们的使命
            </Heading>
            <Text color={textColor}>
              致力于提供最优质的咖啡体验，从种植到杯中的每一个环节都精益求精。
            </Text>
          </Box>

          <Box mt={8}>
            <Heading as="h2" size="lg" mb={4} color="coffee.700">
              团队介绍
            </Heading>
            <Text color={textColor}>
              我们拥有一支专业的咖啡师团队，每位成员都经过严格培训和认证。
            </Text>
          </Box>
        </VStack>
      </Container>
    </MotionBox>
  );
};

export default About;