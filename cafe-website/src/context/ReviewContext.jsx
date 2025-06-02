// src/context/ReviewContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. 创建 Context
const ReviewContext = createContext();
export const useReview = () => useContext(ReviewContext);

/**
 * 评论数据结构示例（localStorage 中存储）:
 * {
 *   "productId1": [
 *     {
 *       orderId: "d4407f35-4d49-4740-90de-5ec345171a52",
 *       rating: 5,
 *       comment: "这款咖啡口感非常顺滑！",
 *       date: "2025-06-10T14:23:45.123Z"
 *     },
 *     …  // 同一个商品的多条评论
 *   ],
 *   "productId2": [ … ],
 *   …
 * }
 */
export function ReviewProvider({ children }) {
  // 2. 从 localStorage 读取已有评论数据（以对象形式）
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('reviews');
    return saved ? JSON.parse(saved) : {};
  });

  // 3. 当 reviews 对象变化时，同步写回 localStorage
  useEffect(() => {
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }, [reviews]);

  // 4. addReview：向某个商品添加一条评论
  const addReview = ({ productId, orderId, rating, comment }) => {
    setReviews((prev) => {
      // 先取出该 productId 现有的评论数组
      const existing = prev[productId] || [];
      const newEntry = {
        orderId,
        rating,
        comment,
        date: new Date().toISOString(),
      };
      return {
        ...prev,
        [productId]: [newEntry, ...existing],
      };
    });
  };

  // 5. getReviewsByProduct：根据 productId 返回该商品所有评论数组（如无，则返回 []）
  const getReviewsByProduct = (productId) => {
    return reviews[productId] || [];
  };

  return (
    <ReviewContext.Provider value={{ reviews, addReview, getReviewsByProduct }}>
      {children}
    </ReviewContext.Provider>
  );
}
