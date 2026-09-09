import { collection, doc, getDocs, setDoc, deleteDoc, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS } from '../lib/firestorePaths';
import type { MaintenanceRecord } from '../types/app';

export const maintenanceService = {
  generateId(): string {
    return `MAINT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  },

  async getAllMaintenanceRecords(): Promise<MaintenanceRecord[]> {
    if (!db) return [];
    try {
      const snapshot = await getDocs(collection(db, COLLECTIONS.maintenances));
      return snapshot.docs.map(doc => doc.data() as MaintenanceRecord);
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
      throw new Error('Failed to retrieve maintenance records.', { cause: error });
    }
  },

  async getMaintenanceByHall(hallId: string): Promise<MaintenanceRecord[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, COLLECTIONS.maintenances), where("hallId", "==", hallId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as MaintenanceRecord);
    } catch (error) {
      console.error(`Error fetching maintenance for hall ${hallId}:`, error);
      throw new Error('Failed to retrieve hall maintenance.', { cause: error });
    }
  },

  async createMaintenanceRecord(record: Omit<MaintenanceRecord, 'id' | 'createdAt'>): Promise<MaintenanceRecord> {
    if (!db) throw new Error('Firestore not initialized');
    
    try {
      const id = this.generateId();
      const newRecord: MaintenanceRecord = {
        ...record,
        id,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, COLLECTIONS.maintenances, id), newRecord);
      
      // Update hall status to 'Maintenance'
      const hallRef = doc(db, COLLECTIONS.halls, record.hallId);
      await updateDoc(hallRef, { status: 'Maintenance' });

      return newRecord;
    } catch (error) {
      console.error('Error creating maintenance record:', error);
      throw new Error('Failed to create the maintenance record.', { cause: error });
    }
  },

  async deleteMaintenanceRecord(id: string, hallId: string): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    try {
      await deleteDoc(doc(db, COLLECTIONS.maintenances, id));
      
      // We should potentially check if there are other active maintenance records for this hall
      // For simplicity, we just set it back to Available when one is deleted.
      const hallRef = doc(db, COLLECTIONS.halls, hallId);
      await updateDoc(hallRef, { status: 'Available' });
    } catch (error) {
      console.error(`Error deleting maintenance record ${id}:`, error);
      throw new Error('Failed to delete maintenance record.', { cause: error });
    }
  }
};
