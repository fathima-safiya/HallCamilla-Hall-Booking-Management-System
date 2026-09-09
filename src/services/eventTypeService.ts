import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS } from '../lib/firestorePaths';
import type { EventType } from '../types/app';

export const eventTypeService = {
  getEventTypes: async (): Promise<EventType[]> => {
    if (!db) return [];
    try {
      const q = query(
        collection(db, COLLECTIONS.eventTypes),
        orderBy('createdAt', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as EventType);
    } catch (error) {
      console.error('Error fetching event types:', error);
      throw error;
    }
  },

  getActiveEventTypes: async (): Promise<EventType[]> => {
    if (!db) return [];
    try {
      const q = query(
        collection(db, COLLECTIONS.eventTypes),
        where('isActive', '==', true),
        orderBy('createdAt', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as EventType);
    } catch (error) {
      console.error('Error fetching active event types:', error);
      throw error;
    }
  },

  createEventType: async (name: string, isActive: boolean = true): Promise<EventType> => {
    if (!db) throw new Error('Firestore not initialized');
    try {
      // Check for duplicates
      const allTypes = await eventTypeService.getEventTypes();
      if (allTypes.some(t => t.name.toLowerCase() === name.toLowerCase())) {
        throw new Error('An event type with this name already exists.');
      }

      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newEventType: EventType = {
        id,
        name,
        isActive,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, COLLECTIONS.eventTypes, id), newEventType);
      return newEventType;
    } catch (error) {
      console.error('Error creating event type:', error);
      throw error;
    }
  },

  updateEventType: async (id: string, updates: Partial<EventType>): Promise<void> => {
    if (!db) throw new Error('Firestore not initialized');
    try {
      if (updates.name) {
         const allTypes = await eventTypeService.getEventTypes();
         if (allTypes.some(t => t.id !== id && t.name.toLowerCase() === updates.name!.toLowerCase())) {
           throw new Error('An event type with this name already exists.');
         }
      }
      const ref = doc(db, COLLECTIONS.eventTypes, id);
      await updateDoc(ref, updates);
    } catch (error) {
      console.error('Error updating event type:', error);
      throw error;
    }
  },

  deleteEventType: async (id: string): Promise<void> => {
    if (!db) throw new Error('Firestore not initialized');
    try {
      const ref = doc(db, COLLECTIONS.eventTypes, id);
      await deleteDoc(ref);
    } catch (error) {
      console.error('Error deleting event type:', error);
      throw error;
    }
  }
};
