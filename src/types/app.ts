export interface Hall {
  id: string;
  hallName: string;
  location: string;
  capacity: number;
  type: string;
  description: string;
  images: string[];
  basePrice: number;
  status: 'Available' | 'Maintenance' | 'Hidden';
  createdAt: string;
  // Specifications
  floor?: string;
  size?: string;
  airConditioned?: boolean;
  indoorOutdoor?: 'Indoor' | 'Outdoor' | 'Both';
  suitableEvents?: string[];
  decorations?: string[];
  parkingCapacity?: number;
  diningCapacity?: number;
  stageAvailable?: boolean;
  bridalRoom?: boolean;
  dressingRooms?: number;
  washrooms?: number;
  wheelchairAccessible?: boolean;
  soundSystem?: boolean;
  ledScreen?: boolean;
  wifi?: boolean;
  generatorBackup?: boolean;
  outdoorPhotographyArea?: boolean;
}

export interface EventType {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  contact: string;
  description: string;
  image: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface ExternalVendor {
  serviceType: string;
  vendorName: string;
  contactNumber: string;
  businessName?: string;
  notes?: string;
}

export interface ExternalServiceDetails {
  serviceName: string;
  vendorName: string;
  contactNumber: string;
  email?: string;
  arrivalTime?: string;
  vehicleNumber?: string;
  numberOfStaff?: number;
  equipment?: string;
  notes?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  hallId: string;
  packageId: string;
  selectedServices?: string[]; // Kept for backward compatibility
  hotelExtraServices?: string[];
  externalServices?: ExternalServiceDetails[]; // Legacy detailed vendor objects
  externalVendors?: ExternalVendor[]; // New structured external vendors
  legacyExternalServices?: string[]; // Kept in case of migrating old strings
  eventName: string; // Used for backward compatibility or general name
  eventType: string; // e.g., "Wedding", "Other"
  otherEventType?: string; // e.g., "Baby Shower" if eventType is "Other"
  customerName: string;
  email: string;
  phone: string;
  guestCount: number;
  eventDate: string;
  hallPrice: number;
  packagePrice: number;
  packagePricePerPerson?: number;
  extraServicesPrice: number;
  promoCode?: string;
  promoDiscount?: number;
  totalAmount: number;
  advanceAmount: number;
  remainingBalance: number;
  bookingStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'CANCELLATION_REQUESTED';
  paymentStatus: 'Unpaid' | 'Advance Paid' | 'Fully Paid';
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  customerId: string;
  amount: number;
  paymentType: 'Advance' | 'Final';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  paymentMethod: 'Card' | 'Bank Transfer' | 'Cash';
  transactionId: string;
  paidAt: string;
  createdAt: string;
}

export interface Package {
  id: string;
  packageName: string;
  packagePrice: number;
  includedServices: string[];
  guestLimit: number;
  extraGuestCharge: number;
  image: string;
  notes: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  category?: string;
  suitableFor?: string;
}



export interface SystemSettings {
  taxRate: number;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export interface CustomerUser {
  id?: string;
  email: string;
  name: string;
  phone: string;
  joinedDate: string;
}

export interface Service {
  id: string;
  serviceName: string;
  category: string; // 'Food' | 'Decoration' | 'Photography' | 'Entertainment' | 'Other' or custom
  price: number;
  description: string;
  image?: string;
  status?: 'Active' | 'Inactive';
  createdAt?: string;
}

export interface Review {
  id: string;
  customerId: string;
  bookingId: string;
  hallId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface CancellationRequest {
  id: string;
  bookingId: string;
  customerId: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string; // The specific customer ID, or 'admin' for global admin notifications
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'system' | 'review' | 'maintenance' | 'cancellation' | 'registration';
  isRead: boolean;
  link?: string; // Optional URL to navigate to when clicked
  relatedBookingId?: string;
  relatedHallId?: string;
  createdAt: string;
}

export interface MaintenanceRecord {
  id: string;
  hallId: string;
  startDate: string; // ISO date string YYYY-MM-DD
  endDate: string; // ISO date string YYYY-MM-DD
  reason: string;
  createdAt: string;
}
