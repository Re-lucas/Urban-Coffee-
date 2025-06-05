Urban Coffee 全栈电商项目

一个基于 React + Vite（前端）、Node.js + Express（后端）、MongoDB（数据库）、Stripe（支付） 构建的完整电商示例项目，包含用户注册/登录、商品列表/详情、购物车、下单/支付、订单管理、评论系统，以及管理员后台（用户管理、商品管理、订单管理）。项目同时支持本地开发与生产部署。

⸻

目录
	•	项目简介
	•	技术栈
	•	功能特性
	•	用户端功能
	•	管理员后台功能
	•	支付集成
	•	项目结构
	•	环境变量
	•	本地开发
	•	后端启动
	•	前端启动
	•	整合测试（ngrok + Stripe Webhook）
	•	生产构建与部署
	•	前端构建
	•	后端部署
	•	Docker 部署示例
	•	环境变量说明
	•	致谢

⸻

项目简介

Urban Coffee 是一个完整的电商项目示例，旨在演示如何使用现代前后端技术栈打造一个可运行、可交付的线上商城。项目核心功能包括：
	1.	用户模块：注册、登录、JWT 鉴权、个人信息（简易）。
	2.	商品模块：商品列表（支持关键字搜索 + 分页）、商品详情、评论系统（已登录用户可发表评论）。
	3.	购物车 & 下单：购物车持久化（LocalStorage + Context），填写收货地址、选择支付方式后下单。
	4.	支付集成：前端 Stripe.js + 后端 Stripe PaymentIntent + Webhook 自动更新订单支付状态。
	5.	订单模块：用户可以查看自己所有订单（历史），查看单个订单详情；管理员可以查看并标记发货。
	6.	管理员后台：用户管理（增删改）、商品管理（增删改）、订单管理（查询、标记发货）。
	7.	路由守卫：所有需要登录/管理员权限的页面都做了鉴权与拦截。

项目适合作为中小型商家前端电商基础，也可用于学习如何快速搭建一个全栈电商系统。

⸻

技术栈
	•	前端
	•	Vite + React 17+（函数组件 + Hooks）
	•	React Router v6（前端路由管理）
	•	Context API（全局状态管理：AuthContext、CartContext、OrderContext、ReviewContext）
	•	Axios（封装全局 API 实例，自动带 JWT）
	•	@stripe/stripe-js + @stripe/react-stripe-js（Stripe 支付集成）
	•	Tailwind CSS（样式与布局） + 自定义 CSS 文件
	•	后端
	•	Node.js 16+ + Express
	•	MongoDB + Mongoose
	•	jsonwebtoken（JWT 鉴权）
	•	bcryptjs（密码哈希）
	•	stripe（Stripe Server SDK）
	•	body-parser（处理 Stripe Webhook Raw Body）
	•	express-async-handler（简化异步错误捕获）
	•	cors（跨域请求）
	•	其他工具
	•	Nodemon（开发模式下热重载）
	•	ngrok（本地测试 Stripe Webhook）
	•	Docker（可选，后端镜像与部署）

⸻

功能特性

用户端功能
	•	注册 / 登录 / 登出
	•	邮箱+密码注册（密码使用 bcrypt 哈希存储）
	•	登录后返回 JWT Token，前端存储到 localStorage，API 请求自动带上 Authorization: Bearer <token>
	•	全局 AuthContext 管理登录状态
	•	商品列表 & 详情
	•	商品列表支持关键字搜索（/api/products?keyword=xxx&pageNumber=yy）与分页
	•	商品详情页显示：商品图片、名称、价格、库存、描述、平均评分、评论数量
	•	登录用户可在详情页发表评价（POST /api/reviews/:productId），服务器会更新商品评分与评论数
	•	购物车 & 下单流程
	•	购物车项持久化到 localStorage，由 CartContext 管理（添加、删除、更新数量）
	•	收货地址 & 支付方式表单保存到 Context / localStorage
	•	下单（POST /api/orders）时前端把 orderItems、shippingAddress、paymentMethod、itemsPrice、taxPrice、shippingPrice、totalPrice 一起提交
	•	订单创建后，前端跳转到支付页面，调用后端 POST /api/orders/:id/payintent 拿到 clientSecret 并用 Stripe.js 完成支付
	•	订单管理
	•	用户查看自己的订单列表（GET /api/orders/myorders）
	•	用户查看单个订单详情（GET /api/orders/:id），包括商品、收货地址、支付状态、发货状态、金额明细等
	•	支付成功后通过 Webhook 自动更新 isPaid=true、paidAt、paymentResult
	•	支付完成后用户刷新订单详情页可见“已支付”标识
	•	评论系统
	•	登录用户在商品详情页发表一次评论（rating, comment）
	•	后端检查同一用户同一商品只能评论一次
	•	评论成功后服务器重新计算该商品的平均评分与评论数，并保存到 Product 文档

