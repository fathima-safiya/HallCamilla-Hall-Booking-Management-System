import { collection, doc, getDocs, getDoc, setDoc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { notificationService } from './notificationService';
import type { Payment, Booking } from '../types/app';
import { COLLECTIONS } from '../lib/firestorePaths';

export const paymentService = {
  generateTransactionId(): string {
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const year = new Date().getFullYear();
    return `TXN-${year}-${randomHex}`;
  },

  async createPayment(
    bookingId: string, 
    customerId: string, 
    amount: number, 
    paymentType: Payment['paymentType'], 
    paymentMethod: Payment['paymentMethod'],
    transactionId?: string
  ): Promise<Payment> {
    if (!db) throw new Error('Firestore not initialized');
    
    try {
      const id = `PAY-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      const finalTransactionId = transactionId || this.generateTransactionId();
      
      const newPayment: Payment = {
        id,
        bookingId,
        customerId,
        amount,
        paymentType,
        paymentStatus: 'Paid',
        paymentMethod,
        transactionId: finalTransactionId,
        paidAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, COLLECTIONS.payments, id), newPayment);
      
      // Update booking status
      const bookingRef = doc(db, COLLECTIONS.bookings, bookingId);
      const bookingUpdateData: Partial<Booking> = { 
        paymentStatus: paymentType === 'Advance' ? 'Advance Paid' : 'Fully Paid',
      };
      
      if (paymentType === 'Advance') {
        bookingUpdateData.advanceAmount = amount;
      }
      if (paymentType === 'Final') {
        bookingUpdateData.bookingStatus = 'CONFIRMED';
      }

      await updateDoc(bookingRef, bookingUpdateData);
      
      // Fetch the booking details to send the email
      const bookingSnap = await getDoc(bookingRef);
      if (bookingSnap.exists()) {
        const bookingData = bookingSnap.data() as Booking;

        const isAdvance = paymentType === 'Advance';

        // Trigger System Notification for Admin
        notificationService.createNotification({
          userId: 'admin',
          title: 'Payment Received',
          message: isAdvance 
            ? `💰 ${bookingData.customerName} has completed the advance payment for Booking #${bookingId}.`
            : `💰 Final payment received for Booking #${bookingId}.`,
          type: 'payment',
          isRead: false,
          relatedBookingId: bookingId,
          relatedHallId: bookingData.hallId,
          link: '/admin/payments'
        }).catch(console.error);

        // Trigger System Notification for Customer
        notificationService.createNotification({
          userId: customerId,
          title: 'Payment Successful',
          message: isAdvance
            ? `💳 Your advance payment of LKR ${amount.toLocaleString()} has been received successfully.`
            : `✅ Your final payment has been received. Your booking is now fully paid.`,
          type: 'payment',
          isRead: false,
          relatedBookingId: bookingId,
          relatedHallId: bookingData.hallId,
          link: '/dashboard'
        }).catch(console.error);
      }

      return newPayment;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw new Error('Failed to create the payment.', { cause: error });
    }
  },

  async getPaymentByBookingId(bookingId: string): Promise<Payment[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, COLLECTIONS.payments), where("bookingId", "==", bookingId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as Payment);
    } catch (error) {
      console.error(`Error fetching payments for booking ${bookingId}:`, error);
      throw new Error('Failed to retrieve payments for the booking.', { cause: error });
    }
  },

  async getCustomerPayments(customerId: string): Promise<Payment[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, COLLECTIONS.payments), where("customerId", "==", customerId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as Payment);
    } catch (error) {
      console.error(`Error fetching payments for customer ${customerId}:`, error);
      throw new Error('Failed to retrieve customer payments.', { cause: error });
    }
  },

  async getAllPayments(): Promise<Payment[]> {
    if (!db) return [];
    try {
      const snapshot = await getDocs(collection(db, COLLECTIONS.payments));
      return snapshot.docs.map(doc => doc.data() as Payment);
    } catch (error) {
      console.error('Error fetching all payments:', error);
      throw new Error('Failed to retrieve payments.', { cause: error });
    }
  },

  async updatePaymentStatus(id: string, paymentStatus: Payment['paymentStatus']): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    try {
      await updateDoc(doc(db, COLLECTIONS.payments, id), { paymentStatus });
    } catch (error) {
      console.error(`Error updating payment status for ${id}:`, error);
      throw new Error('Failed to update payment status.', { cause: error });
    }
  }
};
