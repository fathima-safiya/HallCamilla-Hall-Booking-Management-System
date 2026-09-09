import { useParams, Link } from 'react-router-dom';
import { Calendar, ChevronLeft, Download, Printer, AlertTriangle, CheckCircle, Loader2, Star } from 'lucide-react';
import { useBookings } from '../../hooks/useBookings';
import { useHalls } from '../../hooks/useHalls';
import { useCatalog } from '../../hooks/useCatalog';
import { useState } from 'react';
import CancellationRequestModal from './components/CancellationRequest';
import ReviewForm from './components/ReviewForm';
import { receiptService } from '../../services/receiptService';
import CostBreakdown from '../../components/CostBreakdown';

export default function BookingDetails() {
  const { id } = useParams();
  const { bookings, loading: bookingsLoading } = useBookings();
  const { halls } = useHalls();
  const { packages, services, loading: catalogLoading } = useCatalog();

  const booking = bookings.find(b => b.id === id);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const printInvoice = () => {
    window.print();
  };

  if (bookingsLoading || catalogLoading) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center h-64 gap-4 text-stone-400">
        <Loader2 size={36} className="animate-spin text-luxury-emerald-700" />
        <p className="text-sm font-semibold">Loading booking details…</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="pt-32 pb-24 max-w-4xl mx-auto px-6 text-center animate-fade-in">
        <div className="w-16 h-16 bg-red-50 text-red-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} />
        </div>
        <h2 className="font-serif text-2xl font-bold text-luxury-emerald-950">Booking Not Found</h2>
        <p className="text-stone-500 mt-2 text-sm">The requested reference {id} does not exist.</p>
        <Link to="/dashboard" className="mt-8 inline-block px-6 py-3 bg-luxury-emerald-950 text-white font-bold tracking-wider text-xs rounded hover:bg-luxury-emerald-900 transition-colors uppercase">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const hallObj = halls.find(h => h.id === booking.hallId);
  const pkgObj = packages.find(p => p.id === booking.packageId);
  const hotelExtraServicesList = booking.hotelExtraServices?.map(sid => services.find(s => s?.id === sid)).filter(Boolean) || [];
  const externalVendorsList = booking.externalVendors || [];
  const externalServicesList = booking.externalServices || []; // Legacy
  const legacyExtraServicesList = booking.selectedServices?.map(sid => services.find(s => s?.id === sid)).filter(Boolean) || [];
  const displayHotelServices = hotelExtraServicesList.length > 0 ? hotelExtraServicesList : legacyExtraServicesList;

  const isApproved = ['APPROVED', 'CONFIRMED', 'COMPLETED'].includes(booking.bookingStatus);
  const isConfirmed = ['CONFIRMED', 'COMPLETED'].includes(booking.bookingStatus);
  const isRejected = booking.bookingStatus === 'REJECTED';
  const isCancelled = booking.bookingStatus === 'CANCELLED';

  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-6 w-full animate-fade-in print:pt-6 print:pb-0">
      
      {/* Status Timeline */}
      <div className="mb-8 bg-white rounded-xl border border-stone-200 p-6 print:hidden">
        <h3 className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-6">Booking Progress</h3>
        <div className="flex items-start justify-between gap-2">
          {/* Step 1: Submitted */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-luxury-emerald-950`}>
              <CheckCircle size={18} className="text-luxury-gold-400" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-center text-luxury-emerald-950">Submitted</p>
            <p className="text-[9px] text-stone-400">Done</p>
          </div>
          
          <div className={`flex-1 mt-5 h-0.5 rounded-full ${isApproved || isRejected ? 'bg-luxury-gold-400' : 'bg-stone-200'}`} />

          {/* Step 2: Approval */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isApproved ? 'bg-luxury-emerald-950' : 
              isRejected ? 'bg-red-100 border-2 border-red-300' : 
              'border-2 border-stone-300 bg-stone-50'
            }`}>
              {isRejected ? (
                <AlertTriangle size={18} className="text-red-600" />
              ) : isApproved ? (
                <CheckCircle size={18} className="text-luxury-gold-400" />
              ) : (
                <span className="text-xs font-bold text-stone-400">2</span>
              )}
            </div>
            <p className={`text-[10px] font-bold uppercase tracking-wide text-center ${
              isRejected ? 'text-red-600' : isApproved ? 'text-luxury-emerald-950' : 'text-stone-400'
            }`}>
              {isRejected ? 'Rejected' : isApproved ? 'Approved' : 'Admin Review'}
            </p>
            <p className="text-[9px] text-stone-400">
              {isRejected ? 'Request Denied' : isApproved ? 'Approved' : 'Awaiting Review'}
            </p>
          </div>

          <div className={`flex-1 mt-5 h-0.5 rounded-full ${isConfirmed ? 'bg-luxury-gold-400' : 'bg-stone-200'}`} />

          {/* Step 3: Paid & Confirmed */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isConfirmed ? 'bg-luxury-gold-500' : 
              isCancelled ? 'bg-red-100 border-2 border-red-300' : 
              'border-2 border-stone-300 bg-stone-50'
            }`}>
              {isCancelled ? (
                <AlertTriangle size={18} className="text-red-600" />
              ) : isConfirmed ? (
                <CheckCircle size={18} className="text-white" />
              ) : (
                <span className="text-xs font-bold text-stone-400">3</span>
              )}
            </div>
            <p className={`text-[10px] font-bold uppercase tracking-wide text-center ${
              isCancelled ? 'text-red-600' : isConfirmed ? 'text-luxury-gold-700' : 'text-stone-400'
            }`}>
              {isCancelled ? 'Cancelled' : 'Confirmed'}
            </p>
            <p className="text-[9px] text-stone-400">
              {isCancelled ? 'Cancelled' : isConfirmed ? 'Paid & Confirmed' : 'Pending Payment'}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Action Bar */}
      {booking.bookingStatus === 'APPROVED' && booking.paymentStatus === 'Unpaid' && (
        <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-start gap-3">
            <CheckCircle size={24} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif font-bold text-luxury-emerald-950">Your Booking Request is Approved!</h4>
              <p className="text-xs text-stone-600 mt-0.5">Please pay the 20% advance amount to secure the date and finalize your booking.</p>
            </div>
          </div>
          <Link
            to={`/booking/payment/${booking.id}`}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-luxury-gold-500 text-luxury-emerald-950 font-extrabold text-xs uppercase tracking-widest rounded shadow-md hover:-translate-y-0.5 transition-all text-center"
          >
            Proceed to Payment
          </Link>
        </div>
      )}

      {/* Remaining Balance Action Bar */}
      {['APPROVED', 'CONFIRMED'].includes(booking.bookingStatus) && booking.paymentStatus === 'Advance Paid' && (
        <div className="mb-8 p-6 bg-sky-50 border border-sky-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle size={24} className="text-sky-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif font-bold text-luxury-emerald-950">Advance Payment Received</h4>
              <p className="text-xs text-stone-600 mt-0.5">You can pay your remaining balance of LKR {(booking.totalAmount * 0.8).toLocaleString()} online now, or pay at the hotel on the event date.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              to={`/booking/payment/${booking.id}?type=final`}
              className="px-6 py-3 bg-luxury-emerald-950 text-white font-extrabold text-xs uppercase tracking-widest rounded shadow-md hover:-translate-y-0.5 hover:bg-luxury-emerald-900 transition-all text-center"
            >
              Pay Balance Online
            </Link>
          </div>
        </div>
      )}

      <div className="mb-8 print:hidden flex justify-between items-center">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-500 bg-white hover:bg-luxury-emerald-950 hover:text-white hover:border-luxury-emerald-950 border border-stone-200 active:bg-luxury-emerald-900 active:border-luxury-emerald-900 px-4 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md group">
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          BACK TO DASHBOARD
        </Link>
        
        {['PENDING', 'APPROVED', 'CONFIRMED'].includes(booking.bookingStatus) && (
          <button 
            onClick={() => setShowCancellationModal(true)}
            className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700 bg-red-50 px-4 py-2 rounded-lg transition-colors border border-red-100"
          >
            Request Cancellation
          </button>
        )}
        
        {booking.bookingStatus === 'COMPLETED' && (
          <button 
            onClick={() => setShowReviewModal(true)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-luxury-emerald-950 bg-luxury-gold-400 hover:bg-luxury-gold-500 px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <Star size={16} className="fill-luxury-emerald-950" />
            Leave a Review
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden print:border-0 print:shadow-none">
        
        {/* Header */}
        <div className="bg-luxury-emerald-950 text-white p-8 sm:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 print:bg-stone-50 print:text-stone-900 print:border-b print:border-stone-200">
          <div>
            <h1 className="font-serif text-3xl font-bold mb-2 print:text-xl">Booking Summary</h1>
            <p className="text-luxury-gold-400 font-mono tracking-widest text-sm print:text-stone-600">REF: {booking.id}</p>
          </div>
          <div className="flex gap-3 print:hidden">
            <button 
              onClick={printInvoice}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors" 
              aria-label="Print"
            >
              <Printer size={18} />
            </button>
            <button 
              onClick={() => {
                const hallName = hallObj?.hallName || booking.hallId;
                const packageName = pkgObj?.packageName || booking.packageId;
                const servicesNames = displayHotelServices.map(s => s?.serviceName).filter(Boolean) as string[];
                const externalServicesNames = [
                  ...externalVendorsList.map((ext: any) => ext.serviceType || ext).filter(Boolean),
                  ...externalServicesList.map((ext: any) => ext.serviceName || ext).filter(Boolean)
                ] as string[];
                receiptService.generateReceipt(booking, hallName, packageName, servicesNames, externalServicesNames);
              }}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors" 
              aria-label="Download PDF"
            >
              <Download size={18} />
            </button>
          </div>
        </div>

        <div className="p-8 sm:px-12">
          
          <div className="grid md:grid-cols-2 gap-10 mb-12">
            <div>
              <h3 className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-3">Event Details</h3>
              <p className="font-serif text-xl font-bold text-luxury-emerald-950 mb-1">{booking.eventName}</p>
              <p className="text-sm font-medium text-stone-800 mb-1">Hall: {hallObj?.hallName || booking.hallId}</p>
              <p className="text-sm text-stone-600 mb-2">Package: {pkgObj?.packageName || booking.packageId}</p>
              <div className="flex items-center text-stone-600 text-sm mb-4">
                <Calendar size={14} className="mr-2 text-luxury-gold-600" />
                {booking.eventDate} ({booking.guestCount} guests)
              </div>
              <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                booking.bookingStatus === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                booking.bookingStatus === 'APPROVED' ? 'bg-amber-100 text-amber-800 animate-pulse font-bold' :
                booking.bookingStatus === 'REJECTED' ? 'bg-red-100 text-red-700 font-bold' :
                booking.bookingStatus === 'PENDING' ? 'bg-stone-100 text-stone-600' :
                booking.bookingStatus === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                booking.bookingStatus === 'COMPLETED' ? 'bg-stone-100 text-stone-700' :
                'bg-stone-100 text-stone-700'
              }`}>
                Status: {booking.bookingStatus}
              </span>
            </div>
            <div>
              <h3 className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-3">Customer Information</h3>
              <p className="font-bold text-stone-800 mb-1">{booking.customerName}</p>
              <p className="text-stone-600 text-sm mb-1">{booking.email}</p>
              <p className="text-stone-600 text-sm">{booking.phone}</p>
            </div>
          </div>

          <table className="w-full text-left mb-12">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="py-4 text-[10px] uppercase font-bold text-stone-400 tracking-wider">Description</th>
                <th className="py-4 text-[10px] uppercase font-bold text-stone-400 tracking-wider text-right">Amount (LKR)</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-stone-100">
                <td className="py-4 font-bold text-stone-800">
                  Hall Reservation Base Price
                  <span className="block text-stone-500 font-normal text-xs mt-1">{hallObj?.hallName || 'Hall Venue'}</span>
                </td>
                <td className="py-4 text-right font-medium">LKR {(booking.hallPrice || hallObj?.basePrice || 0).toLocaleString()}</td>
              </tr>
              <tr className="border-b border-stone-100">
                <td className="py-4 font-bold text-stone-800">
                  Package Cost
                  <span className="block text-stone-500 font-normal text-xs mt-1">{pkgObj?.packageName || 'Base Package'}</span>
                </td>
                <td className="py-4 text-right font-medium">LKR {(booking.packagePrice || pkgObj?.packagePrice || 0).toLocaleString()}</td>
              </tr>
              {displayHotelServices.length > 0 && (
                <>
                  <tr className="bg-stone-50/50">
                    <td colSpan={2} className="py-2 px-2 text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                      Selected Hotel Services
                    </td>
                  </tr>
                  {displayHotelServices.map((srv) => (
                    <tr key={srv?.id} className="border-b border-stone-100">
                      <td className="py-3 pl-4 text-stone-700">
                        {srv?.serviceName}
                        <span className="block text-stone-400 text-[10px] mt-0.5">{srv?.category}</span>
                      </td>
                      <td className="py-3 text-right font-medium text-stone-700">LKR {srv?.price.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="border-b border-stone-100 font-semibold">
                    <td className="py-3 pl-4 text-stone-800">Hotel Services Subtotal</td>
                    <td className="py-3 text-right">LKR {booking.extraServicesPrice?.toLocaleString()}</td>
                  </tr>
                </>
              )}
              {externalVendorsList.length > 0 && (
                <>
                  <tr className="bg-stone-50/50">
                    <td colSpan={2} className="py-2 px-2 text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                      Customer Own Vendors (Self-Arranged)
                    </td>
                  </tr>
                  {externalVendorsList.map((ext: any, idx: number) => (
                    <tr key={`v-${idx}`} className="border-b border-stone-100">
                      <td colSpan={2} className="py-3 pl-4 text-stone-700">
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2 font-semibold">
                            <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold-400"></div>
                            <span className="text-luxury-emerald-900">{ext.serviceType}</span>
                          </div>
                          {ext.vendorName && (
                            <div className="text-sm font-bold text-stone-800 ml-3.5 mt-1">
                              {ext.vendorName}
                            </div>
                          )}
                          <div className="text-xs text-stone-500 ml-3.5 mt-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                            {ext.contactNumber && <div><span className="font-semibold text-stone-600">Contact:</span> {ext.contactNumber}</div>}
                            {ext.businessName && <div><span className="font-semibold text-stone-600">Business:</span> {ext.businessName}</div>}
                          </div>
                          {ext.notes && (
                            <div className="text-xs text-stone-500 ml-3.5 mt-2 italic">
                              Notes: {ext.notes}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              )}
              {externalServicesList.length > 0 && (
                <>
                  <tr className="bg-stone-50/50">
                    <td colSpan={2} className="py-2 px-2 text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                      External Vendors (Legacy)
                    </td>
                  </tr>
                  {externalServicesList.map((ext: any, idx: number) => (
                    <tr key={`s-${idx}`} className="border-b border-stone-100">
                      <td colSpan={2} className="py-3 pl-4 text-stone-700">
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2 font-semibold">
                            <div className="w-1.5 h-1.5 rounded-full bg-stone-300"></div>
                            <span className="text-stone-600">{ext.serviceName || ext}</span>
                          </div>
                          {ext.vendorName && (
                            <div className="text-sm font-bold text-stone-500 ml-3.5 mt-1">
                              {ext.vendorName}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>

          {/* Cost Breakdown Summary Card (screen only) */}
          <div className="mt-8 print:hidden">
            <CostBreakdown
              hallName={hallObj?.hallName || booking.hallId}
              hallPrice={booking.hallPrice || hallObj?.basePrice || 0}
              packageName={pkgObj?.packageName || booking.packageId}
              packagePrice={booking.packagePrice || pkgObj?.packagePrice || 0}
              hotelServices={displayHotelServices.map(s => ({ name: s?.serviceName || '', price: s?.price || 0 }))}
              discount={booking.promoDiscount}
              paymentStatus={booking.paymentStatus}
            />
          </div>

          {/* Print-only totals (keep for invoice printing) */}
          <div className="hidden print:flex flex-col items-end mt-8">
            <div className="w-full sm:w-1/2">
              <div className="flex justify-between items-center py-4 border-t border-stone-200 font-bold text-xl">
                <span className="text-luxury-emerald-950">Grand Total</span>
                <span className="text-luxury-gold-700">LKR {booking.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm text-stone-600">
                <span>Advance (20%)</span>
                <span className="font-semibold">LKR {(booking.totalAmount * 0.2).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-bold border-t border-stone-100 mt-1">
                <span>Remaining Balance (80%)</span>
                <span>LKR {(booking.totalAmount * 0.8).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-stone-50 border border-stone-200 rounded-lg p-6 print:hidden">
            <h4 className="font-serif font-bold text-luxury-emerald-950 mb-3 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              Cancellation Policy
            </h4>
            <ul className="text-sm text-stone-600 space-y-2">
              <li>• Cancellations made 30 days before the event will receive a full refund of the advance.</li>
              <li>• Cancellations made within 30 days of the event may forfeit the advance payment.</li>
              <li>• You can request a cancellation directly from your Booking Dashboard using the "Request Cancellation" button above.</li>
            </ul>
          </div>

        </div>
      </div>

      {showCancellationModal && (
        <CancellationRequestModal
          bookingId={booking.id}
          customerId={booking.customerId}
          onClose={() => setShowCancellationModal(false)}
          onSuccess={() => setShowCancellationModal(false)}
        />
      )}

      {showReviewModal && (
        <ReviewForm
          bookingId={booking.id}
          hallId={booking.hallId}
          customerId={booking.customerId}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => setShowReviewModal(false)}
        />
      )}
    </div>
  );
}
