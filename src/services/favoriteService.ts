import {
  collection, addDoc, deleteDoc, doc, query, where, onSnapshot, getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS } from '../lib/firestorePaths';

export interface Favorite {
  id: string;
  userId: string;
  hallId: string;
  createdAt: string;
}

export const favoriteService = {
  /** Real-time subscription to a user's favourites */
  subscribeToFavorites(userId: string, callback: (favs: Favorite[]) => void): () => void {
    if (!db) return () => {};
    const q = query(
      collection(db, COLLECTIONS.favorites),
      where('userId', '==', userId)
    );
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Favorite)));
    });
  },

  /** Add a hall to the user's wishlist (duplicate-safe) */
  async addFavorite(userId: string, hallId: string): Promise<void> {
    if (!db) return;
    // Prevent duplicates
    const q = query(
      collection(db, COLLECTIONS.favorites),
      where('userId', '==', userId),
      where('hallId', '==', hallId)
    );
    const existing = await getDocs(q);
    if (!existing.empty) return; // already saved

    await addDoc(collection(db, COLLECTIONS.favorites), {
      userId,
      hallId,
      createdAt: new Date().toISOString(),
    });
  },

  /** Remove a hall from the user's wishlist */
  async removeFavorite(userId: string, hallId: string): Promise<void> {
    if (!db) return;
    const q = query(
      collection(db, COLLECTIONS.favorites),
      where('userId', '==', userId),
      where('hallId', '==', hallId)
    );
    const snapshot = await getDocs(q);
    await Promise.all(snapshot.docs.map(d => deleteDoc(doc(db!, COLLECTIONS.favorites, d.id))));
  },
};
