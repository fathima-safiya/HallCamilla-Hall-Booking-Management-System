import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  User, 
  Share2, 
  Globe, 
  Mail, 
  LogIn, 
  LayoutDashboard, 
  CalendarRange, 
  Building2, 
  LogOut, 
  Sliders,
  Package,
  AlertCircle,
  Star,
  Crown,
  FileText, 
  CreditCard, 
  Clock, 
  Users, 
  Tags, 
  Wrench, 
  Settings,
  Bell,
  Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import NotificationBell from './components/NotificationBell';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { showToast } = useToast();

  const isAdminView = location.pathname.startsWith('/admin');

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // ----------------------------------------------------
  // ADMIN PANEL SIDEBAR LAYOUT
  // ----------------------------------------------------
  if (isAdminView && user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-stone-100 font-sans flex flex-col md:flex-row selection:bg-amber-800 selection:text-amber-100">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-luxury-emerald-950 text-white shrink-0 shadow-xl border-r border-luxury-emerald-900 flex flex-col justify-between">
          <div>
            {/* Admin Brand */}
            <div className="p-6 border-b border-white/5 bg-luxury-emerald-950/80">
              <Link to="/admin/dashboard" className="flex flex-col">
                <span className="font-serif text-lg font-bold tracking-tight text-white">
                  Camilla Banquet
                </span>
                <span className="text-[9px] uppercase tracking-widest text-luxury-gold-400 font-bold mt-0.5">
                  Administrative Suite
                </span>
              </Link>
            </div>

            {/* Sidebar Links */}
            <nav className="p-4 space-y-1">
              <Link
                to="/admin/dashboard"
                className={`flex items-center space-x-3 px-4 py-3 rounded transition-all duration-200 text-xs font-semibold uppercase tracking-wider ${
                  isActive('/admin/dashboard')
                    ? 'bg-luxury-gold-500 text-luxury-emerald-950 font-bold shadow-md'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/admin/bookings"
                className={`flex items-center space-x-3 px-4 py-3 rounded transition-all duration-200 text-xs font-semibold uppercase tracking-wider ${
                  isActive('/admin/bookings')
                    ? 'bg-luxury-gold-500 text-luxury-emerald-950 font-bold shadow-md'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <CalendarRange size={16} />
                <span>Bookings Grid</span>
              </Link>

              <Link
                to="/admin/halls"
                className={`flex items-center space-x-3 px-4 py-3 rounded transition-all duration-200 text-xs font-semibold uppercase tracking-wider ${
                  isActive('/admin/halls')
                    ? 'bg-luxury-gold-500 text-luxury-emerald-950 font-bold shadow-md'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Building2 size={16} />
                <span>Halls</span>
              </Link>
              
              <Link
                to="/admin/packages"
                className={`flex items-center space-x-3 px-4 py-3 rounded transition-all duration-200 text-xs font-semibold uppercase tracking-wider ${
                  isActive('/admin/packages')
                    ? 'bg-luxury-gold-500 text-luxury-emerald-950 font-bold shadow-md'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Package size={16} />
                <span>Packages</span>
              </Link>


              <Link
                to="/admin/cancellations"
                className={`flex items-center space-x-3 px-4 py-3 rounded transition-all duration-200 text-xs font-semibold uppercase tracking-wider ${
                  isActive('/admin/cancellations')
                    ? 'bg-luxury-gold-500 text-luxury-emerald-950 font-bold shadow-md'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <AlertCircle size={16} />
                <span>Cancellations</span>
              </Link>

              <Link
                to="/admin/reviews"
                className={`flex items-center space-x-3 px-4 py-3 rounded transition-all duration-200 text-xs font-semibold uppercase tracking-wider ${
                  isActive('/admin/reviews')
                    ? 'bg-luxury-gold-500 text-luxury-emerald-950 font-bold shadow-md'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Star size={16} />
                <span>Reviews</span>
              </Link>

              <Link
                to="/admin/payments"
                className={`flex items-center space-x-3 px-4 py-3 rounded transition-all duration-200 text-xs font-semibold uppercase tracking-wider ${
                  isActive('/admin/payments')
                    ? 'bg-luxury-gold-500 text-luxury-emerald-950 font-bold shadow-md'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <CreditCard size={16} />
                <span>Payments</span>
              </Link>

              <Link
                to="/admin/reports"
                className={`flex items-center space-x-3 px-4 py-3 rounded transition-all duration-200 text-xs font-semibold uppercase tracking-wider ${
                  isActive('/admin/reports')
                    ? 'bg-luxury-gold-500 text-luxury-emerald-950 font-bold shadow-md'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <FileText size={16} />
                <span>Reports</span>
              </Link>

              <Link
                to="/admin/customers"
                className={`flex items-center space-x-3 px-4 py-3 rounded transition-all duration-200 text-xs font-semibold uppercase tracking-wider ${
                  isActive('/admin/customers')
                    ? 'bg-luxury-gold-500 text-luxury-emerald-950 font-bold shadow-md'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Users size={16} />
                <span>Customers</span>
              </Link>

              <Link
                to="/admin/event-types"
                className={`flex items-center space-x-3 px-4 py-3 rounded transition-all duration-200 text-xs font-semibold uppercase tracking-wider ${
                  isActive('/admin/event-types')
                    ? 'bg-luxury-gold-500 text-luxury-emerald-950 font-bold shadow-md'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Tags size={16} />
                <span>Event Types</span>
              </Link>

              <Link
                to="/admin/maintenance"
                className={`flex items-center space-x-3 px-4 py-3 rounded transition-all duration-200 text-xs font-semibold uppercase tracking-wider ${
                  isActive('/admin/maintenance')
                    ? 'bg-luxury-gold-500 text-luxury-emerald-950 font-bold shadow-md'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Wrench size={16} />
                <span>Maintenance</span>
              </Link>

              <Link
                to="/admin/availability"
                className={`flex items-center space-x-3 px-4 py-3 rounded transition-all duration-200 text-xs font-semibold uppercase tracking-wider ${
                  isActive('/admin/availability')
                    ? 'bg-luxury-gold-500 text-luxury-emerald-950 font-bold shadow-md'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Clock size={16} />
                <span>Availability</span>
              </Link>

              <Link
                to="/admin/notifications"
                className={`flex items-center space-x-3 px-4 py-3 rounded transition-all duration-200 text-xs font-semibold uppercase tracking-wider ${
                  isActive('/admin/notifications')
                    ? 'bg-luxury-gold-500 text-luxury-emerald-950 font-bold shadow-md'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Bell size={16} />
                <span>Notifications</span>
              </Link>

              <Link
                to="/admin/settings"
                className={`flex items-center space-x-3 px-4 py-3 rounded transition-all duration-200 text-xs font-semibold uppercase tracking-wider ${
                  isActive('/admin/settings')
                    ? 'bg-luxury-gold-500 text-luxury-emerald-950 font-bold shadow-md'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Settings size={16} />
                <span>Settings</span>
              </Link>

            </nav>
          </div>

          {/* Sidebar Footer Controls */}
          <div className="p-4 border-t border-white/5 space-y-2 bg-luxury-emerald-950/40">

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center space-x-2 w-full py-2.5 rounded bg-white/5 hover:bg-red-950/40 text-stone-300 hover:text-red-300 hover:border-red-500/20 border border-transparent text-xs font-bold transition-all"
            >
              <LogOut size={14} />
              <span>LOGOUT</span>
            </button>
          </div>
        </aside>

        {/* Content Wrapper */}
        <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden">
          
          {/* Top Administrative Bar */}
          <header className="h-16 bg-white border-b border-stone-200 shadow-sm px-8 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2 text-stone-500 text-xs">
              <span className="font-bold text-luxury-emerald-900">ADMIN PANEL</span>
              <span>/</span>
              <span className="capitalize">{location.pathname.split('/').pop()?.replace('-', ' ')}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-xs text-stone-500 font-medium">
                Logged in: <strong className="text-stone-800">{user.email}</strong>
              </span>
              <NotificationBell />
              <div className="w-8 h-8 rounded-full bg-luxury-gold-500 text-luxury-emerald-950 font-bold text-sm flex items-center justify-center shadow-inner">
                A
              </div>
            </div>
          </header>

          {/* Main workspace */}
          <main className="flex-grow p-8 flex flex-col relative w-full overflow-y-auto">
            <Outlet />
          </main>
        </div>

      </div>
    );
  }

  // ----------------------------------------------------
  // STANDARD CUSTOMER / PUBLIC LAYOUT
  // ----------------------------------------------------
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password';

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-stone-50 font-sans flex flex-col selection:bg-emerald-800 selection:text-amber-100">
        <main className="flex-grow flex flex-col relative w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans flex flex-col selection:bg-emerald-800 selection:text-amber-100">
      
      {/* Header & Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full bg-luxury-emerald-900 flex items-center justify-center text-luxury-gold-400 group-hover:bg-luxury-gold-500 group-hover:text-luxury-emerald-950 transition-colors shadow-sm border border-luxury-gold-500/20">
              <Crown size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-luxury-emerald-950 group-hover:text-luxury-emerald-800 transition-colors">
                Camilla Banquet
              </span>
              <span className="text-[10px] uppercase tracking-widest text-luxury-gold-600 font-semibold mt-0">
                Kurunegala, Sri Lanka
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/"
              className={`text-sm font-semibold tracking-wider transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-luxury-emerald-900 border-b-2 border-luxury-gold-500 pb-1' 
                  : 'text-stone-600 hover:text-luxury-emerald-800'
              }`}
            >
              HOME
            </Link>
            <Link 
              to="/halls"
              className={`text-sm font-semibold tracking-wider transition-colors duration-200 ${
                isActive('/halls') 
                  ? 'text-luxury-emerald-900 border-b-2 border-luxury-gold-500 pb-1' 
                  : 'text-stone-600 hover:text-luxury-emerald-800'
              }`}
            >
              HALLS
            </Link>
            <Link 
              to="/budget-calculator"
              className={`text-sm font-semibold tracking-wider transition-colors duration-200 ${
                isActive('/budget-calculator') 
                  ? 'text-luxury-emerald-900 border-b-2 border-luxury-gold-500 pb-1' 
                  : 'text-stone-600 hover:text-luxury-emerald-800'
              }`}
            >
              PLANNER
            </Link>
            <Link 
              to="/about"
              className={`text-sm font-semibold tracking-wider transition-colors duration-200 ${
                isActive('/about') 
                  ? 'text-luxury-emerald-900 border-b-2 border-luxury-gold-500 pb-1' 
                  : 'text-stone-600 hover:text-luxury-emerald-800'
              }`}
            >
              ABOUT
            </Link>
            <Link 
              to="/contact"
              className={`text-sm font-semibold tracking-wider transition-colors duration-200 ${
                isActive('/contact') 
                  ? 'text-luxury-emerald-900 border-b-2 border-luxury-gold-500 pb-1' 
                  : 'text-stone-600 hover:text-luxury-emerald-800'
              }`}
            >
              CONTACT
            </Link>
            {isAuthenticated && (
              <Link 
                to="/dashboard"
                className={`text-sm font-semibold tracking-wider transition-colors duration-200 ${
                  isActive('/dashboard') 
                    ? 'text-luxury-emerald-900 border-b-2 border-luxury-gold-500 pb-1' 
                    : 'text-stone-600 hover:text-luxury-emerald-800'
                }`}
              >
                MY BOOKINGS
              </Link>
            )}
            {isAuthenticated && (
              <Link
                to="/wishlist"
                className={`flex items-center gap-1.5 text-sm font-semibold tracking-wider transition-colors duration-200 ${
                  isActive('/wishlist')
                    ? 'text-red-500 border-b-2 border-red-400 pb-1'
                    : 'text-stone-600 hover:text-red-500'
                }`}
              >
                <Heart size={14} className={isActive('/wishlist') ? 'fill-red-500' : ''} />
                WISHLIST
              </Link>
            )}



            {/* Elegant link to Admin Panel for Admin Users */}
            {user?.role === 'admin' && (
              <Link 
                to="/admin/dashboard"
                className="text-xs font-bold text-luxury-gold-600 bg-luxury-emerald-950 px-3 py-1.5 rounded hover:bg-luxury-emerald-900 transition-colors shadow-sm flex items-center gap-1.5 tracking-wider border border-luxury-gold-500/30"
              >
                <Sliders size={12} className="text-luxury-gold-400" />
                <span>ADMIN PANEL</span>
              </Link>
            )}
          </nav>

          {/* Icons on Right */}
          <div className="flex items-center space-x-6">
            
            {isAuthenticated ? (
              <>
                <NotificationBell />
                {/* Profile */}
                <div className="flex items-center space-x-2">
                  <Link 
                    to="/profile"
                    className="p-2 text-stone-700 hover:text-luxury-emerald-900 transition-colors rounded-full hover:bg-stone-100"
                    aria-label="User Account"
                  >
                    <User size={21} />
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-xs font-bold text-stone-500 hover:text-luxury-emerald-900 uppercase tracking-wider transition-colors ml-2"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link 
                to="/login"
                className="flex items-center space-x-2 text-sm font-bold text-luxury-emerald-900 hover:text-luxury-gold-600 transition-colors tracking-wider"
              >
                <LogIn size={18} />
                <span>SIGN IN</span>
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col relative w-full overflow-x-hidden">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-luxury-dark text-stone-300 border-t border-stone-800 relative z-10 w-full shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-12 gap-10">
          
          {/* Logo & Intro */}
          <div className="md:col-span-5 text-left">
            <span className="font-serif text-2xl font-bold tracking-tight text-white mb-2 block">
              Camilla Banquet Hotel
            </span>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm mb-6">
              Elevating celebrations in Kurunegala with a legacy of luxury and unmatched hospitality.
            </p>
            <div className="flex space-x-4 text-luxury-gold-400">
              <button className="hover:text-white transition-colors" aria-label="Website"><Globe size={18} /></button>
              <button className="hover:text-white transition-colors" aria-label="Share"><Share2 size={18} /></button>
              <a href="mailto:admin@camillabanquet.com" className="hover:text-white transition-colors" aria-label="Mail"><Mail size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3 text-xs text-stone-400">
              <li><Link to="/about" className="hover:text-luxury-gold-400 transition-colors">About Us</Link></li>
              <li><Link to="/halls" className="hover:text-luxury-gold-400 transition-colors">Our Halls</Link></li>
              <li><Link to="/contact" className="hover:text-luxury-gold-400 transition-colors">Contact</Link></li>
              <li><Link to="/login" className="hover:text-luxury-gold-400 transition-colors">Login / Register</Link></li>
              <li><button className="hover:text-luxury-gold-400 transition-colors">Privacy Policy</button></li>

            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">
              Newsletter
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              Join our mailing list for exclusive event packages and updates.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); showToast("Subscribed successfully!"); }} className="flex">
              <input 
                type="email" 
                placeholder="Email Address"
                required
                className="bg-white/5 border border-white/10 rounded-l px-4 py-2.5 text-xs text-white focus:outline-none focus:border-luxury-gold-500/50 flex-grow"
              />
              <button 
                type="submit" 
                className="bg-luxury-gold-500 hover:bg-luxury-gold-600 text-luxury-emerald-950 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-r transition-colors"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-stone-800/80 py-6 text-center text-[10px] text-stone-500 uppercase tracking-wider">
          © 2026 Camilla Banquet Hotel, Kurunegala, Sri Lanka.
        </div>
      </footer>
    </div>
  );
}
