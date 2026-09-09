import { collection, doc, writeBatch, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS, customerDocId } from '../lib/firestorePaths';
import type { Review, Hall } from '../types/app';

export async function seedMoreReviews() {
  console.log('Starting More Reviews Seeding...');
  const batch = writeBatch(db);

  try {
    const hallsSnap = await getDocs(collection(db, COLLECTIONS.halls));
    const halls = hallsSnap.docs.map(d => d.data() as Hall);

    if (halls.length === 0) {
      throw new Error('Halls not found. Cannot seed reviews.');
    }

    const DEMO_CUSTOMERS = [
      { name: 'Kavindi Perera', email: 'kavindi@example.com' },
      { name: 'Dilshan Silva', email: 'dilshan@example.com' },
      { name: 'Nadeesha Fernando', email: 'nadeesha@example.com' },
      { name: 'Tharindu Rathnayake', email: 'tharindu@example.com' },
      { name: 'Imasha Jayawardhane', email: 'imasha@example.com' },
      { name: 'Roshan Bandara', email: 'roshan@example.com' },
      { name: 'Saduni Weerasinghe', email: 'saduni@example.com' },
      { name: 'Mohamed Fazil', email: 'fazil@example.com' },
      { name: 'Shalini Peiris', email: 'shalini@example.com' },
      { name: 'Gayan Senanayake', email: 'gayan@example.com' },
    ];

    const COMMENTS = [
      'The hall was absolutely beautiful and the staff was very accommodating. Highly recommend for weddings!',
      'Food was incredibly delicious, but the AC took a little while to cool the entire hall.',
      'Perfect venue for our company annual gathering. The lighting and sound systems were top notch.',
      'Excellent service from start to finish. The event coordinator was extremely helpful.',
      'A wonderful experience! The floral decorations exceeded our expectations.',
      'Spacious and clean. Parking was well organized, which was a huge relief for our guests.',
      'The banquet menu was fantastic. Everyone loved the traditional Sri Lankan dishes.',
      'Very professional management. Everything ran smoothly without any issues.',
      'Great value for money. The package included everything we needed for a perfect party.',
      'Beautiful location for photography. We got some amazing shots in the garden area.'
    ];

    const RATINGS = [5, 4, 5, 5, 5, 4, 5, 5, 4, 5];

    // Generate 10 more reviews
    for (let i = 0; i < 10; i++) {
      const custData = DEMO_CUSTOMERS[i];
      const custId = customerDocId(custData.email);
      const hall = halls[i % halls.length];
      
      const bookingId = `CBH-BK${Math.floor(Math.random() * 90000) + 10000}`;
      
      const createdAtDate = new Date();
      createdAtDate.setDate(createdAtDate.getDate() - Math.floor(Math.random() * 60) - 1);

      const reviewId = doc(collection(db, COLLECTIONS.reviews)).id;
      const review: Review = {
        id: reviewId,
        customerId: custId,
        bookingId: bookingId,
        hallId: hall.id,
        rating: RATINGS[i],
        comment: COMMENTS[i],
        createdAt: createdAtDate.toISOString()
      };

      batch.set(doc(db, COLLECTIONS.reviews, reviewId), review);
    }

    console.log('Committing to Firestore...');
    await batch.commit();
    console.log('🎉 10 more reviews added!');
  } catch (error) {
    console.error('Error seeding reviews:', error);
  }
}
