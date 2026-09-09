import { collection, getDocs, setDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS, customerDocId } from '../lib/firestorePaths';
import type { Hall, Package, Service, Booking, Payment, CustomerUser, Review, CancellationRequest, MaintenanceRecord, AppNotification, EventType } from '../types/app';

const DEMO_CUSTOMERS = [
  { name: 'Mohamed Rizwan', email: 'rizwan@example.com', phone: '0771234567', location: 'Kurunegala' },
  { name: 'Fathima Ayesha', email: 'ayesha@example.com', phone: '0712345678', location: 'Colombo' },
  { name: 'Kasun Perera', email: 'kasun@example.com', phone: '0763456789', location: 'Kandy' },
  { name: 'Nadeesha Fernando', email: 'nadeesha@example.com', phone: '0754567890', location: 'Kurunegala' },
  { name: 'Ahmed Faiz', email: 'faiz@example.com', phone: '0785678901', location: 'Kuliyapitiya' },
  { name: 'Tharindu Silva', email: 'tharindu@example.com', phone: '0726789012', location: 'Dambadeniya' },
  { name: 'Nuwan Jayasinghe', email: 'nuwan@example.com', phone: '0777890123', location: 'Kurunegala' },
  { name: 'Sarah Weerasinghe', email: 'sarah@example.com', phone: '0718901234', location: 'Colombo' },
  { name: 'Imran Nazeer', email: 'imran@example.com', phone: '0769012345', location: 'Kandy' },
  { name: 'Sanduni Rathnayake', email: 'sanduni@example.com', phone: '0750123456', location: 'Kurunegala' }
];

const DEMO_EVENT_TYPES = [
  'Wedding Reception', 'Engagement Ceremony', 'Birthday Party', 'Corporate Meeting',
  'Conference', 'Seminar', 'Anniversary Celebration', 'Religious Event', 'Product Launch'
];

