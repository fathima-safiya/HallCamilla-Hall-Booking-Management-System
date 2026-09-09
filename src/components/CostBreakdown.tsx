import { Building2, Package, Sparkles, Tag, CreditCard, Wallet, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export interface CostBreakdownProps {
  hallName: string;
  hallPrice: number;
  packageName: string;
  packagePrice: number;
  hotelServices: { name: string; price: number }[];
  packagePricePerPerson?: number;
  guestCount?: number;
  discount?: number;
  paymentStatus?: 'Unpaid' | 'Advance Paid' | 'Fully Paid';
  /** 'default' = full card (customer-facing), 'compact' = condensed (admin panel) */
  variant?: 'default' | 'compact';
}

function fmt(n: number) {
  return `LKR ${n.toLocaleString('en-LK')}`;
}

export default function CostBreakdown({
  hallName,
  hallPrice,
  packageName,
  packagePrice,
  hotelServices,
  packagePricePerPerson,
  guestCount,
  discount = 0,
  paymentStatus,
  variant = 'default',
}: CostBreakdownProps) {
  const [servicesOpen, setServicesOpen] = useState(true);

  const servicesSubtotal = hotelServices.reduce((s, sv) => s + sv.price, 0);
  const subtotal = hallPrice + packagePrice + servicesSubtotal;
  const grandTotal = Math.max(0, subtotal - discount);
  const advance = Math.round(grandTotal * 0.2);
  const remaining = grandTotal - advance;

  if (variant === 'compact') {
    return (
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3 text-xs">
        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">Financial Summary</p>

        <Row label={`🏛 ${hallName}`} value={fmt(hallPrice)} />
        <Row label={`📦 ${packageName}`} value={fmt(packagePrice)} />
        {packagePricePerPerson && guestCount && (
          <Row label={`   LKR ${packagePricePerPerson.toLocaleString('en-LK')} × ${guestCount} Guests`} value={""} labelClass="text-[10px] text-stone-400 pl-4" />
        )}
        {hotelServices.length > 0 && (
          <Row label={`✨ Hotel Services (${hotelServices.length})`} value={fmt(servicesSubtotal)} />
        )}
        {discount > 0 && (
          <Row label="🎁 Discount" value={`-${fmt(discount)}`} valueClass="text-emerald-600" />
        )}

        <div className="border-t border-stone-200 pt-3 space-y-1.5">
          <Row label="Grand Total" value={fmt(grandTotal)} labelClass="font-bold text-stone-800" valueClass="font-bold text-luxury-gold-700" />
          <Row label="Advance (20%)" value={fmt(advance)} valueClass="text-luxury-emerald-700 font-semibold" />
          <Row label="Remaining (80%)" value={fmt(remaining)} valueClass={paymentStatus === 'Fully Paid' ? 'text-luxury-emerald-700 font-semibold' : 'text-amber-600 font-semibold'} />
        </div>

        {paymentStatus && (
          <div className={`mt-2 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider text-center ${
            paymentStatus === 'Fully Paid' ? 'bg-emerald-100 text-emerald-700' :
            paymentStatus === 'Advance Paid' ? 'bg-sky-100 text-sky-700' :
            'bg-amber-100 text-amber-700'
          }`}>
            {paymentStatus}
          </div>
        )}
      </div>
    );
  }

  // --- Default (full) variant ---
  return (
    <div className="bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden">
      {/* Card Header */}
      <div className="bg-luxury-emerald-950 text-white px-6 py-5 flex items-center gap-3">
        <div className="w-9 h-9 bg-luxury-gold-500/20 rounded-lg flex items-center justify-center">
          <CreditCard size={18} className="text-luxury-gold-400" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold leading-tight">Booking Cost Summary</h3>
          <p className="text-stone-400 text-[10px] tracking-wider mt-0.5">Full pricing breakdown</p>
        </div>
      </div>

      <div className="p-6 space-y-1">

        {/* Hall Rental */}
        <LineItem
          icon={<Building2 size={15} className="text-luxury-emerald-700" />}
          label="Hall Rental"
          sublabel={hallName}
          value={fmt(hallPrice)}
        />

        <Divider />

        {/* Package */}
        <LineItem
          icon={<Package size={15} className="text-luxury-emerald-700" />}
          label="Selected Package"
          sublabel={packageName + (packagePricePerPerson && guestCount ? ` (LKR ${packagePricePerPerson.toLocaleString('en-LK')} × ${guestCount} Guests)` : '')}
          value={fmt(packagePrice)}
        />

        <Divider />

        {/* Hotel Extra Services */}
        {hotelServices.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setServicesOpen(o => !o)}
              className="w-full flex items-center justify-between py-3 group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 bg-luxury-gold-50 rounded flex items-center justify-center">
                  <Sparkles size={13} className="text-luxury-gold-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-stone-800 group-hover:text-luxury-emerald-900 transition-colors">Hotel Extra Services</p>
                  <p className="text-[10px] text-stone-400">{hotelServices.length} service{hotelServices.length > 1 ? 's' : ''} selected</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-stone-700">{fmt(servicesSubtotal)}</span>
                {servicesOpen ? <ChevronUp size={14} className="text-stone-400" /> : <ChevronDown size={14} className="text-stone-400" />}
              </div>
            </button>

            {servicesOpen && (
              <div className="ml-8 space-y-2 pb-2 animate-fade-in">
                {hotelServices.map((sv, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-stone-600 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-luxury-gold-400 inline-block" />
                      {sv.name}
                    </span>
                    <span className="font-medium text-stone-600">{fmt(sv.price)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-xs font-bold text-stone-500 pt-2 border-t border-stone-100">
                  <span>Services Subtotal</span>
                  <span>{fmt(servicesSubtotal)}</span>
                </div>
              </div>
            )}

            <Divider />
          </>
        )}

        {/* Discount */}
        {discount > 0 && (
          <>
            <LineItem
              icon={<Tag size={15} className="text-emerald-600" />}
              label="Discount Applied"
              value={`-${fmt(discount)}`}
              valueClass="text-emerald-600"
            />
            <Divider />
          </>
        )}

        {/* Grand Total */}
        <div className="pt-4">
          <div className="bg-gradient-to-br from-luxury-emerald-950 to-luxury-emerald-900 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white font-bold text-sm uppercase tracking-widest">Grand Total</span>
              <span className="font-serif text-2xl font-bold text-luxury-gold-400">{fmt(grandTotal)}</span>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-3">
              {/* Advance */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Wallet size={14} className="text-luxury-gold-400" />
                  <div>
                    <p className="text-white text-xs font-bold">Advance Payment</p>
                    <p className="text-stone-400 text-[10px]">Required to confirm booking</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-sm">{fmt(advance)}</p>
                  <p className="text-luxury-gold-400 text-[10px] font-bold">20%</p>
                </div>
              </div>

              {/* Remaining */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Wallet size={14} className="text-stone-400" />
                  <div>
                    <p className={`text-xs font-bold ${paymentStatus === 'Fully Paid' ? 'text-emerald-400' : 'text-stone-300'}`}>
                      {paymentStatus === 'Fully Paid' ? 'Balance — Paid ✓' : 'Remaining Balance'}
                    </p>
                    <p className="text-stone-500 text-[10px]">Due on or before event day</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${paymentStatus === 'Fully Paid' ? 'text-emerald-400' : 'text-amber-300'}`}>
                    {fmt(remaining)}
                  </p>
                  <p className="text-stone-400 text-[10px] font-bold">80%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment status badge (shown on details pages) */}
          {paymentStatus && (
            <div className={`mt-3 py-2.5 rounded-lg text-center text-[10px] font-bold uppercase tracking-widest ${
              paymentStatus === 'Fully Paid'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : paymentStatus === 'Advance Paid'
                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              Payment Status: {paymentStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Small helper sub-components ── */

function LineItem({
  icon, label, sublabel, value, valueClass = 'text-stone-700'
}: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between items-center py-3">
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 bg-stone-50 rounded flex items-center justify-center">{icon}</div>
        <div>
          <p className="text-sm font-bold text-stone-800">{label}</p>
          {sublabel && <p className="text-[10px] text-stone-400 mt-0.5">{sublabel}</p>}
        </div>
      </div>
      <span className={`font-bold text-sm ${valueClass}`}>{value}</span>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-stone-100" />;
}

function Row({
  label, value, labelClass = 'text-stone-600', valueClass = 'text-stone-700'
}: {
  label: string; value: string; labelClass?: string; valueClass?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className={labelClass}>{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}
