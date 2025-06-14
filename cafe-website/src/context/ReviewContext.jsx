/* src/context/ReviewContext.jsx */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

const ReviewContext = createContext();
export const useReview = () => useContext(ReviewContext);

export function ReviewProvider({ children }) {
  const toast = useToast();
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('reviews');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }, [reviews]);

  const addReview = ({ productId, orderId, rating, comment }) => {
    setReviews(prev => {
      const existing = prev[productId] || [];
      const newEntry = { orderId, rating, comment, date: new Date().toISOString() };
      return { ...prev, [productId]: [newEntry, ...existing] };
    });
    toast({ title: '评价提交成功', status: 'success', duration: 2000, isClosable: true });
  };

  const getReviewsByProduct = productId => reviews[productId] || [];

  return (
    <ReviewContext.Provider value={{ reviews, addReview, getReviewsByProduct }}>
      {children}
    </ReviewContext.Provider>
  );
}
