import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS } from '../lib/firestorePaths';
import type { Vendor } from '../types/app';

export const vendorService = {
  /** Generate a new ID for a vendor */
  generateId(): string {
    if (!db) throw new Error('Firestore not initialized');
    return doc(collection(db, COLLECTIONS.vendors)).id;
  },

  /** Subscribe to all vendors in real-time */
  subscribeToVendors(callback: (vendors: Vendor[]) => void): () => void {
    if (!db) return () => {};
    return onSnapshot(
      collection(db, COLLECTIONS.vendors),
      (snapshot) => {
        const vendors = snapshot.docs.map(doc => doc.data() as Vendor);
        callback(vendors);
      },
      (error) => {
        console.error('Error in vendors subscription:', error);
      }
    );
  },

  /** Add a new vendor */
  async addVendor(vendorData: Omit<Vendor, 'createdAt' | 'id'>): Promise<Vendor> {
    if (!db) throw new Error('Firestore not initialized');
    try {
      const id = this.generateId();
      const newVendor: Vendor = {
        ...vendorData,
        id,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, COLLECTIONS.vendors, id), newVendor);
      return newVendor;
    } catch (error) {
      console.error('Error adding vendor:', error);
      throw new Error('Failed to add new vendor. Please try again.', { cause: error });
    }
  },

  /** Update an existing vendor */
  async updateVendor(id: string, updatedFields: Partial<Vendor>): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    try {
      await updateDoc(doc(db, COLLECTIONS.vendors, id), updatedFields as Record<string, unknown>);
    } catch (error) {
      console.error(`Error updating vendor ${id}:`, error);
      throw new Error('Failed to update vendor details.', { cause: error });
    }
  },

  /** Delete a vendor */
  async deleteVendor(id: string): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    try {
      await deleteDoc(doc(db, COLLECTIONS.vendors, id));
    } catch (error) {
      console.error(`Error deleting vendor ${id}:`, error);
      throw new Error('Failed to delete vendor.', { cause: error });
    }
  }
};
