import { useState } from 'react';
import { Users, ChevronRight, Sparkles, MapPin, Search, SlidersHorizontal, Snowflake, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHalls } from '../../hooks/useHalls';
import { useAllReviews } from '../../hooks/useAllReviews';
import FavoriteButton from '../../components/FavoriteButton';
import type { Hall } from '../../types/app';

export default function Halls() {
  const { halls } = useHalls();
  const { getHallRatingSummary } = useAllReviews();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [settingFilter, setSettingFilter] = useState('all');
  const [acFilter, setAcFilter] = useState('all');

  const getHallImage = (hall: Hall) => {
    return hall.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop';
  };

  // Filter Logic
  const filteredHalls = halls.filter((hall) => {
    if (hall.status === 'Hidden') return false;

    // 1. Search text
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      hall.hallName.toLowerCase().includes(query) ||
      (hall.type || '').toLowerCase().includes(query) ||
      (hall.description || '').toLowerCase().includes(query);

    if (!matchesSearch) return false;

    // 2. Capacity filter
    if (capacityFilter !== 'all') {
      const cap = hall.capacity;
      if (capacityFilter === 'under-150' && cap >= 150) return false;
      if (capacityFilter === '150-300' && (cap < 150 || cap > 300)) return false;
      if (capacityFilter === '300-500' && (cap < 300 || cap > 500)) return false;
      if (capacityFilter === 'over-500' && cap <= 500) return false;
    }

    // 3. Price filter
    if (priceFilter !== 'all') {
      const price = hall.basePrice;
      if (priceFilter === 'under-100k' && price >= 100000) return false;
      if (priceFilter === '100k-200k' && (price < 100000 || price > 200000)) return false;
      if (priceFilter === '200k-300k' && (price < 200000 || price > 300000)) return false;
      if (priceFilter === 'over-300k' && price <= 300000) return false;
    }

    // 4. Setting (Indoor / Outdoor)
    if (settingFilter !== 'all') {
      const setting = hall.indoorOutdoor || 'Indoor';
      if (settingFilter !== setting.toLowerCase()) return false;
    }

    // 5. Air Conditioning
    if (acFilter !== 'all') {
      const isAC = hall.airConditioned !== undefined ? hall.airConditioned : true;
      if (acFilter === 'ac' && !isAC) return false;
      if (acFilter === 'non-ac' && isAC) return false;
    }

    return true;
  });

  return (
    <div className="bg-stone-50 min-h-screen pb-32 w-full animate-fade-in font-sans">
      
      {/* Premium Hero Section */}
      <div className="relative pt-32 pb-20 bg-luxury-emerald-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 to-transparent"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-luxury-gold-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-luxury-gold-500/10 text-luxury-gold-400 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-luxury-gold-500/20 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <Sparkles size={32} />
          </div>
          <span className="text-luxury-gold-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block">Explore Our Spaces</span>
          <h1 className="font-serif text-4xl lg:text-6xl font-bold mb-6 drop-shadow-md">Signature Halls</h1>
          <p className="text-stone-300 max-w-2xl mx-auto text-sm leading-relaxed">
            Discover the perfect canvas for your celebration. From grand ballrooms to panoramic sky pavilions, each venue offers a unique masterpiece of architecture and design.
          </p>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-30">
        <div className="bg-white rounded-2xl border border-stone-200/60 shadow-xl p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-center">
            
            {/* Search Bar */}
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-luxury-emerald-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search by name, type, or feature..."
                className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-emerald-500/20 focus:border-luxury-emerald-500 transition-all font-medium text-stone-700 placeholder:font-normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap lg:flex-nowrap gap-3">
              <div className="relative flex-1 lg:flex-none">
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <select
                  value={capacityFilter}
                  onChange={(e) => setCapacityFilter(e.target.value)}
                  className="w-full lg:w-auto pl-10 pr-8 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 appearance-none focus:outline-none focus:border-luxury-emerald-500 cursor-pointer"
                >
                  <option value="all">Any Capacity</option>
                  <option value="under-150">Up to 150 guests</option>
                  <option value="150-300">150 - 300 guests</option>
                  <option value="300-500">300 - 500 guests</option>
                  <option value="over-500">500+ guests</option>
                </select>
              </div>

              <div className="relative flex-1 lg:flex-none">
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full lg:w-auto px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 appearance-none focus:outline-none focus:border-luxury-emerald-500 cursor-pointer"
                >
                  <option value="all">Any Price</option>
                  <option value="under-100k">Under LKR 100k</option>
                  <option value="100k-200k">LKR 100k - 200k</option>
                  <option value="200k-300k">LKR 200k - 300k</option>
                  <option value="over-300k">Over LKR 300k</option>
                </select>
              </div>

              <div className="relative flex-1 lg:flex-none">
                <select
                  value={settingFilter}
                  onChange={(e) => setSettingFilter(e.target.value)}
                  className="w-full lg:w-auto px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 appearance-none focus:outline-none focus:border-luxury-emerald-500 cursor-pointer"
                >
                  <option value="all">Indoor & Outdoor</option>
                  <option value="indoor">Indoor Only</option>
                  <option value="outdoor">Outdoor Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Halls Grid */}
      <div className="max-w-7xl mx-auto px-6 mt-16">
        {filteredHalls.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-stone-100 shadow-sm">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-400">
              <Search size={32} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-800 mb-2">No halls found</h3>
            <p className="text-stone-500 max-w-sm mx-auto">We couldn't find any venues matching your current filters. Try adjusting your search criteria.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setCapacityFilter('all');
                setPriceFilter('all');
                setSettingFilter('all');
                setAcFilter('all');
              }}
              className="mt-6 text-luxury-emerald-600 font-semibold hover:text-luxury-emerald-700 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHalls.map((hall, index) => (
              <div 
                key={hall.id} 
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl border border-stone-100 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                
                {/* Image Gallery */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-white/90 backdrop-blur text-luxury-emerald-950 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                      {hall.type || 'Premium'}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 z-10">
                    <FavoriteButton hallId={hall.id} />
                  </div>
                  
                  <div className="absolute bottom-4 left-4 z-10 flex gap-2">
                    {hall.indoorOutdoor && (
                      <span className="bg-black/40 backdrop-blur-md border border-white/20 text-white text-[10px] font-medium px-2 py-1 rounded shadow-sm">
                        {hall.indoorOutdoor}
                      </span>
                    )}
                    {hall.airConditioned && (
                      <span className="bg-black/40 backdrop-blur-md border border-white/20 text-white text-[10px] font-medium px-2 py-1 rounded shadow-sm flex items-center gap-1">
                        <Snowflake size={10} /> A/C
                      </span>
                    )}
                    {(() => {
                      const rating = getHallRatingSummary(hall.id);
                      if (rating.count > 0) {
                        return (
                          <span className="bg-white/90 backdrop-blur-md text-luxury-emerald-950 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                            <Star size={10} className="fill-luxury-gold-500 text-luxury-gold-500" />
                            {rating.average} ({rating.count})
                          </span>
                        );
                      }
                      return null;
                    })()}
                  </div>

                  <img 
                    src={getHallImage(hall)} 
                    alt={hall.hallName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-luxury-emerald-950 group-hover:text-luxury-emerald-700 transition-colors">{hall.hallName}</h3>
                      <div className="flex items-center text-stone-500 text-xs mt-1 font-medium">
                        <MapPin size={12} className="mr-1 text-luxury-gold-500" />
                        {hall.floor || 'Ground Floor'} • {hall.location}
                      </div>
                    </div>
                  </div>

                  <p className="text-stone-600 text-sm leading-relaxed mb-6 line-clamp-2">
                    {hall.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 flex flex-col justify-center">
                      <span className="text-[10px] uppercase font-bold text-stone-400 mb-1 tracking-wider">Capacity</span>
                      <div className="flex items-center text-luxury-emerald-950 font-bold">
                        <Users size={14} className="mr-1.5 text-luxury-emerald-600" />
                        Up to {hall.capacity}
                      </div>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 flex flex-col justify-center">
                      <span className="text-[10px] uppercase font-bold text-stone-400 mb-1 tracking-wider">Base Price</span>
                      <div className="flex items-center text-luxury-emerald-950 font-bold">
                        LKR {(hall.basePrice || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto pt-4 border-t border-stone-100 flex gap-3">
                    <Link 
                      to={`/halls/${hall.id}#reserve`}
                      className="w-full bg-luxury-emerald-950 text-white flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm hover:bg-luxury-emerald-900 transition-all hover:shadow-lg hover:shadow-luxury-emerald-900/20 group/btn"
                    >
                      View & Book Now
                      <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
