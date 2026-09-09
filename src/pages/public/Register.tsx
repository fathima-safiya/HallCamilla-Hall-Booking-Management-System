import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { Loader2, Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft } from 'lucide-react';
import { isFirebaseConfigured } from '../../lib/firebase';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fromPath = location.state?.from?.pathname || '/dashboard';
  const fromSearch = location.state?.from?.search || '';
  const fromState = location.state?.from?.state;
  const targetPath = `${fromPath}${fromSearch}`;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!termsAccepted) {
      setError('You must accept the Terms of Service.');
      return;
    }

    setIsSubmitting(true);

    try {
      const names = fullName.trim().split(' ');
      const firstName = names[0];
      const lastName = names.slice(1).join(' ') || '';

      await register(email, password || 'local', { firstName, lastName, phone });
      navigate(targetPath, { replace: true, state: fromState });
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'code' in err
          ? firebaseRegisterErrorMessage(String((err as { code: string }).code))
          : 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full bg-stone-50 font-sans text-stone-900 overflow-hidden">
      {/* Back to Home Link */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest z-50 text-stone-500 bg-white/60 hover:bg-white border border-stone-200 lg:text-white/90 lg:bg-black/20 lg:hover:bg-white lg:hover:text-luxury-emerald-950 lg:border-white/20 backdrop-blur-md px-4 py-2.5 rounded-full transition-all shadow-sm lg:shadow-lg group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      {/* Left Side: Visual Experience (Hidden on Mobile) */}
      <section className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden">
        <img 
          alt="Camilla Grand Hall" 
          className="absolute inset-0 w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC443M--EDcaBuXt-9euc_uGz2KnsMh_yUM49x3E7PTLbIOv82MaXKFT2cEL9rU7pzEnXNOzbiwmHsz1qZHtH02SIP8IYovSMrV7UREdw0aVN29TUWw-8I-5OI1bvkVUtwyUXuIsr7eTD2pTz8H4uZg8P5rhgsncPeWPuy0ejWBM2tNKWkziX7-nqv3EBzePHLmeGei49KNyN06jicn9sD3JbzZhRKJBfNP4y0hsLcbn6-3N8VfbCa7jaXOQOJLdZykBZchf1u-dvjJ"
        />
        {/* Glassmorphism Overlay Content */}
        <div className="relative z-10 p-12 rounded-xl max-w-md mx-8 text-white bg-luxury-emerald-950/40 backdrop-blur-md border border-white/20 shadow-2xl">
          <div className="mb-6 flex items-center gap-2">
            <span className="text-luxury-gold-400">★</span>
            <span className="text-xs font-bold tracking-[0.1em] text-luxury-gold-400">ESTABLISHED 1924</span>
          </div>
          <h1 className="font-serif text-5xl font-bold mb-4">Camilla Banquet</h1>
          <p className="text-lg opacity-90 leading-relaxed">
            Join an exclusive community where every event is a masterpiece. Experience the pinnacle of luxury.
          </p>
        </div>
      </section>

      {/* Right Side: Form Content */}
      <section className="w-full lg:w-1/2 px-6 md:px-16 bg-white relative overflow-y-auto h-screen flex flex-col">
        {/* Top Spacer */}
        <div className="flex-1 min-h-[3rem]"></div>
        
        <div className="w-full max-w-md mx-auto relative z-10 py-8">
          
          {/* Mobile Branding */}
          <div className="lg:hidden mb-12 flex flex-col items-center text-center">
            <h1 className="font-serif text-3xl font-bold text-luxury-emerald-950">Camilla Banquet</h1>
            <div className="w-12 h-0.5 bg-luxury-gold-500 mt-3"></div>
          </div>

          <div className="mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-luxury-emerald-950 mb-3">Create Account</h2>
            <p className="text-stone-500">Step into a world of curated elegance and seamless hospitality.</p>
            {isFirebaseConfigured && (
              <p className="text-[10px] text-luxury-gold-600 font-bold uppercase tracking-wider mt-3">
                Secured with Firebase
              </p>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-xs rounded border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5" autoComplete="off">
            {/* Full Name */}
            <div className="space-y-2.5">
              <label className="block text-xs uppercase font-bold text-stone-500 tracking-widest">
                FULL NAME
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-luxury-emerald-900 transition-colors" size={20} />
                <input 
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-luxury-emerald-100 focus:border-luxury-emerald-800 transition-all outline-none text-base text-stone-800" 
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Johnathan Doe" 
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2.5">
              <label className="block text-xs uppercase font-bold text-stone-500 tracking-widest">
                EMAIL ADDRESS
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-luxury-emerald-900 transition-colors" size={20} />
                <input 
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-luxury-emerald-100 focus:border-luxury-emerald-800 transition-all outline-none text-base text-stone-800" 
                  type="email"
                  required
                  autoComplete="nope"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com" 
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2.5">
              <label className="block text-xs uppercase font-bold text-stone-500 tracking-widest">
                PHONE NUMBER
              </label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-luxury-emerald-900 transition-colors" size={20} />
                <input 
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-luxury-emerald-100 focus:border-luxury-emerald-800 transition-all outline-none text-base text-stone-800" 
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+94 77 123 4567" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-2.5">
                <label className="block text-xs uppercase font-bold text-stone-500 tracking-widest">
                  PASSWORD
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-luxury-emerald-900 transition-colors" size={20} />
                  <input 
                    className="w-full pl-11 pr-10 py-3.5 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-luxury-emerald-100 focus:border-luxury-emerald-800 transition-all outline-none text-base text-stone-800" 
                    type={showPassword ? 'text' : 'password'}
                    required={isFirebaseConfigured}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2.5">
                <label className="block text-xs uppercase font-bold text-stone-500 tracking-widest">
                  CONFIRM
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-luxury-emerald-900 transition-colors" size={20} />
                  <input 
                    className="w-full pl-11 pr-10 py-3.5 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-luxury-emerald-100 focus:border-luxury-emerald-800 transition-all outline-none text-base text-stone-800" 
                    type={showPassword ? 'text' : 'password'}
                    required={isFirebaseConfigured}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-start space-x-3 pt-2">
              <input 
                className="mt-1 w-4 h-4 rounded border-stone-300 text-luxury-emerald-900 focus:ring-luxury-emerald-900 cursor-pointer" 
                id="terms" 
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)} 
              />
              <label className="text-sm text-stone-600 cursor-pointer" htmlFor="terms">
                I agree to the <Link to="#" className="text-luxury-emerald-900 font-bold hover:underline">Terms of Service</Link> and <Link to="#" className="text-luxury-emerald-900 font-bold hover:underline">Privacy Policy</Link>.
              </label>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-luxury-emerald-950 text-white py-4 rounded-lg text-sm font-bold tracking-widest uppercase hover:bg-luxury-emerald-900 transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
                CREATE ACCOUNT
              </button>
            </div>
          </form>

          {/* Footer Options */}
          <div className="mt-10 text-center space-y-4">
            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] flex-1 bg-stone-200"></div>
              <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">ALREADY HAVE AN ACCOUNT?</span>
              <div className="h-[1px] flex-1 bg-stone-200"></div>
            </div>
            <p className="text-stone-500">
              Welcome back to excellence. 
              <Link className="text-luxury-gold-600 font-bold hover:underline ml-2" to="/login">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="flex-1"></div>

        {/* Subtle Legal Footer */}
        <footer className="pb-6 text-center w-full shrink-0">
          <p className="text-[10px] font-bold tracking-widest text-stone-400 opacity-60 uppercase">
            © 2026 CAMILLA BANQUET HOTEL. ALL RIGHTS RESERVED.
          </p>
        </footer>
      </section>
    </main>
  );
}

function firebaseRegisterErrorMessage(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    default:
      return 'Registration failed. Please try again.';
  }
}
