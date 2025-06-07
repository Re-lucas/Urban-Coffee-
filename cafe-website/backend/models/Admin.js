// backend/models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  email: {
    type: String, required: true, unique: true, lowercase: true, trim: true
  },
  password: {
    type: String, required: true
  }
}, { timestamps: true });

// 密码加盐哈希
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 验证密码
adminSchema.methods.matchPassword = function(entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
