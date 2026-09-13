import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, Inbox, Crown, Star, Loader2, Heart, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../hooks/useBookings';

export default function Dashboard() {
  const { user } = useAuth();
  const { bookings, loading } = useBookings();

  // Filter bookings belonging to currently signed in user
  const userBookings = bookings.filter(booking => booking.customerId === user?.uid || booking.email?.toLowerCase() === user?.email?.toLowerCase());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-stone-100/80 text-stone-600 border border-stone-300';
      case 'APPROVED':
        return 'bg-amber-50 text-amber-700 border border-amber-300 animate-pulse';
      case 'REJECTED':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'CANCELLED':
        return 'bg-stone-100/80 text-stone-500 border border-stone-200';
      case 'CONFIRMED':
        return 'bg-emerald-100/80 text-emerald-800 border border-emerald-200';
      case 'COMPLETED':
        return 'bg-stone-100/80 text-stone-700 border border-stone-200';
      default:
        return 'bg-stone-100/80 text-stone-600 border border-stone-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Awaiting Admin Review';
      case 'APPROVED':
        return 'Approved - Pending Payment';
      case 'REJECTED':
        return 'Request Rejected';
      case 'CANCELLED':
        return 'Cancelled';
      case 'CONFIRMED':
        return 'Confirmed & Paid';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center h-64 gap-4 text-stone-400">
        <Loader2 size={36} className="animate-spin text-luxury-emerald-700" />
        <p className="text-sm font-semibold">Loading your reservations…</p>
      </div>
    );
  }

  return (
    <div className="pt-8 sm:pt-12 pb-16 sm:pb-24 max-w-7xl mx-auto px-4 sm:px-6 w-full animate-fade-in">
      
      {/* Premium Membership Card Header */}
      <div className="mb-8 sm:mb-12 flex flex-col lg:flex-row gap-6 sm:gap-8 items-start lg:items-end">
        <div className="flex-grow w-full lg:w-auto">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-luxury-emerald-950 mb-3">
            Welcome Back, {user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Guest'}
          </h1>
          <p className="text-stone-500">Manage your exclusive reservations and event details.</p>
        </div>
        
        {/* Camilla Prestige Card */}
        <div className="w-full lg:w-[400px] h-[180px] sm:h-[220px] rounded-2xl relative overflow-hidden shadow-2xl flex-shrink-0 group">
          <div className="absolute inset-0 bg-gradient-to-br from-luxury-emerald-950 via-luxury-emerald-900 to-luxury-emerald-950"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
          
          {/* Animated Gold Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-luxury-gold-500/30 rounded-full blur-3xl group-hover:bg-luxury-gold-400/40 transition-colors duration-700"></div>
          
          <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="font-serif text-lg tracking-widest font-bold text-luxury-gold-300">CAMILLA</span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-stone-300">Prestige Member</span>
              </div>
              <Crown className="text-luxury-gold-400 opacity-80" size={24} />
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">Account</p>
                <p className="font-bold tracking-widest text-lg">{user?.displayName?.toUpperCase() || user?.email?.toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-stone-200">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-luxury-emerald-950">My Reservations</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/wishlist"
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-red-200 text-red-500 font-bold tracking-wider text-xs rounded shadow-sm hover:bg-red-50 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
          >
            <Heart size={14} className="fill-red-400" /> MY WISHLIST
          </Link>
          <Link 
            to="/halls"
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-luxury-gold-500 text-luxury-emerald-950 font-bold tracking-wider text-xs rounded shadow-md hover:bg-luxury-gold-400 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
          >
            <Star size={14} /> NEW RESERVATION
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {userBookings.length > 0 ? (
          userBookings.map((booking, index) => {
            return (
              <div 
                key={booking.id} 
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-200/60 overflow-hidden flex flex-col md:flex-row hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {(() => {
                  const isApproved = ['APPROVED', 'CONFIRMED', 'COMPLETED'].includes(booking.bookingStatus);
                  const isConfirmed = ['CONFIRMED', 'COMPLETED'].includes(booking.bookingStatus);
                  const isRejected = booking.bookingStatus === 'REJECTED';
                  const isCancelled = booking.bookingStatus === 'CANCELLED';

                  return (
                    <>
                <div className="w-full md:w-64 h-44 md:h-auto relative shrink-0 overflow-hidden bg-stone-100 flex items-center justify-center">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                   <div className="absolute bottom-4 left-4 text-white z-20">
                    <span className="text-[10px] font-bold tracking-widest text-luxury-gold-400 uppercase drop-shadow-md">
                      Ref: {booking.id}
                    </span>
                  </div>
                  <Crown size={48} className="text-stone-300" />
                </div>
                
                <div className="p-4 sm:p-6 md:p-8 flex-grow flex flex-col justify-between relative bg-gradient-to-br from-white to-stone-50">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
                      <div>
                        <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-luxury-emerald-950 break-words">{booking.eventName}</h3>
                        <p className="text-stone-500 text-sm mt-1">Hall ID: {booking.hallId}</p>
                      </div>
                      <span className={`self-start px-3 sm:px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm whitespace-nowrap ${getStatusBadge(booking.bookingStatus)}`}>
                        {getStatusLabel(booking.bookingStatus)}
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center text-stone-600 text-sm gap-4 sm:gap-8">
                      <div className="flex items-center font-medium bg-white px-4 py-2 rounded-lg border border-stone-100 shadow-sm">
                        <Calendar size={16} className="mr-2 text-luxury-gold-600" />
                        {booking.eventDate}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold mb-0.5">Guests</span>
                        <span className="font-semibold text-stone-800">{booking.guestCount} PAX</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 mb-2 hidden sm:block">
                    <div className="flex items-start justify-between gap-2 max-w-lg">
                      {/* Step 1 */}
                      <div className="flex flex-col items-center gap-1 flex-1">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-luxury-emerald-950">
                          <CheckCircle size={12} className="text-luxury-gold-400" />
                        </div>
                        <p className="text-[9px] font-bold uppercase text-luxury-emerald-950">Submitted</p>
                      </div>
                      
                      <div className={`flex-1 mt-3 h-0.5 rounded-full ${isApproved || isRejected ? 'bg-luxury-gold-400' : 'bg-stone-200'}`} />

                      {/* Step 2 */}
                      <div className="flex flex-col items-center gap-1 flex-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isApproved ? 'bg-luxury-emerald-950' : 
                          isRejected ? 'bg-red-100 border border-red-300' : 
                          'border border-stone-300 bg-stone-50'
                        }`}>
                          {isRejected ? (
                            <AlertTriangle size={12} className="text-red-600" />
                          ) : isApproved ? (
                            <CheckCircle size={12} className="text-luxury-gold-400" />
                          ) : (
                            <span className="text-[10px] font-bold text-stone-400">2</span>
                          )}
                        </div>
                        <p className={`text-[9px] font-bold uppercase text-center ${
                          isRejected ? 'text-red-600' : isApproved ? 'text-luxury-emerald-950' : 'text-stone-400'
                        }`}>
                          {isRejected ? 'Rejected' : isApproved ? 'Approved' : 'Review'}
                        </p>
                      </div>

                      <div className={`flex-1 mt-3 h-0.5 rounded-full ${isConfirmed ? 'bg-luxury-gold-400' : 'bg-stone-200'}`} />

                      {/* Step 3 */}
                      <div className="flex flex-col items-center gap-1 flex-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isConfirmed ? 'bg-luxury-gold-500' : 
                          isCancelled ? 'bg-red-100 border border-red-300' : 
                          'border border-stone-300 bg-stone-50'
                        }`}>
                          {isCancelled ? (
                            <AlertTriangle size={12} className="text-red-600" />
                          ) : isConfirmed ? (
                            <CheckCircle size={12} className="text-white" />
                          ) : (
                            <span className="text-[10px] font-bold text-stone-400">3</span>
                          )}
                        </div>
                        <p className={`text-[9px] font-bold uppercase text-center ${
                          isCancelled ? 'text-red-600' : isConfirmed ? 'text-luxury-gold-700' : 'text-stone-400'
                        }`}>
                          {isCancelled ? 'Cancelled' : isConfirmed ? 'Paid' : 'Pending'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-6 border-t border-stone-200/60">
                    <div>
                      <span className="block text-[10px] uppercase text-stone-400 tracking-wider font-bold mb-0.5">Grand Total</span>
                      <span className="font-bold text-xl text-luxury-emerald-950">LKR {booking.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      {booking.bookingStatus === 'APPROVED' && booking.paymentStatus === 'Unpaid' && (
                        <Link 
                          to={`/booking/payment/${booking.id}`}
                          className="flex items-center justify-center text-xs font-bold text-luxury-emerald-950 bg-gradient-to-r from-amber-500 to-luxury-gold-500 px-6 py-3 rounded transition-all uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:-translate-y-0.5 animate-pulse"
                        >
                          Confirm & Pay
                        </Link>
                      )}
                      {(booking.paymentStatus === 'Advance Paid' || booking.paymentStatus === 'Fully Paid') && (
                        <Link 
                          to={`/booking/payment/${booking.id}`}
                          className="flex items-center justify-center text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-6 py-3 rounded transition-all uppercase tracking-wider shadow-sm border border-emerald-200"
                        >
                          <CheckCircle size={16} className="mr-2" />
                          Payment Completed
                        </Link>
                      )}
                      <Link 
                        to={`/dashboard/booking/${booking.id}`}
                        className="flex items-center justify-center text-xs font-bold text-white bg-luxury-emerald-950 hover:bg-luxury-emerald-800 px-6 py-3 rounded transition-colors uppercase tracking-wider shadow-md"
                      >
                        View Details <ChevronRight size={14} className="ml-2 text-luxury-gold-400" />
                      </Link>
                    </div>
                  </div>
                </div>
                    </>
                  );
                })()}
              </div>
            );
          })
        ) : (
          <div className="py-32 text-center border-2 border-dashed border-stone-200 rounded-2xl bg-gradient-to-b from-stone-50/50 to-white">
            <div className="w-20 h-20 bg-luxury-gold-50 text-luxury-gold-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Inbox size={32} />
            </div>
            <h3 className="font-serif text-2xl font-bold text-luxury-emerald-950 mb-2">No active reservations</h3>
            <p className="text-stone-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              You haven't booked any events yet. Discover our breathtaking venues and secure your date to experience true luxury.
            </p>
            <Link 
              to="/halls" 
              className="px-8 py-4 bg-luxury-emerald-950 text-white font-bold tracking-wider text-xs rounded hover:bg-luxury-emerald-900 shadow-lg transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              BROWSE HALLS <ChevronRight size={16} className="text-luxury-gold-400" />
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
