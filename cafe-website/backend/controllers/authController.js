// backend/controllers/authController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/jwtUtils');

// @desc    注册新用户
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  // 先检查用户是否已存在
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('该邮箱已被注册');
  }

  const user = await User.create({
    name,
    email,
    password,
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
    throw new Error('无效用户数据');
  }
});

// @desc    登录用户并返回 JWT
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  // 暂时只返回 501，后续补充真正逻辑
  res.status(501).json({ message: 'authUser 暂未实现' });
});

// @desc    获取用户个人信息
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // 暂时只返回 501，后续补充真正逻辑
  res.status(501).json({ message: 'getUserProfile 暂未实现' });
});

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
};
