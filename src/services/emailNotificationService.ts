import { emailService } from './emailService';
import type { Booking } from '../types/app';
import config from '../../firebase.config.json';

// Helper to format date consistently
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Extract the first admin email from the config
const getAdminEmail = () => {
  const emails = config.adminEmails;
  if (Array.isArray(emails) && emails.length > 0) return emails[0];
  if (typeof emails === 'string') return emails;
  return 'admincamillahotel@gmail.com'; // Fallback
};

export const emailNotificationService = {
  // 1. Booking Request Submitted
  async sendBookingSubmittedEmail(booking: Booking) {
    try {
      const formattedDate = formatDate(booking.eventDate);
      
      // To Customer
      await emailService.sendEmail(
        booking.email,
        "Booking Request Received - Camilla Banquet Hotel",
        {
          customer_name: booking.customerName.split(' ')[0],
          status_message: `We have received your booking request for the ${booking.eventName}. It is currently pending admin approval.`,
          hall_name: booking.eventName,
          event_date: formattedDate,
          booking_id: booking.id,
          company_name: "Camilla Banquet"
        }
      );

      // To Admin
      await emailService.sendEmail(
        getAdminEmail(),
        "New Booking Request",
        {
          customer_name: 'Admin',
          status_message: `A new booking request has been submitted by ${booking.customerName} (${booking.email}, ${booking.phone}). Guest count: \$\{booking.guestCount\}.`,
          hall_name: booking.eventName,
          event_date: formattedDate,
          booking_id: booking.id,
          company_name: "Camilla Banquet"
        }
      );
    } catch (e) {
      console.error("Failed to send Booking Submitted email", e);
    }
  },

  // 2. Booking Approved
  async sendBookingApprovedEmail(booking: Booking) {
    try {
      const formattedDate = formatDate(booking.eventDate);
      const advanceAmount = (booking.totalAmount || 0) * 0.5; // Assuming 50% advance
      
      await emailService.sendEmail(
        booking.email,
        "Booking Approved - Camilla Banquet Hotel",
        {
          customer_name: booking.customerName.split(' ')[0],
          status_message: `Great news! Your booking has been approved. To secure your reservation, please complete the advance payment of LKR ${advanceAmount.toLocaleString()} via your dashboard. Total amount is LKR ${(booking.totalAmount || 0).toLocaleString()}.`,
          hall_name: booking.eventName,
          event_date: formattedDate,
          booking_id: booking.id,
          company_name: "Camilla Banquet"
        }
      );
    } catch (e) {
      console.error("Failed to send Booking Approved email", e);
    }
  },

  // 3. Booking Rejected
  async sendBookingRejectedEmail(booking: Booking) {
    try {
      const formattedDate = formatDate(booking.eventDate);
      
      await emailService.sendEmail(
        booking.email,
        "Booking Request Update - Camilla Banquet Hotel",
        {
          customer_name: booking.customerName.split(' ')[0],
          status_message: `We regret to inform you that we are unable to accommodate your booking request at this time. Please contact us to find an alternative date.`,
          hall_name: booking.eventName,
          event_date: formattedDate,
          booking_id: booking.id,
          company_name: "Camilla Banquet"
        }
      );
    } catch (e) {
      console.error("Failed to send Booking Rejected email", e);
    }
  },

  // 4. Payment Received
  async sendPaymentReceivedEmail(booking: Booking, amount: number, transactionId: string) {
    try {
      const formattedDate = formatDate(booking.eventDate);
      
      // To Customer
      await emailService.sendEmail(
        booking.email,
        "Payment Received - Camilla Banquet Hotel",
        {
          customer_name: booking.customerName.split(' ')[0],
          status_message: `We have successfully received your payment of LKR ${amount.toLocaleString()}. Your transaction ID is ${transactionId}.`,
          hall_name: booking.eventName,
          event_date: formattedDate,
          booking_id: booking.id,
          company_name: "Camilla Banquet"
        }
      );

      // To Admin
      await emailService.sendEmail(
        getAdminEmail(),
        "Payment Received",
        {
          customer_name: 'Admin',
          status_message: `${booking.customerName} has successfully completed a payment of LKR ${amount.toLocaleString()}. Transaction ID: ${transactionId}.`,
          hall_name: booking.eventName,
          event_date: formattedDate,
          booking_id: booking.id,
          company_name: "Camilla Banquet"
        }
      );
    } catch (e) {
      console.error("Failed to send Payment Received email", e);
    }
  },

  // 5. Booking Confirmed
  async sendBookingConfirmedEmail(booking: Booking) {
    try {
      const formattedDate = formatDate(booking.eventDate);
      
      await emailService.sendEmail(
        booking.email,
        "Booking Confirmed - Camilla Banquet Hotel",
        {
          customer_name: booking.customerName.split(' ')[0],
          status_message: `Your booking is now fully confirmed! We look forward to hosting your event on \$\{booking.eventDate\}.`,
          hall_name: booking.eventName,
          event_date: formattedDate,
          booking_id: booking.id,
          company_name: "Camilla Banquet"
        }
      );
    } catch (e) {
      console.error("Failed to send Booking Confirmed email", e);
    }
  },

  // 6. Cancellation Request
  async sendCancellationRequestEmail(booking: Booking, reason: string) {
    try {
      const formattedDate = formatDate(booking.eventDate);
      
      // To Admin
      await emailService.sendEmail(
        getAdminEmail(),
        "Cancellation Request",
        {
          customer_name: 'Admin',
          status_message: `${booking.customerName} has requested to cancel their booking. Reason provided: "${reason}". Please review this in the admin dashboard.`,
          hall_name: booking.eventName,
          event_date: formattedDate,
          booking_id: booking.id,
          company_name: "Camilla Banquet"
        }
      );
    } catch (e) {
      console.error("Failed to send Cancellation Request email", e);
    }
  }
};
