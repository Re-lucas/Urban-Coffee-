// backend/routes/adminRoutes.js
const express = require('express');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

// —— 两个模型都要拿到 —— 
const Admin = require('../models/Admin');
const User = require('../models/User');

const router = express.Router();

// 生成 JWT，payload 里固定带 isAdmin=true
const generateToken = (id) =>
  jwt.sign({ id, isAdmin: true }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

// @route POST /api/admin/login
// @desc  管理员登录（先查 Admin 表，查不到再查 User 表且 isAdmin=true）
// @access Public
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1. 先查超级管理员表
    let admin = await Admin.findOne({ email });

    // 2. 如果没查到，再查普通用户表里 isAdmin = true 的记录
    if (!admin) {
      const user = await User.findOne({ email });
      if (user && user.isAdmin) {
        admin = user;
      }
    }

    // 3. 校验密码
    if (admin && (await admin.matchPassword(password))) {
      return res.json({
        success: true,
        token: generateToken(admin._id),
        admin: { id: admin._id, email: admin.email },
      });
    }

    res.status(401).json({
      success: false,
      message: '邮箱或密码错误／没有管理权限',
    });
  })
);

module.exports = router;
