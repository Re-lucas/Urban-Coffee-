// backend/routes/adminRoutes.js
const express = require('express');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

// —— 两个模型都要拿到 —— 
const Admin   = require('../models/Admin');
const User    = require('../models/User');

const router = express.Router();

// 生成 JWT
const generateToken = (id) =>
  jwt.sign({ id, isAdmin: true }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

// @route POST /api/admin/login
// @desc  管理员登录（支持 Admin or User(isAdmin)）
// @access Public
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // —— 1. 先去 Admin 表里找 —— 
    let admin = await Admin.findOne({ email });
    // —— 2. 如果没找到，就退而求其次，查 User 表里打了 isAdmin: true 的 —— 
    if (!admin) {
      const user = await User.findOne({ email });
      if (user && user.isAdmin) {
        admin = user;
      }
    }

    // —— 3. 最终只要 admin 变量指向了一个对象，就校验密码 —— 
    //    （无论它原来是 Admin 还是 User，都要有 matchPassword 方法）
    if (admin && (await admin.matchPassword(password))) {
      return res.json({
        success: true,
        token: generateToken(admin._id),
        admin: { id: admin._id, email: admin.email },
      });
    }

    res.status(401).json({ success: false, message: '邮箱或密码错误／没有管理权限' });
  })
);

module.exports = router;
