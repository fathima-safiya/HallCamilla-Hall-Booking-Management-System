import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart, Users, MapPin, Sparkles, ChevronRight, Loader2,
  Trash2, LayoutGrid, X, Check, ArrowRight
} from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import { useHalls } from '../../hooks/useHalls';
import { useCatalog } from '../../hooks/useCatalog';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import type { Hall } from '../../types/app';

const HALL_META: Record<string, { floor: string; size: string; image: string }> = {
  'camilla-grand-hall': { floor: 'Ground Floor', size: '8,500 Sq Ft', image: '/grand_hall.png' },
  'camilla-sky-hall':   { floor: 'Upper Floor',  size: '4,300 Sq Ft', image: '/sky_hall.png'   },
};

function fmt(n: number) {
  return `LKR ${n.toLocaleString('en-LK')}`;
}

export default function Wishlist() {
  const { user } = useAuth();
  const { favorites, loading: favLoading, toggleFavorite } = useFavorites();
  const { halls, loading: hallsLoading } = useHalls();
  const { packages } = useCatalog();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const loading = favLoading || hallsLoading;

  // Resolve favorite hall objects
  const wishlistHalls: Hall[] = favorites
    .map(f => halls.find(h => h.id === f.hallId))
    .filter((h): h is Hall => !!h);

  const handleRemove = async (hallId: string) => {
    await toggleFavorite(hallId);
    showToast('Removed from your Wishlist.');
    setCompareIds(prev => prev.filter(id => id !== hallId));
  };

  const toggleCompare = (hallId: string) => {
    setCompareIds(prev =>
      prev.includes(hallId) ? prev.filter(id => id !== hallId) : [...prev, hallId]
    );
  };

  const compareHalls = compareIds
    .map(id => halls.find(h => h.id === id))
    .filter((h): h is Hall => !!h);

  const minPackagePrice = (hallId: string) => {
    const hallPackages = packages.filter(p =>
      p.hallId === hallId || !p.hallId
    );
    if (!hallPackages.length) return null;
    return Math.min(...hallPackages.map(p => p.packagePrice));
  };

  if (loading) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center h-64 gap-4 text-stone-400">
        <Loader2 size={36} className="animate-spin text-luxury-emerald-700" />
        <p className="text-sm font-semibold">Loading your wishlist…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-32">

      {/* Hero Header */}
      <div className="relative pt-32 pb-20 bg-luxury-emerald-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-luxury-gold-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-red-400/20 shadow-xl">
            <Heart size={32} className="fill-red-400" />
          </div>
          <span className="text-luxury-gold-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block">
            Your Personal Collection
          </span>
          <h1 className="font-serif text-4xl lg:text-6xl font-bold mb-4 drop-shadow-md">
            My Wishlist
          </h1>
          <p className="text-stone-300 max-w-lg mx-auto text-sm leading-relaxed">
            {user?.displayName?.split(' ')[0] || 'Your'} saved halls — review, compare, and book whenever you're ready.
          </p>
          {wishlistHalls.length > 0 && (
            <span className="mt-6 inline-block bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-sm font-bold">
              {wishlistHalls.length} Hall{wishlistHalls.length !== 1 ? 's' : ''} Saved
            </span>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12">

        {/* Compare Bar */}
        {compareIds.length >= 2 && !showCompare && (
          <div className="mb-8 bg-luxury-emerald-950 text-white rounded-2xl p-5 flex items-center justify-between shadow-xl animate-fade-in">
            <div className="flex items-center gap-3">
              <LayoutGrid size={20} className="text-luxury-gold-400" />
              <span className="font-bold text-sm">
                {compareIds.length} halls selected for comparison
              </span>
            </div>
            <button
              onClick={() => setShowCompare(true)}
              className="bg-luxury-gold-500 text-luxury-emerald-950 font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-lg hover:bg-luxury-gold-400 transition-colors flex items-center gap-2"
            >
              <LayoutGrid size={14} />
              Compare Now
            </button>
          </div>
        )}

        {/* Empty State */}
        {wishlistHalls.length === 0 ? (
          <div className="py-32 text-center border-2 border-dashed border-stone-200 rounded-2xl bg-gradient-to-b from-stone-50/50 to-white animate-fade-in">
            <div className="w-20 h-20 bg-red-50 text-red-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Heart size={32} />
            </div>
            <h3 className="font-serif text-2xl font-bold text-luxury-emerald-950 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-stone-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              You haven't added any favourite halls yet. Browse our stunning venues and click the ❤️ to save them here.
            </p>
            <Link
              to="/halls"
              className="px-8 py-4 bg-luxury-emerald-950 text-white font-bold tracking-wider text-xs rounded hover:bg-luxury-emerald-900 shadow-lg transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              Browse Halls <ChevronRight size={16} className="text-luxury-gold-400" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {wishlistHalls.map((hall, i) => {
              const meta = HALL_META[hall.id] || { floor: 'Hotel Floor', size: 'N/A', image: '/grand_hall.png' };
              const minPkg = minPackagePrice(hall.id);
              const inCompare = compareIds.includes(hall.id);

              return (
                <div
                  key={hall.id}
                  className="bg-white rounded-3xl border border-stone-200/60 shadow-xl shadow-stone-200/40 overflow-hidden group animate-slide-up hover:-translate-y-1 transition-all duration-500"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-1000 ease-out"
                      style={{ backgroundImage: `url(${hall.images?.[0] || meta.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-emerald-950/80 via-luxury-emerald-950/20 to-transparent" />

                    {/* Compare toggle */}
                    <button
                      onClick={() => toggleCompare(hall.id)}
                      className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all duration-300 ${
                        inCompare
                          ? 'bg-luxury-gold-500 border-luxury-gold-400 text-luxury-emerald-950'
                          : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                      }`}
                    >
                      {inCompare ? <Check size={12} /> : <LayoutGrid size={12} />}
                      {inCompare ? 'Selected' : 'Compare'}
                    </button>

                    {/* Hall name overlay */}
                    <div className="absolute bottom-5 left-6 right-6">
                      <span className="text-luxury-gold-300 text-[10px] font-bold tracking-widest uppercase mb-1 block">
                        {hall.type || 'Premium Venue'}
                      </span>
                      <h2 className="font-serif text-2xl font-bold text-white drop-shadow-lg">
                        {hall.hallName}
                      </h2>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-7">
                    <p className="text-stone-500 text-sm leading-relaxed mb-5 line-clamp-2">
                      {hall.description}
                    </p>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-4 border-y border-stone-100 py-4 mb-5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1">
                          <Users size={10} className="text-luxury-gold-500" /> Capacity
                        </span>
                        <span className="text-luxury-emerald-950 font-bold text-sm">{hall.capacity} Guests</span>
                      </div>
                      <div className="flex flex-col gap-0.5 border-l border-stone-100 pl-4">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1">
                          <MapPin size={10} className="text-luxury-gold-500" /> Floor
                        </span>
                        <span className="text-luxury-emerald-950 font-bold text-sm">{meta.floor}</span>
                      </div>
                      <div className="flex flex-col gap-0.5 border-l border-stone-100 pl-4">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1">
                          <Sparkles size={10} className="text-luxury-gold-500" /> From
                        </span>
                        <span className="text-luxury-emerald-950 font-bold text-sm">
                          {fmt(hall.basePrice)}
                        </span>
                      </div>
                    </div>

                    {/* Package Starting Price */}
                    {minPkg !== null && (
                      <p className="text-xs text-stone-400 mb-5">
                        Packages starting from{' '}
                        <span className="font-bold text-luxury-gold-600">{fmt(minPkg)}</span>
                      </p>
                    )}

                    {/* Availability badge */}
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-5 ${
                      hall.status === 'Available'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full inline-block ${hall.status === 'Available' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {hall.status}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      <Link
                        to={`/halls/${hall.id}`}
                        className="flex-1 text-center bg-luxury-emerald-950 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-luxury-emerald-900 transition-colors flex items-center justify-center gap-1.5"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => navigate(`/halls/${hall.id}`)}
                        className="flex-1 bg-luxury-gold-500 text-luxury-emerald-950 text-xs font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-luxury-gold-400 transition-colors flex items-center justify-center gap-1.5"
                      >
                        Book Now <ArrowRight size={13} />
                      </button>
                      <button
                        onClick={() => handleRemove(hall.id)}
                        className="p-3 bg-red-50 border border-red-100 text-red-400 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Compare Modal */}
      {showCompare && compareHalls.length >= 2 && (
        <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slide-up">

            {/* Modal Header */}
            <div className="bg-luxury-emerald-950 text-white px-8 py-6 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center gap-3">
                <LayoutGrid size={22} className="text-luxury-gold-400" />
                <h2 className="font-serif text-xl font-bold">Hall Comparison</h2>
              </div>
              <button
                onClick={() => setShowCompare(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Comparison Table */}
            <div className="p-8">
              {/* Hall images header */}
              <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: `180px repeat(${compareHalls.length}, 1fr)` }}>
                <div />
                {compareHalls.map(hall => {
                  const meta = HALL_META[hall.id] || { image: '/grand_hall.png', floor: '', size: '' };
                  return (
                    <div key={hall.id} className="text-center">
                      <div className="h-36 rounded-xl overflow-hidden mb-3 shadow-md">
                        <img src={hall.images?.[0] || meta.image} alt={hall.hallName} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="font-serif font-bold text-luxury-emerald-950 text-lg">{hall.hallName}</h3>
                    </div>
                  );
                })}
              </div>

              {/* Comparison rows */}
              {[
                { label: 'Type', getValue: (h: Hall) => h.type || 'Premium Venue' },
                { label: 'Capacity', getValue: (h: Hall) => `${h.capacity} Guests` },
                { label: 'Hall Size', getValue: (h: Hall) => HALL_META[h.id]?.size || 'N/A' },
                { label: 'Floor', getValue: (h: Hall) => HALL_META[h.id]?.floor || 'N/A' },
                { label: 'Base Rental', getValue: (h: Hall) => fmt(h.basePrice) },
                { label: 'Location', getValue: (h: Hall) => h.location || 'Kurunegala' },
                { label: 'Status', getValue: (h: Hall) => h.status },
                { label: 'Min Package', getValue: (h: Hall) => {
                  const mp = minPackagePrice(h.id);
                  return mp !== null ? fmt(mp) : 'See packages';
                }},
              ].map((row, i) => (
                <div
                  key={row.label}
                  className={`grid gap-4 py-4 border-b border-stone-100 ${i % 2 === 0 ? 'bg-stone-50/50 rounded-lg px-2' : 'px-2'}`}
                  style={{ gridTemplateColumns: `180px repeat(${compareHalls.length}, 1fr)` }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 self-center">{row.label}</span>
                  {compareHalls.map(hall => {
                    const val = row.getValue(hall);
                    const allVals = compareHalls.map(row.getValue);
                    const isDiff = new Set(allVals).size > 1;
                    return (
                      <div key={hall.id} className="text-center">
                        <span className={`font-bold text-sm ${isDiff ? 'text-luxury-gold-700' : 'text-luxury-emerald-950'}`}>
                          {val}
                        </span>
                        {isDiff && (
                          <span className="ml-1 text-[8px] bg-luxury-gold-50 text-luxury-gold-700 border border-luxury-gold-200 px-1.5 py-0.5 rounded-full font-bold uppercase">diff</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Book Now per column */}
              <div
                className="grid gap-4 mt-8"
                style={{ gridTemplateColumns: `180px repeat(${compareHalls.length}, 1fr)` }}
              >
                <div />
                {compareHalls.map(hall => (
                  <div key={hall.id} className="text-center">
                    <Link
                      to={`/halls/${hall.id}`}
                      onClick={() => setShowCompare(false)}
                      className="inline-flex items-center gap-2 bg-luxury-gold-500 text-luxury-emerald-950 font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-luxury-gold-400 transition-colors shadow-md"
                    >
                      Book Now <ArrowRight size={13} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
