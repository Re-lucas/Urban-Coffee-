// src/data/products.js

// 假设最初只有 name/price/roast/description/image/stock，下面把 stock 初始值设为 10，
// 另外加一个 isAvailable 字段控制上下架
const products = [
  {
    id: 'p1',
    name: '哥伦比亚特级豆',
    description: '口感醇厚，微甜果香。',
    roast: '中度烘焙',
    price: 65.0,
    image: '/images/colombia.jpg',
    stock: 10,
    isAvailable: true
  },
  {
    id: 'p2',
    name: '衣索比亚耶加雪啡',
    description: '花香与柑橘果香，余味悠长。',
    roast: '浅度烘焙',
    price: 75.0,
    image: '/images/ethiopia.jpg',
    stock: 5,
    isAvailable: true
  },
  // … 其余商品同理 …
];

export default products;
