export interface EmailParams {
  customer_name: string;
  hall_name: string;
  event_date: string;
  booking_id: string;
  status_message: string;
  customer_email: string; // If using dynamic to_email
}

/**
 * Helper to generate standardized template parameters for EmailJS
 */
export const buildEmailParams = (
  customerName: string,
  customerEmail: string,
  hallName: string,
  eventDate: string,
  bookingId: string,
  statusMessage: string
): Record<string, string> => {
  return {
    customer_name: customerName,
    customer_email: customerEmail,
    hall_name: hallName,
    event_date: eventDate,
    booking_id: bookingId,
    status_message: statusMessage,
    // Add any global variables here
    company_name: 'Camilla Banquet Hotel',
  };
};

/**
 * Fallback console templates for testing without EmailJS credentials
 */
export const getConsoleTemplate = (params: Record<string, string>, subject: string) => `
=========================================
📧 EMAIL SIMULATION
-----------------------------------------
To: ${params.customer_email}
Subject: ${subject}
-----------------------------------------
Dear ${params.customer_name},

${params.status_message}

Booking Details:
- Hall: ${params.hall_name}
- Date: ${params.event_date}
- Booking ID: ${params.booking_id}

Thank you for choosing ${params.company_name}.
=========================================
`;
