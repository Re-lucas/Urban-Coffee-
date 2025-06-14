// pages/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../utils/axiosConfig';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Divider,
  useToast,
  useColorModeValue,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiCreditCard, FiDollarSign, FiCheckCircle } from 'react-icons/fi';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const StripePaymentForm = ({ orderId, grandTotal, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const { data } = await api.post(`/orders/${orderId}/payintent`);
      const { clientSecret } = data;

      const cardElement = elements.getElement(CardElement);
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement }
      });

      if (error) {
        setPaymentError(error.message);
        toast({
          title: '支付失败',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        onPaymentSuccess();
      }
    } catch (err) {
      setPaymentError(err.message || '支付处理失败');
      toast({
        title: '支付错误',
        description: err.message || '支付处理失败',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Stack spacing={6} p={6} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
      <Heading size="md">信用卡支付</Heading>
      <Text fontSize="lg" fontWeight="bold">
        订单总金额: ${grandTotal.toFixed(2)}
      </Text>
      
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: useColorModeValue('#424770', '#ffffff'),
                  '::placeholder': {
                    color: useColorModeValue('#aab7c4', '#aab7c4'),
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </FormControl>
        
        {paymentError && (
          <Text color="red.500" mb={4}>
            {paymentError}
          </Text>
        )}
        
        <MotionButton
          type="submit"
          colorScheme="brand"
          size="lg"
          width="full"
          isLoading={isProcessing}
          loadingText="支付处理中..."
          rightIcon={<FiCreditCard />}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isProcessing || !stripe}
        >
          支付 ${grandTotal.toFixed(2)}
        </MotionButton>
      </form>
    </Stack>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '温哥华',
    postalCode: '',
    phone: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [orderError, setOrderError] = useState(null);
  
  const calculateShipping = (subtotal) => {
    if (subtotal >= 200) return 0;
    if (subtotal >= 50) return 2;
    return 5;
  };
  
  const shippingFee = calculateShipping(totalPrice);
  const tax = totalPrice * 0.12;
  const grandTotal = totalPrice + tax + shippingFee;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setOrderError(null);
    
    try {
      const { data: createdOrder } = await api.post('/orders', {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.quantity,
          image: item.image,
          price: item.price,
          product: item.product,
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: 'Canada',
        },
        paymentMethod,
        itemsPrice: totalPrice,
        taxPrice: tax,
        shippingPrice: shippingFee,
        totalPrice: grandTotal,
      });

      setCreatedOrder({
        id: createdOrder._id,
        grandTotal
      });
      
      toast({
        title: '订单创建成功',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('订单提交失败:', error);
      setOrderError('订单提交失败，请重试');
      toast({
        title: '订单提交失败',
        description: error.response?.data?.message || '请检查您的信息并重试',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePaymentSuccess = () => {
    clearCart();
    navigate(`/order-confirmation/${createdOrder.id}`);
    toast({
      title: '支付成功',
      description: '感谢您的购买！',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  if (createdOrder) {
    return (
      <Container maxW="6xl" py={8}>
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Heading as="h1" size="xl" mb={8} textAlign="center">
            支付订单
          </Heading>
          
          <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={8}>
            <GridItem>
              <Elements stripe={stripePromise}>
                <StripePaymentForm 
                  orderId={createdOrder.id} 
                  grandTotal={createdOrder.grandTotal}
                  onPaymentSuccess={handlePaymentSuccess} 
                />
              </Elements>
            </GridItem>
            
            <GridItem>
              <OrderSummary 
                cartItems={cartItems}
                totalPrice={totalPrice}
                shippingFee={shippingFee}
                tax={tax}
                grandTotal={grandTotal}
              />
            </GridItem>
          </Grid>
        </MotionBox>
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={8}>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Heading as="h1" size="xl" mb={8} textAlign="center">
          结算
        </Heading>
        
        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={8}>
          <GridItem>
            <Stack spacing={8} as="form" onSubmit={handleOrderSubmit}>
              <Stack spacing={6} p={6} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                <Heading size="md">收货信息</Heading>
                
                <FormControl isRequired>
                  <FormLabel>姓名</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>邮箱</FormLabel>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>地址</FormLabel>
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </FormControl>
                
                <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap={4}>
                  <FormControl isRequired>
                    <FormLabel>城市</FormLabel>
                    <Input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>邮编</FormLabel>
                    <Input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Grid>
                
                <FormControl isRequired>
                  <FormLabel>电话</FormLabel>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </FormControl>
              </Stack>
              
              <Stack spacing={6} p={6} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                <Heading size="md">支付方式</Heading>
                
                <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
                  <Stack direction="column">
                    <Radio value="creditCard" colorScheme="brand">
                      <HStack ml={2}>
                        <FiCreditCard />
                        <Text>信用卡支付</Text>
                      </HStack>
                    </Radio>
                    
                    <Radio value="cash" colorScheme="brand">
                      <HStack ml={2}>
                        <FiDollarSign />
                        <Text>现金到付</Text>
                      </HStack>
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Stack>
            </Stack>
          </GridItem>
          
          <GridItem>
            <OrderSummary 
              cartItems={cartItems}
              totalPrice={totalPrice}
              shippingFee={shippingFee}
              tax={tax}
              grandTotal={grandTotal}
              orderError={orderError}
              isSubmitting={isSubmitting}
              onOrderSubmit={handleOrderSubmit}
              hasItems={cartItems.length > 0}
            />
          </GridItem>
        </Grid>
      </MotionBox>
    </Container>
  );
};

const OrderSummary = ({ 
  cartItems, 
  totalPrice, 
  shippingFee, 
  tax, 
  grandTotal, 
  orderError, 
  isSubmitting, 
  onOrderSubmit,
  hasItems
}) => {
  return (
    <Stack spacing={6} p={6} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md" position="sticky" top="20px">
      <Heading size="md">订单摘要</Heading>
      
      <Stack spacing={4} divider={<Divider />}>
        {cartItems.map((item, idx) => (
          <HStack key={item.id ?? item._id ?? idx} justify="space-between">
            <Text>
              {item.name} × {item.quantity}
            </Text>
            <Text fontWeight="bold">
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </HStack>
        ))}
      </Stack>
      
      <Stack spacing={2}>
        <HStack justify="space-between">
          <Text>商品小计:</Text>
          <Text>${totalPrice.toFixed(2)}</Text>
        </HStack>
        
        <HStack justify="space-between">
          <Text>运费:</Text>
          <Text>
            {shippingFee === 0 ? (
              <Text as="span" color="green.500">免费</Text>
            ) : (
              `$${shippingFee.toFixed(2)}`
            )}
          </Text>
        </HStack>
        
        <HStack justify="space-between">
          <Text>税费 (12%):</Text>
          <Text>${tax.toFixed(2)}</Text>
        </HStack>
        
        <Divider />
        
        <HStack justify="space-between" fontSize="lg" fontWeight="bold">
          <Text>总计:</Text>
          <Text>${grandTotal.toFixed(2)}</Text>
        </HStack>
      </Stack>
      
      {orderError && (
        <Text color="red.500" textAlign="center">
          {orderError}
        </Text>
      )}
      
      {onOrderSubmit && (
        <MotionButton
          colorScheme="brand"
          size="lg"
          width="full"
          onClick={onOrderSubmit}
          isLoading={isSubmitting}
          loadingText="提交订单中..."
          rightIcon={<FiCheckCircle />}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!hasItems}
        >
          提交订单
        </MotionButton>
      )}
    </Stack>
  );
};

export default Checkout;