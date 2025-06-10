// backend/controllers/productController.js
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Review = require('../models/Review');

// @desc    获取全部商品列表（支持分页 + 搜索）
// @route   GET /api/products?keyword=&pageNumber=
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    根据 ID 获取单个商品信息
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('未找到商品');
  }
});

// @desc    创建新商品（管理员）
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock, isAvailable } = req.body;

  const product = new Product({
    user: req.user._id, // protect 会把当前用户 ID 放入 req.user
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
    numReviews: 0,
    rating: 0,
    isAvailable,   // 从前端拿到的布尔值
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    更新商品（管理员）
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock, isAvailable } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price !== undefined ? price : product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
    product.isAvailable  = isAvailable !== undefined ? isAvailable : product.isAvailable;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('未找到商品');
  }
});

// @desc    删除商品（管理员）
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: '商品已删除' });
  } else {
    res.status(404);
    throw new Error('未找到商品');
  }
});

// —— 新增：获取特色商品 ——
// @desc    获取所有标记了 isFeatured: true 的商品
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  // 举例：我们假设在 Product schema 里有一个 `isFeatured` 字段
  // 如果数据库里没有 isFeatured，可以改成其他筛选条件，比如按销量、按评分等
  const featured = await Product.find({ isFeatured: true }).limit(8);
  res.json(featured);
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,    // ❗️ 新增导出
};