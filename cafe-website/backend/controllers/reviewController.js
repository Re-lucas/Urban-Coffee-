// backend/controllers/reviewController.js
const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');

// @desc    针对某商品添加评论
// @route   POST /api/reviews/:productId
// @access  Private
const addProductReview = asyncHandler(async (req, res) => {
  // 暂时占位，后续实现真实逻辑
  res.status(501).json({ message: 'addProductReview 暂未实现' });
});

// @desc    获取某商品的所有评论
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  // 暂时占位，后续实现真实逻辑
  res.status(501).json({ message: 'getProductReviews 暂未实现' });
});

module.exports = {
  addProductReview,
  getProductReviews,
};
