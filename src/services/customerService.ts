import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS } from '../lib/firestorePaths';
import type { CustomerUser, Booking } from '../types/app';

export const customerService = {
  async getAllCustomers(): Promise<CustomerUser[]> {
    if (!db) return [];
    try {
      const snapshot = await getDocs(collection(db, COLLECTIONS.customers));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CustomerUser));
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw new Error('Failed to retrieve customers.', { cause: error });
    }
  },

  async getCustomerById(id: string): Promise<CustomerUser | null> {
    if (!db) return null;
    try {
      const docRef = doc(db, COLLECTIONS.customers, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as CustomerUser;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      throw new Error('Failed to retrieve customer details.', { cause: error });
    }
  },

  async getCustomerBookings(email: string): Promise<Booking[]> {
    if (!db) return [];
    try {
      const q = query(
        collection(db, COLLECTIONS.bookings),
        where('email', '==', email)
      );
      const snapshot = await getDocs(q);
      const bookings = snapshot.docs.map(doc => doc.data() as Booking);
      // Sort by createdAt descending
      return bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error(`Error fetching bookings for email ${email}:`, error);
      throw new Error('Failed to retrieve customer bookings.', { cause: error });
    }
  },

  async getCustomerLoyaltyStatus(email: string): Promise<{ isLoyal: boolean, bookingsCount: number }> {
    if (!db) return { isLoyal: false, bookingsCount: 0 };
    try {
      const bookings = await this.getCustomerBookings(email);
      const completedBookings = bookings.filter(b => b.bookingStatus === 'COMPLETED' || b.bookingStatus === 'CONFIRMED');
      return {
        isLoyal: completedBookings.length >= 2, // Loyalty threshold
        bookingsCount: completedBookings.length
      };
    } catch (error) {
      console.error(`Error checking loyalty status for ${email}:`, error);
      return { isLoyal: false, bookingsCount: 0 };
    }
  }
};
