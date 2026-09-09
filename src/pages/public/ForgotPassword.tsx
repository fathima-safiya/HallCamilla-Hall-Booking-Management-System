import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Add firebase password reset logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-stone-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-luxury-emerald-950 font-serif">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-stone-600">
            Enter your email to receive a password reset link.
          </p>
        </div>
        
        {submitted ? (
          <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg text-sm text-center">
            If an account exists for {email}, we have sent a reset link. Please check your inbox.
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit} autoComplete="off">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded relative block w-full px-3 py-3 border border-stone-300 placeholder-stone-500 text-stone-900 focus:outline-none focus:ring-luxury-gold-500 focus:border-luxury-gold-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase tracking-widest rounded text-white bg-luxury-emerald-950 hover:bg-luxury-emerald-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-luxury-emerald-900 transition-colors"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        )}
        
        <div className="text-center mt-4">
          <Link to="/login" className="font-medium text-luxury-gold-600 hover:text-luxury-gold-500 text-sm">
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
