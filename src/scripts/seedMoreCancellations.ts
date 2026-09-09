import { collection, doc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS, customerDocId } from '../lib/firestorePaths';
import type { Booking, CancellationRequest, Hall, Package } from '../types/app';
import { getDocs } from 'firebase/firestore';

export async function seedMoreCancellations() {
  console.log('Starting More Cancellations Seeding...');
  const batch = writeBatch(db);

  try {
    const hallsSnap = await getDocs(collection(db, COLLECTIONS.halls));
    const pkgsSnap = await getDocs(collection(db, COLLECTIONS.packages));

    const halls = hallsSnap.docs.map(d => d.data() as Hall);
    const packages = pkgsSnap.docs.map(d => d.data() as Package);

    if (halls.length === 0 || packages.length === 0) {
      throw new Error('Halls or packages not found. Cannot seed bookings.');
    }

    const DEMO_CUSTOMERS = [
      { name: 'Mohamed Rizwan', email: 'rizwan@example.com', phone: '0771234567' },
      { name: 'Fathima Ayesha', email: 'ayesha@example.com', phone: '0719876543' },
      { name: 'Kasun Perera', email: 'kasun@example.com', phone: '0775556667' },
      { name: 'Amaya Silva', email: 'amaya@example.com', phone: '0781112223' },
      { name: 'Nuwan Jayasuriya', email: 'nuwan@example.com', phone: '0729998887' },
    ];

    const reasons = [
      'Customer changed event date unexpectedly',
      'Personal emergency',
      'Budget issue',
      'Relocating to another city',
      'Event cancelled by the host family',
      'Found a cheaper alternative',
      'Unexpected family circumstances'
    ];

    const statuses: CancellationRequest['status'][] = ['PENDING', 'PENDING', 'PENDING', 'PENDING', 'PENDING', 'APPROVED', 'APPROVED', 'REJECTED'];

    // Generate 12 more cancellations
    for (let i = 0; i < 12; i++) {
      const custData = DEMO_CUSTOMERS[i % DEMO_CUSTOMERS.length];
      const custId = customerDocId(custData.email);
      const hall = halls[i % halls.length];
      const pkg = packages[i % packages.length];
      
      const bookingId = `CBH-CANC${Math.floor(Math.random() * 10000)}`;
      const reqStatus = statuses[i % statuses.length];
      const bookingStatus = reqStatus === 'PENDING' ? 'CANCELLATION_REQUESTED' : reqStatus === 'APPROVED' ? 'CANCELLED' : 'CONFIRMED';
      
      const eventDate = new Date();
      eventDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 60) + 10);
      
      const createdAtDate = new Date();
      createdAtDate.setDate(createdAtDate.getDate() - Math.floor(Math.random() * 15) - 1);

      const totalAmount = hall.basePrice + pkg.packagePrice;

      const booking: Booking = {
        id: bookingId,
        customerId: custId,
        hallId: hall.id,
        packageId: pkg.id,
        eventName: 'Wedding Reception',
        eventType: 'Wedding',
        customerName: custData.name,
        email: custData.email,
        phone: custData.phone,
        guestCount: 150,
        eventDate: eventDate.toISOString().split('T')[0],
        hallPrice: hall.basePrice,
        packagePrice: pkg.packagePrice,
        extraServicesPrice: 0,
        totalAmount: totalAmount,
        advanceAmount: totalAmount * 0.3,
        remainingBalance: totalAmount * 0.7,
        bookingStatus: bookingStatus,
        paymentStatus: 'Advance Paid',
        createdAt: createdAtDate.toISOString()
      };

      batch.set(doc(db, COLLECTIONS.bookings, bookingId), booking);

      const cancelId = doc(collection(db, COLLECTIONS.cancellationRequests)).id;
      const cancelReq: CancellationRequest = {
        id: cancelId,
        bookingId: bookingId,
        customerId: custId,
        reason: reasons[i % reasons.length],
        status: reqStatus,
        createdAt: createdAtDate.toISOString()
      };

      batch.set(doc(db, COLLECTIONS.cancellationRequests, cancelId), cancelReq);
    }

    console.log('Committing to Firestore...');
    await batch.commit();
    console.log('🎉 12 more cancellations added!');
  } catch (error) {
    console.error('Error seeding cancellations:', error);
  }
}
