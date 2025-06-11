// src/pages/CartPage.jsx
import React, { useState } from 'react';
import RequireAuth from '../components/RequireAuth';
import CartPanel from '../components/CartPanel';

const CartPage = () => {
  const [open, setOpen] = useState(true);
  return (
    <RequireAuth>
      <CartPanel isOpen={open} onClose={() => setOpen(false)} />
    </RequireAuth>
  );
};

export default CartPage;
