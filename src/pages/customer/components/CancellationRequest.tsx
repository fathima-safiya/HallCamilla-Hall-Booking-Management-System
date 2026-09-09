import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { cancellationService } from '../../../services/cancellationService';
import { useToast } from '../../../context/ToastContext';

interface CancellationRequestProps {
  bookingId: string;
  customerId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CancellationRequestModal({ bookingId, customerId, onClose, onSuccess }: CancellationRequestProps) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      showToast('Please provide a reason for cancellation.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await cancellationService.requestCancellation(bookingId, customerId, reason);
      showToast('Cancellation request submitted successfully.');
      onSuccess();
    } catch (err) {
      showToast('Failed to submit cancellation request.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md m-4 z-10 overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-red-50/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-full">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-luxury-emerald-950">Request Cancellation</h3>
              <p className="text-stone-500 text-xs mt-0.5">Booking {bookingId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-stone-600 mb-6 leading-relaxed">
            Are you sure you want to request a cancellation for this booking? Please provide a reason below. 
            An administrator will review your request.
          </p>
          
          <div className="mb-6">
            <label className="block text-[10px] uppercase font-bold text-stone-500 tracking-wider mb-2">
              Reason for Cancellation
            </label>
            <textarea
              required
              rows={4}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Please explain why you need to cancel..."
              className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-luxury-gold-500 focus:ring-1 focus:ring-luxury-gold-500 transition-all resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-stone-100 text-stone-700 font-bold tracking-wider text-xs rounded-lg hover:bg-stone-200 uppercase transition-all"
            >
              Keep Booking
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-red-600 text-white font-bold tracking-wider text-xs rounded-lg hover:bg-red-700 shadow-md uppercase transition-all disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
