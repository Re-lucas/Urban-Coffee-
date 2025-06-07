// backend/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { addProductReview, getProductReviews } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

// 添加评论（登录用户）
router.post('/:productId', protect, addProductReview);

// 获取评论（公开）
router.get('/:productId', getProductReviews);

module.exports = router;
