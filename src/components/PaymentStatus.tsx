import { CheckCircle, Clock } from 'lucide-react';

interface PaymentStatusProps {
  status: 'Pending' | 'Paid';
  paidAmount: number;
  remainingBalance: number;
  transactionId?: string;
}

export default function PaymentStatus({ status, paidAmount, remainingBalance, transactionId }: PaymentStatusProps) {
  const isPaid = status === 'Paid';

  return (
    <div className={`p-6 rounded-xl border ${isPaid ? 'bg-luxury-emerald-50 border-luxury-emerald-200' : 'bg-stone-50 border-stone-200'}`}>
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isPaid ? 'bg-luxury-emerald-100 text-luxury-emerald-700' : 'bg-stone-200 text-stone-600'}`}>
          {isPaid ? <CheckCircle size={24} /> : <Clock size={24} />}
        </div>
        <div>
          <h3 className={`font-serif text-xl font-bold ${isPaid ? 'text-luxury-emerald-950' : 'text-stone-700'}`}>
            {isPaid ? 'Payment Completed' : 'Payment Pending'}
          </h3>
          {transactionId && (
            <p className="text-xs text-stone-500 font-mono mt-1">Transaction ID: {transactionId}</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-stone-500 font-medium">Paid Amount</span>
          <span className="font-bold text-luxury-emerald-950">LKR {paidAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm border-t border-stone-200/60 pt-3">
          <span className="text-stone-500 font-medium">Remaining Balance</span>
          <span className="font-bold text-stone-800">LKR {remainingBalance.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
