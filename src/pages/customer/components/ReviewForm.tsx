import React, { useState } from 'react';
import { X, Star, MessageSquare } from 'lucide-react';
import { reviewService } from '../../../services/reviewService';
import { useToast } from '../../../context/ToastContext';

interface ReviewFormProps {
  bookingId: string;
  hallId: string;
  customerId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewForm({ bookingId, hallId, customerId, onClose, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      showToast('Please select a rating from 1 to 5 stars.', 'error');
      return;
    }
    if (!comment.trim()) {
      showToast('Please leave a written comment.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await reviewService.submitReview({ bookingId, hallId, customerId, rating, comment });
      showToast('Thank you for your feedback!');
      onSuccess();
    } catch (err) {
      showToast('Failed to submit review.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md m-4 z-10 overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-luxury-emerald-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-luxury-emerald-100 text-luxury-emerald-800 rounded-full">
              <MessageSquare size={20} />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-luxury-emerald-950">Leave a Review</h3>
              <p className="text-stone-500 text-xs mt-0.5">Rate your experience</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  size={36}
                  className={`${(hoverRating || rating) >= star ? 'fill-luxury-gold-400 text-luxury-gold-400' : 'text-stone-300'}`}
                />
              </button>
            ))}
          </div>
          
          <div className="mb-6">
            <label className="block text-[10px] uppercase font-bold text-stone-500 tracking-wider mb-2">
              Your Feedback
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Tell us what you loved about the event..."
              className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-luxury-gold-500 focus:ring-1 focus:ring-luxury-gold-500 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-luxury-emerald-950 text-white font-bold tracking-wider text-xs rounded-lg hover:bg-luxury-emerald-900 shadow-md uppercase transition-all disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}
