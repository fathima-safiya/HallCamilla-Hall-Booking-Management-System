import React from 'react';
import { X, User, Mail, Phone, Calendar, CalendarCheck, CalendarX, TrendingUp, Receipt } from 'lucide-react';
import type { CustomerUser, Booking } from '../../types/app';

interface CustomerDetailsCardProps {
  customer: CustomerUser;
  bookings: Booking[];
  onClose: () => void;
  isLoadingBookings?: boolean;
}

export default function CustomerDetailsCard({ customer, bookings, onClose, isLoadingBookings }: CustomerDetailsCardProps) {
  const totalSpent = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalBookings = bookings.length;
  
  const upcomingBookings = bookings.filter(b => 
    new Date(b.eventDate) >= new Date() && 
    ['APPROVED', 'CONFIRMED'].includes(b.bookingStatus)
  ).length;
  
  const cancelledBookings = bookings.filter(b => 
    ['CANCELLED', 'CANCELLATION_REQUESTED'].includes(b.bookingStatus)
  ).length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-stone-50 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-full animate-fade-in">
        
        {/* Header */}
        <div className="bg-luxury-emerald-950 p-6 sm:p-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-luxury-gold-500 rounded-full flex items-center justify-center text-luxury-emerald-950 shadow-inner">
              <User size={28} />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-white">{customer.name || 'Unknown Customer'}</h2>
              <p className="text-luxury-gold-400 text-sm font-semibold tracking-wider uppercase mt-1">Customer Profile</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Column: Personal Details */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4 border-b border-stone-200 pb-2">
                Contact Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-luxury-gold-600"><Mail size={18} /></div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Email Address</p>
                    <p className="text-sm font-medium text-stone-800 break-all">{customer.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-luxury-gold-600"><Phone size={18} /></div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Phone Number</p>
                    <p className="text-sm font-medium text-stone-800">{customer.phone || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-luxury-gold-600"><Calendar size={18} /></div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Registered Since</p>
                    <p className="text-sm font-medium text-stone-800">
                      {customer.joinedDate ? new Date(customer.joinedDate).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'long', day: 'numeric'
                      }) : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Statistics & Booking History */}
            <div className="md:col-span-2 space-y-8">
              
              {/* Summary Stats */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4 border-b border-stone-200 pb-2">
                  Account Summary
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col items-center justify-center text-center">
                    <Receipt size={20} className="text-luxury-emerald-700 mb-2" />
                    <span className="text-2xl font-bold text-luxury-emerald-950">{totalBookings}</span>
                    <span className="text-[10px] font-bold uppercase text-stone-400 tracking-widest mt-1">Total Events</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col items-center justify-center text-center">
                    <CalendarCheck size={20} className="text-luxury-gold-600 mb-2" />
                    <span className="text-2xl font-bold text-luxury-emerald-950">{upcomingBookings}</span>
                    <span className="text-[10px] font-bold uppercase text-stone-400 tracking-widest mt-1">Upcoming</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col items-center justify-center text-center">
                    <CalendarX size={20} className="text-red-500 mb-2" />
                    <span className="text-2xl font-bold text-luxury-emerald-950">{cancelledBookings}</span>
                    <span className="text-[10px] font-bold uppercase text-stone-400 tracking-widest mt-1">Cancelled</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col items-center justify-center text-center">
                    <TrendingUp size={20} className="text-blue-600 mb-2" />
                    <span className="text-lg font-bold text-luxury-emerald-950">LKR {totalSpent >= 1000000 ? (totalSpent/1000000).toFixed(1) + 'M' : (totalSpent/1000).toFixed(0) + 'K'}</span>
                    <span className="text-[10px] font-bold uppercase text-stone-400 tracking-widest mt-1">Total Spent</span>
                  </div>
                </div>
              </div>

              {/* Booking History List */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4 border-b border-stone-200 pb-2">
                  Recent Booking History
                </h3>
                
                {isLoadingBookings ? (
                  <div className="py-8 text-center text-stone-500 text-sm">Loading bookings...</div>
                ) : bookings.length === 0 ? (
                  <div className="py-8 text-center text-stone-400 text-sm italic bg-white rounded-xl border border-stone-200 border-dashed">
                    No bookings found for this customer.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-luxury-emerald-950">{booking.eventName}</span>
                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full ${
                              ['CONFIRMED', 'COMPLETED'].includes(booking.bookingStatus) ? 'bg-green-100 text-green-800' :
                              ['CANCELLED', 'CANCELLATION_REQUESTED'].includes(booking.bookingStatus) ? 'bg-red-100 text-red-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {booking.bookingStatus.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-xs text-stone-500 flex items-center gap-3">
                            <span>{new Date(booking.eventDate).toLocaleDateString()}</span>
                            <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                            <span>{booking.guestCount} Guests</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-stone-700 text-sm">LKR {booking.totalAmount?.toLocaleString()}</p>
                          <p className="text-[10px] uppercase font-bold text-stone-400">{booking.paymentStatus}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
