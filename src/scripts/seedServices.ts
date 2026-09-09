import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS } from '../lib/firestorePaths';

const DEMO_SERVICES = [
  {
    serviceName: 'Premium Sound System',
    category: 'Technology',
    price: 75000,
    description: 'Professional audio system including microphones, speakers, mixers, and technical support for weddings and large events.',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    serviceName: 'LED Video Wall',
    category: 'Technology',
    price: 180000,
    description: 'Large LED display wall for wedding presentations, videos, live announcements, and stage backgrounds.',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    serviceName: 'Live Event Streaming',
    category: 'Technology',
    price: 50000,
    description: 'Multi-camera live streaming service for guests who cannot attend physically.',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    serviceName: 'Professional Stage Lighting',
    category: 'Decoration',
    price: 120000,
    description: 'Advanced lighting setup including spotlights, decorative lights, and stage effects.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    serviceName: 'Luxury Floral Decoration',
    category: 'Decoration',
    price: 150000,
    description: 'Premium fresh flower arrangements for stage, entrance, tables, and reception areas.',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    serviceName: 'Bridal Table Decoration',
    category: 'Decoration',
    price: 50000,
    description: 'Elegant bridal table setup with premium decorations and lighting.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    serviceName: 'Welcome Drinks Station',
    category: 'Catering',
    price: 25000,
    description: 'Welcome drink counter with fresh juices, mocktails, and refreshments for guests.',
    image: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    serviceName: 'Premium Dessert Counter',
    category: 'Catering',
    price: 45000,
    description: 'Luxury dessert arrangement including cakes, sweets, chocolate items, and presentation setup.',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    serviceName: 'Coffee & Tea Station',
    category: 'Catering',
    price: 20000,
    description: 'Dedicated beverage station providing tea, coffee, and refreshments during the event.',
    image: 'https://images.unsplash.com/photo-1522413452208-996ff3f3e740?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    serviceName: 'Generator Backup Service',
    category: 'Facilities',
    price: 30000,
    description: 'Full power backup service to ensure uninterrupted event operation.',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    serviceName: 'VIP Guest Lounge Setup',
    category: 'Facilities',
    price: 45000,
    description: 'Comfortable VIP seating area with premium furniture and refreshments.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    serviceName: 'Kids Entertainment Area',
    category: 'Facilities',
    price: 40000,
    description: 'Supervised children area with games and entertainment facilities.',
    image: 'https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    serviceName: 'Photo Booth Setup',
    category: 'Entertainment',
    price: 50000,
    description: 'Interactive photo booth with unlimited prints and event-themed decorations.',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    serviceName: 'Live Acoustic Music',
    category: 'Entertainment',
    price: 150000,
    description: 'Professional acoustic band performance for dinner and reception entertainment.',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    serviceName: 'Traditional Kandyan Dance Performance',
    category: 'Entertainment',
    price: 60000,
    description: 'Traditional Sri Lankan cultural dance performance for welcoming guests.',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    serviceName: 'Extended Air Conditioning',
    category: 'Facilities',
    price: 20000,
    description: 'Additional air conditioning operation beyond the standard event duration.',
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    serviceName: 'Premium Buffet Upgrade',
    category: 'Catering',
    price: 100000,
    description: 'Upgrade the selected package with additional food varieties and premium menu options.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    serviceName: 'Wedding Entrance Decoration',
    category: 'Decoration',
    price: 75000,
    description: 'Luxury entrance decoration including flowers, lighting, and welcome area setup.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  }
];

export async function seedDemoServices() {
  if (!db) throw new Error('Firestore not initialized');

  try {
    const servicesSnapshot = await getDocs(collection(db, COLLECTIONS.services));
    const existingServices = servicesSnapshot.docs;

    let seededCount = 0;
    let updatedCount = 0;

    for (const service of DEMO_SERVICES) {
      const existingDoc = existingServices.find(doc => doc.data().serviceName === service.serviceName);
      
      if (!existingDoc) {
        // Create new
        const docRef = doc(collection(db, COLLECTIONS.services));
        await setDoc(docRef, {
          ...service,
          id: docRef.id,
          createdAt: new Date().toISOString()
        });
        seededCount++;
      } else if (existingDoc.data().image !== service.image) {
        // Update image if it's broken/changed
        const docRef = doc(db, COLLECTIONS.services, existingDoc.id);
        await setDoc(docRef, { ...existingDoc.data(), image: service.image });
        updatedCount++;
      }
    }

    return {
      success: true,
      message: (seededCount > 0 || updatedCount > 0)
        ? `Successfully added ${seededCount} and updated ${updatedCount} demo extra services.`
        : 'Demo extra services already exist in the database with latest images.'
    };
  } catch (error) {
    console.error('Error seeding demo services:', error);
    throw new Error('Failed to seed demo services');
  }
}
