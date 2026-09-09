import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHalls } from '../../hooks/useHalls';
import { useCatalog } from '../../hooks/useCatalog';
import { useBookings } from '../../hooks/useBookings';
import { useEventTypes } from '../../hooks/useEventTypes';
import { bookingService } from '../../services/bookingService';
import type { ExternalVendor } from '../../types/app';
import { Calendar, Check, Send, Loader2, AlertCircle, Users, ChevronDown, FileText } from 'lucide-react';
import CostBreakdown from '../../components/CostBreakdown';
import { quotationService } from '../../services/quotationService';

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { halls, loading: hallsLoading } = useHalls();
  const { packages, services, loading: catalogLoading } = useCatalog();
  const { createBooking } = useBookings();
  const { activeEventTypes } = useEventTypes();

  const state = location.state as {
    hallId?: string;
    date?: string;
    guests?: number;
    packageId?: string;
    selectedServices?: string[];
    hotelExtraServices?: string[];
    externalVendors?: ExternalVendor[];
    hallPrice?: number;
    packagePricePerPerson?: number;
    packagePrice?: number;
    extraServicesPrice?: number;
    totalAmount?: number;
  } | null;

  useEffect(() => {
    if (!state || !state.hallId || !state.packageId) {
      navigate('/halls');
    }
  }, [state, navigate]);

  const [eventDate, setEventDate] = useState(state?.date || '');
  const [eventName, setEventName] = useState('');
  const [customEventName, setCustomEventName] = useState('');
  const [guestCount, setGuestCount] = useState(state?.guests || 100);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');

  if (!state || !state.hallId || !state.packageId || hallsLoading || catalogLoading) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center h-64 gap-4 text-stone-400">
        <Loader2 size={36} className="animate-spin text-luxury-emerald-700" />
        <p className="text-sm font-semibold">Loading booking details…</p>
      </div>
    );
  }

  const selectedHall = halls.find(h => h.id === state.hallId);
  const selectedPackage = packages.find(p => p.id === state.packageId);
  const hotelExtraServicesList = state.hotelExtraServices?.map(id => services.find(s => s?.id === id)).filter(Boolean) || [];
  const externalVendorsList = state.externalVendors || [];

  // Dynamic calculations based on current guestCount
  const hallPrice = state.hallPrice || 0;
  const packagePricePerPerson = state.packagePricePerPerson || selectedPackage.packagePrice || 0;
  const packagePrice = packagePricePerPerson * guestCount;
  const extraServicesPrice = state.extraServicesPrice || 0;
  const totalAmount = hallPrice + packagePrice + extraServicesPrice;

  const today = new Date().toISOString().split('T')[0];

  const handleBookingSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHall || !selectedPackage || !user) return;

    setIsSubmitting(true);
    setAvailabilityError('');

    try {
      const isAvailable = await bookingService.checkAvailability(selectedHall.id, eventDate);
      if (!isAvailable) {
        setAvailabilityError('This hall is already booked for the selected date. Please choose another date.');
        setIsSubmitting(false);
        return;
      }

      const initialStatus = 'PENDING';

      const newBooking = await createBooking({
        customerId: user.uid || user.email || 'guest',
        hallId: selectedHall.id,
        packageId: selectedPackage.id,
        selectedServices: state.selectedServices || [],
        hotelExtraServices: state.hotelExtraServices || [],
        externalVendors: state.externalVendors || [],
        eventName: eventName === 'Other' && customEventName ? customEventName : (eventName || `${selectedHall.hallName} Event`),
        eventType: eventName === 'Other' && customEventName ? customEventName : (eventName || 'Other'),
        customerName: user.displayName || user.email?.split('@')[0] || 'Guest',
        email: user.email || '',
        phone: '',
        guestCount,
        eventDate,
        hallPrice: hallPrice,
        packagePrice: packagePrice,
        packagePricePerPerson: packagePricePerPerson,
        extraServicesPrice: extraServicesPrice,
        totalAmount: totalAmount,
        advanceAmount: 0,
        remainingBalance: totalAmount,
        bookingStatus: initialStatus
      });

      navigate(`/booking/submitted?ref=${newBooking.id}&hall=${selectedHall.id}`);
    } catch (err: unknown) {
      const e = err as Error;
      setAvailabilityError(e.message || 'Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 max-w-6xl mx-auto px-6 w-full animate-fade-in">
      <div className="flex items-center justify-between mb-12 border-b border-stone-200 pb-8 max-w-4xl mx-auto">
        {[{ label: 'Hall', done: true }, { label: 'Package', done: true }, { label: 'Review & Submit', done: false }].map((step, i, arr) => (
          <React.Fragment key={step.label}>
            <div className={`flex items-center space-x-3 font-bold ${step.done ? 'text-luxury-emerald-950' : 'text-luxury-gold-700'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.done ? 'bg-luxury-emerald-100' : 'border-2 border-luxury-gold-500'}`}>
                {step.done ? <Check size={16} /> : i + 1}
              </div>
              <span className="text-sm hidden sm:inline">{step.label}</span>
            </div>
            {i < arr.length - 1 && <div className={`flex-1 h-0.5 mx-4 ${step.done ? 'bg-luxury-emerald-950' : 'bg-stone-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl font-semibold text-luxury-emerald-950 mb-2">Review & Submit Booking</h1>
        <p className="text-stone-500">Please review your selections and confirm the event details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 animate-slide-up">
          <form onSubmit={handleBookingSubmission} className="space-y-8" autoComplete="off">
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 space-y-4">
              <h3 className="font-serif text-xl font-bold text-luxury-emerald-950 border-b border-stone-100 pb-3">Review Event Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm mb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1">Date</span>
                  <div className="font-bold text-luxury-emerald-950 flex items-center gap-2">
                    <Calendar size={14} className="text-luxury-gold-600" />
                    {eventDate ? new Date(eventDate).toLocaleDateString() : 'Not Set'}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1">Guests</span>
                  <div className="relative group">
                    <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gold-600 pointer-events-none" />
                    <input
                      type="number"
                      required
                      min="1"
                      max={selectedHall?.capacity || 1000}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-white border border-stone-200 rounded-lg pl-10 pr-4 py-2.5 text-sm font-bold text-luxury-emerald-950 focus:ring-2 focus:ring-luxury-emerald-100 focus:border-luxury-emerald-700 outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 mt-6 border-t border-stone-100 pt-6">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Event Type</label>
                  <div className="relative group">
                    <select
                      required
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-lg pl-4 pr-10 py-3 text-sm focus:ring-2 focus:ring-luxury-emerald-100 focus:border-luxury-emerald-700 outline-none transition-all appearance-none cursor-pointer group-hover:border-luxury-gold-400/50 shadow-sm"
                    >
                      <option value="" disabled>Select the type of event</option>
                      {activeEventTypes.map(type => (
                        <option key={type.id} value={type.name}>{type.name}</option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none group-hover:text-luxury-emerald-700 transition-colors" size={18} />
                  </div>
                  
                  {eventName === 'Other' && (
                    <div className="mt-3 animate-fade-in">
                      <input
                        type="text"
                        required
                        value={customEventName}
                        onChange={(e) => setCustomEventName(e.target.value)}
                        placeholder="Please specify your event type"
                        className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-luxury-emerald-100 focus:border-luxury-emerald-700 outline-none transition-all shadow-sm"
                      />
                    </div>
                  )}
                </div>
            </div>

            {availabilityError && (
              <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <span className="text-sm">{availabilityError}</span>
              </div>
            )}

            {/* Download Quotation — client-side only, no Firestore write */}
            <button
              type="button"
              onClick={() => {
                if (!selectedHall || !selectedPackage) return;
                quotationService.generateQuotation({
                  customerName: user?.displayName || user?.email?.split('@')[0] || 'Valued Customer',
                  customerEmail: user?.email || '',
                  customerPhone: '',
                  hallName: selectedHall.hallName,
                  hallPrice: hallPrice,
                  packageName: selectedPackage.packageName,
                  packageDescription: selectedPackage.notes,
                  packagePrice: packagePrice,
                  packagePricePerPerson: packagePricePerPerson,
                  eventDate: eventDate || undefined,
                  guestCount: guestCount || undefined,
                  eventType: eventName === 'Other' && customEventName ? customEventName : (eventName || undefined),
                  hotelServices: hotelExtraServicesList.map(s => ({ name: s?.serviceName || '', price: s?.price || 0 })),
                  externalVendors: externalVendorsList,
                });
              }}
              className="w-full bg-white border-2 border-luxury-emerald-950 text-luxury-emerald-950 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-luxury-emerald-50 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <FileText size={18} />
              Download Quotation PDF
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-luxury-emerald-950 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-luxury-emerald-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:active:scale-100"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              Confirm Booking Request
            </button>
          </form>
        </div>

        <div className="lg:col-span-1 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="sticky top-32 space-y-4">
            <CostBreakdown
              hallName={selectedHall?.hallName || ''}
              hallPrice={hallPrice}
              packageName={selectedPackage?.packageName || ''}
              packagePrice={packagePrice}
              packagePricePerPerson={packagePricePerPerson}
              guestCount={guestCount}
              hotelServices={hotelExtraServicesList.map(s => ({ name: s?.serviceName || '', price: s?.price || 0 }))}
            />
            {externalVendorsList.length > 0 && (
              <div className="bg-white border border-stone-200 rounded-xl p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold-400 inline-block" />
                  Customer Own Vendors
                </p>
                <ul className="space-y-2">
                  {externalVendorsList.map((ext: ExternalVendor, idx: number) => (
                    <li key={idx} className="bg-stone-50 rounded-lg p-3 border border-stone-100">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-luxury-emerald-700">{ext.serviceType}</p>
                      <p className="font-bold text-stone-800 text-sm mt-0.5">{ext.vendorName}</p>
                      <p className="text-xs text-stone-500">{ext.contactNumber}</p>
                    </li>
                  ))}
                </ul>
                <p className="text-[9px] text-stone-400 mt-3 italic">* Vendor costs are self-arranged and not included in the hotel bill.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
