import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center animate-fade-in">
      <div className="bg-red-50 p-6 rounded-full text-red-500 mb-8">
        <AlertCircle size={64} />
      </div>
      <h1 className="font-serif text-5xl font-bold text-luxury-emerald-950 mb-4">404 - Page Not Found</h1>
      <p className="text-stone-600 mb-8 max-w-md">
        The page you are looking for does not exist, has been removed, or is temporarily unavailable.
      </p>
      <Link 
        to="/"
        className="px-8 py-3 bg-luxury-emerald-950 text-white font-bold tracking-wider text-xs rounded hover:bg-luxury-emerald-900 transition-all uppercase shadow-md"
      >
        Return to Home
      </Link>
    </div>
  );
}
