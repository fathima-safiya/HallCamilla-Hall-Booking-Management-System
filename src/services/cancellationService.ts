import { collection, doc, setDoc, updateDoc, onSnapshot, query, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS } from '../lib/firestorePaths';
import type { CancellationRequest } from '../types/app';
import { bookingService } from './bookingService';
import { notificationService } from './notificationService';
import { emailNotificationService } from './emailNotificationService';
import type { Booking } from '../types/app';
export const cancellationService = {
  generateId(): string {
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CR-${randomHex}`;
  },

  async requestCancellation(bookingId: string, customerId: string, reason: string): Promise<CancellationRequest> {
    if (!db) throw new Error('Firestore not initialized');
    try {
      // 1. Create cancellation request
      const id = this.generateId();
      const request: CancellationRequest = {
        id,
        bookingId,
        customerId,
        reason,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, COLLECTIONS.cancellationRequests, id), request);

      // 2. Update booking status to 'CANCELLATION_REQUESTED'
      await bookingService.updateBookingStatus(bookingId, 'CANCELLATION_REQUESTED');

      // 3. Trigger Notification
      const bookingSnap = await getDoc(doc(db, COLLECTIONS.bookings, bookingId));
      if (bookingSnap.exists()) {
        const bookingData = bookingSnap.data();
        notificationService.createNotification({
          userId: 'admin',
          title: 'Cancellation Request',
          message: `⚠️ ${bookingData.customerName} has submitted a cancellation request for Booking #${bookingId}.`,
          type: 'cancellation',
          isRead: false,
          relatedBookingId: bookingId,
          relatedHallId: bookingData.hallId,
          link: '/admin/cancellations'
        }).catch(console.error);

        // Send Email Notification (non-blocking)
        emailNotificationService.sendCancellationRequestEmail(bookingData as Booking, reason);
      }

      return request;
    } catch (error) {
      console.error('Error creating cancellation request:', error);
      throw new Error('Failed to submit cancellation request.', { cause: error });
    }
  },

  subscribeToRequests(callback: (requests: CancellationRequest[]) => void): () => void {
    if (!db) return () => {};
    return onSnapshot(collection(db, COLLECTIONS.cancellationRequests), (snapshot) => {
      const requests = snapshot.docs.map(doc => doc.data() as CancellationRequest);
      requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(requests);
    });
  },

  async processRequest(id: string, bookingId: string, approved: boolean): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    try {
      const newStatus = approved ? 'APPROVED' : 'REJECTED';
      await updateDoc(doc(db, COLLECTIONS.cancellationRequests, id), { status: newStatus });

      if (approved) {
        await bookingService.updateBookingStatus(bookingId, 'CANCELLED');
      } else {
        // If rejected, revert booking to previous known state (Assume confirmed or approved based on payment, but here we can just set to APPROVED)
        // A robust system would store previous state. We will default back to 'APPROVED'.
        await bookingService.updateBookingStatus(bookingId, 'APPROVED');
      }

      const reqSnap = await getDoc(doc(db, COLLECTIONS.cancellationRequests, id));
      if (reqSnap.exists()) {
        const reqData = reqSnap.data() as CancellationRequest;
        const bookingSnap = await getDoc(doc(db, COLLECTIONS.bookings, bookingId));
        const hallId = bookingSnap.exists() ? bookingSnap.data().hallId : undefined;
        
        notificationService.createNotification({
          userId: reqData.customerId,
          title: `Cancellation ${newStatus}`,
          message: approved 
            ? `✅ Your cancellation request has been approved.` 
            : `❌ Your cancellation request has been rejected. Your booking remains active.`,
          type: 'cancellation',
          isRead: false,
          relatedBookingId: bookingId,
          relatedHallId: hallId,
          link: '/dashboard'
        }).catch(console.error);
      }
    } catch (error) {
      console.error('Error processing cancellation:', error);
      throw new Error('Failed to process cancellation.', { cause: error });
    }
  }
};
