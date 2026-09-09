import jsPDF from 'jspdf';
import type { Booking } from '../types/app';

export const receiptService = {
  generateReceipt(booking: Booking, hallName: string, packageName: string, hotelExtraServicesNames: string[], externalServicesNames: string[] = []) {
    const doc = new jsPDF();
    
    // Theme colors
    const emeraldColor = '#022c22'; // luxury-emerald-950
    const goldColor = '#b45309'; // luxury-gold-700
    const grayColor = '#78716c'; // stone-500

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(emeraldColor);
    doc.text('CAMILLA BANQUET HOTEL', 105, 20, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(grayColor);
    doc.text('Kurunegala, Sri Lanka', 105, 28, { align: 'center' });
    doc.text('admincamillahotel@gmail.com | +94 11 234 5678', 105, 33, { align: 'center' });
    
    // Separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 40, 190, 40);

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(goldColor);
    doc.text('BOOKING RECEIPT', 20, 55);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(grayColor);
    doc.text(`Receipt Date: ${new Date().toLocaleDateString()}`, 190, 55, { align: 'right' });

    // Customer & Booking Info
    doc.setFontSize(11);
    doc.setTextColor(emeraldColor);
    
    let yPos = 70;
    const leftCol = 20;
    const rightCol = 100;
    const valueOffset = 40;

    // Left Column
    doc.setFont('helvetica', 'bold');
    doc.text('Booking Ref:', leftCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(booking.id, leftCol + valueOffset, yPos);
    yPos += 8;

    doc.setFont('helvetica', 'bold');
    doc.text('Customer:', leftCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(booking.customerName, leftCol + valueOffset, yPos);
    yPos += 8;

    doc.setFont('helvetica', 'bold');
    doc.text('Event Type:', leftCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(booking.eventName, leftCol + valueOffset, yPos);
    yPos += 8;

    doc.setFont('helvetica', 'bold');
    doc.text('Event Date:', leftCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(booking.eventDate, leftCol + valueOffset, yPos);
    yPos += 8;

    doc.setFont('helvetica', 'bold');
    doc.text('Guests:', leftCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(`${booking.guestCount} Pax`, leftCol + valueOffset, yPos);

    // Right Column
    yPos = 70;
    doc.setFont('helvetica', 'bold');
    doc.text('Hall:', rightCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(hallName, rightCol + 30, yPos);
    yPos += 8;

    doc.setFont('helvetica', 'bold');
    doc.text('Package:', rightCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(packageName, rightCol + 30, yPos);
    yPos += 8;

    doc.setFont('helvetica', 'bold');
    doc.text('Status:', rightCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(booking.bookingStatus, rightCol + 30, yPos);
    yPos += 8;

    // Separator line
    yPos += 15;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos, 190, yPos);
    yPos += 15;

    // Pricing Breakdown
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(goldColor);
    doc.text('PAYMENT DETAILS', 20, yPos);
    yPos += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(emeraldColor);

    const priceRightCol = 190;

    doc.text('Hall Reservation', 20, yPos);
    doc.text(`LKR ${booking.hallPrice.toLocaleString()}`, priceRightCol, yPos, { align: 'right' });
    yPos += 8;

    doc.text('Package Cost', 20, yPos);
    doc.text(`LKR ${booking.packagePrice.toLocaleString()}`, priceRightCol, yPos, { align: 'right' });
    yPos += 8;

    if (booking.extraServicesPrice > 0) {
      doc.text('Extra Services', 20, yPos);
      doc.text(`LKR ${booking.extraServicesPrice.toLocaleString()}`, priceRightCol, yPos, { align: 'right' });
      yPos += 6;
      
      doc.setFontSize(9);
      doc.setTextColor(grayColor);
      hotelExtraServicesNames.forEach(name => {
        doc.text(`- ${name}`, 25, yPos);
        yPos += 5;
      });
      doc.setFontSize(11);
      doc.setTextColor(emeraldColor);
      yPos += 2;
    }

    if (externalServicesNames.length > 0) {
      doc.setFontSize(11);
      doc.setTextColor(emeraldColor);
      doc.text('External Services', 20, yPos);
      doc.text('Customer Arranged', priceRightCol, yPos, { align: 'right' });
      yPos += 6;
      
      doc.setFontSize(9);
      doc.setTextColor(grayColor);
      externalServicesNames.forEach(name => {
        doc.text(`- ${name}`, 25, yPos);
        yPos += 5;
      });
      doc.setFontSize(11);
      doc.setTextColor(emeraldColor);
      yPos += 2;
    }

    // Separator line
    yPos += 5;
    doc.line(120, yPos, 190, yPos);
    yPos += 8;

    // Total
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Total Amount', 120, yPos);
    doc.text(`LKR ${booking.totalAmount.toLocaleString()}`, priceRightCol, yPos, { align: 'right' });
    yPos += 12;

    // Payments Made
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const advanceAmount = booking.totalAmount * 0.2;
    const remainingAmount = booking.totalAmount - advanceAmount;
    const hasPaidAdvance = ['Advance Paid', 'Fully Paid'].includes(booking.paymentStatus);
    
    doc.text('Advance Paid (20%)', 120, yPos);
    doc.text(hasPaidAdvance ? `LKR ${advanceAmount.toLocaleString()}` : 'LKR 0', priceRightCol, yPos, { align: 'right' });
    yPos += 8;

    doc.line(120, yPos, 190, yPos);
    yPos += 8;

    // Balance
    doc.setFont('helvetica', 'bold');
    doc.text('Remaining Balance', 120, yPos);
    const balance = hasPaidAdvance ? booking.totalAmount - advanceAmount : booking.totalAmount;
    doc.text(`LKR ${balance.toLocaleString()}`, priceRightCol, yPos, { align: 'right' });

    // Cancellation Policy
    yPos += 30;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(emeraldColor);
    doc.text('CANCELLATION POLICY', 20, yPos);
    yPos += 6;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(grayColor);
    doc.text('1. Cancellations made 30 days before the event will receive a full refund of the advance.', 20, yPos);
    yPos += 5;
    doc.text('2. Cancellations made within 30 days of the event may forfeit the advance payment.', 20, yPos);
    yPos += 5;
    doc.text('3. You can request a cancellation directly from your Booking Dashboard.', 20, yPos);

    // Footer
    yPos = 270;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(grayColor);
    doc.text('Thank you for choosing Camilla Banquet Hotel. We look forward to hosting your event.', 105, yPos, { align: 'center' });

    // Save
    doc.save(`Camilla_Receipt_${booking.id}.pdf`);
  }
};
