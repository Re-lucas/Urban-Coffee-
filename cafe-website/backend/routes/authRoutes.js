// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  resetPasswordController,
  checkEmail,
} = require('../controllers/authController');
const { protect, admin } = require('../middlewares/authMiddleware');


// 注册新用户
router.post('/register', registerUser);

// 用户登录
router.post('/login', authUser);

// 忘记密码 → 重置密码
router.post('/reset-password', resetPasswordController);

// 检查邮箱是否已注册
router.get('/check-email', checkEmail);

// 获取当前登录用户的信息（需要先通过 protect 校验）
router.get('/profile', protect, getUserProfile);

// 更新个人信息
router.put('/profile', protect, updateUserProfile);

module.exports = router;
