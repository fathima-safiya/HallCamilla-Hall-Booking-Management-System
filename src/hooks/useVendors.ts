import { useState, useEffect } from 'react';
import { vendorService } from '../services/vendorService';
import type { Vendor } from '../types/app';

export function useVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = vendorService.subscribeToVendors((updatedVendors) => {
      setVendors(updatedVendors);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addVendor = async (vendor: Omit<Vendor, 'id' | 'createdAt'>) => {
    try {
      await vendorService.addVendor(vendor);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message);
      throw e;
    }
  };

  const updateVendor = async (id: string, updatedFields: Partial<Vendor>) => {
    try {
      await vendorService.updateVendor(id, updatedFields);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message);
      throw e;
    }
  };

  const deleteVendor = async (id: string) => {
    try {
      await vendorService.deleteVendor(id);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message);
      throw e;
    }
  };

  return { vendors, loading, error, addVendor, updateVendor, deleteVendor };
}
