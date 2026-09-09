import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// This is just a script to seed data, so we initialize firebase using the env vars
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const reviews = [
  {
    customerId: 'guest_1',
    hallId: 'camilla-grand-hall',
    bookingId: 'B-1001',
    rating: 5,
    comment: 'Absolutely stunning venue! The Camilla Grand Hall exceeded all our expectations for our wedding. The service was impeccable.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    customerId: 'guest_2',
    hallId: 'camilla-grand-hall',
    bookingId: 'B-1002',
    rating: 4,
    comment: 'Beautiful place and very spacious. The lighting setup was fantastic. Food could have been slightly warmer, but overall a great experience.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    customerId: 'guest_3',
    hallId: 'emerald-banquet',
    bookingId: 'B-1003',
    rating: 5,
    comment: 'The Emerald Banquet was the perfect size for our corporate event. Very elegant and the staff was extremely helpful.',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    customerId: 'guest_4',
    hallId: 'emerald-banquet',
    bookingId: 'B-1004',
    rating: 5,
    comment: 'A truly luxurious experience. Everything from the entrance to the seating arrangements was top-notch.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    customerId: 'guest_5',
    hallId: 'sapphire-lounge',
    bookingId: 'B-1005',
    rating: 4,
    comment: 'Great intimate setting. We had a birthday party here and everyone loved the atmosphere. Highly recommended!',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    customerId: 'guest_6',
    hallId: 'sapphire-lounge',
    bookingId: 'B-1006',
    rating: 5,
    comment: 'Superb service and a wonderful view from the lounge. The premium packages are definitely worth it.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

async function seedReviews() {
  console.log('Seeding reviews...');
  for (const review of reviews) {
    const id = `REV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    await setDoc(doc(db, 'Reviews', id), {
      ...review,
      id,
    });
    console.log(`Added review ${id} for hall ${review.hallId}`);
  }
  console.log('Finished seeding reviews.');
  process.exit(0);
}

seedReviews().catch(console.error);
