import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS } from '../lib/firestorePaths';
import type { Booking } from '../types/app';
import { notificationService } from './notificationService';
import { emailNotificationService } from './emailNotificationService';
export const bookingService = {
  generateId(): string {
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CBH-${randomHex}`;
  },

  async getAllBookings(): Promise<Booking[]> {
    if (!db) return [];
    try {
      const snapshot = await getDocs(collection(db, COLLECTIONS.bookings));
      return snapshot.docs.map(bookingDoc => bookingDoc.data() as Booking);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw new Error('Failed to retrieve bookings. Please check your network connection.', { cause: error });
    }
  },

  async getBookingsByCustomer(customerId: string): Promise<Booking[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, COLLECTIONS.bookings), where("customerId", "==", customerId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(bookingDoc => bookingDoc.data() as Booking);
    } catch (error) {
      console.error(`Error fetching bookings for customer ${customerId}:`, error);
      throw new Error('Failed to retrieve customer bookings.', { cause: error });
    }
  },

  subscribeToBookings(callback: (bookings: Booking[]) => void): () => void {
    if (!db) return () => {};
    return onSnapshot(
      collection(db, COLLECTIONS.bookings), 
      (snapshot) => {
        const bookings = snapshot.docs.map(bookingDoc => bookingDoc.data() as Booking);
        // Sort by createdAt descending
        bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(bookings);
      },
      (error) => {
        console.error('Error in bookings subscription:', error);
      }
    );
  },

  async checkAvailability(hallId: string, eventDate: string): Promise<boolean> {
    if (!db) return true;
    try {
      const q = query(
        collection(db, COLLECTIONS.bookings), 
        where("hallId", "==", hallId),
        where("eventDate", "==", eventDate),
        where("bookingStatus", "in", ["CONFIRMED", "PENDING", "APPROVED"])
      );
      const snapshot = await getDocs(q);
      return snapshot.empty;
    } catch (error) {
      console.error('Error checking availability:', error);
      throw new Error('Failed to check hall availability.', { cause: error });
    }
  },

  async createBooking(booking: Omit<Booking, 'createdAt' | 'id' | 'paymentStatus'> & Partial<Pick<Booking, 'bookingStatus'>>): Promise<Booking> {
    if (!db) throw new Error('Firestore not initialized');
    
    try {
      // Check availability first to prevent double booking
      const isAvailable = await this.checkAvailability(booking.hallId, booking.eventDate);
      if (!isAvailable) {
        throw new Error('This hall is already booked or pending for the selected date.');
      }

      const id = this.generateId();
      const newBooking: Booking = {
        ...booking,
        id,
        bookingStatus: booking.bookingStatus || 'PENDING',
        paymentStatus: 'Unpaid',
        createdAt: new Date().toISOString()
      };

      // Firestore doesn't support undefined values, so we delete them
      Object.keys(newBooking).forEach(key => {
        if (newBooking[key as keyof Booking] === undefined) {
          delete newBooking[key as keyof Booking];
        }
      });

      await setDoc(doc(db, COLLECTIONS.bookings, id), newBooking);

      // Trigger System Notification for Admin (non-blocking)
      notificationService.createNotification({
        userId: 'admin',
        title: 'New Booking Request',
        message: `📅 New booking request received from ${newBooking.customerName} for  on ${newBooking.eventDate}.`,
        type: 'booking',
        isRead: false,
        relatedBookingId: id,
        relatedHallId: newBooking.hallId,
        link: '/admin/bookings'
      }).catch(console.error);

      // Trigger Email Notification (non-blocking)
      emailNotificationService.sendBookingSubmittedEmail(newBooking);

      return newBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      if (error instanceof Error) throw error;
      throw new Error('Failed to create the booking.', { cause: error });
    }
  },

  async updateBookingStatus(id: string, bookingStatus: Booking['bookingStatus']): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    try {
      const updateData: Partial<Booking> = { bookingStatus };
      if (bookingStatus === 'CONFIRMED') {
        updateData.paymentStatus = 'Fully Paid';
      }
      await updateDoc(doc(db, COLLECTIONS.bookings, id), updateData);

      // Trigger System Notifications and Emails for Customer (non-blocking)
      getDoc(doc(db, COLLECTIONS.bookings, id)).then(docSnap => {
        if (docSnap.exists()) {
          const bookingData = docSnap.data() as Booking;
          // Fire and forget System Notification for customer status update
          if (bookingData.customerId) {
              let message = `Your booking for your selected hall has been ${bookingStatus.toLowerCase()}.`;
              if (bookingStatus === 'APPROVED') {
                message = `✅ Your booking for your selected hall has been approved. Please complete your advance payment.`;
                emailNotificationService.sendBookingApprovedEmail(bookingData);
              } else if (bookingStatus === 'REJECTED') {
                message = `❌ Your booking request has been rejected. Please contact the hotel for more information.`;
                emailNotificationService.sendBookingRejectedEmail(bookingData);
              } else if (bookingStatus === 'CONFIRMED') {
                emailNotificationService.sendBookingConfirmedEmail(bookingData);
              }

              notificationService.createNotification({
                userId: bookingData.customerId,
                title: `Booking ${bookingStatus}`,
                message,
                type: 'booking',
                isRead: false,
                relatedBookingId: id,
                relatedHallId: bookingData.hallId,
                link: `/dashboard/booking/${bookingData.id}`
              });
          }
        }
      });
    } catch (error) {
      console.error(`Error updating booking status for ${id}:`, error);
      throw new Error('Failed to update booking status.', { cause: error });
    }
  },

  async deleteBooking(id: string): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    try {
      await deleteDoc(doc(db, COLLECTIONS.bookings, id));
    } catch (error) {
      console.error(`Error deleting booking ${id}:`, error);
      throw new Error('Failed to delete booking.', { cause: error });
    }
  }
};
