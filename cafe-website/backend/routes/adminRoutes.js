// backend/routes/adminRoutes.js
const express = require('express');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const router = express.Router();

function generateToken(id) {
  return jwt.sign({ id, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

// @route POST /api/admin/login
// @desc  管理员登录
// @access Public
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (admin && (await admin.matchPassword(password))) {
      return res.json({
        success: true,
        token: generateToken(admin._id),
        admin: { id: admin._id, email: admin.email },
      });
    }
    res.status(401).json({ success: false, message: '邮箱或密码错误' });
  })
);

module.exports = router;
