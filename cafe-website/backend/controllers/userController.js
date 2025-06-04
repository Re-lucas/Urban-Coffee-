// backend/controllers/userController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    获取所有用户（仅限管理员）
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  // 暂时占位，后续再实现真实逻辑
  res.status(501).json({ message: 'getUsers 暂未实现' });
});

// @desc    获取指定 ID 的用户（仅限管理员）
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  res.status(501).json({ message: 'getUserById 暂未实现' });
});

// @desc    更新指定用户信息（仅限管理员）
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  res.status(501).json({ message: 'updateUser 暂未实现' });
});

// @desc    删除指定用户（仅限管理员）
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  res.status(501).json({ message: 'deleteUser 暂未实现' });
});

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
