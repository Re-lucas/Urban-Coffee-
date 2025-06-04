// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');       // 可选：让控制台日志有颜色
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config();

// 1. 先连接数据库
connectDB();

// 2. 创建 Express 应用
const app = express();

// 3. 中间件
app.use(cors());                        // 跨域：允许前端 localhost:3000 访问
app.use(express.json());                // 解析 JSON 请求体

// 4. 测试路由：确认后端跑起来没问题
app.get('/', (req, res) => {
  res.send('Urban Coffee 后端 API 正在运行…');
});

// 5. 以后会在这里挂载各个业务路由（示例）
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/products', require('./routes/productRoutes'));
// app.use('/api/orders', require('./routes/orderRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/reviews', require('./routes/reviewRoutes'));

// 6. 全局错误处理中间件（必须在路由之后引入）
app.use(errorHandler);

// 7. 启动服务
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `服务器已启动在 ${process.env.NODE_ENV} 模式，监听端口 ${PORT}`.yellow.bold
  );
});
