// backend/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// protect 用于验证请求头里的 JWT，确认用户已登录
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('不是合法的 Token，请先登录');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('没有 Token，拒绝访问');
  }
});

// admin 用于校验当前登录用户是否为管理员（需要先通过 protect）
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('仅限管理员访问');
  }
};

/**
 * 保护管理员接口，只允许带了 isAdmin=true 的 JWT 访问
 * 本质上和 protect + admin 二合一
 */
const protectAdmin = asyncHandler(async (req, res, next) => {
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    res.status(401);
    throw new Error('未提供管理员 token');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 查询并赋值 user，保持和 protect 一致
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isAdmin) {
      res.status(403);
      throw new Error('非管理员身份');
    }
    req.user = user; // 赋值给 req.user，保持前后一致
    next();
  } catch (err) {
    res.status(401);
    throw new Error('管理员鉴权失败');
  }
});

module.exports = {
  protect,
  admin,
  protectAdmin,
};
