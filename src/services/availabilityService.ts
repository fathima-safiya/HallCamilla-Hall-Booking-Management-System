import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS } from '../lib/firestorePaths';
import type { Booking, MaintenanceRecord } from '../types/app';
import { parseISO, eachDayOfInterval, format } from 'date-fns';

export interface DateAvailability {
  date: string;
  status: 'PENDING' | 'BOOKED' | 'MAINTENANCE';
}

export const availabilityService = {
  /**
   * Fetches all booked, pending, and maintenance dates for a specific hall
   */
  async getHallAvailability(hallId: string): Promise<DateAvailability[]> {
    if (!db) return [];
    try {
      const q = query(
        collection(db, COLLECTIONS.bookings),
        where('hallId', '==', hallId),
        where('bookingStatus', 'in', ['PENDING', 'APPROVED', 'CONFIRMED'])
      );
      const snapshot = await getDocs(q);
      const bookings = snapshot.docs.map(doc => doc.data() as Booking);
      
      const availability: DateAvailability[] = bookings.map(b => ({
        date: b.eventDate,
        status: b.bookingStatus === 'PENDING' ? 'PENDING' : 'BOOKED'
      }));

      // Fetch maintenance records
      const maintQ = query(collection(db, COLLECTIONS.maintenances), where('hallId', '==', hallId));
      const maintSnapshot = await getDocs(maintQ);
      const maintenances = maintSnapshot.docs.map(doc => doc.data() as MaintenanceRecord);

      maintenances.forEach(m => {
        try {
          // Use parseISO to ensure dates are treated as local midnight, matching the calendar display
          const start = parseISO(m.startDate);
          const end = parseISO(m.endDate);
          
          const days = eachDayOfInterval({ start, end });
          days.forEach(d => {
            availability.push({
              date: format(d, 'yyyy-MM-dd'),
              status: 'MAINTENANCE'
            });
          });
        } catch (e) {
          console.error('Invalid maintenance date range:', m);
        }
      });

      return availability;
    } catch (error) {
      console.error('Error fetching hall availability:', error);
      throw new Error('Failed to fetch hall availability.', { cause: error });
    }
  },

  /**
   * Checks if a specific date is available for a hall
   * Returns true if available, false if booked, pending, or under maintenance
   */
  async checkDateAvailability(hallId: string, date: string): Promise<boolean> {
    if (!db) return true; // Assume available in local mode for simplicity, though local mode isn't fully mocked here
    try {
      const q = query(
        collection(db, COLLECTIONS.bookings),
        where('hallId', '==', hallId),
        where('eventDate', '==', date),
        where('bookingStatus', 'in', ['PENDING', 'APPROVED', 'CONFIRMED'])
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) return false;

      // Check maintenance records
      const maintQ = query(collection(db, COLLECTIONS.maintenances), where('hallId', '==', hallId));
      const maintSnapshot = await getDocs(maintQ);
      const maintenances = maintSnapshot.docs.map(doc => doc.data() as MaintenanceRecord);

      const targetDate = new Date(date).getTime();
      for (const m of maintenances) {
        const start = new Date(m.startDate).getTime();
        const end = new Date(m.endDate).getTime();
        if (targetDate >= start && targetDate <= end) {
          return false; // Under maintenance
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking date availability:', error);
      throw new Error('Failed to check date availability.', { cause: error });
    }
  }
};
