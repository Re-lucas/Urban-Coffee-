// backend/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { addProductReview, getProductReviews } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

// @route   POST /api/reviews/:productId
// @desc    针对某商品添加评论
// @access  Private
router.post('/:productId', protect, addProductReview);

// @route   GET /api/reviews/:productId
// @desc    获取某商品的所有评论
// @access  Public
router.get('/:productId', getProductReviews);

module.exports = router;
