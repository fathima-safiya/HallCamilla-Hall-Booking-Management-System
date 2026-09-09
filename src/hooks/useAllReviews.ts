import { useState, useEffect } from 'react';
import { reviewService } from '../services/reviewService';
import type { Review } from '../types/app';

export function useAllReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = reviewService.subscribeToAllReviews((data) => {
      setReviews(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getHallRatingSummary = (hallId: string) => {
    const hallReviews = reviews.filter(r => r.hallId === hallId);
    if (hallReviews.length === 0) return { average: 0, count: 0 };
    
    const total = hallReviews.reduce((sum, review) => sum + review.rating, 0);
    const average = total / hallReviews.length;
    
    return {
      average: Number(average.toFixed(1)),
      count: hallReviews.length
    };
  };

  return { reviews, loading, getHallRatingSummary };
}
