// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getAllOrders,
  updateOrderToDelivered,
  createPaymentIntent,
} = require('../controllers/orderController');
const { protect, admin, protectAdmin } = require('../middlewares/authMiddleware');

// 用户下单、查询
router.post('/:id/payintent', protect, createPaymentIntent);
router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);

// 管理员专属：插入 protectAdmin
router.get('/', protect, admin, protectAdmin, getAllOrders);
router.put('/:id/deliver', protect, admin, protectAdmin, updateOrderToDelivered);

module.exports = router;
