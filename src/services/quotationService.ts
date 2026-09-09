import { jsPDF } from 'jspdf';
import type { ExternalServiceDetails } from '../types/app';

export interface QuotationData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  hallName: string;
  hallPrice: number;
  packageName: string;
  packageDescription?: string;
  packagePrice: number;
  packagePricePerPerson?: number;
  eventDate?: string;
  guestCount?: number;
  eventType?: string;
  hotelServices: { name: string; price: number }[];
  externalVendors?: ExternalServiceDetails[];
  discount?: number;
}

const EMERALD = '#022c22';
const GOLD    = '#b45309';
const GRAY    = '#78716c';
const LIGHT   = '#f5f5f4'; // stone-100

function fmt(n: number) {
  return `LKR ${n.toLocaleString('en-LK')}`;
}

function autoQuotationNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `QT-${date}-${rand}`;
}

export const quotationService = {
  generateQuotation(data: QuotationData) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = 210;   // page width
    const MARGIN = 18;
    const RIGHT = W - MARGIN;
    const COL_MID = W / 2;

    const servicesSubtotal = data.hotelServices.reduce((s, sv) => s + sv.price, 0);
    const subtotal = data.hallPrice + data.packagePrice + servicesSubtotal;
    const discount = data.discount || 0;
    const grandTotal = Math.max(0, subtotal - discount);
    const advance = Math.round(grandTotal * 0.2);
    const remaining = grandTotal - advance;

    const quotationNo = autoQuotationNumber();
    const today = new Date();
    const validUntil = new Date(today);
    validUntil.setDate(today.getDate() + 7);
    const fmtDate = (d: Date) =>
      d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    let y = 0;

    /* ─────────────────────────────────────────
       HEADER BAND
    ───────────────────────────────────────── */
    // Elegant Dark Emerald Top Band
    doc.setFillColor(6, 78, 59); // emerald-900 (slightly softer than 950)
    doc.rect(0, 0, W, 40, 'F');

    // Hotel name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('CAMILLA BANQUET HOTEL', COL_MID, 18, { align: 'center' });

    // Tagline
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(209, 213, 219); // stone-300
    doc.text('Luxury Banquet & Event Venue  •  Kurunegala, Sri Lanka', COL_MID, 25, { align: 'center' });
    
    // Contact Info
    doc.setFontSize(7.5);
    doc.setTextColor(156, 163, 175); // stone-400
    doc.text('admincamillahotel@gmail.com   |   +94 37 123 4567   |   hallcamilla.lk', COL_MID, 32, { align: 'center' });

    // Thin Gold accent strip
    doc.setFillColor(217, 119, 6); // amber-600 (a nicer gold)
    doc.rect(0, 40, W, 1.5, 'F');

    y = 52;

    /* ─────────────────────────────────────────
       QUOTATION TITLE & META
    ───────────────────────────────────────── */
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(6, 78, 59); // emerald-900
    doc.text('OFFICIAL QUOTATION', MARGIN, y);

    // Meta details block
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(87, 83, 78); // stone-600
    
    // Moved labels further left to avoid overlapping with values
    doc.text(`Quotation No:`, RIGHT - 45, y - 6);
    doc.text(`Date Issued:`, RIGHT - 45, y - 1);
    doc.text(`Valid Until:`, RIGHT - 45, y + 4);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(28, 25, 23); // stone-900
    doc.text(`${quotationNo}`, RIGHT, y - 6, { align: 'right' });
    doc.text(`${fmtDate(today)}`, RIGHT, y - 1, { align: 'right' });
    doc.text(`${fmtDate(validUntil)}`, RIGHT, y + 4, { align: 'right' });

    y += 10;
    // Elegant Divider
    doc.setDrawColor(229, 231, 235); // gray-200
    doc.setLineWidth(0.5);
    doc.line(MARGIN, y, RIGHT, y);
    y += 8;

    /* ─────────────────────────────────────────
       CUSTOMER & EVENT DETAILS BOXES
    ───────────────────────────────────────── */
    // Left box (Customer)
    doc.setDrawColor(217, 119, 6); // amber-600
    doc.setLineWidth(0.3);
    doc.setFillColor(250, 250, 249); // stone-50
    doc.roundedRect(MARGIN, y, 82, 32, 3, 3, 'FD');

    // Right box (Event)
    doc.setDrawColor(6, 78, 59); // emerald-900
    doc.roundedRect(COL_MID + 3, y, 82, 32, 3, 3, 'FD');

    // ─ Left: Customer Details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(217, 119, 6);
    doc.text('PREPARED FOR', MARGIN + 6, y + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(28, 25, 23);
    doc.text(data.customerName || 'Valued Guest', MARGIN + 6, y + 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(87, 83, 78);
    doc.text(data.customerEmail || 'No Email Provided', MARGIN + 6, y + 21);
    doc.text(data.customerPhone || 'No Phone Provided', MARGIN + 6, y + 27);

    // ─ Right: Event Details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(6, 78, 59);
    doc.text('EVENT SPECIFICATIONS', COL_MID + 9, y + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(87, 83, 78);
    
    doc.text('Venue:', COL_MID + 9, y + 14);
    doc.text('Type:', COL_MID + 9, y + 20);
    doc.text('Date:', COL_MID + 9, y + 26);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(28, 25, 23);
    
    const evType = data.eventType || 'Not specified';
    const evDate = data.eventDate ? fmtDate(new Date(data.eventDate)) : 'TBC';
    const guests = data.guestCount ? `${data.guestCount} Pax` : 'TBC';

    doc.text(data.hallName, COL_MID + 24, y + 14);
    doc.text(evType, COL_MID + 24, y + 20);
    doc.text(evDate, COL_MID + 24, y + 26);
    // Guests on the same line as Type to save space, or just keep it simple
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(87, 83, 78);
    doc.text('Guests:', COL_MID + 46, y + 26);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(28, 25, 23);
    doc.text(guests, COL_MID + 59, y + 26);

    y += 40;

    /* ─────────────────────────────────────────
       SECTION HELPER
    ───────────────────────────────────────── */
    const drawSectionTitle = (title: string, currentY: number) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(6, 78, 59); // emerald-900
      doc.text(title, MARGIN, currentY);
      
      // Thin line below title
      doc.setDrawColor(217, 119, 6); // amber-600
      doc.setLineWidth(0.4);
      doc.line(MARGIN, currentY + 3, RIGHT, currentY + 3);
      return currentY + 10; // Reduced padding
    };

    /* ─────────────────────────────────────────
       SELECTED PACKAGE
    ───────────────────────────────────────── */
    y = drawSectionTitle('1. SELECTED PACKAGE', y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(28, 25, 23);
    doc.text(data.packageName, MARGIN, y + 4);

    doc.setFontSize(11);
    doc.setTextColor(217, 119, 6);
    doc.text(fmt(data.packagePrice), RIGHT, y + 4, { align: 'right' });

    if (data.packagePricePerPerson && data.guestCount) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(120, 113, 108); // stone-500
      doc.text(`(LKR ${data.packagePricePerPerson.toLocaleString('en-LK')} × ${data.guestCount} Guests)`, MARGIN, y + 9);
      y += 5;
    }

    if (data.packageDescription) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(120, 113, 108); // stone-500
      const descLines = doc.splitTextToSize(data.packageDescription, RIGHT - MARGIN - 30);
      doc.text(descLines, MARGIN, y + 10);
      y += 10 + (descLines.length * 4) + 6;
    } else {
      y += 12;
    }

    /* ─────────────────────────────────────────
       HOTEL EXTRA SERVICES
    ───────────────────────────────────────── */
    if (data.hotelServices.length > 0) {
      y = drawSectionTitle('2. HOTEL EXTRA SERVICES', y);

      // Header row
      doc.setFillColor(243, 244, 246); // gray-100
      doc.rect(MARGIN, y, RIGHT - MARGIN, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(87, 83, 78);
      doc.text('Service Description', MARGIN + 4, y + 5.5);
      doc.text('Amount', RIGHT - 4, y + 5.5, { align: 'right' });
      y += 8;

      // Rows
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(28, 25, 23);
      data.hotelServices.forEach((sv, i) => {
        if (i % 2 !== 0) {
          doc.setFillColor(250, 250, 249);
          doc.rect(MARGIN, y, RIGHT - MARGIN, 8, 'F');
        }
        doc.text(sv.name, MARGIN + 4, y + 5.5);
        doc.text(fmt(sv.price), RIGHT - 4, y + 5.5, { align: 'right' });
        y += 8;
      });

      // Subtotal
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.3);
      doc.line(MARGIN, y, RIGHT, y);
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(6, 78, 59);
      doc.text('Services Subtotal', MARGIN + 4, y + 6);
      doc.text(fmt(servicesSubtotal), RIGHT - 4, y + 6, { align: 'right' });
      y += 12;
    }

    /* ─────────────────────────────────────────
       COST BREAKDOWN & TOTALS
    ───────────────────────────────────────── */
    y = drawSectionTitle('3. COST BREAKDOWN', y);

    const drawLineItem = (label: string, val: string, isBold = false) => {
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setFontSize(isBold ? 9.5 : 9);
      doc.setTextColor(28, 25, 23);
      doc.text(label, MARGIN + 4, y + 5);
      doc.text(val, RIGHT - 4, y + 5, { align: 'right' });
      y += 8;
    };

    // Very faint background for breakdown block
    doc.setFillColor(250, 250, 249);
    doc.rect(MARGIN, y, RIGHT - MARGIN, (discount > 0 ? 32 : 24), 'F');

    drawLineItem(`Venue Rental: ${data.hallName}`, fmt(data.hallPrice));
    drawLineItem(`Package: ${data.packageName}`, fmt(data.packagePrice));
    if (data.hotelServices.length > 0) {
      drawLineItem('Hotel Extra Services', fmt(servicesSubtotal));
    }
    if (discount > 0) {
      doc.setTextColor(220, 38, 38); // red-600
      doc.text('Discount Applied', MARGIN + 4, y + 5);
      doc.text(`-${fmt(discount)}`, RIGHT - 4, y + 5, { align: 'right' });
      y += 8;
    }

    // GRAND TOTAL BOX
    y += 2;
    doc.setFillColor(6, 78, 59); // emerald-900
    doc.roundedRect(MARGIN, y, RIGHT - MARGIN, 12, 2, 2, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text('GRAND TOTAL', MARGIN + 6, y + 8);
    
    doc.setTextColor(253, 230, 138); // amber-200
    doc.text(fmt(grandTotal), RIGHT - 6, y + 8, { align: 'right' });
    y += 14;

    // Payment Terms Box
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.roundedRect(MARGIN, y, RIGHT - MARGIN, 18, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(217, 119, 6); // amber-600
    doc.text('Advance Payment (20%) to Confirm Booking:', MARGIN + 6, y + 7);
    doc.text(fmt(advance), RIGHT - 6, y + 7, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(120, 113, 108); // stone-500
    doc.text('Remaining Balance (80%) payable before event day:', MARGIN + 6, y + 13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(28, 25, 23);
    doc.text(fmt(remaining), RIGHT - 6, y + 13, { align: 'right' });
    
    y += 24;

    /* ─────────────────────────────────────────
       TERMS & CONDITIONS
    ───────────────────────────────────────── */
    // Make sure terms fit on page, else add page
    if (y > 245) {
      doc.addPage();
      y = 20;
    }

    y = drawSectionTitle('TERMS & CONDITIONS', y);

    const terms = [
      'This quotation is valid for 7 days from the date of issue.',
      'Prices are subject to change based on final availability at the time of booking.',
      'Booking is confirmed only upon receipt of the 20% advance payment.',
      'This quotation does NOT reserve the event date until payment is confirmed.',
      'Final pricing may be adjusted if guest counts or selected services are modified.'
    ];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(87, 83, 78);
    terms.forEach((t, i) => {
      doc.text(`${i + 1}.  ${t}`, MARGIN, y + 4);
      y += 6;
    });

    /* ─────────────────────────────────────────
       FOOTER
    ───────────────────────────────────────── */
    // Emerald bottom bar
    doc.setFillColor(6, 78, 59);
    doc.rect(0, 280, W, 17, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('Thank you for choosing Camilla Banquet Hotel.', COL_MID, 287, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(167, 243, 208); // emerald-200
    doc.text('We look forward to making your event truly unforgettable.', COL_MID, 292, { align: 'center' });

    doc.save(`Camilla_Quotation_${quotationNo}.pdf`);
  }
};
