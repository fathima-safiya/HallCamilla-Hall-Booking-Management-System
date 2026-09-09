import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { isFirebaseConfigured } from '../../lib/firebase';

export default function AppLoader({ children }: { children: React.ReactNode }) {
  const { isLoading: dataLoading } = useApp();
  const { isLoading: authLoading } = useAuth();

  if (!isFirebaseConfigured) return <>{children}</>;

  if (dataLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-luxury-gold-500 border-t-luxury-emerald-950 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-serif text-lg text-luxury-emerald-950">Camilla Banquet</p>
          <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-1">Connecting to cloud…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
