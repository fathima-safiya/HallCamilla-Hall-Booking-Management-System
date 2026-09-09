import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS } from '../lib/firestorePaths';
import type { Hall } from '../types/app';
import { notificationService } from './notificationService';

export const hallService = {
  /** Generate a new ID for a hall */
  generateId(): string {
    if (!db) throw new Error('Firestore not initialized');
    return doc(collection(db, COLLECTIONS.halls)).id;
  },

  /** Get all halls one-time */
  async getAllHalls(): Promise<Hall[]> {
    if (!db) return [];
    try {
      const snapshot = await getDocs(collection(db, COLLECTIONS.halls));
      return snapshot.docs.map(hallDoc => hallDoc.data() as Hall);
    } catch (error) {
      console.error('Error fetching halls:', error);
      throw new Error('Failed to fetch halls. Please check your network connection.', { cause: error });
    }
  },

  /** Subscribe to all halls in real-time */
  subscribeToHalls(callback: (halls: Hall[]) => void): () => void {
    if (!db) return () => {};
    return onSnapshot(
      collection(db, COLLECTIONS.halls), 
      (snapshot) => {
        const halls = snapshot.docs.map(hallDoc => hallDoc.data() as Hall);
        callback(halls);
      },
      (error) => {
        console.error('Error in halls subscription:', error);
      }
    );
  },

  /** Add a new hall */
  async addHall(hallData: Omit<Hall, 'createdAt' | 'id'>): Promise<Hall> {
    if (!db) throw new Error('Firestore not initialized');
    try {
      const id = this.generateId();
      const newHall: Hall = {
        ...hallData,
        id,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, COLLECTIONS.halls, id), newHall);
      return newHall;
    } catch (error) {
      console.error('Error adding hall:', error);
      throw new Error('Failed to add new hall. Please try again.', { cause: error });
    }
  },

  /** Update an existing hall */
  async updateHall(id: string, updatedFields: Partial<Hall>): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    try {
      await updateDoc(doc(db, COLLECTIONS.halls, id), updatedFields as Record<string, unknown>);

      if (updatedFields.status === 'Maintenance') {
        const hallSnap = await getDoc(doc(db, COLLECTIONS.halls, id));
        if (hallSnap.exists()) {
          const hallName = hallSnap.data().hallName;
          notificationService.createNotification({
            userId: 'admin',
            title: 'Hall Maintenance',
            message: `🛠 ${hallName} has been marked as under maintenance.`,
            type: 'maintenance',
            isRead: false,
            relatedHallId: id,
            link: '/admin/halls'
          }).catch(console.error);
        }
      }
    } catch (error) {
      console.error(`Error updating hall ${id}:`, error);
      throw new Error('Failed to update hall details.', { cause: error });
    }
  },

  /** Delete a hall */
  async deleteHall(id: string): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    try {
      await deleteDoc(doc(db, COLLECTIONS.halls, id));
    } catch (error) {
      console.error(`Error deleting hall ${id}:`, error);
      throw new Error('Failed to delete hall.', { cause: error });
    }
  }
};
