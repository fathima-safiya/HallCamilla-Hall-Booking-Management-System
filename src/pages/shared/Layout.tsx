import { useState } from 'react';
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
  Heart,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import NotificationBell from './components/NotificationBell';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { showToast } = useToast();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [adminSidebarOpen, setAdminSidebarOpen] = useState(false);

  const isAdminView = location.pathname.startsWith('/admin');

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const closeMobileNav = () => setMobileNavOpen(false);

  // ----------------------------------------------------
  // ADMIN PANEL SIDEBAR LAYOUT
  // ----------------------------------------------------
  if (isAdminView && user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-stone-100 font-sans flex flex-col selection:bg-amber-800 selection:text-amber-100">
        
        {/* Mobile Admin Top Bar */}
        <div className="md:hidden flex items-center justify-between bg-luxury-emerald-950 text-white px-4 py-3 shrink-0 shadow-md z-50">
          <Link to="/admin/dashboard" className="flex flex-col">
            <span className="font-serif text-base font-bold tracking-tight text-white leading-tight">
              Camilla Banquet
            </span>
            <span className="text-[8px] uppercase tracking-widest text-luxury-gold-400 font-bold">
              Administrative Suite
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <button
              onClick={() => setAdminSidebarOpen(!adminSidebarOpen)}
              className="p-2 rounded bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Toggle admin menu"
            >
              {adminSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <div className="flex flex-row flex-1 min-h-0">

          {/* Admin Sidebar — hidden on mobile unless open */}
          <aside
            className={`
              fixed inset-y-0 left-0 z-40 w-64 bg-luxury-emerald-950 text-white shrink-0 shadow-xl border-r border-luxury-emerald-900 flex flex-col justify-between
              transform transition-transform duration-300 ease-in-out
              md:relative md:translate-x-0 md:flex
              ${adminSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Admin Brand - Desktop only */}
              <div className="hidden md:block p-6 border-b border-white/5 bg-luxury-emerald-950/80 shrink-0">
                <Link to="/admin/dashboard" className="flex flex-col">
                  <span className="font-serif text-lg font-bold tracking-tight text-white">
                    Camilla Banquet
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-luxury-gold-400 font-bold mt-0.5">
                    Administrative Suite
                  </span>
                </Link>
              </div>

              {/* Mobile sidebar close button row */}
              <div className="md:hidden flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
                <span className="text-[9px] uppercase tracking-widest text-luxury-gold-400 font-bold">Menu</span>
                <button
                  onClick={() => setAdminSidebarOpen(false)}
                  className="p-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Sidebar Links */}
              <nav className="p-4 space-y-1 flex-1">
                {[
                  { to: '/admin/dashboard', Icon: LayoutDashboard, label: 'Dashboard' },
                  { to: '/admin/bookings', Icon: CalendarRange, label: 'Bookings Grid' },
                  { to: '/admin/halls', Icon: Building2, label: 'Halls' },
                  { to: '/admin/packages', Icon: Package, label: 'Packages' },
                  { to: '/admin/cancellations', Icon: AlertCircle, label: 'Cancellations' },
                  { to: '/admin/reviews', Icon: Star, label: 'Reviews' },
                  { to: '/admin/payments', Icon: CreditCard, label: 'Payments' },
                  { to: '/admin/reports', Icon: FileText, label: 'Reports' },
                  { to: '/admin/customers', Icon: Users, label: 'Customers' },
                  { to: '/admin/event-types', Icon: Tags, label: 'Event Types' },
                  { to: '/admin/maintenance', Icon: Wrench, label: 'Maintenance' },
                  { to: '/admin/availability', Icon: Clock, label: 'Availability' },
                  { to: '/admin/notifications', Icon: Bell, label: 'Notifications' },
                  { to: '/admin/settings', Icon: Settings, label: 'Settings' },
                ].map(({ to, Icon, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setAdminSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded transition-all duration-200 text-xs font-semibold uppercase tracking-wider ${
                      isActive(to)
                        ? 'bg-luxury-gold-500 text-luxury-emerald-950 font-bold shadow-md'
                        : 'text-stone-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Sidebar Footer Controls */}
            <div className="p-4 border-t border-white/5 space-y-2 bg-luxury-emerald-950/40 shrink-0">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center space-x-2 w-full py-2.5 rounded bg-white/5 hover:bg-red-950/40 text-stone-300 hover:text-red-300 hover:border-red-500/20 border border-transparent text-xs font-bold transition-all"
              >
                <LogOut size={14} />
                <span>LOGOUT</span>
              </button>
            </div>
          </aside>

          {/* Overlay for mobile sidebar */}
          {adminSidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/50 md:hidden"
              onClick={() => setAdminSidebarOpen(false)}
            />
          )}

          {/* Content Wrapper */}
          <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden w-0">
            
            {/* Top Administrative Bar - Desktop */}
            <header className="hidden md:flex h-16 bg-white border-b border-stone-200 shadow-sm px-4 lg:px-8 items-center justify-between shrink-0">
              <div className="flex items-center space-x-2 text-stone-500 text-xs">
                <span className="font-bold text-luxury-emerald-900">ADMIN PANEL</span>
                <span>/</span>
                <span className="capitalize">{location.pathname.split('/').pop()?.replace('-', ' ')}</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-xs text-stone-500 font-medium hidden lg:block">
                  Logged in: <strong className="text-stone-800">{user.email}</strong>
                </span>
                <NotificationBell />
                <div className="w-8 h-8 rounded-full bg-luxury-gold-500 text-luxury-emerald-950 font-bold text-sm flex items-center justify-center shadow-inner">
                  A
                </div>
              </div>
            </header>

            {/* Main workspace */}
            <main className="flex-grow p-4 sm:p-6 lg:p-8 flex flex-col relative w-full overflow-x-hidden overflow-y-auto">
              <Outlet />
            </main>
          </div>

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-luxury-emerald-900 flex items-center justify-center text-luxury-gold-400 group-hover:bg-luxury-gold-500 group-hover:text-luxury-emerald-950 transition-colors shadow-sm border border-luxury-gold-500/20">
              <Crown size={18} strokeWidth={2.5} className="sm:hidden" />
              <Crown size={22} strokeWidth={2.5} className="hidden sm:block" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-luxury-emerald-950 group-hover:text-luxury-emerald-800 transition-colors leading-tight">
                Camilla Banquet
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-luxury-gold-600 font-semibold hidden xs:block">
                Kurunegala, Sri Lanka
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {[
              { to: '/', label: 'HOME' },
              { to: '/halls', label: 'HALLS' },
              { to: '/budget-calculator', label: 'PLANNER' },
              { to: '/about', label: 'ABOUT' },
              { to: '/contact', label: 'CONTACT' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-xs lg:text-sm font-semibold tracking-wider transition-colors duration-200 ${
                  isActive(to)
                    ? 'text-luxury-emerald-900 border-b-2 border-luxury-gold-500 pb-1'
                    : 'text-stone-600 hover:text-luxury-emerald-800'
                }`}
              >
                {label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`text-xs lg:text-sm font-semibold tracking-wider transition-colors duration-200 ${
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
                className={`flex items-center gap-1.5 text-xs lg:text-sm font-semibold tracking-wider transition-colors duration-200 ${
                  isActive('/wishlist')
                    ? 'text-red-500 border-b-2 border-red-400 pb-1'
                    : 'text-stone-600 hover:text-red-500'
                }`}
              >
                <Heart size={14} className={isActive('/wishlist') ? 'fill-red-500' : ''} />
                WISHLIST
              </Link>
            )}
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

          {/* Right side icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAuthenticated ? (
              <>
                <NotificationBell />
                <div className="hidden md:flex items-center space-x-2">
                  <Link
                    to="/profile"
                    className="p-2 text-stone-700 hover:text-luxury-emerald-900 transition-colors rounded-full hover:bg-stone-100"
                    aria-label="User Account"
                  >
                    <User size={21} />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-bold text-stone-500 hover:text-luxury-emerald-900 uppercase tracking-wider transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center space-x-2 text-sm font-bold text-luxury-emerald-900 hover:text-luxury-gold-600 transition-colors tracking-wider"
              >
                <LogIn size={18} />
                <span>SIGN IN</span>
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              className="md:hidden p-2 text-luxury-emerald-900 hover:bg-stone-100 rounded-full transition-colors"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu size={22} />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobileNav}
          />

          {/* Drawer Panel */}
          <div className="absolute top-0 right-0 bottom-0 w-[80vw] max-w-[320px] bg-white shadow-2xl flex flex-col overflow-y-auto animate-slide-up">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 shrink-0">
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold text-luxury-emerald-950">Camilla Banquet</span>
                <span className="text-[9px] uppercase tracking-widest text-luxury-gold-600 font-semibold">Kurunegala, Sri Lanka</span>
              </div>
              <button
                onClick={closeMobileNav}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-500 transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col p-4 gap-1 flex-1">
              {[
                { to: '/', label: 'Home' },
                { to: '/halls', label: 'Halls' },
                { to: '/budget-calculator', label: 'Planner' },
                { to: '/about', label: 'About' },
                { to: '/contact', label: 'Contact' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={closeMobileNav}
                  className={`flex items-center px-4 py-3.5 rounded-lg text-sm font-semibold tracking-wide transition-colors ${
                    isActive(to)
                      ? 'bg-luxury-emerald-950 text-white'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {label}
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  <div className="border-t border-stone-100 my-2" />
                  <Link
                    to="/dashboard"
                    onClick={closeMobileNav}
                    className={`flex items-center px-4 py-3.5 rounded-lg text-sm font-semibold tracking-wide transition-colors ${
                      isActive('/dashboard') ? 'bg-luxury-emerald-950 text-white' : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    My Bookings
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={closeMobileNav}
                    className={`flex items-center gap-2 px-4 py-3.5 rounded-lg text-sm font-semibold tracking-wide transition-colors ${
                      isActive('/wishlist') ? 'bg-red-50 text-red-600' : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <Heart size={15} className={isActive('/wishlist') ? 'fill-red-500 text-red-500' : ''} />
                    Wishlist
                  </Link>
                  <Link
                    to="/profile"
                    onClick={closeMobileNav}
                    className={`flex items-center gap-2 px-4 py-3.5 rounded-lg text-sm font-semibold tracking-wide transition-colors ${
                      isActive('/profile') ? 'bg-luxury-emerald-950 text-white' : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <User size={15} />
                    Profile
                  </Link>
                </>
              )}

              {user?.role === 'admin' && (
                <>
                  <div className="border-t border-stone-100 my-2" />
                  <Link
                    to="/admin/dashboard"
                    onClick={closeMobileNav}
                    className="flex items-center gap-2 px-4 py-3.5 rounded-lg text-sm font-bold text-luxury-gold-600 bg-luxury-emerald-950 hover:bg-luxury-emerald-900 transition-colors"
                  >
                    <Sliders size={15} className="text-luxury-gold-400" />
                    Admin Panel
                  </Link>
                </>
              )}
            </nav>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-stone-100 shrink-0">
              {isAuthenticated ? (
                <button
                  onClick={() => { closeMobileNav(); handleLogout(); }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-600 text-sm font-bold transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMobileNav}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-luxury-emerald-950 text-white text-sm font-bold hover:bg-luxury-emerald-900 transition-colors"
                >
                  <LogIn size={16} />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col relative w-full overflow-x-hidden pt-16 sm:pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-luxury-dark text-stone-300 border-t border-stone-800 relative z-10 w-full shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 sm:gap-10">
          
          {/* Logo & Intro */}
          <div className="sm:col-span-2 md:col-span-5 text-left">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 block">
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
          <div className="sm:col-span-2 md:col-span-4 text-left">
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
                className="bg-white/5 border border-white/10 rounded-l px-3 sm:px-4 py-2.5 text-xs text-white focus:outline-none focus:border-luxury-gold-500/50 flex-1 min-w-0"
              />
              <button
                type="submit"
                className="bg-luxury-gold-500 hover:bg-luxury-gold-600 text-luxury-emerald-950 font-bold text-xs uppercase tracking-wider px-4 sm:px-5 py-2.5 rounded-r transition-colors shrink-0"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-stone-800/80 py-5 sm:py-6 text-center text-[10px] text-stone-500 uppercase tracking-wider px-4">
          © 2026 Camilla Banquet Hotel, Kurunegala, Sri Lanka.
        </div>
      </footer>
    </div>
  );
}
