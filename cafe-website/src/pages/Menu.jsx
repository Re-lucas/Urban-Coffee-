// src/pages/Menu.jsx
import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products';
import '../styles/menu.css';
import '../styles/main.css';

const Menu = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoast, setSelectedRoast] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleRoastChange = (e) => setSelectedRoast(e.target.value);
  const handleMinPriceChange = (e) => setMinPrice(e.target.value);
  const handleMaxPriceChange = (e) => setMaxPrice(e.target.value);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedRoast('All');
    setMinPrice('');
    setMaxPrice('');
  };

  const filteredProducts = productsData.filter((product) => {
    const lowerName = product.name.toLowerCase();
    const lowerDesc = product.description.toLowerCase();
    const lowerQuery = searchQuery.toLowerCase();

    const matchesQuery =
      searchQuery === '' ||
      lowerName.includes(lowerQuery) ||
      lowerDesc.includes(lowerQuery);

    const matchesRoast =
      selectedRoast === 'All' || product.roast === selectedRoast;

    const price = parseFloat(product.price);
    const matchesMin = minPrice === '' || price >= parseFloat(minPrice);
    const matchesMax = maxPrice === '' || price <= parseFloat(maxPrice);

    return matchesQuery && matchesRoast && matchesMin && matchesMax;
  });

  return (
    <div className="menu-page">
      <h1 className="page-title">咖啡菜单</h1>

      <div className="filter-controls">
        <input
          type="text"
          placeholder="🔍  搜索咖啡名称或描述..."
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <select value={selectedRoast} onChange={handleRoastChange}>
          <option value="All">全部烘焙程度</option>
          <option value="浅焙">浅焙</option>
          <option value="中焙">中焙</option>
          <option value="深焙">深焙</option>
        </select>

        <input
          type="number"
          placeholder="最低价 (¥)"
          value={minPrice}
          onChange={handleMinPriceChange}
          min="0"
          step="0.01"
        />

        <input
          type="number"
          placeholder="最高价 (¥)"
          value={maxPrice}
          onChange={handleMaxPriceChange}
          min="0"
          step="0.01"
        />

        <button onClick={handleReset}>重置筛选</button>
      </div>

      <div className="container">
        {filteredProducts.length === 0 ? (
          <p className="no-results">没有符合条件的商品。</p>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
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