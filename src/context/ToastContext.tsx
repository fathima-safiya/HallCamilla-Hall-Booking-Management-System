import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Automatically remove toast after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const typeStyles = {
            success: 'bg-emerald-50 border-emerald-250 text-emerald-900 shadow-md shadow-emerald-100/40 border-l-4 border-l-emerald-600',
            error: 'bg-red-50 border-red-250 text-red-900 shadow-md shadow-red-100/40 border-l-4 border-l-red-600',
            info: 'bg-stone-50 border-stone-250 text-stone-900 shadow-md shadow-stone-100/40 border-l-4 border-l-stone-600'
          };
          const icons = {
            success: <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />,
            error: <AlertCircle className="w-5 h-5 text-red-700 shrink-0" />,
            info: <Info className="w-5 h-5 text-stone-700 shrink-0" />
          };

          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 p-4 rounded-xl border pointer-events-auto transition-all duration-300 animate-slide-in-right ${typeStyles[toast.type]}`}
            >
              {icons[toast.type]}
              <div className="text-xs font-serif font-medium flex-1 pt-0.5">{toast.message}</div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-stone-400 hover:text-stone-700 transition-colors cursor-pointer shrink-0 mt-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
