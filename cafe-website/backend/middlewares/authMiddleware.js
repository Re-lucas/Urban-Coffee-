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
      // 格式： Authorization: "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];
      // 解码 token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // 根据解码后拿到的 ID，查询用户信息（不返回密码字段）
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
    if (!decoded.isAdmin) throw new Error('非管理员身份');
    req.admin = { id: decoded.id };
    next();
  } catch (err) {
    res.status(401);
    throw new Error('管理员鉴权失败');
  }
});

module.exports = {
  protect,
  admin,
  protectAdmin
};