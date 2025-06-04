// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

// @route   GET /api/users
// @desc    获取所有用户（仅限管理员）
// @access  Private/Admin
router.get('/', protect, admin, getUsers);

// @route   GET /api/users/:id
// @desc    获取指定 ID 的用户（仅限管理员）
// @access  Private/Admin
router.get('/:id', protect, admin, getUserById);

// @route   PUT /api/users/:id
// @desc    更新指定用户信息（仅限管理员）
// @access  Private/Admin
router.put('/:id', protect, admin, updateUser);

// @route   DELETE /api/users/:id
// @desc    删除指定用户（仅限管理员）
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
