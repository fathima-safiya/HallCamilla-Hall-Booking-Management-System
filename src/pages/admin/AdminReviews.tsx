import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { reviewService } from '../../services/reviewService';
import type { Review } from '../../types/app';
import { Star, Trash2, Loader2, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = reviewService.subscribeToAllReviews((data) => {
      setReviews(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    setDeletingId(id);
    try {
      await reviewService.deleteReview(id);
      showToast('Review deleted successfully.');
    } catch (err) {
      showToast('Failed to delete review.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 text-stone-400">
        <Loader2 size={36} className="animate-spin text-luxury-emerald-700" />
        <p className="text-sm font-semibold">Loading reviews…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-luxury-emerald-950">Customer Reviews</h1>
          <p className="text-stone-500 text-sm mt-1">Monitor and manage feedback left by customers after their events.</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400">
          <MessageSquare size={48} className="mb-4 opacity-30" />
          <p className="font-semibold text-sm">No reviews found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 relative group">
              <button
                onClick={() => handleDelete(review.id)}
                disabled={deletingId === review.id}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                title="Delete Review"
              >
                {deletingId === review.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              </button>
              
              <div className="flex justify-between items-start mb-4 pr-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-luxury-emerald-950 text-sm">{review.customerId}</span>
                    <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                      {format(new Date(review.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-mono">Booking: {review.bookingId} • Hall: {review.hallId}</p>
                </div>
              </div>
              
              <div className="flex text-luxury-gold-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < review.rating ? 'fill-current' : 'text-stone-300'} />
                ))}
              </div>
              
              <p className="text-stone-700 text-sm leading-relaxed italic bg-stone-50 p-4 rounded-lg border border-stone-100">"{review.comment}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
