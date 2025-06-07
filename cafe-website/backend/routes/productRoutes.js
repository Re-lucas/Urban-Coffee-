// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,   // ❗️ 引入新方法
} = require('../controllers/productController');

const { protect, admin } = require('../middlewares/authMiddleware');

// @route   GET /api/products/featured
// @desc    获取特色商品列表
// @access  Public
router.get('/featured', getFeaturedProducts);

// @route   GET /api/products
// @desc    获取全部商品列表
// @access  Public
router.get('/', getProducts);

// @route   GET /api/products/:id
// @desc    根据 ID 获取单个商品信息
// @access  Public
router.get('/:id', getProductById);

// —— 以下操作仅限管理员 ——
// @route   POST /api/products
// @desc    创建新商品（管理员）
// @access  Private/Admin
router.post('/', protect, admin, createProduct);

// @route   PUT /api/products/:id
// @desc    更新商品（管理员）
// @access  Private/Admin
router.put('/:id', protect, admin, updateProduct);

// @route   DELETE /api/products/:id
// @desc    删除商品（管理员）
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
