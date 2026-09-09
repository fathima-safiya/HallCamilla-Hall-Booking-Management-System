import { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import type { Booking } from '../types/app';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = bookingService.subscribeToBookings((updatedBookings) => {
      setBookings(updatedBookings);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createBooking = async (booking: Omit<Booking, 'id' | 'createdAt' | 'bookingStatus' | 'paymentStatus'>) => {
    try {
      return await bookingService.createBooking(booking);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message);
      throw e;
    }
  };

  const updateStatus = async (id: string, status: Booking['bookingStatus']) => {
    try {
      await bookingService.updateBookingStatus(id, status);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message);
      throw e;
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      await bookingService.deleteBooking(id);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message);
      throw e;
    }
  };

  return { bookings, loading, error, createBooking, updateStatus, deleteBooking };
}
