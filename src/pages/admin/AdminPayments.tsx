import { useState, useEffect, useMemo } from 'react';
import { PlusCircle, DollarSign, Clock, RefreshCw, TrendingUp, Search, Filter, ChevronLeft, ChevronRight, CreditCard, Loader2 } from 'lucide-react';
import { paymentService } from '../../services/paymentService';
import { useBookings } from '../../hooks/useBookings';
import { useNavigate } from 'react-router-dom';
import type { Payment } from '../../types/app';

export default function AdminPayments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const { bookings, loading: loadingBookings } = useBookings();
  const [filter, setFilter] = useState<'All' | 'Paid' | 'Pending' | 'Failed'>('All');

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const data = await paymentService.getAllPayments();
        setPayments(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (error) {
        console.error("Error loading payments:", error);
      } finally {
        setLoadingPayments(false);
      }
    };
    loadPayments();
  }, []);

  const handleMarkBalancePaid = async (bookingId: string, customerId: string, totalAmount: number, advanceAmount: number) => {
    if (!window.confirm("Are you sure you want to mark the remaining balance as paid (Cash/Card)?")) return;
    try {
      const remainingBalance = totalAmount - advanceAmount;
      await paymentService.createPayment(
        bookingId,
        customerId,
        remainingBalance,
        'Final',
        'Cash' // Defaulting to Cash for manual admin entry
      );
      // Reload payments
      const data = await paymentService.getAllPayments();
      setPayments(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error("Error recording offline payment:", error);
      alert("Failed to record payment.");
    }
  };

  const filteredPayments = useMemo(() => {
    if (filter === 'All') return payments;
    return payments.filter(p => p.paymentStatus === filter);
  }, [payments, filter]);

  if (loadingPayments || loadingBookings) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center h-64 gap-4 text-stone-400">
        <Loader2 size={36} className="animate-spin text-luxury-emerald-700" />
        <p className="text-sm font-semibold">Loading payments…</p>
      </div>
    );
  }
  return (
    <div className="space-y-8 animate-fade-in w-full pb-12">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-luxury-emerald-950">Payment Tracking</h2>
          <p className="text-stone-500 mt-2 text-sm">Real-time oversight of banquet revenues and financial transactions.</p>
        </div>
        <button onClick={() => navigate('/availability')} className="bg-luxury-emerald-950 text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-luxury-emerald-900 transition-all active:scale-95 shadow-md">
          <PlusCircle size={18} />
          New Booking
        </button>
      </header>

      {/* Summary Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-stone-200 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-luxury-emerald-50 text-luxury-emerald-950 rounded-lg">
              <DollarSign size={24} />
            </div>
            <span className="text-luxury-gold-600 font-bold text-[11px] uppercase tracking-wider bg-luxury-gold-50 px-2 py-1 rounded">+12.5%</span>
          </div>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Total Revenue</p>
          <h3 className="font-serif text-3xl font-bold text-luxury-emerald-950">LKR 428,500,000</h3>
        </div>

        <div className="bg-white border border-stone-200 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-stone-100 text-stone-600 rounded-lg">
              <Clock size={24} />
            </div>
            <span className="text-stone-500 font-bold text-[11px] uppercase tracking-wider bg-stone-100 px-2 py-1 rounded">Active</span>
          </div>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Pending Payments</p>
          <h3 className="font-serif text-3xl font-bold text-luxury-emerald-950">LKR 84,200,000</h3>
        </div>

        <div className="bg-white border border-stone-200 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <RefreshCw size={24} />
            </div>
            <span className="text-red-600 font-bold text-[11px] uppercase tracking-wider bg-red-50 px-2 py-1 rounded">-2.1%</span>
          </div>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Refunds</p>
          <h3 className="font-serif text-3xl font-bold text-luxury-emerald-950">LKR 12,450,000</h3>
        </div>
      </section>

      {/* Secondary Section: Revenue Trend & Filters */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white border border-stone-200 p-8 rounded-xl min-h-[300px] flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-serif text-2xl font-bold text-luxury-emerald-950">Revenue Trend</h4>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-luxury-emerald-50 text-luxury-emerald-950 font-bold text-[10px] uppercase tracking-widest rounded cursor-pointer">7 DAYS</span>
              <span className="px-3 py-1 bg-stone-100 text-stone-500 font-bold text-[10px] uppercase tracking-widest rounded cursor-pointer hover:bg-stone-200 transition-colors">30 DAYS</span>
            </div>
          </div>
          
          <div className="relative h-48 w-full flex items-end gap-1">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
              <div className="border-b border-luxury-emerald-950 w-full"></div>
              <div className="border-b border-luxury-emerald-950 w-full"></div>
              <div className="border-b border-luxury-emerald-950 w-full"></div>
            </div>
            {[40, 55, 45, 70, 65, 85, 95].map((height, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-luxury-emerald-50 to-luxury-emerald-800 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${height}%` }}></div>
            ))}
          </div>
        </div>
        
        <div className="bg-luxury-gold-50 border border-luxury-gold-200 p-8 rounded-xl overflow-hidden relative shadow-sm">
          <div className="relative z-10">
            <h4 className="font-serif text-2xl font-bold text-luxury-emerald-950 mb-4 flex items-center gap-2">
              <TrendingUp size={24} className="text-luxury-gold-600" />
              Financial Insight
            </h4>
            <p className="text-sm text-stone-600 mb-6 leading-relaxed">
              Your collection rate is <strong className="text-luxury-emerald-950">15% higher</strong> than the same period last quarter. Consider automating final balance reminders for the upcoming wedding season peak.
            </p>
            <button onClick={() => navigate('/admin/reports')} className="text-[10px] font-bold uppercase tracking-widest text-luxury-emerald-950 border-b border-luxury-emerald-950 pb-1 hover:text-luxury-gold-600 hover:border-luxury-gold-600 transition-colors z-20 relative">
              Download Report
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-luxury-gold-400/20 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Detailed Transaction Table */}
      <section className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm mb-8">
        <div className="p-6 border-b border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-50/50">
          <h4 className="font-serif text-2xl font-bold text-luxury-emerald-950">Transaction History</h4>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input 
                className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-luxury-emerald-100 focus:border-luxury-emerald-800 outline-none" 
                placeholder="Search by ID or Customer..." 
                type="text" 
              />
            </div>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value as any)}
              className="p-2 border border-stone-200 rounded-lg bg-white hover:bg-stone-50 transition-colors text-stone-600 outline-none"
            >
              <option value="All">All</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-500">Transaction ID</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-500">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-500">Customer</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-500">Payment Type</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-500">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-500">Method</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-500">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredPayments.length > 0 ? filteredPayments.map((trx) => {
                const booking = bookings.find(b => b.id === trx.bookingId);
                const customerName = booking?.customerName || 'Unknown Customer';
                const initials = customerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                const isPaid = trx.paymentStatus === 'Paid';

                return (
                  <tr key={trx.id} className="hover:bg-stone-50 transition-colors group">
                    <td className="px-6 py-4 text-xs font-mono font-bold text-luxury-emerald-950">{trx.transactionId}</td>
                    <td className="px-6 py-4 text-sm text-stone-500">{new Date(trx.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-luxury-gold-100 flex items-center justify-center text-[10px] font-bold text-luxury-gold-800">
                          {initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-luxury-emerald-950">{customerName}</span>
                          <span className="text-xs text-stone-400 font-mono">{trx.bookingId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-[10px] font-bold uppercase tracking-widest">{trx.paymentType}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-sm text-luxury-emerald-950">LKR {trx.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-stone-500 text-sm">
                        <CreditCard size={16} className="text-stone-400" />
                        <span>{trx.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${isPaid ? 'text-luxury-emerald-700' : trx.paymentStatus === 'Failed' ? 'text-red-600' : 'text-amber-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-luxury-emerald-700 animate-pulse' : trx.paymentStatus === 'Failed' ? 'bg-red-600' : 'bg-amber-500'}`}></span>
                        {trx.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {booking && booking.paymentStatus === 'Advance Paid' && trx.paymentType === 'Advance' && (
                        <button 
                          onClick={() => handleMarkBalancePaid(booking.id, booking.customerId, booking.totalAmount, booking.advanceAmount || (booking.totalAmount * 0.2))}
                          className="bg-luxury-emerald-950 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded hover:bg-luxury-emerald-900 transition-colors whitespace-nowrap"
                        >
                          Mark Balance Paid
                        </button>
                      )}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-stone-500 text-sm">No payments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 border-t border-stone-200 bg-stone-50/50 flex justify-between items-center">
          <span className="text-stone-500 text-[10px] font-bold uppercase tracking-wider">Showing {filteredPayments.length} transactions</span>
          <div className="flex gap-2">
            <button className="p-2 border border-stone-200 rounded-lg bg-white hover:bg-stone-100 disabled:opacity-50 text-stone-600" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="p-2 border border-stone-200 rounded-lg bg-white hover:bg-stone-100 text-stone-600">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
