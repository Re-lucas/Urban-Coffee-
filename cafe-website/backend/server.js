// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');       // 可选：让控制台日志有颜色
const cors = require('cors');
const bodyParser = require('body-parser');  // 新增
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config(); // ← 先加载 .env

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // ← 然后才能正确初始化

// 1. 先连接数据库
connectDB();

// 2. 创建 Express 应用
const app = express();

// 3. 注册 Stripe Webhook 路由（必须在 express.json() 之前）
app.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  async (req, res) => {
    console.log('✔️ 收到 Stripe Webhook 请求'); // 新增：通用日志
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️ Webhook signature 验证失败:`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // 只关注 payment_intent.succeeded 事件
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.order_id;
      console.log('收到 payment_intent.succeeded，metadata.order_id =', orderId); // 新增：事件详情日志
      try {
        const Order = require('./models/Order');
        const order = await Order.findById(orderId);
        if (order && !order.isPaid) {
          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentResult = {
            id: paymentIntent.id,
            status: paymentIntent.status,
            update_time: new Date().toISOString(),
            email_address: paymentIntent.receipt_email || '',
          };
          await order.save();
          console.log(`订单 ${orderId} 支付已更新`);
        }
      } catch (dbErr) {
        console.error(`更新订单支付状态出错:`, dbErr);
      }
    }

    // 返回给 Stripe 20x
    res.json({ received: true });
  }
);

// 4. 注册常规中间件
// 修改这里：增强 CORS 配置
app.use(cors({
  origin: 'http://localhost:5173', // 你的前端地址
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'] // 明确允许的请求头
}));
app.use(express.json());                // 解析 JSON 请求体

// 5. 测试路由：确认后端跑起来没问题
app.get('/', (req, res) => {
  res.send('Urban Coffee 后端 API 正在运行…');
});

// 6. 挂载各业务路由时都带上 /api 前缀
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));


// 7. 全局错误处理中间件（必须在路由之后引入）
app.use(errorHandler);

// 8. 启动服务
const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || 'development'; // 添加环境变量获取

app.listen(PORT, () => {
  console.log(
    `服务器已启动在 ${ENV} 模式，监听端口 ${PORT}`.yellow.bold
  );
});