// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getAllOrders,
} = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

// @route   POST /api/orders
// @desc    创建新的订单
// @access  Private
router.post('/', protect, addOrderItems);

// @route   GET /api/orders/myorders
// @desc    获取当前用户的所有订单
// @access  Private
router.get('/myorders', protect, getMyOrders);

// @route   GET /api/orders/:id
// @desc    根据 ID 获取订单详情
// @access  Private
router.get('/:id', protect, getOrderById);

// @route   PUT /api/orders/:id/pay
// @desc    标记订单为已支付（Stripe 支付完成后回调）
// @access  Private
router.put('/:id/pay', protect, updateOrderToPaid);

// 以下仅管理员可操作：
// @route   GET /api/orders
// @desc    获取所有订单
// @access  Private/Admin
router.get('/', protect, admin, getAllOrders);

// @route   PUT /api/orders/:id/deliver
// @desc    标记订单为已发货
// @access  Private/Admin
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

module.exports = router;
