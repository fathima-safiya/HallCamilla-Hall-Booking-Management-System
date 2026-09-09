import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  requiredRole?: 'user' | 'admin';
}

export default function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center pt-32">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-luxury-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Loading…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole === 'admin' && user?.role !== 'admin') {
    // If user is trying to access admin pages but has user role, bounce back to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredRole === 'user' && user?.role === 'admin') {
    // If admin is trying to access user pages, bounce back to admin dashboard
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}

