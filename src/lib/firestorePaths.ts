export const COLLECTIONS = {
  halls: 'Halls',
  packages: 'Packages',
  bookings: 'Bookings',
  services: 'Services',
  customers: 'Customers',
  config: 'config',
  reviews: 'Reviews',
  cancellationRequests: 'CancellationRequests',
  payments: 'Payments',
  eventTypes: 'EventTypes',
  users: 'Users',
  maintenances: 'Maintenances',
  promos: 'Promos',
  faqs: 'Faqs',
  favorites: 'Favorites',
  vendors: 'Vendors',
} as const;

export const CONFIG_DOCS = {
  settings: 'settings',
  blockedDates: 'blockedDates',
  meta: 'meta',
} as const;

/** Safe Firestore document id from email */
export function customerDocId(email: string): string {
  return email.toLowerCase().replace(/[^a-z0-9]+/g, '_');
}
