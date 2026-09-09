import { useState, useEffect } from 'react';
import { hallService } from '../services/hallService';
import type { Hall } from '../types/app';

export function useHalls() {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = hallService.subscribeToHalls((updatedHalls) => {
      setHalls(updatedHalls);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addHall = async (hall: Omit<Hall, 'id' | 'createdAt'>) => {
    try {
      await hallService.addHall(hall);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message);
      throw e;
    }
  };

  const updateHall = async (id: string, updatedFields: Partial<Hall>) => {
    try {
      await hallService.updateHall(id, updatedFields);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message);
      throw e;
    }
  };

  const deleteHall = async (id: string) => {
    try {
      await hallService.deleteHall(id);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message);
      throw e;
    }
  };

  return { halls, loading, error, addHall, updateHall, deleteHall };
}
