import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useBookings } from '../../hooks/useBookings';
import { useHalls } from '../../hooks/useHalls';
import { useCatalog } from '../../hooks/useCatalog';
import { useToast } from '../../context/ToastContext';
import { Shield, Lock, Loader2, AlertCircle } from 'lucide-react';
import PayHereButton from '../../components/PayHereButton';
import PaymentStatus from '../../components/PaymentStatus';
import CostBreakdown from '../../components/CostBreakdown';
import { paymentService } from '../../services/paymentService';
import { emailNotificationService } from '../../services/emailNotificationService';
import type { Payment as PaymentType } from '../../types/app';

export default function Payment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isFinalPayment = queryParams.get('type') === 'final';
  
  const { bookings, loading } = useBookings();
  const { halls } = useHalls();
  const { packages, services } = useCatalog();
  const booking = bookings.find(b => b.id === id) || null;
  const { showToast } = useToast();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [existingPayment, setExistingPayment] = useState<PaymentType | null>(null);

  useEffect(() => {
    const checkExistingPayment = async () => {
      if (booking?.id) {
        try {
          const payments = await paymentService.getPaymentByBookingId(booking.id);
          const targetPaymentType = isFinalPayment ? 'Final' : 'Advance';
          const relevantPayment = payments.find(p => p.paymentType === targetPaymentType);
          
          if (relevantPayment) {
            setExistingPayment(relevantPayment);
            setPaymentSuccess(true);
          }
        } catch (error) {
          console.error("Error checking payments:", error);
        }
      }
    };
    checkExistingPayment();
  }, [booking?.id, isFinalPayment]);

  const handlePayHereSuccess = async (orderId: string) => {
    if (!booking) return;
    setIsProcessing(true);
    
    try {
      const amount = isFinalPayment ? (booking.totalAmount * 0.8) : (booking.totalAmount * 0.2);
      const paymentType: PaymentType['paymentType'] = isFinalPayment ? 'Final' : 'Advance';

      await paymentService.createPayment(
        booking.id,
        booking.customerId,
        amount,
        paymentType,
        'Card', // Log as a Card payment logically for the DB
        orderId // Pass the PayHere order ID as transaction ID
      );
      setPaymentSuccess(true);
      showToast("Payment processed successfully via PayHere.", "success");

      // Send Email Notification (non-blocking)
      emailNotificationService.sendPaymentReceivedEmail(booking, amount, orderId);

    } catch (err) {
      console.error("Payment failed", err);
      showToast("Payment saving failed. Please contact support.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayHereDismissed = () => {
    showToast("Payment cancelled. You can try again when ready.", "info");
    setIsProcessing(false);
  };

  const handlePayHereError = (error: string) => {
    console.error("PayHere Error:", error);
    showToast("Payment gateway error. Please try again.", "error");
    setIsProcessing(false);
  };

  if (loading || !booking) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center h-64 gap-4 text-stone-400">
        <Loader2 size={36} className="animate-spin text-luxury-emerald-700" />
        <p className="text-sm font-semibold">Loading payment details…</p>
      </div>
    );
  }

  if (booking.bookingStatus !== 'APPROVED' && booking.bookingStatus !== 'CONFIRMED') {
    return (
      <div className="pt-32 flex flex-col items-center justify-center h-64 gap-4 text-stone-400">
        <AlertCircle size={36} className="text-amber-500" />
        <p className="text-sm font-semibold">This booking is not approved for payment yet.</p>
      </div>
    );
  }

  // Calculate amounts
  const advanceAmount = booking.totalAmount * 0.2;
  const displayAmount = isFinalPayment ? (booking.totalAmount * 0.8) : advanceAmount;

  return (
    <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-16 w-full animate-fade-in font-sans">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="font-serif text-4xl font-semibold text-luxury-emerald-950 mb-2">
          {isFinalPayment ? "Secure Final Balance Payment" : "Secure Advance Payment"}
        </h1>
        <p className="text-stone-500 text-lg">
          {isFinalPayment 
            ? "Please complete your remaining 80% balance payment to finalize your booking." 
            : "Please complete your 20% advance payment to secure your booking date."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          {/* Cost Breakdown Card */}
          {(() => {
            const hallObj = halls.find(h => h.id === booking.hallId);
            const pkgObj = packages.find(p => p.id === booking.packageId);
            const hotelSvcs = (booking.hotelExtraServices || [])
              .map(sid => services.find(s => s?.id === sid))
              .filter(Boolean)
              .map(s => ({ name: s!.serviceName, price: s!.price }));
            return (
              <CostBreakdown
                hallName={hallObj?.hallName || booking.hallId}
                hallPrice={booking.hallPrice || hallObj?.basePrice || 0}
                packageName={pkgObj?.packageName || booking.packageId}
                packagePrice={booking.packagePrice || pkgObj?.packagePrice || 0}
                hotelServices={hotelSvcs}
                paymentStatus={booking.paymentStatus}
              />
            );
          })()}

          {/* Trust Indicator */}
          <div className="p-6 rounded-xl border border-stone-200 bg-white flex items-center gap-4">
            <div className="bg-luxury-emerald-950 text-white w-12 h-12 rounded-full flex items-center justify-center shrink-0">
              <Lock size={20} />
            </div>
            <div>
              <p className="font-bold text-luxury-emerald-950">Bank-Grade Encryption</p>
              <p className="text-stone-500 text-xs mt-1 leading-relaxed">Your transaction is protected by SSL 256-bit encryption and modern security protocols.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Payment Form or Status */}
        <div className="lg:col-span-7">
          <section className="bg-white border border-stone-200 rounded-xl p-8 md:p-12 shadow-sm">
            {paymentSuccess ? (
              <div className="flex flex-col gap-6">
                <PaymentStatus 
                  status="Paid" 
                  paidAmount={advanceAmount} 
                  remainingBalance={booking.totalAmount - advanceAmount} 
                  transactionId={existingPayment?.transactionId || "Processing..."} 
                />
                <button 
                  onClick={() => navigate(`/dashboard/booking/${booking.id}`)}
                  className="bg-luxury-emerald-950 text-white text-[10px] uppercase font-bold tracking-widest px-8 py-4 rounded-lg w-full hover:bg-luxury-emerald-900 transition-colors shadow-sm"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="font-serif text-3xl font-bold text-luxury-emerald-950 mb-2">Card Details</h2>
                  <p className="text-stone-500 text-sm">Enter your credit or debit card information below.</p>
                </div>
                
                <PayHereButton
                  merchantId="1236849"
                  merchantSecret="MTg0OTk4Nzg3NjI5MzMxODczODAyMTEwMTk2MjMwMTE1MTg0MDU2MQ=="
                  orderId={isFinalPayment ? `FIN-${booking.id}` : `ADV-${booking.id}`}
                  amount={displayAmount}
                  currency="LKR"
                  items={`${booking.eventName} - ${isFinalPayment ? 'Final Balance' : 'Advance Payment'}`}
                  firstName={booking.customerName.split(' ')[0] || 'Customer'}
                  lastName={booking.customerName.split(' ').slice(1).join(' ') || 'Name'}
                  email={booking.email}
                  phone={booking.phone || '0000000000'}
                  address="Camilla Banquet Hall"
                  city="Colombo"
                  country="Sri Lanka"
                  onSuccess={handlePayHereSuccess}
                  onDismissed={handlePayHereDismissed}
                  onError={handlePayHereError}
                  isProcessing={isProcessing}
                />
              </>
            )}

            <div className="mt-12 flex justify-center items-center gap-8 opacity-40 grayscale">
              <img alt="Visa" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpny9Pkv0_Pi4D6TkJYYq3I8hjHI39LRaaebL7JtTG6Ov6Io74U0MlAM-EH2A1H_d31enWat2lGh5v09lCzxMC-SAHlthoMNJWahsXCMoX246XKS3Zqn65w9bCOyDH4fBotul_eQoXlEpvbndPuPKn28Rv4tyrez0QcpIQ-n5BxRwIOwy3Gq6XFg7tdIsRol6QQ8oTmUGmvcyKj7uQJcQOvYYH7cs2hHKfDZpoA9YJbI8Ttk9fgjfJ_7DWYv7aOpcQ_v3M3a3Z7ota" />
              <img alt="Mastercard" className="h-8" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLhlzh8gKaC7j9eWT_I9i_Ip69Kt3vwxOG4NIybZit-ksvut2EUo6YB58qLYxd8xrIUsGBKkpBfh3sQKoyW7YqrEfLXwN1WpyPLn7CWi14xQ3fTD8LxD18VPvAAQ8xMPiR-EyYHhHqkIXjwSg-sLh5V1u8xxJRo8kI0_RDl9WiA0y9aCo6fS8zaXU4KdgnwTvKcd7nqmiTDcHKqvW1WbNzpnFg1wzze8A5odHRDilCoUG9z7A0fMfRWbYEShedt0DbPm8-NFk3PLMY" />
            </div>
          </section>
        </div>
      </div>

      {/* Payment Success Modal */}
      {paymentSuccess && !existingPayment && (
        <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in p-6">
          <div className="bg-white p-10 rounded-2xl max-w-lg w-full text-center shadow-2xl scale-in">
            <div className="w-20 h-20 bg-luxury-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield size={40} className="text-luxury-emerald-700" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-luxury-emerald-950 mb-3">Payment Successful</h2>
            <p className="text-stone-500 mb-8 text-sm leading-relaxed">
              Your payment of <span className="font-bold text-luxury-emerald-950">LKR {displayAmount.toLocaleString()}</span> has been processed securely. 
              {isFinalPayment ? " Your booking is now fully confirmed and fully paid." : " Your booking advance is paid."}
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-luxury-emerald-950 text-white text-[10px] uppercase font-bold tracking-widest px-8 py-4 rounded-lg w-full hover:bg-luxury-emerald-900 transition-colors"
            >
              RETURN TO DASHBOARD
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
