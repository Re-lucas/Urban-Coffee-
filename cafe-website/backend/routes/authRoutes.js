// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// 注册新用户
router.post('/register', registerUser);

// 用户登录
router.post('/login', authUser);

// 获取当前登录用户的信息（需要先通过 protect 校验）
router.get('/profile', protect, getUserProfile);

module.exports = router;
