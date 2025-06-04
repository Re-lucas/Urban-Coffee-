// backend/controllers/productController.js
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    获取全部商品列表
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  res.status(501).json({ message: 'getProducts 暂未实现' });
});

// @desc    根据 ID 获取单个商品信息
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  res.status(501).json({ message: 'getProductById 暂未实现' });
});

// @desc    创建新商品（管理员）
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  res.status(501).json({ message: 'createProduct 暂未实现' });
});

// @desc    更新商品（管理员）
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  res.status(501).json({ message: 'updateProduct 暂未实现' });
});

// @desc    删除商品（管理员）
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  res.status(501).json({ message: 'deleteProduct 暂未实现' });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
