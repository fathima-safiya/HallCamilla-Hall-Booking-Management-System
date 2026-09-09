import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Clock, Bell, CheckCircle } from 'lucide-react';

export default function BookingSubmitted() {
  const [searchParams] = useSearchParams();
  const [reference] = useState(() => searchParams.get('ref') || ('CBH-' + Math.random().toString(36).substring(2, 8).toUpperCase()));

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-6 w-full animate-fade-in bg-stone-100">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl border border-stone-200 p-10 text-center relative overflow-hidden">
        
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-luxury-gold-400 via-luxury-gold-500 to-luxury-gold-400"></div>
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-luxury-gold-50 rounded-full opacity-60 blur-3xl pointer-events-none"></div>

        {/* Icon */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="w-24 h-24 bg-luxury-gold-100 rounded-full flex items-center justify-center border-4 border-luxury-gold-200 shadow-lg">
            <Clock size={44} className="text-luxury-gold-600" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
            <Bell size={14} className="text-white" />
          </div>
        </div>

        <h1 className="font-serif text-4xl font-bold text-luxury-emerald-950 mb-3">Request Submitted!</h1>
        <p className="text-stone-600 mb-8 leading-relaxed text-sm">
          Your booking request has been submitted! Our team will review within 24 hours.
        </p>

        {/* Reference Box */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 mb-8">
          <span className="block text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-2">
            Booking Request Reference
          </span>
          <span className="text-3xl font-mono font-bold text-luxury-emerald-950 tracking-widest">
            {reference}
          </span>
          <p className="text-[10px] text-stone-400 mt-2 font-medium">Save this reference to track your request status.</p>
        </div>

        {/* Timeline */}
        <div className="mb-10 flex items-start justify-between text-left gap-2 px-2">
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="w-8 h-8 rounded-full bg-luxury-emerald-950 flex items-center justify-center flex-shrink-0">
              <CheckCircle size={16} className="text-luxury-gold-400" />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-luxury-emerald-950 uppercase tracking-wide">Submitted</p>
              <p className="text-[9px] text-stone-400">Done</p>
            </div>
          </div>
          <div className="flex-1 mt-4 h-0.5 bg-stone-200 relative">
            <div className="absolute inset-y-0 left-0 right-0 bg-luxury-gold-300 animate-pulse rounded-full"></div>
          </div>
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="w-8 h-8 rounded-full border-2 border-amber-400 bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Clock size={14} className="text-amber-500" />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">Admin Review</p>
              <p className="text-[9px] text-stone-400">In Progress</p>
            </div>
          </div>
          <div className="flex-1 mt-4 h-0.5 bg-stone-200 rounded-full"></div>
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="w-8 h-8 rounded-full border-2 border-stone-300 bg-stone-50 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-stone-400">3</span>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wide">Confirmed</p>
              <p className="text-[9px] text-stone-400">Pending</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/dashboard"
            className="w-full sm:w-auto px-8 py-4 bg-luxury-emerald-950 text-white font-bold tracking-wider text-xs rounded hover:bg-luxury-emerald-900 shadow-md transition-all hover:-translate-y-0.5"
          >
            GO TO MY BOOKINGS
          </Link>
          <Link 
            to="/"
            className="w-full sm:w-auto px-8 py-4 bg-white text-luxury-emerald-950 font-bold tracking-wider text-xs rounded hover:bg-stone-50 border border-stone-200 transition-all"
          >
            BACK TO HOME
          </Link>
        </div>

      </div>
    </div>
  );
}
