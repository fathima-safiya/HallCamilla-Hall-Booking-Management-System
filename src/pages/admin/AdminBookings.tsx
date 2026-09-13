import { useState, Fragment } from 'react';
import { useBookings } from '../../hooks/useBookings';
import { useHalls } from '../../hooks/useHalls';
import { useCatalog } from '../../hooks/useCatalog';
import { ConfirmModal } from '../shared/components/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import CostBreakdown from '../../components/CostBreakdown';

import type { Booking } from '../../types/app';
import {
  Search, CheckCircle, XCircle, Loader2, Calendar, Users,
  AlertCircle, Trash2, X, Filter, CheckSquare, ChevronDown, ChevronUp
} from 'lucide-react';

const STATUS_STYLES: Record<Booking['bookingStatus'], string> = {
  PENDING:   'bg-stone-100 text-stone-600 border border-stone-300',
  APPROVED:  'bg-amber-100 text-amber-800 border border-amber-300',
  REJECTED:  'bg-red-100 text-red-700 border border-red-200',
  CONFIRMED: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  COMPLETED: 'bg-stone-100 text-stone-700 border border-stone-200',
  CANCELLED: 'bg-red-100 text-red-700 border border-red-200',
  CANCELLATION_REQUESTED: 'bg-orange-100 text-orange-800 border border-orange-300',
};

