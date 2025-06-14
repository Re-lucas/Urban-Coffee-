// components/CartIcon.jsx
import React from 'react';
import { 
  IconButton, Badge, 
  useDisclosure, Tooltip
} from '@chakra-ui/react';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import CartPanel from './CartPanel';

const CartIcon = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { itemCount } = useCart();

  return (
    <>
      <Tooltip label="查看购物车" placement="bottom">
        <Box position="relative">
          <IconButton
            icon={<FiShoppingCart />}
            variant="ghost"
            fontSize="xl"
            aria-label="购物车"
            onClick={onOpen}
          />
          {itemCount > 0 && (
            <Badge
              colorScheme="red"
              borderRadius="full"
              position="absolute"
              top="-1"
              right="-1"
              fontSize="xs"
            >
              {itemCount}
            </Badge>
          )}
        </Box>
      </Tooltip>
      
      <CartPanel isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default CartIcon;