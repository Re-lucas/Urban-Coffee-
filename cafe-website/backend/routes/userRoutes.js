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
const User = require('../models/User');

// 管理员接口
router.get('/', protect, admin, getUsers);
router.get('/:id', protect, admin, getUserById);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

// 用户自身偏好更新
router.put('/:id/preferences', protect, async (req, res) => {
  try {
    const userId = req.params.id;
    const { preferences, notifications } = req.body;

    // 只允许本人操作
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: '无权更新该用户的偏好',
      });
    }

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
        message: '用户未找到',
      });
    }

    res.json({
      success: true,
      message: '偏好已更新',
      preferences: user.preferences,
      notifications: user.notifications,
    });

  } catch (error) {
    console.error('更新偏好错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message,
    });
  }
});

module.exports = router;
