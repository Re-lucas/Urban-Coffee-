// pages/Contact.jsx
import React from 'react';
import {
  Box,
  Heading,
  Text,
  Container,
  Grid,
  GridItem,
  Stack,
  useColorModeValue,
  Icon,
  Link
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiClock, FiMail } from 'react-icons/fi';
import ContactForm from '../components/ContactForm';

const MotionBox = motion(Box);
const MotionGrid = motion(Grid);

const Contact = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const accentColor = useColorModeValue('brand.500', 'brand.300');

  return (
    <Container maxW="6xl" py={12}>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Heading as="h1" size="xl" mb={8} textAlign="center" color={accentColor}>
          联系我们
        </Heading>
        
        <MotionGrid
          templateColumns={{ base: '1fr', md: '1fr 1fr' }}
          gap={8}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GridItem>
            <Stack spacing={6} p={8} bg={bgColor} borderRadius="md" height="100%">
              <Heading size="md">店铺信息</Heading>
              
              <Stack spacing={4}>
                <HStack align="flex-start">
                  <Icon as={FiMapPin} boxSize={5} color={accentColor} mt={1} />
                  <Box>
                    <Text fontWeight="bold">地址</Text>
                    <Text>温哥华市中心咖啡街123号</Text>
                    <Link 
                      href="https://maps.google.com" 
                      color={accentColor}
                      isExternal
                    >
                      查看地图
                    </Link>
                  </Box>
                </HStack>
                
                <HStack align="flex-start">
                  <Icon as={FiPhone} boxSize={5} color={accentColor} mt={1} />
                  <Box>
                    <Text fontWeight="bold">电话</Text>
                    <Text>(604) 123-4567</Text>
                  </Box>
                </HStack>
                
                <HStack align="flex-start">
                  <Icon as={FiMail} boxSize={5} color={accentColor} mt={1} />
                  <Box>
                    <Text fontWeight="bold">邮箱</Text>
                    <Text>info@urbancoffee.com</Text>
                  </Box>
                </HStack>
                
                <HStack align="flex-start">
                  <Icon as={FiClock} boxSize={5} color={accentColor} mt={1} />
                  <Box>
                    <Text fontWeight="bold">营业时间</Text>
                    <Text>周一至周五 7:00 - 20:00</Text>
                    <Text>周末 8:00 - 18:00</Text>
                  </Box>
                </HStack>
              </Stack>
            </Stack>
          </GridItem>
          
          <GridItem>
            <Stack spacing={6} p={8} bg={bgColor} borderRadius="md">
              <Heading size="md">发送留言</Heading>
              <ContactForm />
            </Stack>
          </GridItem>
        </MotionGrid>
      </MotionBox>
    </Container>
  );
};

export default Contact;