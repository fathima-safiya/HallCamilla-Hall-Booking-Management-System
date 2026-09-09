import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { COLLECTIONS } from '../lib/firestorePaths';
import type { EventType } from '../types/app';
import { eventTypeService } from '../services/eventTypeService';

export function useEventTypes() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, COLLECTIONS.eventTypes), orderBy('createdAt', 'asc'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const types = snapshot.docs.map(doc => doc.data() as EventType);
        setEventTypes(types);
        setLoading(false);
      },
      (err) => {
        console.error('Error listening to event types:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const createEventType = async (name: string, isActive: boolean = true) => {
    setError(null);
    try {
      await eventTypeService.createEventType(name, isActive);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message);
      throw e;
    }
  };

  const updateEventType = async (id: string, updates: Partial<EventType>) => {
    setError(null);
    try {
      await eventTypeService.updateEventType(id, updates);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message);
      throw e;
    }
  };

  const deleteEventType = async (id: string) => {
    setError(null);
    try {
      await eventTypeService.deleteEventType(id);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message);
      throw e;
    }
  };

  return {
    eventTypes,
    activeEventTypes: eventTypes.filter(t => t.isActive),
    loading,
    error,
    createEventType,
    updateEventType,
    deleteEventType
  };
}