export default function AdminBookings() {
  const { bookings, loading, error, updateStatus, deleteBooking } = useBookings();
  const { halls } = useHalls();
  const { packages, services } = useCatalog();

  const staticPackages = [
    { id: 'silver-pkg', packageName: 'Silver Package' },
    { id: 'gold-pkg', packageName: 'Gold Package' },
    { id: 'platinum-pkg', packageName: 'Platinum Package' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [hallFilter, setHallFilter] = useState('ALL');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    type: 'approve' | 'reject' | 'complete' | 'cancel' | 'delete';
    bookingId: string;
  } | null>(null);
  const { showToast } = useToast();

  // Status count for quick-filter tabs
  const statusCounts = bookings.reduce((acc, b) => {
    acc[b.bookingStatus] = (acc[b.bookingStatus] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredBookings = bookings.filter(b => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (b.id || '').toLowerCase().includes(search) ||
      (b.customerName || '').toLowerCase().includes(search) ||
      (b.email || '').toLowerCase().includes(search) ||
      (b.eventName || '').toLowerCase().includes(search);
    const matchesStatus = statusFilter === 'ALL' || b.bookingStatus === statusFilter;
    const matchesHall = hallFilter === 'ALL' || b.hallId === hallFilter;
    return matchesSearch && matchesStatus && matchesHall;
  });

  const getHallName = (id: string) => halls.find(hall => hall.id === id)?.hallName || id;
  const getPackageName = (id: string) => staticPackages.find(pkg => pkg.id === id)?.packageName || id;

  const handleBookingStatusUpdate = async () => {
    if (!pendingAction) return;
    const { type, bookingId } = pendingAction;

    try {
      if (type === 'delete') {
        await deleteBooking(bookingId);
        showToast('Booking deleted.');
      } else {
        const statusMap: Record<Exclude<typeof type, 'delete'>, Booking['bookingStatus']> = {
          approve: 'APPROVED', reject: 'REJECTED', complete: 'COMPLETED', cancel: 'CANCELLED',
        };
        await updateStatus(bookingId, statusMap[type as Exclude<typeof type, 'delete'>]);
        
        // Trigger System Notification (handled in bookingService)
        showToast(`Booking ${type}d successfully.`);
      }
    } catch {
      showToast('Action failed. Please try again.', 'error');
    } finally {
      setPendingAction(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 text-stone-400">
        <Loader2 size={36} className="animate-spin text-luxury-emerald-700" />
        <p className="text-sm font-semibold">Loading bookings…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in w-full">

      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-luxury-emerald-950">Bookings Control Panel</h1>
        <p className="text-stone-500 text-sm mt-1">Review requests, approve bookings, and manage the full booking lifecycle.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 relative">
            <Search size={15} className="absolute left-3 top-3.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search by name, email, booking ID, event…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full border border-stone-200 rounded-lg pl-10 pr-4 py-3 text-xs bg-stone-50 focus:outline-none focus:border-luxury-gold-500 focus:bg-white"
            />
          </div>
          <div className="md:col-span-3">
            <select value={hallFilter} onChange={e => setHallFilter(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-3 text-xs text-stone-700 bg-stone-50 focus:outline-none">
              <option value="ALL">All Halls</option>
              {halls.map(h => <option key={h.id} value={h.id}>{h.hallName}</option>)}
            </select>
          </div>
          <div className="md:col-span-3">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-3 text-xs text-stone-700 bg-stone-50 focus:outline-none">
              <option value="ALL">All Statuses</option>
              {['PENDING', 'APPROVED', 'REJECTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick-filter tab bar */}
        <div className="flex gap-4 overflow-x-auto border-t border-stone-100 pt-3 text-[10px] uppercase font-bold tracking-wider text-stone-400">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`pb-1 border-b-2 transition-colors shrink-0 ${statusFilter === s ? 'border-luxury-gold-500 text-luxury-emerald-950' : 'border-transparent hover:text-stone-700'}`}>
              {s} ({s === 'ALL' ? bookings.length : statusCounts[s] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                <th className="p-4 pl-6 whitespace-nowrap">Booking ID</th>
                <th className="p-4 whitespace-nowrap">Customer</th>
                <th className="p-4 min-w-[200px]">Hall & Event</th>
                <th className="p-4 whitespace-nowrap">Date / Guests</th>
                <th className="p-4 whitespace-nowrap">Amount</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 text-right pr-6 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs text-stone-700 divide-y divide-stone-100">
              {filteredBookings.length > 0 ? (
                filteredBookings.map(booking => {
                  const hallObj = halls.find(h => h.id === booking.hallId);
                  const pkgObj = packages.find(p => p.id === booking.packageId);
                  const hotelSvcs = (booking.hotelExtraServices || [])
                    .map(sid => services.find(s => s?.id === sid))
                    .filter(Boolean)
                    .map(s => ({ name: s!.serviceName, price: s!.price }));
                  return (
                    <Fragment key={booking.id}>
                      <tr className="hover:bg-stone-50/60 transition-colors">
                        <td className="p-4 pl-6 whitespace-nowrap align-top">
                          <p className="font-mono font-bold text-luxury-gold-600">{booking.id}</p>
                          <p className="text-[9px] text-stone-400 mt-0.5">{new Date(booking.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="p-4 whitespace-nowrap align-top">
                          <p className="font-bold text-stone-800">{booking.customerName}</p>
                          <p className="text-[10px] text-stone-400 mt-0.5">{booking.email}</p>
                          <p className="text-[10px] text-stone-400">{booking.phone}</p>
                        </td>
                        <td className="p-4 align-top">
                          <p className="font-serif font-bold text-luxury-emerald-950">{getHallName(booking.hallId)}</p>
                          <p className="text-[10px] text-stone-500 mt-0.5">
                            {booking.eventType?.toLowerCase() === 'other' ? `Other - ${booking.otherEventType}` : booking.eventName}
                          </p>
                          <p className="text-[10px] text-stone-400">{getPackageName(booking.packageId)}</p>
                          {(Array.isArray(booking.externalVendors) && booking.externalVendors.length > 0) ? (
                            <div className="mt-2 pt-2 border-t border-stone-100">
                              <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold-400 inline-block"></span>
                                Customer External Vendors
                              </p>
                              <ul className="text-[9px] text-stone-500 space-y-0.5">
                                {booking.externalVendors.map((ext: any, idx: number) => (
                                  <li key={idx} className="flex flex-col border-b border-stone-200/50 pb-1.5 mb-1.5 last:border-0 last:pb-0 last:mb-0">
                                    <span className="font-bold text-luxury-emerald-950">{ext.serviceType}</span>
                                    {ext.vendorName && <span className="text-[9px] font-semibold text-stone-700">{ext.vendorName} {ext.contactNumber && `(${ext.contactNumber})`}</span>}
                                    {ext.businessName && <span className="text-[8px] text-stone-500 mt-0.5">Business: {ext.businessName}</span>}
                                    {ext.notes && <span className="text-[8px] text-stone-400 italic mt-0.5 line-clamp-2">Note: {ext.notes}</span>}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (Array.isArray(booking.externalServices) && booking.externalServices.length > 0) ? (
                            <div className="mt-2 pt-2 border-t border-stone-100">
                              <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 inline-block"></span>
                                External Vendors (Legacy)
                              </p>
                              <ul className="text-[9px] text-stone-500 space-y-0.5">
                                {booking.externalServices.map((ext: any, idx: number) => (
                                  <li key={idx} className="flex flex-col border-b border-stone-200/50 pb-1.5 mb-1.5 last:border-0 last:pb-0 last:mb-0">
                                    <span className="font-bold text-stone-600">{ext.serviceName || ext}</span>
                                    {ext.vendorName && <span className="text-[9px] font-semibold text-stone-500">{ext.vendorName} {ext.contactNumber && `(${ext.contactNumber})`}</span>}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                        </td>
                        <td className="p-4 whitespace-nowrap align-top">
                          <div className="flex items-center gap-1 font-bold text-stone-800">
                            <Calendar size={11} className="text-luxury-gold-600" />
                            {booking.eventDate}
                          </div>
                          <div className="flex items-center gap-1 text-stone-500 mt-1">
                            <Users size={11} />
                            {booking.guestCount} guests
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap align-top">
                          <p className="font-bold text-stone-800">LKR {(booking.totalAmount || 0).toLocaleString()}</p>
                        </td>
                        <td className="p-4 whitespace-nowrap align-top">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${STATUS_STYLES[booking.bookingStatus]}`}>
                            {booking.bookingStatus}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right whitespace-nowrap align-top">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setExpandedRow(expandedRow === booking.id ? null : booking.id)}
                              className="p-1.5 bg-stone-50 text-stone-500 hover:bg-stone-100 rounded"
                              title="Financial Summary"
                            >
                              {expandedRow === booking.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                            {booking.bookingStatus === 'PENDING' && (
                              <>
                                <button onClick={() => setPendingAction({ type: 'approve', bookingId: booking.id })}
                                  className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded" title="Approve">
                                  <CheckCircle size={14} />
                                </button>
                                <button onClick={() => setPendingAction({ type: 'reject', bookingId: booking.id })}
                                  className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded" title="Reject">
                                  <XCircle size={14} />
                                </button>
                              </>
                            )}
                            {booking.bookingStatus === 'CONFIRMED' && (
                              <button onClick={() => setPendingAction({ type: 'complete', bookingId: booking.id })}
                                className="p-1.5 bg-stone-50 text-stone-700 hover:bg-stone-100 rounded" title="Mark Completed">
                                <CheckSquare size={14} />
                              </button>
                            )}
                            {!['CANCELLED', 'COMPLETED', 'REJECTED'].includes(booking.bookingStatus) && (
                              <button onClick={() => setPendingAction({ type: 'cancel', bookingId: booking.id })}
                                className="p-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded" title="Cancel">
                                <X size={14} />
                              </button>
                            )}
                            <button onClick={() => setPendingAction({ type: 'delete', bookingId: booking.id })}
                              className="p-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded" title="Delete">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedRow === booking.id && (
                        <tr className="bg-stone-50/70 border-b border-stone-100">
                          <td colSpan={7} className="px-6 py-6">
                            <div className="max-w-sm">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">Financial Breakdown</p>
                              <CostBreakdown
                                variant="compact"
                                hallName={hallObj?.hallName || booking.hallId}
                                hallPrice={booking.hallPrice || hallObj?.basePrice || 0}
                                packageName={pkgObj?.packageName || booking.packageId}
                                packagePrice={booking.packagePrice || pkgObj?.packagePrice || 0}
                                hotelServices={hotelSvcs}
                                discount={booking.promoDiscount}
                                paymentStatus={booking.paymentStatus}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-16 text-center text-stone-400">
                    <Filter size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="font-semibold text-sm">No bookings match current filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {pendingAction && (
        <ConfirmModal
          title={
            pendingAction.type === 'approve' ? 'Approve Booking?' :
            pendingAction.type === 'reject'  ? 'Reject Booking?' :
            pendingAction.type === 'complete' ? 'Mark as Completed?' :
            pendingAction.type === 'cancel'  ? 'Cancel Booking?' :
            'Delete Booking?'
          }
          message={
            pendingAction.type === 'approve' ? 'This will mark the booking as approved and request the 20% advance payment from the customer.' :
            pendingAction.type === 'reject'  ? 'This will mark the booking as cancelled.' :
            pendingAction.type === 'complete' ? 'This marks the event as completed.' :
            pendingAction.type === 'cancel'  ? 'Are you sure you want to cancel this booking?' :
            'This action is permanent and cannot be undone.'
          }
          confirmLabel={
            pendingAction.type === 'approve' ? 'Approve' :
            pendingAction.type === 'reject'  ? 'Reject' :
            pendingAction.type === 'complete' ? 'Mark Completed' :
            pendingAction.type === 'cancel'  ? 'Cancel Booking' :
            'Delete'
          }
          danger={pendingAction.type !== 'approve' && pendingAction.type !== 'complete'}
          onConfirm={handleBookingStatusUpdate}
          onCancel={() => setPendingAction(null)}
        />
      )}
    </div>
  );
}
