import type { Booking, Hall, Package, SystemSettings, CustomerUser, Service, EventType } from '../types/app';

export const defaultHalls: Hall[] = [
  {
    id: 'camilla-grand-hall',
    hallName: 'Camilla Grand Hall',
    location: 'Kurunegala Main Building',
    capacity: 500,
    type: 'Grand Ballroom',
    description: 'Designed for spectacular, high-society weddings and large corporate annual galas, offering rich acoustics and luxury suites.',
    images: [
      '/grand_hall.png',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1507504038482-76210f6c3ef1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800'
    ],
    basePrice: 450000,
    status: 'Available',
    createdAt: new Date().toISOString()
  },
  {
    id: 'camilla-sky-hall',
    hallName: 'Camilla Sky Hall',
    location: 'Rooftop Pavilion',
    capacity: 300,
    type: 'Sky Pavilion',
    description: 'A breathtaking glass-walled rooftop pavilion offering gorgeous sunset vistas, customized for elegant receptions and high-profile seminars.',
    images: [
      '/sky_hall.png',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1478812954026-9c750f0e89fc?auto=format&fit=crop&q=80&w=800'
    ],
    basePrice: 280000,
    status: 'Available',
    createdAt: new Date().toISOString()
  }
];

export const defaultPackages: Package[] = [
  {
    id: 'silver',
    packageName: 'Silver Feast',
    packagePrice: 4500,
    includedServices: ['2 Appetizers', '5 Main courses', '2 Desserts', 'Welcome drinks & fresh juices', 'Standard table arrangements'],
    guestLimit: 100,
    extraGuestCharge: 4000,
    image: '/silver_pkg.png',
    notes: 'An outstanding selection of traditional and contemporary dishes prepared by local master chefs.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'gold',
    packageName: 'Gold Premium',
    packagePrice: 7500,
    includedServices: ['3 Appetizers', '7 Main courses', '4 Desserts', 'Live pasta/hopper stations', 'Assorted mocktails', 'Floral centerpieces'],
    guestLimit: 200,
    extraGuestCharge: 7000,
    image: '/gold_pkg.png',
    notes: 'An elevated gourmet experience featuring multi-cuisine choices and interactive live stations.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'platinum',
    packageName: 'Platinum Royal',
    packagePrice: 12000,
    includedServices: ['5 Starters (Canapés)', '10 Main courses', '6 Desserts', 'Unlimited gourmet juices', 'Chocolate fountain', 'Premium lighting & smoke machines', 'Luxury floral arches'],
    guestLimit: 300,
    extraGuestCharge: 11000,
    image: '/platinum_pkg.png',
    notes: 'The epitome of culinary and decor luxury: customized premium cuts, international delicacies, and fine pastries.',
    createdAt: new Date().toISOString()
  }
];

export const defaultBookings: Booking[] = [
  {
    id: 'CBH-A9F3K2',
    customerId: 'cust-1',
    customerName: 'Sajith Perera',
    email: 'sajith@example.com',
    phone: '+94 77 123 4567',
    hallId: 'camilla-grand-hall',
    packageId: 'gold',
    selectedServices: ['srv-photo-1', 'srv-dj-1'],
    eventName: 'Perera Wedding',
    eventType: 'wedding',
    eventDate: '2026-08-12',
    guestCount: 500,
    hallPrice: 450000,
    packagePrice: 3750000,
    extraServicesPrice: 230000,
    totalAmount: 4430000,
    advanceAmount: 1329000,
    remainingBalance: 3101000,
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'Fully Paid',
    createdAt: new Date().toISOString()
  }
];

export const defaultCustomers: CustomerUser[] = [
  {
    email: 'sajith@example.com',
    name: 'Sajith Perera',
    phone: '+94 77 123 4567',
    joinedDate: '2026-05-01'
  }
];

export const defaultSettings: SystemSettings = {
  taxRate: 15,
  contactEmail: 'admin@camillabanquet.com',
  contactPhone: '+94 37 222 4500',
  address: 'No. 45, Dambulla Road, Kurunegala, Sri Lanka'
};

export const defaultBlocked: string[] = ['2026-05-31', '2026-06-15'];

