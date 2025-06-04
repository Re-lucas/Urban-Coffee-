// backend/middlewares/errorHandler.js

// 这是一个最简单的全局错误处理中间件示例
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // 在控制台打印完整的错误堆栈

  // 如果响应头已经发送，交给 Express 默认的错误处理
  if (res.headersSent) {
    return next(err);
  }

  // 自定义错误返回格式：统一返回 JSON
  const statusCode = err.statusCode || 500;
  const message = err.message || '服务器内部错误';

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

module.exports = errorHandler;
