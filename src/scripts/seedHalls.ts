import { hallService } from '../services/hallService';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS } from '../lib/firestorePaths';

export const DEMO_HALLS = [
  {
    hallName: 'Camilla Grand Ballroom',
    location: 'Camilla Banquet Hotel, Kurunegala, Sri Lanka',
    capacity: 700,
    type: 'Premium Indoor AC Wedding Hall',
    description: 'Our flagship venue. A breathtaking, double-height grand ballroom featuring neoclassical architecture, a large stage, luxury lighting, and premium seating arrangements. Ideal for massive high-profile weddings and premium corporate events.',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80'
    ],
    basePrice: 500000,
    status: 'Available' as const,
    floor: 'Ground Floor',
    size: '15,000 Sq Ft',
    airConditioned: true,
    indoorOutdoor: 'Indoor' as const,
    suitableEvents: ['Weddings', 'Corporate Events', 'Awards'],
    parkingCapacity: 300,
    diningCapacity: 600,
    stageAvailable: true,
    bridalRoom: true,
    soundSystem: true,
    ledScreen: true,
    wifi: true,
    generatorBackup: true
  },
  {
    hallName: 'Camilla Sky Hall',
    location: 'Camilla Banquet Hotel, Kurunegala, Sri Lanka',
    capacity: 350,
    type: 'Upper Floor Event Hall',
    description: 'An elegant upper-floor venue offering panoramic views of the city. Featuring floor-to-ceiling glass windows, elegant modern decor, and a state-of-the-art acoustic sound system. Highly suitable for weddings and corporate events.',
    images: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80'
    ],
    basePrice: 350000,
    status: 'Available' as const,
    floor: 'Top Floor',
    size: '8,500 Sq Ft',
    airConditioned: true,
    indoorOutdoor: 'Indoor' as const,
    suitableEvents: ['Weddings', 'Receptions', 'Corporate Events'],
    parkingCapacity: 150,
    diningCapacity: 300,
    stageAvailable: true,
    bridalRoom: true,
    soundSystem: true,
    ledScreen: true,
    wifi: true,
    generatorBackup: true
  },
  {
    hallName: 'Camilla Royal Hall',
    location: 'Camilla Banquet Hotel, Kurunegala, Sri Lanka',
    capacity: 400,
    type: 'Elegant Event Venue',
    description: 'A spectacular venue combining modern luxury with traditional architectural elements. The Royal Hall features elegant decoration, premium seating arrangements, and magnificent opulent verandas.',
    images: [
      'https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583939003604-fa2f0f46757b?auto=format&fit=crop&w=800&q=80'
    ],
    basePrice: 400000,
    status: 'Available' as const,
    floor: 'Ground Floor',
    size: '10,000 Sq Ft',
    airConditioned: true,
    indoorOutdoor: 'Indoor' as const,
    suitableEvents: ['Weddings', 'Cultural Events', 'Banquets'],
    parkingCapacity: 200,
    diningCapacity: 350,
    stageAvailable: true,
    bridalRoom: true,
    soundSystem: true,
    ledScreen: false,
    wifi: true,
    generatorBackup: true
  },
  {
    hallName: 'Camilla Garden Hall',
    location: 'Camilla Banquet Hotel, Kurunegala, Sri Lanka',
    capacity: 300,
    type: 'Outdoor Event Venue',
    description: 'Immerse your guests in nature at the Garden Hall. A magical outdoor setting with manicured lawns, a scenic fountain backdrop, and romantic festoon lighting. Ideal for outdoor garden-style events.',
    images: [
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80'
    ],
    basePrice: 280000,
    status: 'Available' as const,
    floor: 'Ground Level (Outdoor)',
    size: '12,000 Sq Ft',
    airConditioned: false,
    indoorOutdoor: 'Outdoor' as const,
    suitableEvents: ['Evening Weddings', 'Garden Parties', 'Photoshoots'],
    parkingCapacity: 150,
    diningCapacity: 250,
    stageAvailable: true,
    bridalRoom: true,
    soundSystem: true,
    ledScreen: false,
    wifi: true,
    generatorBackup: true
  },
  {
    hallName: 'Camilla Crystal Hall',
    location: 'Camilla Banquet Hotel, Kurunegala, Sri Lanka',
    capacity: 250,
    type: 'Modern Reception Hall',
    description: 'An exquisitely detailed indoor banquet hall featuring crystal chandeliers and a modern interior design. The venue includes a built-in premium dance floor and advanced acoustic treatments for vibrant celebrations.',
    images: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1545622783-b410fc0c5ec4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80'
    ],
    basePrice: 220000,
    status: 'Available' as const,
    floor: '1st Floor',
    size: '6,000 Sq Ft',
    airConditioned: true,
    indoorOutdoor: 'Indoor' as const,
    suitableEvents: ['Weddings', 'Birthdays', 'Anniversaries'],
    parkingCapacity: 100,
    diningCapacity: 200,
    stageAvailable: true,
    bridalRoom: true,
    soundSystem: true,
    ledScreen: false,
    wifi: true,
    generatorBackup: true
  },
  {
    hallName: 'Camilla Pearl Hall',
    location: 'Camilla Banquet Hotel, Kurunegala, Sri Lanka',
    capacity: 200,
    type: 'Intimate Celebration Hall',
    description: 'An elegant, medium-sized celebration hall characterized by warm pearl and gold tones. Perfect for small private functions, milestone birthdays, and private engagement parties.',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
    ],
    basePrice: 180000,
    status: 'Available' as const,
    floor: '1st Floor',
    size: '4,500 Sq Ft',
    airConditioned: true,
    indoorOutdoor: 'Indoor' as const,
    suitableEvents: ['Engagements', 'Birthdays', 'Small Weddings'],
    parkingCapacity: 80,
    diningCapacity: 150,
    stageAvailable: true,
    bridalRoom: true,
    soundSystem: true,
    ledScreen: false,
    wifi: true,
    generatorBackup: true
  },
  {
    hallName: 'Camilla VIP Lounge Hall',
    location: 'Camilla Banquet Hotel, Kurunegala, Sri Lanka',
    capacity: 100,
    type: 'Exclusive VIP Venue',
    description: 'A luxurious and highly private venue designed for premium VIP events. It features plush leather seating, a private bar, exclusive entrance, and dedicated service staff for your most esteemed guests.',
    images: [
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
    ],
    basePrice: 200000,
    status: 'Available' as const,
    floor: 'Top Floor',
    size: '3,000 Sq Ft',
    airConditioned: true,
    indoorOutdoor: 'Indoor' as const,
    suitableEvents: ['VIP Gatherings', 'Private Dinners', 'Exclusive Parties'],
    parkingCapacity: 50,
    diningCapacity: 80,
    stageAvailable: false,
    bridalRoom: false,
    soundSystem: true,
    ledScreen: true,
    wifi: true,
    generatorBackup: true
  },
  {
    hallName: 'Camilla Conference Hall',
    location: 'Camilla Banquet Hotel, Kurunegala, Sri Lanka',
    capacity: 150,
    type: 'Business & Conference Hall',
    description: 'Designed specifically for professional gatherings. This hall features ergonomic seating options, multiple presentation screens, integrated teleconferencing equipment, and dedicated breakout areas for corporate meetings and seminars.',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80'
    ],
    basePrice: 120000,
    status: 'Available' as const,
    floor: 'Ground Floor',
    size: '3,500 Sq Ft',
    airConditioned: true,
    indoorOutdoor: 'Indoor' as const,
    suitableEvents: ['Conferences', 'Seminars', 'Corporate Meetings'],
    parkingCapacity: 100,
    diningCapacity: 120,
    stageAvailable: true,
    bridalRoom: false,
    soundSystem: true,
    ledScreen: true,
    wifi: true,
    generatorBackup: true
  }
];

export async function seedHalls() {
  try {
    const existingHalls = await hallService.getAllHalls();
    const deletePromises = existingHalls.map(hall => hallService.deleteHall(hall.id));
    await Promise.all(deletePromises);
    
    console.log('✅ Cleared existing halls.');

    let successCount = 0;
    
    for (const hall of DEMO_HALLS) {
      const hallId = hall.hallName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newHall = {
        ...hall,
        id: hallId,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, COLLECTIONS.halls, hallId), newHall);
      console.log(`✅ Seeded: ${hall.hallName}`);
      successCount++;
    }
    
    return { success: successCount, message: 'Seeding completed' };
  } catch (error) {
    console.error('Error seeding halls:', error);
    throw error;
  }
}
