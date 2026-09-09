import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured, ADMIN_EMAILS, DEMO_PASSWORD } from '../lib/firebase';
import { COLLECTIONS, customerDocId } from '../lib/firestorePaths';
import { notificationService } from '../services/notificationService';

export interface UserProfile {
  email: string;
  role: 'user' | 'admin';
  uid?: string;
  displayName?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  authSource: 'firebase' | 'local';
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    profile?: { firstName?: string; lastName?: string; phone?: string }
  ) => Promise<void>;
  logout: () => Promise<void>;
  /** Demo quick-login when Firebase is configured (uses VITE_DEMO_PASSWORD) */
  quickLogin: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function resolveRole(email: string, storedRole?: string): 'user' | 'admin' {
  if (storedRole === 'admin') return 'admin';
  if (ADMIN_EMAILS.includes(email.toLowerCase())) return 'admin';
  return 'user';
}

function profileFromLocal(email: string): UserProfile {
  return {
    email,
    role: resolveRole(email),
  };
}

function profileFromFirebaseUser(fbUser: User, role: 'user' | 'admin'): UserProfile {
  return {
    email: fbUser.email || '',
    role,
    uid: fbUser.uid,
    displayName: fbUser.displayName || '',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const useFirebase = isFirebaseConfigured && !!auth;

  const [user, setUser] = useState<UserProfile | null>(() => {
    if (useFirebase) return null;
    const saved = localStorage.getItem('camilla_session');
    return saved ? (JSON.parse(saved) as UserProfile) : null;
  });
  const [isLoading, setIsLoading] = useState(useFirebase);

  useEffect(() => {
    if (!useFirebase || !auth) return;

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser?.email) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      let role: 'user' | 'admin' = resolveRole(fbUser.email);

      if (db) {
        try {
          const userDoc = await getDoc(doc(db, COLLECTIONS.users, fbUser.uid));
          if (userDoc.exists()) {
            role = resolveRole(fbUser.email, userDoc.data().role as string);
          }
        } catch {
          // use email-based role
        }
      }

      setUser(profileFromFirebaseUser(fbUser, role));
      setIsLoading(false);
    });

    return unsub;
  }, [useFirebase]);

  const persistLocalSession = (profile: UserProfile | null) => {
    if (profile) {
      localStorage.setItem('camilla_session', JSON.stringify(profile));
    } else {
      localStorage.removeItem('camilla_session');
    }
  };

  const ensureUserDoc = async (fbUser: User, role: 'user' | 'admin', extra?: object) => {
    if (!db) return;
    await setDoc(
      doc(db, COLLECTIONS.users, fbUser.uid),
      {
        email: fbUser.email,
        role,
        ...extra,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  };

  const login = async (email: string, password: string) => {
    if (useFirebase && auth) {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const role = resolveRole(email);
      await ensureUserDoc(cred.user, role);
      return;
    }

    const profile = profileFromLocal(email);
    setUser(profile);
    persistLocalSession(profile);
  };

  const register = async (
    email: string,
    password: string,
    profile?: { firstName?: string; lastName?: string; phone?: string }
  ) => {
    const name = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || email.split('@')[0];

    if (useFirebase && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const role = resolveRole(email);
      await ensureUserDoc(cred.user, role, {
        name,
        phone: profile?.phone || '',
        createdAt: new Date().toISOString(),
      });

      if (db) {
        await setDoc(
          doc(db, COLLECTIONS.customers, customerDocId(email)),
          {
            email,
            name,
            phone: profile?.phone || '',
            joinedDate: new Date().toISOString().split('T')[0],
          },
          { merge: true }
        );
      }
      
      // Trigger System Notification for Admin
      notificationService.createNotification({
        userId: 'admin',
        title: 'New Customer Registered',
        message: '👤 A new customer account has been registered.',
        type: 'registration',
        isRead: false,
        link: '/admin/customers'
      }).catch(console.error);

      await signOut(auth);
      return;
    }

    // Do not auto-login for local mode either
    // const localProfile = profileFromLocal(email);
    // setUser(localProfile);
    // persistLocalSession(localProfile);
  };

  const quickLogin = async (email: string) => {
    if (useFirebase && auth) {
      await login(email, DEMO_PASSWORD);
      return;
    }
    const profile = profileFromLocal(email);
    setUser(profile);
    persistLocalSession(profile);
  };

  const logout = async () => {
    if (useFirebase && auth) {
      await signOut(auth);
      setUser(null);
      return;
    }
    setUser(null);
    persistLocalSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isLoading,
        authSource: useFirebase ? 'firebase' : 'local',
        login,
        register,
        logout,
        quickLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
