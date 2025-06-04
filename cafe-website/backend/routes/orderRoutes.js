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
  createPaymentIntent,   // 新增这一行
} = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

// POST /api/orders/:id/payintent  （创建 PaymentIntent）
router.post('/:id/payintent', protect, createPaymentIntent);

// POST /api/orders  创建订单
router.post('/', protect, addOrderItems);

// GET /api/orders/myorders  获取本人所有订单
router.get('/myorders', protect, getMyOrders);

// GET /api/orders/:id  获取单个订单
router.get('/:id', protect, getOrderById);

// PUT /api/orders/:id/pay  标记支付完成
router.put('/:id/pay', protect, updateOrderToPaid);

// GET /api/orders  管理员获取所有订单
router.get('/', protect, admin, getAllOrders);

// PUT /api/orders/:id/deliver  管理员标记发货
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

module.exports = router;
