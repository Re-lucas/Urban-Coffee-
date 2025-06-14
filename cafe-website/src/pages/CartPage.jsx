// src/pages/CartPage.jsx
import React, { useState } from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import RequireAuth from '../components/RequireAuth';
import CartPanel from '../components/CartPanel';

const MotionBox = motion(Box);

const CartPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  return (
    <RequireAuth>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <CartPanel isOpen={isOpen} onClose={onClose} />
      </MotionBox>
    </RequireAuth>
  );
};

export default CartPage;