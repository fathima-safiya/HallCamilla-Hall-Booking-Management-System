import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS } from '../lib/firestorePaths';
import { catalogService } from '../services/catalogService';

const DEMO_PACKAGES = [
  {
    packageName: 'Bronze Essential Package',
    category: 'Budget Package',
    suitableFor: 'Birthday parties, family gatherings, private celebrations',
    guestLimit: 50,
    packagePrice: 125000, // 50 * 2500
    extraGuestCharge: 2500,
    notes: 'An affordable package designed for small celebrations and family events with essential banquet facilities.',
    includedServices: [
      'Standard Buffet Menu',
      'Basic Seating Arrangement',
      'Welcome Drink',
      'Basic Sound System',
      'Table Setup'
    ],
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    packageName: 'Silver Celebration Package',
    category: 'Standard Package',
    suitableFor: 'Small weddings, engagements, family functions',
    guestLimit: 100,
    packagePrice: 350000, // 100 * 3500
    extraGuestCharge: 3500,
    notes: 'A standard banquet package providing comfortable dining and essential event arrangements.',
    includedServices: [
      'Buffet Service',
      'Table Decoration',
      'Welcome Drinks',
      'Basic Sound System',
      'Standard Lighting',
      'Guest Seating Arrangement'
    ],
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    packageName: 'Garden Elegance Package',
    category: 'Outdoor Package',
    suitableFor: 'Garden weddings, engagement ceremonies, outdoor celebrations',
    guestLimit: 150,
    packagePrice: 600000, // 150 * 4000
    extraGuestCharge: 4000,
    notes: 'A beautiful outdoor event package combining elegant decoration and a natural atmosphere.',
    includedServices: [
      'Outdoor Seating Setup',
      'Garden Decoration',
      'Welcome Drinks',
      'Buffet Service',
      'Ambient Lighting',
      'Sound System'
    ],
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    packageName: 'Gold Premium Package',
    category: 'Premium Package',
    suitableFor: 'Weddings, engagements, corporate events',
    guestLimit: 200,
    packagePrice: 900000, // 200 * 4500
    extraGuestCharge: 4500,
    notes: 'A premium package providing elegant dining, decoration, and entertainment facilities.',
    includedServices: [
      'Premium Buffet',
      'Stage Decoration',
      'Floral Decoration',
      'Sound System',
      'Lighting Setup',
      'Welcome Drinks',
      'Guest Seating',
      'Event Support'
    ],
    image: 'https://images.unsplash.com/photo-1522413452208-996ff3f3e740?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    packageName: 'Corporate Excellence Package',
    category: 'Corporate Package',
    suitableFor: 'Conferences, seminars, training sessions, company events',
    guestLimit: 250,
    packagePrice: 1250000, // 250 * 5000
    extraGuestCharge: 5000,
    notes: 'A professional event package designed for business meetings and corporate functions.',
    includedServices: [
      'Conference Seating',
      'Projector & Screen',
      'Sound System',
      'Refreshment Counter',
      'Lunch Buffet',
      'WiFi Facilities',
      'Event Support Staff'
    ],
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    packageName: 'Wedding Classic Package',
    category: 'Wedding Package',
    suitableFor: 'Traditional weddings, receptions, homecoming ceremonies',
    guestLimit: 250,
    packagePrice: 1500000, // 250 * 6000
    extraGuestCharge: 6000,
    notes: 'A complete wedding package providing elegant decoration, dining, and essential wedding arrangements.',
    includedServices: [
      'Wedding Stage Decoration',
      'Bridal Table Setup',
      'Premium Buffet',
      'Flower Decoration',
      'Sound System',
      'Lighting Setup',
      'Welcome Drinks'
    ],
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    packageName: 'Platinum Royal Package',
    category: 'Luxury Package',
    suitableFor: 'Luxury weddings and large celebrations',
    guestLimit: 300,
    packagePrice: 1650000, // 300 * 5500
    extraGuestCharge: 5500,
    notes: 'A luxury banquet experience with premium decoration, dining, and entertainment facilities.',
    includedServices: [
      'Luxury Buffet',
      'Premium Decoration',
      'LED Lighting',
      'VIP Seating',
      'Sound System',
      'Floral Arrangement',
      'Event Coordination',
      'Welcome Drinks'
    ],
    image: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    packageName: 'Diamond Luxury Package',
    category: 'VIP Package',
    suitableFor: 'High-end weddings and corporate events',
    guestLimit: 400,
    packagePrice: 2800000, // 400 * 7000
    extraGuestCharge: 7000,
    notes: 'A premium VIP package designed for customers who require a luxurious event experience.',
    includedServices: [
      'Premium Dining',
      'Luxury Stage Design',
      'VIP Lounge',
      'Advanced Sound System',
      'Premium Lighting',
      'Floral Decoration',
      'Event Manager',
      'Guest Services'
    ],
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    packageName: 'Royal Signature Package',
    category: 'Exclusive Package',
    suitableFor: 'Grand weddings and VIP events',
    guestLimit: 500,
    packagePrice: 4250000, // 500 * 8500
    extraGuestCharge: 8500,
    notes: 'The highest-level package offering a complete luxury event management experience.',
    includedServices: [
      'Exclusive Menu',
      'Luxury Theme Decoration',
      'VIP Guest Management',
      'Premium Entertainment',
      'LED Video Wall',
      'Professional Lighting',
      'Event Coordinator',
      'Premium Service Staff'
    ],
    image: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    packageName: 'Royal Wedding Premium Package',
    category: 'Premium Wedding Package',
    suitableFor: 'Grand weddings, luxury receptions',
    guestLimit: 600,
    packagePrice: 6000000, // 600 * 10000
    extraGuestCharge: 10000,
    notes: 'A complete luxury wedding solution designed for large-scale celebrations.',
    includedServices: [
      'Luxury Stage Design',
      'Premium Floral Decoration',
      'Premium Buffet',
      'Bridal Room Facilities',
      'VIP Lounge',
      'LED Screen',
      'Entertainment Setup',
      'Event Coordinator'
    ],
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  },
  {
    packageName: 'VIP Experience Package',
    category: 'Ultra Luxury Package',
    suitableFor: 'Celebrity events, VIP functions, premium celebrations',
    guestLimit: 800,
    packagePrice: 12000000, // 800 * 15000
    extraGuestCharge: 15000,
    notes: 'An exclusive event experience designed for customers expecting maximum luxury and personalized service.',
    includedServices: [
      'Customized Menu',
      'Luxury Theme Decoration',
      'Premium Entertainment',
      'VIP Reception Area',
      'Live Music Arrangement',
      'Dedicated Event Manager',
      'Premium Guest Services',
      'Complete Event Coordination'
    ],
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    status: 'Active' as const
  }
];

export async function seedDemoPackages() {
  try {
    const packagesSnapshot = await getDocs(collection(db, COLLECTIONS.packages));
    const existingPackages = packagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Check if demo packages already exist (check by deterministic ID of the first package)
    const firstPackageId = DEMO_PACKAGES[0].packageName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const alreadyExists = existingPackages.some(pkg => pkg.id === firstPackageId);
    
    if (alreadyExists) {
      return { success: 0, message: 'Demo packages already added' };
    }

    let successCount = 0;
    
    for (const pkg of DEMO_PACKAGES) {
      const packageId = pkg.packageName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newPackage = {
        ...pkg,
        id: packageId,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, COLLECTIONS.packages, packageId), newPackage);
      successCount++;
    }
    
    return { success: successCount, message: `11 demo packages added successfully` };
  } catch (error) {
    console.error('Error seeding packages:', error);
    throw error;
  }
}
