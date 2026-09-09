import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  writeBatch,
  getDocs,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Firestore } from 'firebase/firestore';
import type { AppNotification } from '../types/app';

const NOTIFICATIONS_COLLECTION = 'notifications';

export const notificationService = {
  /**
   * Create a new notification
   */
  async createNotification(notification: Omit<AppNotification, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db as Firestore, NOTIFICATIONS_COLLECTION), {
        ...notification,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  /**
   * Listen to notifications for a specific user (or 'admin')
   */
  subscribeToUserNotifications(userId: string, callback: (notifications: AppNotification[]) => void): () => void {
    const q = query(
      collection(db as Firestore, NOTIFICATIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AppNotification[];
      callback(notifications);
    }, (error) => {
      console.error('Error listening to notifications:', error);
    });

    return unsubscribe;
  },

  /**
   * Mark a single notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const docRef = doc(db as Firestore, NOTIFICATIONS_COLLECTION, notificationId);
      await updateDoc(docRef, { isRead: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Mark all unread notifications for a user as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const q = query(
        collection(db as Firestore, NOTIFICATIONS_COLLECTION),
        where('userId', '==', userId),
        where('isRead', '==', false)
      );
      
      const snapshot = await getDocs(q);
      if (snapshot.empty) return;

      const batch = writeBatch(db as Firestore);
      snapshot.docs.forEach((document) => {
        batch.update(doc(db as Firestore, NOTIFICATIONS_COLLECTION, document.id), { isRead: true });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  /**
   * Delete a specific notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const docRef = doc(db as Firestore, NOTIFICATIONS_COLLECTION, notificationId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
};
