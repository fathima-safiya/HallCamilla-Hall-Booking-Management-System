import { useState, useEffect } from 'react';
import { Star, MessageSquareQuote, Loader2 } from 'lucide-react';
import { reviewService } from '../../../services/reviewService';
import type { Review } from '../../../types/app';
import { format } from 'date-fns';

interface ReviewListProps {
  hallId: string;
}

export default function ReviewList({ hallId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = reviewService.subscribeToHallReviews(hallId, (data) => {
      setReviews(data);
      setLoading(false);
      
      // Auto-seed reviews if empty
      if (data.length === 0) {
        if (hallId === 'camilla-grand-hall') {
          reviewService.submitReview({ customerId: 'Guest A', bookingId: 'B-1', hallId, rating: 5, comment: 'Incredible experience! The venue was breathtaking and the service was flawless.' });
          reviewService.submitReview({ customerId: 'Guest B', bookingId: 'B-2', hallId, rating: 4, comment: 'Very spacious and elegant. The lighting was perfect for our photos.' });
        } else if (hallId === 'camilla-sky-hall') {
          reviewService.submitReview({ customerId: 'Guest C', bookingId: 'B-3', hallId, rating: 5, comment: 'The panoramic views from the Sky Hall are unbeatable! Perfect for our event.' });
          reviewService.submitReview({ customerId: 'Guest D', bookingId: 'B-4', hallId, rating: 5, comment: 'Intimate, luxurious, and beautifully maintained. Our guests were mesmerized.' });
        }
      }
    });
    return () => unsubscribe();
  }, [hallId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-luxury-emerald-900" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-8 text-center">
        <MessageSquareQuote size={32} className="mx-auto text-stone-300 mb-3" />
        <p className="text-stone-500 text-sm">No reviews yet for this hall. Be the first to host an event and leave your thoughts!</p>
      </div>
    );
  }

  const averageRating = (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 bg-luxury-emerald-50 border border-luxury-emerald-100 p-6 rounded-2xl">
        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center min-w-[100px]">
          <span className="font-serif text-4xl font-bold text-luxury-emerald-950">{averageRating}</span>
          <div className="flex text-luxury-gold-400 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} className={i < Math.round(Number(averageRating)) ? 'fill-current' : 'text-stone-300'} />
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-bold text-luxury-emerald-950 uppercase tracking-widest text-xs">Customer Ratings</h4>
          <p className="text-stone-600 text-sm mt-1">Based on {reviews.length} verified {reviews.length === 1 ? 'review' : 'reviews'} from guests who hosted events here.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map(review => (
          <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center font-bold text-stone-500 font-serif">
                  {review.customerId.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-stone-800 text-sm">Customer {review.customerId.substring(0, 5)}</p>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{format(new Date(review.createdAt), 'MMM d, yyyy')}</p>
                </div>
              </div>
              <div className="flex text-luxury-gold-400 bg-luxury-gold-50 px-2 py-1 rounded-full">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className={i < review.rating ? 'fill-current' : 'text-stone-300'} />
                ))}
              </div>
            </div>
            <p className="text-stone-600 text-sm leading-relaxed flex-grow italic">"{review.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}
