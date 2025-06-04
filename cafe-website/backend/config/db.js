// backend/config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
require('colors'); // 添加颜色支持

dotenv.config(); // 自动加载根目录下的 .env

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB 已连接: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`MongoDB 连接失败: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

module.exports = connectDB;