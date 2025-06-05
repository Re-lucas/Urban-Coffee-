// backend/controllers/authController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/jwtUtils'); // 自行实现：接收 userId，返回 JWT 字符串

// @desc    注册新用户
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // 检查请求必填字段
  if (!name || !email || !password) {
    const err = new Error('请提供用户名、邮箱和密码');
    err.statusCode = 400;
    throw err;
  }

  // 查询邮箱是否已被注册
  const userExists = await User.findOne({ email });
  if (userExists) {
    // 先创建一个 Error 实例
    const err = new Error('该邮箱已被注册');
    // 将状态码附加到 err 对象上
    err.statusCode = 400;
    // 直接抛出这个带 statusCode 的错误
    throw err;
  }

  // 创建新用户
  const user = await User.create({
    name,
    email,
    password, // 会在 User model pre('save') 钩子中自动加盐哈希
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('无效的用户数据');
  }
});

// @desc    登录用户并返回 JWT
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 检查请求必填字段
  if (!email || !password) {
    res.status(400);
    throw new Error('请提供邮箱和密码');
  }

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    // matchPassword 在 User model 里用 bcrypt.compare 完成
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('邮箱或密码错误');
  }
});

// @desc    获取用户个人信息
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // protect 中间件会把 req.user = User.findById(decodedId).select('-password')
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('未找到用户');
  }
});

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
};
