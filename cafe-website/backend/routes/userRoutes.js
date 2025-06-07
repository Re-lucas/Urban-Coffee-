// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, admin, protectAdmin } = require('../middlewares/authMiddleware');
const User = require('../models/User'); // 确保引入 User 模型

// @route   GET /api/users
// @desc    获取所有用户（仅限管理员）
// @access  Private/Admin
router.get('/', protect, admin, protectAdmin, getUsers);

// @route   GET /api/users/:id
// @desc    获取指定 ID 的用户（仅限管理员）
// @access  Private/Admin
router.get('/:id', protect, admin, protectAdmin, getUserById);

// @route   PUT /api/users/:id
// @desc    更新指定用户信息（仅限管理员）
// @access  Private/Admin
router.put('/:id', protect, admin, protectAdmin, updateUser);

// @route   DELETE /api/users/:id
// @desc    删除指定用户（仅限管理员）
// @access  Private/Admin
router.delete('/:id', protect, admin, protectAdmin, deleteUser);

// 新增：更新用户偏好的路由
// @route   PUT /api/users/:userId/preferences
// @desc    更新当前用户的口味偏好
// @access  Private
router.put('/:id/preferences', protect, async (req, res) => {
  try {
    const userId = req.params.id; // 改为 id
    const { preferences } = req.body;
    
    // 验证用户权限：用户只能更新自己的偏好
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ 
        success: false,
        message: '无权更新该用户的偏好' 
      });
    }
    
    // 更新 preferences 和 notifications（如果前端发了 notifications 就更新）
    const updateFields = {};
    if (preferences !== undefined) updateFields.preferences = preferences;
    if (notifications !== undefined) updateFields.notifications = notifications;

    const user = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true }
    );
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: '用户未找到' 
        });
      }
    
    // 返回成功响应
    res.json({
      success: true,
      message: '偏好已更新',
      preferences: user.preferences,
      notifications: user.notifications
    });
    
  } catch (error) {
    console.error('更新偏好错误:', error);
    res.status(500).json({ 
      success: false,
      message: '服务器错误',
      error: error.message 
    });
  }
});

module.exports = router;