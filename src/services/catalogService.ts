import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS } from '../lib/firestorePaths';
import type { Package, Service } from '../types/app';

export const catalogService = {
  // Packages
  subscribeToPackages(callback: (packages: Package[]) => void) {
    if (!db) return () => {};
    const q = query(collection(db, COLLECTIONS.packages));
    return onSnapshot(
      q, 
      (snapshot) => {
        const packages = snapshot.docs.map(packageDoc => packageDoc.data() as Package);
        callback(packages);
      },
      (error) => {
        console.error('Error in packages subscription:', error);
      }
    );
  },

  async createPackage(packageData: Omit<Package, 'id' | 'createdAt'>): Promise<Package> {
    if (!db) throw new Error('Firestore not initialized');
    try {
      const docRef = doc(collection(db, COLLECTIONS.packages));
      const newPackage: Package = {
        ...packageData,
        id: docRef.id,
        createdAt: new Date().toISOString()
      };
      await setDoc(docRef, newPackage);
      return newPackage;
    } catch (error) {
      console.error('Error creating package:', error);
      throw new Error('Failed to create package. Please try again.', { cause: error });
    }
  },

  async updatePackage(id: string, updates: Partial<Package>): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    try {
      const docRef = doc(db, COLLECTIONS.packages, id);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error(`Error updating package ${id}:`, error);
      throw new Error('Failed to update package details.', { cause: error });
    }
  },

  async deletePackage(id: string): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    try {
      const docRef = doc(db, COLLECTIONS.packages, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting package ${id}:`, error);
      throw new Error('Failed to delete package.', { cause: error });
    }
  },

  // Services
  subscribeToServices(callback: (services: Service[]) => void) {
    if (!db) return () => {};
    const q = query(collection(db, COLLECTIONS.services));
    return onSnapshot(
      q, 
      (snapshot) => {
        const services = snapshot.docs.map(serviceDoc => serviceDoc.data() as Service);
        callback(services);
      },
      (error) => {
        console.error('Error in services subscription:', error);
      }
    );
  },

  async createService(serviceData: Omit<Service, 'id'>): Promise<Service> {
    if (!db) throw new Error('Firestore not initialized');
    try {
      const docRef = doc(collection(db, COLLECTIONS.services));
      const newService: Service = {
        ...serviceData,
        id: docRef.id
      };
      await setDoc(docRef, newService);
      return newService;
    } catch (error) {
      console.error('Error creating service:', error);
      throw new Error('Failed to create service.', { cause: error });
    }
  },

  async updateService(id: string, updates: Partial<Service>): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    try {
      const docRef = doc(db, COLLECTIONS.services, id);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error(`Error updating service ${id}:`, error);
      throw new Error('Failed to update service details.', { cause: error });
    }
  },

  async deleteService(id: string): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    try {
      const docRef = doc(db, COLLECTIONS.services, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting service ${id}:`, error);
      throw new Error('Failed to delete service.', { cause: error });
    }
  }
};
