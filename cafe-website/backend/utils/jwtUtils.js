// backend/utils/jwtUtils.js
const jwt = require('jsonwebtoken');

// 接受用户 ID，返回签名好的 JWT 字符串
const generateToken = (userId) => {
  // 这里用你 .env 里配置的 JWT_SECRET，过期时间 30 天仅作示例
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
