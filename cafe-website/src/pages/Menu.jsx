// src/pages/Menu.jsx
import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products';     // 原始商品列表
import '../styles/menu.css';                     // 本页专属样式（会在下面给出）
import '../styles/main.css';                     // 如果已有全局样式，也可一并保留

const Menu = () => {
  // **1.1. 搜索相关的状态**
  // searchQuery：用户在输入框里输入的关键词
  const [searchQuery, setSearchQuery] = useState('');

  // **1.2. 烘焙程度筛选状态**
  // selectedRoast："All"（全部）、"浅焙"、"中焙"、"深焙"
  const [selectedRoast, setSelectedRoast] = useState('All');

  // **1.3. 价格区间筛选状态**
  // minPrice/maxPrice 都是字符串，为了空值时不过滤
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // **1.4. 各控件的 onChange 处理函数**
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleRoastChange  = (e) => setSelectedRoast(e.target.value);
  const handleMinPriceChange = (e) => setMinPrice(e.target.value);
  const handleMaxPriceChange = (e) => setMaxPrice(e.target.value);

  // **1.5. 重置所有筛选条件（清空输入框、恢复默认）**
  const handleReset = () => {
    setSearchQuery('');
    setSelectedRoast('All');
    setMinPrice('');
    setMaxPrice('');
  };

  // **1.6. 根据 上面的四个状态 过滤原始商品数组**
  //    过滤逻辑：
  //    1) 如果 searchQuery 不为空，要保证 name 或 description 中至少有一个包含关键词；
  //    2) 如果 selectedRoast 不是 "All"，则 product.roast 必须和它一致；
  //    3) 如果 minPrice 存在，就要 price >= minPrice；如果 maxPrice 存在，就要 price <= maxPrice。
  const filteredProducts = productsData.filter((product) => {
    // （a）关键词匹配（忽略大小写），对 name 和 description 都要判断
    const lowerName = product.name.toLowerCase();
    const lowerDesc = product.description.toLowerCase();
    const lowerQuery = searchQuery.toLowerCase();

    const matchesQuery =
      searchQuery === '' ||
      lowerName.includes(lowerQuery) ||
      lowerDesc.includes(lowerQuery);

    // （b）烘焙程度匹配
    const matchesRoast =
      selectedRoast === 'All' || product.roast === selectedRoast;

    // （c）价格范围匹配
    const price = parseFloat(product.price);
    // 如果 minPrice 为空串，就代表不需要做下限过滤
    const matchesMin = minPrice === '' || price >= parseFloat(minPrice);
    // 如果 maxPrice 为空，就代表不需要做上限过滤
    const matchesMax = maxPrice === '' || price <= parseFloat(maxPrice);

    return matchesQuery && matchesRoast && matchesMin && matchesMax;
  });

  return (
    <div className="menu-page">
      <h1 className="page-title">咖啡菜单</h1>

      {/* ===== 2. 搜索与筛选控件区域 ===== */}
      <div className="filter-controls">
        {/* 2.1. 关键词搜索框 */}
        <input
          type="text"
          placeholder="🔍  搜索咖啡名称或描述..."
          value={searchQuery}
          onChange={handleSearchChange}
        />

        {/* 2.2. 烘焙程度下拉筛选 */}
        <select value={selectedRoast} onChange={handleRoastChange}>
          <option value="All">全部烘焙程度</option>
          <option value="浅焙">浅焙</option>
          <option value="中焙">中焙</option>
          <option value="深焙">深焙</option>
        </select>

        {/* 2.3. 价格区间输入框（最小价格） */}
        <input
          type="number"
          placeholder="最低价 (¥)"
          value={minPrice}
          onChange={handleMinPriceChange}
          min="0"
          step="0.01"
        />
        {/* 2.4. 价格区间输入框（最高价格） */}
        <input
          type="number"
          placeholder="最高价 (¥)"
          value={maxPrice}
          onChange={handleMaxPriceChange}
          min="0"
          step="0.01"
        />

        {/* 2.5. 重置筛选按钮 */}
        <button onClick={handleReset}>重置筛选</button>
      </div>

      {/* ===== 3. 根据 filteredProducts 渲染商品列表或“无结果”提示 ===== */}
      <div className="container">
        {filteredProducts.length === 0 ? (
          <p className="no-results">没有符合条件的商品。</p>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              // 传递 searchQuery 到 ProductCard，让它负责高亮显示
              <ProductCard
                key={product.id}
                product={product}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
