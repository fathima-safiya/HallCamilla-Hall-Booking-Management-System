import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { Loader2, Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { isFirebaseConfigured, ADMIN_EMAILS } from '../../lib/firebase';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<'customer' | 'admin'>('customer');

  const fromPath = location.state?.from?.pathname || '/dashboard';
  const fromSearch = location.state?.from?.search || '';
  const fromState = location.state?.from?.state;

  const redirectAfterLogin = (userEmail: string) => {
    const role = ADMIN_EMAILS.includes(userEmail.toLowerCase().trim()) ? 'admin' : 'user';
    const targetPath = role === 'admin' ? '/admin/dashboard' : `${fromPath}${fromSearch}`;
    navigate(targetPath, { replace: true, state: fromState });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password || (isFirebaseConfigured ? '' : 'local'));
      redirectAfterLogin(email);
    } catch (err: unknown) {
      // Auto-register admin if they don't exist yet
      if (
        ADMIN_EMAILS.includes(email.toLowerCase().trim()) &&
        err &&
        typeof err === 'object' &&
        'code' in err &&
        ((err as { code: string }).code === 'auth/user-not-found' || (err as { code: string }).code === 'auth/invalid-credential' || (err as { code: string }).code === 'auth/invalid-login-credentials')
      ) {
        try {
          await register(email, password || (isFirebaseConfigured ? '' : 'local'));
          redirectAfterLogin(email);
          return;
        } catch (regErr: unknown) {
           console.error('Failed to auto-register admin', regErr);
           if (regErr && typeof regErr === 'object' && 'code' in regErr) {
             const regCode = (regErr as { code: string }).code;
             if (regCode === 'auth/operation-not-allowed') {
               setError('Email/Password sign-in is not enabled in Firebase Console.');
               setIsSubmitting(false);
               return;
             }
             if (regCode === 'auth/weak-password') {
               setError('Password is too weak. Please use at least 6 characters.');
               setIsSubmitting(false);
               return;
             }
             if (regCode === 'auth/email-already-in-use') {
               // They just typed the wrong password
               setError('Incorrect email or password.');
               setIsSubmitting(false);
               return;
             }
           }
        }
      }

      const message =
        err && typeof err === 'object'
          ? 'code' in err 
            ? firebaseAuthErrorMessage(String((err as { code: string }).code), (err as any).message)
            : (err as any).message || 'Sign in failed. Please try again.'
          : 'Sign in failed. Please check your email and password.';
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
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7tRqwRezRs4yrvb5HnIhAlUf1aCYX_Jw0RAA43AkpAUMtwy-tsigwJy9kvUNKs-tPaVUOoA3cFqeyr3Kgh7atfPSWjVbjprUKueomgWoauaFdrcgLKN7CYSroDBWZY-Sqll2-o4vhxQ6JszaAFRgjX2fzaM6Z0iuQog31SDDJSAWepL081_OUvU220YVPbEhiCPdsJRAsltQ6STej9PhWARXjfDTXVCMzXCIaJ2GhETRpNW0Tg05xW8eW0lcQCnYRL9zusTe609xs"
        />
        {/* Glassmorphism Overlay Content */}
        <div className="relative z-10 p-12 rounded-xl max-w-md mx-8 text-white bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
          <div className="mb-6 flex items-center gap-2">
            <span className="text-luxury-gold-400">★</span>
            <span className="text-xs font-bold tracking-[0.1em] text-luxury-gold-400">ESTABLISHED 1924</span>
          </div>
          <h1 className="font-serif text-5xl font-bold mb-4">Camilla Banquet</h1>
          <p className="text-lg opacity-90 leading-relaxed">
            Step into a world where timeless elegance meets unparalleled service. Your exceptional experience begins here.
          </p>
          <div className="mt-8 pt-8 border-t border-white/20">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full border border-luxury-gold-400 p-1">
                <img
                  alt="Concierge"
                  className="w-full h-full rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAegRZB58ASs9U7o-GO5JX7-aI0P7JQs1L8jQ1lEYT0CBVvrWdN22sV1ItejkZPnXhRZcEogRLAz1UyZTOD1ghaWWE3GWAqiWhHmW0gURHt_ZTtI5BbpaQ2GX4dk8CddKpBG_UmWZVh6p0rxGTNvGXhnUQx5ntch7mFaMh_GXAT23ySvvQ_sfwqHDJrGnqPhMS9kREfR_ZVa7OVbZNIcd9UCqvSO6S7gL108Bw7b3142cZJD85DNBDhy4Mm3KDiwww9GvhRg56Scc7-"
                />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-luxury-gold-400 uppercase">DIRECTOR OF SERVICE</p>
                <p className="text-sm italic text-white/80">"Welcome back to excellence."</p>
              </div>
            </div>
          </div>
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
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-luxury-emerald-950 mb-3">
              {loginType === 'admin' ? 'Admin Portal' : 'Welcome Back'}
            </h2>
            <p className="text-stone-500">
              {loginType === 'admin'
                ? 'Sign in to manage halls, bookings, and users.'
                : 'Please enter your credentials to access your booking suite.'}
            </p>
            {isFirebaseConfigured && (
              <p className="text-[10px] text-luxury-gold-600 font-bold uppercase tracking-wider mt-3">
                Secured with Firebase
              </p>
            )}
          </div>

          {/* Role Toggle */}
          <div className="flex bg-stone-100 p-1 rounded-lg mb-8">
            <button
              type="button"
              onClick={() => { setLoginType('customer'); setEmail(''); setPassword(''); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${loginType === 'customer' ? 'bg-white shadow-sm text-luxury-emerald-950' : 'text-stone-400 hover:text-stone-600'}`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => { setLoginType('admin'); setEmail(''); setPassword(''); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${loginType === 'admin' ? 'bg-white shadow-sm text-luxury-emerald-950' : 'text-stone-400 hover:text-stone-600'}`}
            >
              Admin
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-xs rounded border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
            {/* Email Field */}
            <div className="space-y-2.5">
              <label className="block text-xs uppercase font-bold text-stone-500 tracking-widest" htmlFor="email">
                EMAIL ADDRESS
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-luxury-emerald-900 transition-colors" size={20} />
                <input
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-luxury-emerald-100 focus:border-luxury-emerald-800 transition-all outline-none text-base text-stone-800"
                  id="email"
                  type="email"
                  required
                  autoComplete="nope"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admincamillahotel@gmail.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs uppercase font-bold text-stone-500 tracking-widest" htmlFor="password">
                  PASSWORD
                </label>
                <Link to="/forgot-password" className="text-xs text-luxury-gold-600 hover:text-luxury-emerald-900 transition-colors tracking-widest font-bold uppercase">
                  FORGOT PASSWORD?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-luxury-emerald-900 transition-colors" size={20} />
                <input
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-luxury-emerald-100 focus:border-luxury-emerald-800 transition-all outline-none text-base text-stone-800"
                  id="password"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 pt-2">
              <input className="w-4 h-4 rounded border-stone-300 text-luxury-emerald-900 focus:ring-luxury-emerald-900 cursor-pointer" id="remember" type="checkbox" />
              <label className="text-sm text-stone-600 cursor-pointer" htmlFor="remember">Remember me for 30 days</label>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-luxury-emerald-950 text-white py-4 rounded-lg text-sm font-bold tracking-widest uppercase hover:bg-luxury-emerald-900 transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
                SIGN IN
              </button>
            </div>
          </form>

          {/* Footer Options */}
          <div className="mt-10 text-center space-y-4">
            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] flex-1 bg-stone-200"></div>
              <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">NEW TO CAMILLA?</span>
              <div className="h-[1px] flex-1 bg-stone-200"></div>
            </div>
            <p className="text-stone-500">
              Experience the gold standard of hospitality.
              <Link className="text-luxury-gold-600 font-bold hover:underline ml-2" to="/register">
                Create an Account
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

function firebaseAuthErrorMessage(code: string, originalMessage?: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return 'Incorrect email or password. If you are a new customer, please click "Create an Account" below.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    default:
      return `Sign in failed: ${code}. ${originalMessage || ''}`;
  }
}
