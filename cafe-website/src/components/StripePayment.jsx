// components/StripePayment.jsx
import React, { useState } from 'react';
import { 
  Box, Button, Alert, AlertIcon, 
  AlertTitle, AlertDescription, Stack
} from '@chakra-ui/react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const StripePayment = ({ total, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (stripeError) {
        throw stripeError;
      }

      const response = await fetch('/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_method_id: paymentMethod.id,
          amount: Math.round(total * 100), // 转换为分
          currency: 'cny',
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setSucceeded(true);
      onSuccess(data);
    } catch (err) {
      setError(err.message || '支付处理失败');
    } finally {
      setProcessing(false);
    }
  };

  if (succeeded) {
    return (
      <Alert status="success" borderRadius="md">
        <AlertIcon />
        <Box>
          <AlertTitle>支付成功!</AlertTitle>
          <AlertDescription>
            您的订单已处理完成，感谢您的购买！
          </AlertDescription>
        </Box>
      </Alert>
    );
  }

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box 
        as="form" 
        onSubmit={handleSubmit}
        p={6} 
        borderWidth="1px" 
        borderRadius="lg"
        boxShadow="md"
      >
        <Stack spacing={5}>
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Box p={4} borderWidth="1px" borderRadius="md">
            <CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </Box>

          <Button
            colorScheme="brand"
            size="lg"
            type="submit"
            isLoading={processing}
            loadingText="支付处理中..."
            isFullWidth
          >
            支付 ¥{total.toFixed(2)}
          </Button>
        </Stack>
      </Box>
    </MotionBox>
  );
};

export default StripePayment;