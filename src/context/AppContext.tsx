import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { doc, onSnapshot, setDoc, collection, Firestore } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { COLLECTIONS, CONFIG_DOCS, customerDocId } from '../lib/firestorePaths';
import { defaultSettings, defaultBlocked, defaultCustomers } from '../data/defaults';
import type { SystemSettings, CustomerUser } from '../types/app';

interface AppContextType {
  customers: CustomerUser[];
  settings: SystemSettings;
  blockedDates: string[];
  isLoading: boolean;
  dataSource: 'firebase' | 'local';
  blockDate: (date: string) => void;
  unblockDate: (date: string) => void;
  updateSettings: (partial: Partial<SystemSettings>) => void;
  addCustomer: (customer: CustomerUser) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const useFirebase = isFirebaseConfigured && !!db;

  const [customers, setCustomers] = useState<CustomerUser[]>(() => useFirebase ? [] : defaultCustomers);
  const [settings, setSettings] = useState<SystemSettings>(() => useFirebase ? defaultSettings : defaultSettings);
  const [blockedDates, setBlockedDates] = useState<string[]>(() => useFirebase ? [] : defaultBlocked);
  const [isLoading, setIsLoading] = useState(useFirebase);

  useEffect(() => {
    if (!useFirebase || !db) return;

    let cancelled = false;
    const unsubs: (() => void)[] = [];

    const init = async () => {
      try {
        // Automatic seed disabled
      } catch (err) {
        console.error('[Camilla] Firestore seed failed:', err);
      }

      if (cancelled) return;

      unsubs.push(
        onSnapshot(collection(db as Firestore, COLLECTIONS.customers), (snap) => {
          setCustomers(snap.docs.map((d) => d.data() as CustomerUser));
        }),
        onSnapshot(doc(db as Firestore, COLLECTIONS.config, CONFIG_DOCS.settings), (snap) => {
          if (snap.exists()) setSettings(snap.data() as SystemSettings);
        }),
        onSnapshot(doc(db as Firestore, COLLECTIONS.config, CONFIG_DOCS.blockedDates), (snap) => {
          if (snap.exists()) {
            const blockedDatesData = snap.data() as { dates?: string[] };
            setBlockedDates(blockedDatesData.dates ?? []);
          }
        })
      );

      setIsLoading(false);
    };

    init();

    return () => {
      cancelled = true;
      unsubs.forEach((u) => u());
    };
  }, [useFirebase]);

  const persistBlocked = useCallback(async (dates: string[]) => {
    if (useFirebase && db) {
      await setDoc(doc(db, COLLECTIONS.config, CONFIG_DOCS.blockedDates), { dates });
    }
  }, [useFirebase]);

  const blockDate = (date: string) => {
    setBlockedDates((prev) => {
      if (prev.includes(date)) return prev;
      const next = [...prev, date].sort();
      persistBlocked(next);
      return next;
    });
  };

  const unblockDate = (date: string) => {
    setBlockedDates((prev) => {
      const next = prev.filter((d) => d !== date);
      persistBlocked(next);
      return next;
    });
  };

  const updateSettings = (partial: Partial<SystemSettings>) => {
    const next = { ...settings, ...partial };
    if (useFirebase && db) {
      setDoc(doc(db, COLLECTIONS.config, CONFIG_DOCS.settings), next).catch(console.error);
    } else {
      setSettings(next);
    }
  };

  const addCustomer = (customer: CustomerUser) => {
    if (customers.some((c) => c.email?.toLowerCase() === customer.email?.toLowerCase())) return;

    if (useFirebase && db) {
      setDoc(doc(db, COLLECTIONS.customers, customerDocId(customer.email)), customer).catch(console.error);
    } else {
      setCustomers((prev) => [customer, ...prev]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        customers,
        settings,
        blockedDates,
        isLoading,
        dataSource: useFirebase ? 'firebase' : 'local',
        blockDate,
        unblockDate,
        updateSettings,
        addCustomer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
