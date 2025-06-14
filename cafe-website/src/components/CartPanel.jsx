// components/CartPanel.jsx
import React from 'react';
import { 
  Box, Flex, Text, Button, IconButton,
  Drawer, DrawerOverlay, DrawerContent,
  DrawerHeader, DrawerBody, DrawerFooter,
  NumberInput, NumberInputField, NumberInputStepper,
  NumberIncrementStepper, NumberDecrementStepper,
  useDisclosure, useToast, Divider, Badge
} from '@chakra-ui/react';
import { FiX, FiShoppingBag } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const MotionBox = motion(Box);

const CartPanel = ({ isOpen, onClose }) => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    totalPrice,
    itemCount
  } = useCart();
  const toast = useToast();

  const handleQuantityChange = (productId, value) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      updateQuantity(productId, numValue);
    }
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
    toast({
      title: '已移除商品',
      status: 'info',
      duration: 1500,
      position: 'top-right'
    });
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size={{ base: 'full', md: 'md' }}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">
          <Flex justify="space-between" align="center">
            <Flex align="center">
              <FiShoppingBag />
              <Text ml={2} fontSize="xl" fontWeight="bold">
                购物车
                {itemCount > 0 && (
                  <Badge ml={2} colorScheme="brand">
                    {itemCount}
                  </Badge>
                )}
              </Text>
            </Flex>
            <IconButton
              icon={<FiX />}
              variant="ghost"
              onClick={onClose}
              aria-label="关闭购物车"
            />
          </Flex>
        </DrawerHeader>

        <DrawerBody p={0}>
          {cartItems.length === 0 ? (
            <Flex
              direction="column"
              align="center"
              justify="center"
              h="60vh"
              color="gray.500"
            >
              <Text fontSize="lg" mb={4}>
                购物车空空如也
              </Text>
              <Button 
                as={Link}
                to="/menu"
                colorScheme="brand"
                onClick={onClose}
              >
                去逛逛
              </Button>
            </Flex>
          ) : (
            <Box>
              {cartItems.map((item) => (
                <MotionBox
                  key={item.product}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  p={4}
                  borderBottomWidth="1px"
                >
                  <Flex justify="space-between">
                    <Box flex={1}>
                      <Text fontWeight="medium">{item.name}</Text>
                      <Text color="gray.600" fontSize="sm">
                        ¥{item.price.toFixed(2)}
                      </Text>
                    </Box>

                    <Flex align="center" ml={4}>
                      <NumberInput
                        size="sm"
                        maxW={20}
                        min={1}
                        value={item.quantity}
                        onChange={(value) => 
                          handleQuantityChange(item.product, value)
                        }
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      
                      <IconButton
                        icon={<FiX />}
                        size="sm"
                        ml={2}
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleRemove(item.product)}
                        aria-label="移除商品"
                      />
                    </Flex>
                  </Flex>
                </MotionBox>
              ))}
            </Box>
          )}
        </DrawerBody>

        {cartItems.length > 0 && (
          <DrawerFooter
            borderTopWidth="1px"
            flexDirection="column"
          >
            <Flex
              justify="space-between"
              w="full"
              mb={4}
              fontSize="lg"
            >
              <Text>总计：</Text>
              <Text fontWeight="bold">¥{totalPrice.toFixed(2)}</Text>
            </Flex>
            <Button
              as={Link}
              to="/checkout"
              onClick={onClose}
              colorScheme="brand"
              size="lg"
              w="full"
              rightIcon={<FiShoppingBag />}
            >
              去结算
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default CartPanel;