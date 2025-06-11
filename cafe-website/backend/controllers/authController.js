// backend/controllers/authController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/jwtUtils'); // 修改后：接收 userId, isAdmin
const User = require('../models/User'); // 确保已引入 User

// @desc    注册新用户
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const err = new Error('请提供用户名、邮箱和密码');
    err.statusCode = 400;
    throw err;
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    const err = new Error('该邮箱已被注册');
    err.statusCode = 400;
    throw err;
  }

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
      token: generateToken(user._id, user.isAdmin), // <--- 这里要带 isAdmin
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

  if (!email || !password) {
    res.status(400);
    throw new Error('请提供邮箱和密码');
  }

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id, user.isAdmin), // <--- 这里要带 isAdmin
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
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('未找到用户');
  }
});

// @desc    更新当前登录用户个人信息（昵称、头像等）
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // 允许更新的字段
    user.name   = req.body.name   ?? user.name;
    user.avatar = req.body.avatar ?? user.avatar;
    // 支持修改密码（前端在发送 profileData 时带上 password 即可）
     if (req.body.password) {
     user.password = req.body.password;
   }
    const updated = await user.save();

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      avatar: updated.avatar,
      isAdmin: updated.isAdmin,
      token: generateToken(updated._id, updated.isAdmin),
    });
  } else {
    res.status(404);
    throw new Error('用户未找到');
  }
});

// @desc    重置密码
// @route   POST /api/auth/reset-password
// @access  Public
const resetPasswordController = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    res.status(400);
    throw new Error('请提供邮箱和新密码');
  }

  // 查找用户
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    res.status(404);
    throw new Error('用户不存在');
  }

  // 直接赋值，pre('save') 钩子会自动加盐哈希
  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: '密码已重置，请登录。' });
});

// @desc    检查邮箱是否已注册
// @route   GET /api/auth/check-email?email=xxx
// @access  Public
const checkEmail = asyncHandler(async (req, res) => {
  const email = req.query.email?.toLowerCase();
  if (!email) {
    res.status(400);
    throw new Error('请提供邮箱');
  }
  const user = await User.findOne({ email });
  res.json({ exists: !!user });
});
module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  resetPasswordController,
  checkEmail,  // 导出新接口
};
