import { useState, useEffect, useCallback } from 'react';
import { availabilityService } from '../services/availabilityService';
import type { DateAvailability } from '../services/availabilityService';

interface UseAvailabilityReturn {
  availability: DateAvailability[];
  selectedDate: string;
  selectDate: (date: string) => void;
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useAvailability(hallId: string, initialDate: string = ''): UseAvailabilityReturn {
  const [availability, setAvailability] = useState<DateAvailability[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAvailability = useCallback(async () => {
    if (!hallId) return;
    setLoading(true);
    try {
      const data = await availabilityService.getHallAvailability(hallId);
      setAvailability(data);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  }, [hallId]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const selectDate = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  return {
    availability,
    selectedDate,
    selectDate,
    loading,
    refresh: fetchAvailability
  };
}
