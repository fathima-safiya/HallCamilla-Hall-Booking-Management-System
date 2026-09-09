import { useState, useEffect } from 'react';
import { catalogService } from '../services/catalogService';
import type { Package, Service } from '../types/app';

export function useCatalog() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    let packagesLoaded = false;
    let servicesLoaded = false;

    const checkLoading = () => {
      if (packagesLoaded && servicesLoaded) {
        setLoading(false);
      }
    };

    const unsubPackages = catalogService.subscribeToPackages((updatedPackages) => {
      setPackages(updatedPackages);
      packagesLoaded = true;
      checkLoading();
    });

    const unsubServices = catalogService.subscribeToServices((updatedServices) => {
      setServices(updatedServices);
      servicesLoaded = true;
      checkLoading();
    });

    return () => {
      unsubPackages();
      unsubServices();
    };
  }, []);

  return { packages, services, loading, error, catalogService };
}
