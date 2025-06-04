// backend/controllers/reviewController.js
const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    针对某商品添加评论
// @route   POST /api/reviews/:productId
// @access  Private
const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.productId;

  if (!rating || !comment) {
    res.status(400);
    throw new Error('请提供评分和评论内容');
  }

  const product = await Product.findById(productId);
  if (product) {
    // 检查当前用户是否已对该商品评论过
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('您已对该商品评论过');
    }

    // 创建新评论
    const review = new Review({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      comment,
    });

    await review.save();

    // 更新该商品的 numReviews 和 rating 平均分
    const reviews = await Review.find({ product: productId });
    product.numReviews = reviews.length;
    product.rating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await product.save();

    res.status(201).json({ message: '评论已添加' });
  } else {
    res.status(404);
    throw new Error('未找到商品');
  }
});

// @desc    获取某商品的所有评论
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
  res.json(reviews);
});

module.exports = {
  addProductReview,
  getProductReviews,
};
