// backend/controllers/userController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    获取所有用户（仅限管理员）
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    获取指定 ID 用户信息（仅限管理员）
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('未找到用户');
  }
});

// @desc    更新指定用户信息（仅限管理员）
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // 管理员可以修改用户名、邮箱、是否超级管理员
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('未找到用户');
  }
});

// @desc    删除指定用户（仅限管理员）
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // 不能删除自己
    if (user._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('管理员不能删除自身账号');
    }
    await user.remove();
    res.json({ message: '用户已删除' });
  } else {
    res.status(404);
    throw new Error('未找到用户');
  }
});

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
