// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// @route   POST /api/auth/register
// @desc    用户注册
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    用户登录，返回 JWT
// @access  Public
router.post('/login', authUser);

// @route   GET /api/auth/profile
// @desc    获取当前已登录用户信息
// @access  Private
router.get('/profile', protect, getUserProfile);

module.exports = router;
