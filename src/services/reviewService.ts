import { collection, doc, setDoc, deleteDoc, onSnapshot, query, where, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS } from '../lib/firestorePaths';
import type { Review } from '../types/app';
import { notificationService } from './notificationService';

export const reviewService = {
  generateId(): string {
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `REV-${randomHex}`;
  },

  async submitReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    if (!db) throw new Error('Firestore not initialized');
    try {
      const id = this.generateId();
      const review: Review = {
        ...reviewData,
        id,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, COLLECTIONS.reviews, id), review);

      const hallSnap = await getDoc(doc(db, COLLECTIONS.halls, reviewData.hallId));
      const hallName = hallSnap.exists() ? hallSnap.data().name : 'a hall';

      notificationService.createNotification({
        userId: 'admin',
        title: 'New Review Submitted',
        message: `⭐ A customer submitted a new review for ${hallName}.`,
        type: 'review',
        isRead: false,
        relatedHallId: reviewData.hallId,
        link: '/admin/reviews'
      }).catch(console.error);

      return review;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw new Error('Failed to submit review.', { cause: error });
    }
  },

  subscribeToHallReviews(hallId: string, callback: (reviews: Review[]) => void): () => void {
    if (!db) return () => {};
    const q = query(collection(db, COLLECTIONS.reviews), where('hallId', '==', hallId));
    return onSnapshot(q, (snapshot) => {
      const reviews = snapshot.docs.map(doc => doc.data() as Review);
      reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(reviews);
    });
  },

  subscribeToAllReviews(callback: (reviews: Review[]) => void): () => void {
    if (!db) return () => {};
    return onSnapshot(collection(db, COLLECTIONS.reviews), (snapshot) => {
      const reviews = snapshot.docs.map(doc => doc.data() as Review);
      reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(reviews);
    });
  },

  async deleteReview(id: string): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    try {
      await deleteDoc(doc(db, COLLECTIONS.reviews, id));
    } catch (error) {
      console.error('Error deleting review:', error);
      throw new Error('Failed to delete review.', { cause: error });
    }
  }
};