管理员后台功能
	•	用户管理（Admin Only）
	•	查看所有用户（GET /api/users）
	•	编辑用户信息（PUT /api/users/:id），可修改用户名、邮箱、管理员权限
	•	删除用户（DELETE /api/users/:id），不能删除自己
	•	商品管理（Admin Only）
	•	查看所有商品并分页（与用户端列表相同逻辑，限管理员）
	•	新增商品（POST /api/products），商品初始字段可只填一个占位值，后续可编辑
	•	编辑商品信息（PUT /api/products/:id），可修改名称、价格、库存、描述、分类、图片 URL 等
	•	删除商品（DELETE /api/products/:id）
	•	订单管理（Admin Only）
	•	查看所有订单（GET /api/orders），服务器返回订单列表并 .populate('user','name')
	•	标记订单发货（PUT /api/orders/:id/deliver），更新 isDelivered=true、deliveredAt
	•	查看单个订单详细信息（可在前端显示收货地址、支付信息、订单项、金额明细、用户信息等）
	•	路由守卫 / 权限控制
	•	前端所有 /admin/* 路由都包裹在 RequireAdmin（或 AdminRoute）组件下，只有登录且 userInfo.isAdmin === true 才能进入
	•	后端所有管理接口都挂载 protect + admin 中间件，若未登录或非管理员，返回 401 或 403 错误

支付集成
	•	Stripe PaymentIntent
	•	后端提供 POST /api/orders/:id/payintent，计算订单总价，将金额（以分为单位）传给 Stripe 创建 PaymentIntent，返回 clientSecret
	•	前端使用 @stripe/stripe-js 加载 Stripe.js，使用 loadStripe(VITE_STRIPE_PUBLIC_KEY) 初始化并包裹 <Elements>
	•	用户填写卡号（测试卡号：4242 4242 4242 4242，任意有效期 & CVC），调用 stripe.confirmCardPayment(clientSecret, { payment_method: { card: CardElement } }) 完成支付
	•	Stripe Webhook 自动更新订单
	•	在 server.js 中，先用 bodyParser.raw({ type: 'application/json' }) 挂载 /api/webhook 路由（必须在 express.json() 之前）
	•	Stripe Dashboard → Webhooks 创建本地测试 Endpoint（需要用 ngrok 暴露本地 5000 端口），只选 payment_intent.succeeded 事件
	•	客户端支付后，Stripe 发起 payment_intent.succeeded POST 请求到 /api/webhook，后端校验签名无误后从 event.data.object.metadata.order_id 拿到订单 ID，并更新该订单的 isPaid = true、paidAt = Date.now()、paymentResult = {...}
	•	前端可在支付后立即跳转到订单详情页，稍后刷新可见“已支付”状态

⸻

项目结构

root
├─ backend/                  # 后端代码
│   ├─ config/
│   │   └─ db.js             # Mongoose 连接配置
│   ├─ controllers/
│   │   ├─ authController.js
│   │   ├─ userController.js
│   │   ├─ productController.js
│   │   ├─ orderController.js
│   │   └─ reviewController.js
│   ├─ models/
│   │   ├─ User.js
│   │   ├─ Product.js
│   │   ├─ Order.js
│   │   └─ Review.js
│   ├─ routes/
│   │   ├─ authRoutes.js
│   │   ├─ userRoutes.js
│   │   ├─ productRoutes.js
│   │   ├─ orderRoutes.js
│   │   └─ reviewRoutes.js
│   ├─ middlewares/
│   │   ├─ authMiddleware.js    # protect + admin
│   │   ├─ errorHandler.js      # 全局错误处理
│   │   └─ asyncHandler.js      # express-async-handler
│   ├─ server.js               # Express 主入口
│   └─ package.json
│
├─ cafe-website/             # 前端代码（使用 Vite 搭建）
│   ├─ public/
│   │   └─ index.html
│   ├─ src/
│   │   ├─ components/
│   │   │   ├─ Navbar.jsx
│   │   │   ├─ CartPanel.jsx
│   │   │   ├─ ProductCard.jsx
│   │   │   ├─ RequireAuth.jsx
│   │   │   └─ RequireAdmin.jsx
│   │   ├─ context/
│   │   │   ├─ AuthContext.jsx
│   │   │   ├─ CartContext.jsx
│   │   │   ├─ OrderContext.jsx
│   │   │   └─ ReviewContext.jsx
│   │   ├─ pages/
│   │   │   ├─ Home.jsx
│   │   │   ├─ Menu.jsx
│   │   │   ├─ ProductDetail.jsx
│   │   │   ├─ Cart.jsx
│   │   │   ├─ Checkout.jsx
│   │   │   ├─ OrderDetail.jsx
│   │   │   ├─ OrderHistory.jsx
│   │   │   ├─ Account.jsx
│   │   │   ├─ Login.jsx
│   │   │   ├─ Register.jsx
│   │   │   ├─ Contact.jsx
│   │   │   ├─ Reservation.jsx
│   │   │   └─ Wishlist.jsx
│   │   ├─ pages/admin/
│   │   │   ├─ AdminHome.jsx
│   │   │   ├─ ProductList.jsx
│   │   │   ├─ ProductEdit.jsx
│   │   │   ├─ OrderList.jsx
│   │   │   ├─ UserList.jsx
│   │   │   └─ UserDetail.jsx
│   │   ├─ styles/             # 各个页面或组件的 CSS 文件
│   │   ├─ utils/
│   │   │   └─ axiosConfig.js  # 全局 Axios 实例
│   │   ├─ App.jsx
│   │   └─ main.jsx
│   ├─ .env.development
│   └─ package.json
└─ README.md                  # 本文件


⸻

环境变量

后端环境变量（放在 backend/.env）

# MongoDB 连接字符串（本地或 Atlas）
MONGODB_URI=<YOUR_MONGODB_URI>

# JWT 密钥（任意一个足够复杂的字符串）
JWT_SECRET=<YOUR_JWT_SECRET>

# Stripe 测试 Secret Key（以 sk_test_ 开头）
STRIPE_SECRET_KEY=<YOUR_STRIPE_SECRET_KEY>

# Stripe Webhook Signing Secret（以 whsec_ 开头，在 Dashboard 创建 Webhook Endpoint 后获取）
STRIPE_WEBHOOK_SECRET=<YOUR_STRIPE_WEBHOOK_SECRET>

# 可选：指定 Node 环境（development / production）
NODE_ENV=development

# 后端监听端口（默认 5000）
PORT=5000

前端环境变量（放在 cafe-website/.env.development）

# 前端调用后端 API 的基础 URL（本地开发时一般是 http://localhost:5000）
VITE_API_BASE_URL=http://localhost:5000

# Stripe 公钥（以 pk_test_ 开头）
VITE_STRIPE_PUBLIC_KEY=<YOUR_STRIPE_PUBLIC_KEY>

注意：.env、.env.development、.env.production 等敏感配置文件请务必加入 .gitignore，避免泄露密钥。

⸻

本地开发

后端启动
	1.	进入后端目录：

cd backend


	2.	安装依赖：

npm install


	3.	在根目录创建 .env，根据 环境变量 填写：

MONGODB_URI=<填写你的 MongoDB 连接字符串>
JWT_SECRET=<填写你自己定义的 JWT 密钥>
STRIPE_SECRET_KEY=<填写 Stripe 测试 Secret Key>
STRIPE_WEBHOOK_SECRET=<填写 Stripe Webhook Signing Secret>
PORT=5000
NODE_ENV=development


	4.	启动后端（开发模式，自动重载）：

npm run dev

	•	此时后端服务将监听 http://localhost:5000。
	•	打开浏览器访问 http://localhost:5000/，会看到：

Urban Coffee 后端 API 正在运行…


	5.	（可选）使用 Postman 或 Insomnia 测试几个最基础接口：
	•	GET http://localhost:5000/api/products
	•	POST http://localhost:5000/api/auth/register （Body: { name, email, password }）
	•	确认后端正常工作。

⸻

前端启动
	1.	打开另一个终端，进入前端目录：

cd cafe-website


	2.	安装前端依赖：

npm install


	3.	在前端根目录创建 .env.development，填写：

VITE_API_BASE_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=<填写你的 Stripe 测试公钥，以 pk_test_ 开头>


	4.	启动前端开发服务器：

npm run dev

	•	默认会在 http://localhost:5173（或其他可用端口）启动。
	•	打开浏览器访问 http://localhost:5173，可以看到首页；此时你可以注册、登录，并在开发环境下完整测试各类功能。

⸻

整合测试（ngrok + Stripe Webhook）

为了让 Stripe 能把支付成功的事件推送到本地，需要用 ngrok 暴露本地后端端口，并在 Stripe Dashboard 配置 Webhook Endpoint。
	1.	安装并登录 ngrok
	•	访问 https://ngrok.com/ 下载可执行文件或使用包管理器安装。
	•	运行 ngrok，并在终端执行：

ngrok authtoken <YOUR_NGROK_AUTH_TOKEN>   # 如果是首次使用，需要先登录并授权


	•	如果已登录并授权，可直接运行下一步。

	2.	启动 ngrok 隧道
	•	在后端运行的终端（监听 5000）旁边，打开一个新终端，运行：

ngrok http 5000


	•	你会看到类似：

Forwarding    http://abcd1234.ngrok.io -> localhost:5000
Forwarding    https://abcd1234.ngrok.io -> localhost:5000


	•	记下 https://abcd1234.ngrok.io（你的 ngrok 域名），后续用于 Stripe Webhook URL。

	3.	在 Stripe Dashboard 配置 Webhook
	•	登录到你的 Stripe 测试账号（https://dashboard.stripe.com，确保打开“Viewing test data”）。
	•	左侧选择 Developers → Webhooks，点击 “+ Add endpoint”。
	•	在 Endpoint URL 填写：

https://abcd1234.ngrok.io/api/webhook


	•	选择 Latest version，并在 Events to send 中只勾选：

payment_intent.succeeded


	•	点击 Add endpoint 完成。
	•	创建成功后，点击右侧“⋯” → Reveal signing secret，复制出以 whsec_ 开头的一串字符。
	•	回到后端 .env，将 STRIPE_WEBHOOK_SECRET 更新为该值，并重启后端服务：

STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxx


	•	你现在可以在 Dashboard “Webhooks” 列表页面，点击“Send test webhook” → 选择 payment_intent.succeeded → 将 metadata.order_id 修改为你数据库中已存在的订单 ID → Send test webhook。
	•	若一切配置正确，后端终端会打印：

收到 Stripe Webhook 请求
收到 payment_intent.succeeded，metadata.order_id = <你填的订单ID>
订单 <订单ID> 支付已更新


	•	若 metadata.order_id 与你本地数据库中不存在，后端会打印“未找到订单”但不会报错。

	4.	完整支付流程测试
	•	用户在前端完成下单后，会自动跳转到Stripe支付页面（Checkout.jsx）。
	•	在浏览器中输入测试卡号 4242 4242 4242 4242（任意到期日 & CVC），点击“确认支付”。
	•	前端完成 confirmCardPayment 后，会触发 Stripe Webhook，将支付状态推送到 https://abcd1234.ngrok.io/api/webhook。
	•	后端收到 Webhook 后自动更新订单 isPaid，前端（刷新订单详情页）可见“已支付”标识。

⸻

生产构建与部署

前端构建
	1.	在前端目录执行：

cd cafe-website
npm run build


	2.	构建完成后会生成 dist/ 文件夹，里面包含压缩、优化过的静态文件（HTML/CSS/JS）。
	3.	你可以将 dist/ 部署到任意静态资源服务器，如：
	•	Netlify / Vercel / GitHub Pages 等静态托管平台
	•	自己的 Nginx / Apache 服务器，将 dist/ 指向根目录
	•	或者把 dist/ 复制到后端项目中，让 Express 托管（见下文）

可选：让后端直接托管前端静态资源
在 backend/server.js 中加入：

import path from 'path';
// 其他 imports …



const app = express();

// 把后端 API 路由挂载在 /api 下
// …

// 如果是生产环境，将 dist 文件夹当作静态目录固定访问
if (process.env.NODE_ENV === ‘production’) {
app.use(express.static(path.join(__dirname, ‘../cafe-website/dist’)));
app.get(’*’, (req, res) =>
res.sendFile(path.join(__dirname, ‘../cafe-website/dist/index.html’))
);
}

// 其他错误处理中间件、监听端口

- 这样，用户在浏览器输入你的服务器域名（如 `https://your-domain.com`）就能直接看到前端页面，且所有 `/api/*` 请求都会被转发到后端。



⸻

后端部署
	1.	在后端目录执行：

cd backend
npm install --production


	2.	确保已经在服务器上配置好 MONGODB_URI、JWT_SECRET、STRIPE_SECRET_KEY、STRIPE_WEBHOOK_SECRET 等环境变量（可用 .env 或 CI/CD 平台环境变量面板）。
	3.	运行：

npm run start


	4.	后端会监听 process.env.PORT（默认为 5000），对外提供 API 服务。
	5.	如果你已经让后端托管了前端静态资源，则可以直接通过同一个域名/端口访问整个网站。

⸻

Docker 部署示例

如果你习惯用 Docker 容器化部署，可以自行编写 Dockerfile。下面提供一个后端示例（前端静态最好单独构建后拷贝进镜像或另起一个镜像）：

示例：后端 Dockerfile

# 使用官方 Node.js LTS 轻量版（Alpine）
FROM node:18-alpine

# 在镜像内创建工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json（如果有）并安装生产依赖
COPY package*.json ./
RUN npm install --production

# 复制后端所有代码
COPY . .

# 设置环境变量（在运行时也可以通过 docker run -e 来传）
ENV NODE_ENV=production
# ENV MONGODB_URI=...
# ENV JWT_SECRET=...
# ENV STRIPE_SECRET_KEY=...
# ENV STRIPE_WEBHOOK_SECRET=...

# 暴露容器端口
EXPOSE 5000

# 启动后端
CMD ["node", "server.js"]

构建镜像并运行：

# 在 backend/ 目录下
docker build -t urban-coffee-backend .

# 如果要运行并挂载环境变量
docker run -d \
  -e MONGODB_URI="你的 MongoDB URI" \
  -e JWT_SECRET="你的 JWT SECRET" \
  -e STRIPE_SECRET_KEY="你的 Stripe 测试 Secret Key" \
  -e STRIPE_WEBHOOK_SECRET="你的 Stripe Webhook Signing Secret" \
  -p 5000:5000 \
  urban-coffee-backend

注意：如果你想让后端镜像同时托管前端静态，需要在镜像里把前端 dist/ 一起拷贝进来，并修改 server.js、Dockerfile 逻辑，让它把静态资源放在 dist/ 目录下供访问。

⸻

环境变量说明

后端（backend/.env）

变量名	说明
MONGODB_URI	MongoDB 连接字符串
JWT_SECRET	JWT 签名密钥，随意设置一个较复杂的字符串，确保安全
STRIPE_SECRET_KEY	Stripe 测试用 Secret Key（以 sk_test_ 开头）
STRIPE_WEBHOOK_SECRET	Stripe Webhook Signing Secret（以 whsec_ 开头）
NODE_ENV	运行环境，development 或 production
PORT	后端监听端口，默认 5000

前端（cafe-website/.env.development）

变量名	说明
VITE_API_BASE_URL	前端调用后端 API 的基础 URL，例如 http://localhost:5000
VITE_STRIPE_PUBLIC_KEY	Stripe 公钥（以 pk_test_ 开头，用于前端 Stripe.js 初始化）

注意：
	•	React + Vite 在前端环境变量里，变量名必须以 VITE_ 开头，才会被 Vite 识别并注入到 import.meta.env 中。
	•	生产环境可创建 .env.production，把 VITE_API_BASE_URL 修改为线上域名，把 VITE_STRIPE_PUBLIC_KEY 改为正式公钥。

⸻

致谢
	•	本项目示例参考了诸多开源电商项目与官方文档：
	•	React + Vite 官方文档
	•	Express 官方示例
	•	MongoDB Atlas 文档
	•	Stripe 官方 Node.js & React 集成指南
	•	Wes Bos YouTube 教程 “MERN E-Commerce Pro” 作为思路参考
	•	感谢所有贡献者与社区同学，帮助完善此项目！
	•	如果你有任何疑问、建议或发现 Bug，欢迎提 Issue 或 PR。

⸻

Urban Coffee
一套演示现代前后端完整电商流程的 Demo 项目
版本：1.0.0
作者：Re-lucas (wuw81013@gmail.com)

⸻

License: MIT License
你可以自由使用、修改、分发本项目。详情请参阅 LICENSE 文件。
