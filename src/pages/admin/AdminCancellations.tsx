import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { cancellationService } from '../../services/cancellationService';
import type { CancellationRequest } from '../../types/app';
import { ShieldAlert, Check, X, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminCancellations() {
  const [requests, setRequests] = useState<CancellationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = cancellationService.subscribeToRequests((data) => {
      setRequests(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleProcess = async (id: string, bookingId: string, approve: boolean) => {
    setProcessingId(id);
    try {
      await cancellationService.processRequest(id, bookingId, approve);
      showToast(`Cancellation request has been ${approve ? 'approved' : 'rejected'}.`);
    } catch (err) {
      showToast('Failed to process cancellation request.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 text-stone-400">
        <Loader2 size={36} className="animate-spin text-luxury-emerald-700" />
        <p className="text-sm font-semibold">Loading cancellation requests…</p>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const pastRequests = requests.filter(r => r.status !== 'PENDING');

  return (
    <div className="space-y-8 animate-fade-in w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-luxury-emerald-950">Cancellation Requests</h1>
          <p className="text-stone-500 text-sm mt-1">Review and manage customer booking cancellation requests.</p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="font-bold text-luxury-emerald-950 uppercase tracking-widest text-xs flex items-center gap-2">
          <AlertCircle size={16} className="text-amber-500" />
          Needs Attention ({pendingRequests.length})
        </h2>
        
        {pendingRequests.length === 0 ? (
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-8 text-center text-stone-500 text-sm">
            No pending cancellation requests.
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingRequests.map(req => (
              <div key={req.id} className="bg-white border-l-4 border-amber-500 border-t border-r border-b border-stone-200 rounded-r-xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold font-mono text-luxury-emerald-950">{req.bookingId}</span>
                    <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                      {format(new Date(req.createdAt), 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm text-stone-600 mb-1"><span className="font-bold text-stone-800">Customer ID:</span> {req.customerId}</p>
                  <p className="text-sm text-stone-600"><span className="font-bold text-stone-800">Reason:</span> {req.reason}</p>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  <button 
                    onClick={() => handleProcess(req.id, req.bookingId, false)}
                    disabled={processingId === req.id}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-red-600 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    <X size={14} /> Reject
                  </button>
                  <button 
                    onClick={() => handleProcess(req.id, req.bookingId, true)}
                    disabled={processingId === req.id}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    {processingId === req.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    Approve Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6 pt-8 border-t border-stone-200">
        <h2 className="font-bold text-stone-400 uppercase tracking-widest text-xs flex items-center gap-2">
          Past Requests
        </h2>
        
        {pastRequests.length === 0 ? (
          <div className="text-stone-400 text-sm italic">No past requests.</div>
        ) : (
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-3 text-[10px] uppercase font-bold text-stone-500 tracking-wider">Date</th>
                  <th className="px-6 py-3 text-[10px] uppercase font-bold text-stone-500 tracking-wider">Booking ID</th>
                  <th className="px-6 py-3 text-[10px] uppercase font-bold text-stone-500 tracking-wider">Status</th>
                  <th className="px-6 py-3 text-[10px] uppercase font-bold text-stone-500 tracking-wider">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {pastRequests.map(req => (
                  <tr key={req.id}>
                    <td className="px-6 py-4 text-stone-500">{format(new Date(req.createdAt), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4 font-mono font-bold text-luxury-emerald-950">{req.bookingId}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${req.status === 'APPROVED' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-stone-100 text-stone-600 border border-stone-200'}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-500 max-w-xs truncate">{req.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
