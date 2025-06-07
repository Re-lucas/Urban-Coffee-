// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
} = require('../controllers/productController');
const { protect, admin, protectAdmin } = require('../middlewares/authMiddleware');

// 公开接口
router.get('/featured', getFeaturedProducts);
router.get('/', getProducts);
router.get('/:id', getProductById);

// 管理员专属接口：插入 protectAdmin
router.post('/', protect, admin, protectAdmin, createProduct);
router.put('/:id', protect, admin, protectAdmin, updateProduct);
router.delete('/:id', protect, admin, protectAdmin, deleteProduct);

module.exports = router;