const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const seedFullDemoData = async () => {
  try {
    console.log("Starting Full System Demo Data Seeding...");
    
    // 1. Fetch Existing Data
    const hallsSnap = await getDocs(collection(db, COLLECTIONS.halls));
    const packagesSnap = await getDocs(collection(db, COLLECTIONS.packages));
    const servicesSnap = await getDocs(collection(db, COLLECTIONS.services));

    const halls: Hall[] = hallsSnap.docs.map(d => d.data() as Hall);
    const packages: Package[] = packagesSnap.docs.map(d => d.data() as Package);
    const services: Service[] = servicesSnap.docs.map(d => d.data() as Service);

    if (halls.length === 0 || packages.length === 0) {
      throw new Error("Cannot seed data: You must have Halls and Packages in the database first.");
    }

    const batch = writeBatch(db);

    // 2. Seed Event Types
    console.log("Seeding Event Types...");
    DEMO_EVENT_TYPES.forEach(typeName => {
      const id = doc(collection(db, COLLECTIONS.eventTypes)).id;
      const eventType: EventType = {
        id,
        name: typeName,
        isActive: true,
        createdAt: new Date().toISOString()
      };
      batch.set(doc(db, COLLECTIONS.eventTypes, id), eventType);
    });

    // 3. Seed Customers
    console.log("Seeding Customers...");
    const customerIds: string[] = [];
    DEMO_CUSTOMERS.forEach(cust => {
      const id = customerDocId(cust.email);
      customerIds.push(id);
      const customer: CustomerUser = {
        id,
        name: cust.name,
        email: cust.email,
        phone: cust.phone,
        joinedDate: formatDate(new Date(2023, 1, 1))
      };
      batch.set(doc(db, COLLECTIONS.customers, id), customer);
    });

    // 4. Seed Bookings, Payments, Cancellations, Reviews
    console.log("Seeding Bookings, Payments, and related data...");
    const bookingStatuses: Booking['bookingStatus'][] = [
      'PENDING', 'APPROVED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED'
    ];

    let pastDates = new Date();
    pastDates.setMonth(pastDates.getMonth() - 2);
    
    let futureDates = new Date();
    futureDates.setMonth(futureDates.getMonth() + 4);

    for (let i = 0; i < 15; i++) {
      const bookingId = doc(collection(db, COLLECTIONS.bookings)).id;
      const customerIndex = i % DEMO_CUSTOMERS.length;
      const custId = customerIds[customerIndex];
      const custData = DEMO_CUSTOMERS[customerIndex];
      
      const hall = halls[i % halls.length];
      const pkg = packages[i % packages.length];
      
      // Select 2 random services
      const extraServs = [
        services[Math.floor(Math.random() * services.length)],
        services[Math.floor(Math.random() * services.length)]
      ].filter(s => s); // Ensure not undefined
      
      const extraServicesPrice = extraServs.reduce((sum, s) => sum + s.price, 0);
      const totalAmount = hall.basePrice + pkg.packagePrice + extraServicesPrice;
      const advanceAmount = totalAmount * 0.3;
      
      const status = bookingStatuses[i % bookingStatuses.length];
      
      // Determine dates
      let eventDateObj = ['COMPLETED', 'CANCELLED', 'REJECTED'].includes(status) 
        ? randomDate(pastDates, new Date()) 
        : randomDate(new Date(), futureDates);
        
      const isPaidAdvance = ['CONFIRMED', 'COMPLETED'].includes(status);
      const isFullyPaid = status === 'COMPLETED';

      const booking: Booking = {
        id: bookingId,
        customerId: custId,
        hallId: hall.id,
        packageId: pkg.id,
        hotelExtraServices: extraServs.map(s => s.id),
        eventName: DEMO_EVENT_TYPES[i % DEMO_EVENT_TYPES.length],
        eventType: DEMO_EVENT_TYPES[i % DEMO_EVENT_TYPES.length],
        customerName: custData.name,
        email: custData.email,
        phone: custData.phone,
        guestCount: Math.floor(Math.random() * 200) + 50,
        eventDate: formatDate(eventDateObj),
        hallPrice: hall.basePrice,
        packagePrice: pkg.packagePrice,
        extraServicesPrice: extraServicesPrice,
        totalAmount: totalAmount,
        advanceAmount: advanceAmount,
        remainingBalance: isFullyPaid ? 0 : (isPaidAdvance ? totalAmount - advanceAmount : totalAmount),
        bookingStatus: status,
        paymentStatus: isFullyPaid ? 'Fully Paid' : (isPaidAdvance ? 'Advance Paid' : 'Unpaid'),
        createdAt: new Date(eventDateObj.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString() // Booked 30 days prior
      };

      batch.set(doc(db, COLLECTIONS.bookings, bookingId), booking);

      // Create Admin Notification for Booking
      const notifId = doc(collection(db, 'notifications')).id;
      batch.set(doc(db, 'notifications', notifId), {
        id: notifId,
        userId: 'admin',
        title: 'New Booking Demo',
        message: `${custData.name} booked ${hall.hallName}.`,
        type: 'booking',
        isRead: false,
        link: `/dashboard/booking/${bookingId}`,
        createdAt: new Date().toISOString()
      } as AppNotification);

      // Create Payments
      if (isPaidAdvance) {
        const payId = doc(collection(db, COLLECTIONS.payments)).id;
        const payment: Payment = {
          id: payId,
          bookingId: bookingId,
          customerId: custId,
          amount: advanceAmount,
          paymentType: 'Advance',
          paymentStatus: 'Paid',
          paymentMethod: 'Card',
          transactionId: `PAYHERE_${Math.floor(Math.random()*1000000)}`,
          paidAt: booking.createdAt,
          createdAt: booking.createdAt
        };
        batch.set(doc(db, COLLECTIONS.payments, payId), payment);
      }

      if (isFullyPaid) {
        const finalPayId = doc(collection(db, COLLECTIONS.payments)).id;
        const finalPayment: Payment = {
          id: finalPayId,
          bookingId: bookingId,
          customerId: custId,
          amount: totalAmount - advanceAmount,
          paymentType: 'Final',
          paymentStatus: 'Paid',
          paymentMethod: i % 2 === 0 ? 'Card' : 'Cash', // Mix of Card/Cash
          transactionId: i % 2 === 0 ? `PAYHERE_${Math.floor(Math.random()*1000000)}` : `CASH_RECPT_${Math.floor(Math.random()*100000)}`,
          paidAt: eventDateObj.toISOString(),
          createdAt: eventDateObj.toISOString()
        };
        batch.set(doc(db, COLLECTIONS.payments, finalPayId), finalPayment);
        
        // Review for Completed
        const reviewId = doc(collection(db, COLLECTIONS.reviews)).id;
        const review: Review = {
          id: reviewId,
          customerId: custId,
          bookingId: bookingId,
          hallId: hall.id,
          rating: [5, 4, 5, 4, 3][i % 5],
          comment: ['Amazing wedding experience!', 'Great food and staff.', 'Decoration was beautiful.', 'Good, but AC was a bit slow.', 'Excellent service!'][i % 5],
          createdAt: new Date(eventDateObj.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days after event
        };
        batch.set(doc(db, COLLECTIONS.reviews, reviewId), review);
      }

      if (status === 'CANCELLED') {
        const cancelId = doc(collection(db, COLLECTIONS.cancellationRequests)).id;
        const cancelReq: CancellationRequest = {
          id: cancelId,
          bookingId: bookingId,
          customerId: custId,
          reason: ['Customer changed event date', 'Personal emergency', 'Budget issue'][i % 3],
          status: 'APPROVED',
          createdAt: booking.createdAt
        };
        batch.set(doc(db, COLLECTIONS.cancellationRequests, cancelId), cancelReq);
      }
    }

    // 5. Seed Maintenance
    console.log("Seeding Maintenance Records...");
    const maintenanceReasons = ['AC Maintenance', 'Hall Decoration Upgrade', 'Electrical Maintenance', 'Cleaning Schedule', 'Sound System Repair'];
    for (let i = 0; i < 5; i++) {
      const mainId = doc(collection(db, COLLECTIONS.maintenances)).id;
      const mDate = randomDate(new Date(), futureDates);
      const eDate = new Date(mDate.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days
      const maintenance: MaintenanceRecord = {
        id: mainId,
        hallId: halls[i % halls.length].id,
        startDate: formatDate(mDate),
        endDate: formatDate(eDate),
        reason: maintenanceReasons[i],
        createdAt: new Date().toISOString()
      };
      batch.set(doc(db, COLLECTIONS.maintenances, mainId), maintenance);
    }

    console.log("Committing to Firestore...");
    await batch.commit();
    console.log("🎉 Full System Demo Data Successfully Seeded!");
    return true;

  } catch (error) {
    console.error("Error seeding full demo data:", error);
    throw error;
  }
};