export const defaultServices: Service[] = [
  // Photography
  { id: 'srv-photo-1', serviceName: 'Professional Photography', category: 'Photography', price: 150000, description: 'Full day coverage with digital album' },
  { id: 'srv-video-1', serviceName: 'Cinematic Videography', category: 'Photography', price: 200000, description: 'Drone footage and cinematic highlight reel' },
  { id: 'srv-photo-2', serviceName: 'Photo Booth with Props', category: 'Photography', price: 45000, description: 'Interactive photo booth with custom instant prints' },
  
  // Entertainment
  { id: 'srv-dj-1', serviceName: 'Premium DJ Service', category: 'Entertainment', price: 80000, description: 'Experienced DJ with customized playlist' },
  { id: 'srv-sound-1', serviceName: 'Concert Sound System', category: 'Entertainment', price: 100000, description: 'High-fidelity audio setup for live bands' },
  { id: 'srv-band-1', serviceName: 'Live Acoustic Band', category: 'Entertainment', price: 150000, description: '3-piece acoustic band for dinner entertainment' },
  { id: 'srv-dance-1', serviceName: 'Traditional Dancers', category: 'Entertainment', price: 60000, description: 'Kandyan dancing troupe for welcoming ceremony' },
  
  // Decoration
  { id: 'srv-flower-1', serviceName: 'Luxury Flower Decoration', category: 'Decoration', price: 300000, description: 'Imported fresh flowers and custom archways' },
  { id: 'srv-light-1', serviceName: 'Intelligent Lighting', category: 'Decoration', price: 120000, description: 'Mood lighting, spotlights, and laser show' },
  { id: 'srv-car-1', serviceName: 'Bridal Car Decoration', category: 'Decoration', price: 25000, description: 'Premium floral decoration for the getaway vehicle' },
  { id: 'srv-center-1', serviceName: 'Crystal Centerpieces', category: 'Decoration', price: 40000, description: 'Elegant crystal candelabras for guest tables' },

  // Technology
  { id: 'srv-tech-1', serviceName: 'Projector & Sound System', category: 'Technology', price: 20000, description: 'High-definition projector and wireless microphones' },
  { id: 'srv-tech-2', serviceName: 'LED Video Wall', category: 'Technology', price: 180000, description: 'Large P3 LED screen for backdrops and videos' },
  { id: 'srv-tech-3', serviceName: 'Live Streaming Setup', category: 'Technology', price: 50000, description: 'Multi-camera live streaming to YouTube/Facebook' },

  // Catering
  { id: 'srv-cat-1', serviceName: 'Chocolate Fountain', category: 'Catering', price: 35000, description: '3-tier chocolate fountain with fresh fruits and marshmallows' },
  { id: 'srv-cat-2', serviceName: 'Champagne Tower', category: 'Catering', price: 45000, description: '5-tier crystal glass tower with premium sparkling wine' },
  { id: 'srv-cat-3', serviceName: 'Welcome Drinks Counter', category: 'Catering', price: 25000, description: 'Fresh king coconut and mocktail station' },

  // Utilities
  { id: 'srv-util-1', serviceName: 'Generator Backup', category: 'Utilities', price: 15000, description: 'Seamless power transition with heavy-duty generators' },
  { id: 'srv-util-2', serviceName: 'Extended AC Hours', category: 'Utilities', price: 20000, description: 'Additional air conditioning per hour after standard time' },

  // Facilities
  { id: 'srv-fac-1', serviceName: 'VIP Guest Lounge', category: 'Facilities', price: 50000, description: 'Exclusive private lounge area for VIP guests' },
  { id: 'srv-fac-2', serviceName: 'Kids Play Area', category: 'Facilities', price: 30000, description: 'Supervised play area with bouncy castle and games' },
];

export const defaultEventTypes: EventType[] = [
  { id: 'wedding', name: 'Wedding', isActive: true, createdAt: new Date().toISOString() },
  { id: 'birthday-party', name: 'Birthday Party', isActive: true, createdAt: new Date().toISOString() },
  { id: 'corporate-event', name: 'Corporate Event', isActive: true, createdAt: new Date().toISOString() },
  { id: 'conference', name: 'Conference', isActive: true, createdAt: new Date().toISOString() },
  { id: 'party', name: 'Party', isActive: true, createdAt: new Date().toISOString() },
  { id: 'engagement', name: 'Engagement', isActive: true, createdAt: new Date().toISOString() }
];
