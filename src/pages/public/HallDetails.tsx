import { useParams, Link } from 'react-router-dom';
import { 
  Users, Maximize2, Check, Calendar, ChevronLeft, AlertTriangle, Sparkles, MapPin, 
  ShieldCheck, Clock, Snowflake, Car, GlassWater, Trophy, ShieldAlert, Laptop, Tv, Wifi, BatteryCharging, Camera
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useHalls } from '../../hooks/useHalls';
import { useBookings } from '../../hooks/useBookings';
import { useApp } from '../../context/AppContext';
import { useAvailability } from '../../hooks/useAvailability';
import AvailabilityCalendar from './components/AvailabilityCalendar';
import ReviewList from './components/ReviewList';
import FavoriteButton from '../../components/FavoriteButton';

export default function HallDetails() {
  const { id } = useParams();
  const { halls } = useHalls();
  const { bookings } = useBookings();
  const { blockedDates } = useApp();
  const { availability, loading: availabilityLoading } = useAvailability(id || '');
  
  const [date, setDate] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Handle hash scrolling
    if (window.location.hash) {
      setTimeout(() => {
        const id = window.location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300); // Wait for render
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dbHall = halls.find(h => h.id === id) || halls[0];
  if (!dbHall) return null;

  const isDateBlocked = date ? blockedDates.includes(date) : false;
  const isDateBooked = date ? availability.some(a => a.date === date && (a.status === 'BOOKED' || a.status === 'PENDING' || a.status === 'MAINTENANCE')) : false;
  const isAvailable = date && !isDateBlocked && !isDateBooked;

  const getHeroImage = () => {
    return dbHall.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop';
  };

  return (
    <div className="bg-stone-50 min-h-screen overflow-x-hidden selection:bg-luxury-gold-200 selection:text-luxury-emerald-950">
      
      {/* Immersive Hero Header */}
      <div className="relative h-[80vh] w-full overflow-hidden group">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out group-hover:scale-105"
          style={{ backgroundImage: `url(${getHeroImage()})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-emerald-950/90 via-luxury-emerald-950/40 to-black/30 backdrop-blur-[2px]"></div>
        
        {/* Floating Back Button */}
        <div className={`fixed top-24 left-6 z-50 transition-all duration-500 ${scrolled ? 'opacity-0 -translate-x-10 pointer-events-none' : 'opacity-100 translate-x-0'}`}>
          <Link to="/halls" className="flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white hover:text-luxury-emerald-950 transition-all hover:scale-110 shadow-lg">
            <ChevronLeft size={24} />
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-7xl mx-auto flex flex-col items-start animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-luxury-gold-500/20 backdrop-blur-md border border-luxury-gold-500/30 rounded-full mb-6 text-luxury-gold-400 text-[10px] font-bold tracking-[0.2em] uppercase">
            <Sparkles size={12} /> {dbHall.type || 'Premium Venue'}
          </div>
          <div className="flex items-end gap-5 w-full">
            <h1 className="font-serif text-5xl md:text-8xl font-bold text-white mb-6 drop-shadow-xl text-shine flex-1">{dbHall.hallName}</h1>
            <div className="mb-8">
              <FavoriteButton hallId={dbHall.id} variant="overlay" />
            </div>
          </div>
          <p className="text-xl md:text-2xl text-white/80 font-light max-w-3xl leading-relaxed">{dbHall.description || 'Experience ultimate luxury in our meticulously designed venues.'}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Details Content */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow hover:-translate-y-0.5 duration-300">
                <div className="w-10 h-10 bg-luxury-emerald-50 rounded-xl flex items-center justify-center text-luxury-emerald-900 mb-4">
                  <Users size={20} />
                </div>
                <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1">Max Capacity</p>
                <p className="font-serif text-2xl font-bold text-luxury-emerald-950">{dbHall.capacity}</p>
                <p className="text-xs text-stone-500 mt-1">Guests maximum</p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow hover:-translate-y-0.5 duration-300">
                <div className="w-10 h-10 bg-luxury-gold-50 rounded-xl flex items-center justify-center text-luxury-gold-600 mb-4">
                  <Maximize2 size={20} />
                </div>
                <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1">Floor Area</p>
                <p className="font-serif text-2xl font-bold text-luxury-emerald-950">{dbHall.size || 'Not specified'}</p>
                <p className="text-xs text-stone-500 mt-1">Total dimensions</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow hover:-translate-y-0.5 duration-300">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                  <MapPin size={20} />
                </div>
                <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1">Setting</p>
                <p className="font-serif text-xl font-bold text-luxury-emerald-950 truncate">{dbHall.indoorOutdoor || 'Indoor'}</p>
                <p className="text-xs text-stone-500 mt-1">{dbHall.floor || 'Ground Floor'}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow hover:-translate-y-0.5 duration-300">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                  <Snowflake size={20} />
                </div>
                <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1">A/C Status</p>
                <p className="font-serif text-2xl font-bold text-luxury-emerald-950">
                  {dbHall.airConditioned !== false ? 'Yes' : 'No'}
                </p>
                <p className="text-xs text-stone-500 mt-1">{dbHall.airConditioned !== false ? 'Fully Conditioned' : 'Natural Ventilation'}</p>
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="bg-white rounded-3xl border border-stone-200/60 shadow-xl p-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="font-serif text-2xl font-bold text-luxury-emerald-950">Technical & Capacity Specifications</h2>
                <div className="h-[1px] flex-grow bg-gradient-to-r from-luxury-gold-200 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
                
                <div className="space-y-4">
                  <h3 className="font-bold text-luxury-gold-600 uppercase tracking-widest text-[10px] border-b pb-2 border-stone-100">Capacity & Seating</h3>
                  <div className="flex justify-between py-1 border-b border-stone-50">
                    <span className="text-stone-500 flex items-center gap-1.5"><Users size={14} /> Theater / Guest Seating</span>
                    <span className="font-bold text-stone-800">{dbHall.capacity} PAX</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-50">
                    <span className="text-stone-500 flex items-center gap-1.5"><GlassWater size={14} /> Banquet / Dining Capacity</span>
                    <span className="font-bold text-stone-800">{dbHall.diningCapacity || Math.round(dbHall.capacity * 0.7)} PAX</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-50">
                    <span className="text-stone-500 flex items-center gap-1.5"><Car size={14} /> Secure Parking Lot</span>
                    <span className="font-bold text-stone-800">{dbHall.parkingCapacity || 100} Cars</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-luxury-gold-600 uppercase tracking-widest text-[10px] border-b pb-2 border-stone-100">Facilities & Staff Inclusions</h3>
                  <div className="flex justify-between py-1 border-b border-stone-50">
                    <span className="text-stone-500 flex items-center gap-1.5"><Trophy size={14} /> Main Stage Available</span>
                    <span className="font-bold text-stone-800">{dbHall.stageAvailable !== false ? 'Complimentary stage' : 'Not Included'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-50">
                    <span className="text-stone-500 flex items-center gap-1.5"><ShieldAlert size={14} /> VIP / Bridal Chamber</span>
                    <span className="font-bold text-stone-800">{dbHall.bridalRoom ? 'Exclusive Suite' : 'Not Available'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-50">
                    <span className="text-stone-500 flex items-center gap-1.5"><Laptop size={14} /> Dressing/Preparation Rooms</span>
                    <span className="font-bold text-stone-800">{dbHall.dressingRooms || 0} Rooms</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-luxury-gold-600 uppercase tracking-widest text-[10px] border-b pb-2 border-stone-100">Media & Connectivity</h3>
                  <div className="flex justify-between py-1 border-b border-stone-50">
                    <span className="text-stone-500 flex items-center gap-1.5"><Tv size={14} /> Dynamic LED Backdrop Screen</span>
                    <span className="font-bold text-stone-800">{dbHall.ledScreen ? 'Yes (Built-in)' : 'Available on request'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-50">
                    <span className="text-stone-500 flex items-center gap-1.5"><Wifi size={14} /> Guest High-Speed WiFi</span>
                    <span className="font-bold text-stone-800">{dbHall.wifi !== false ? 'Complimentary' : 'None'}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-luxury-gold-600 uppercase tracking-widest text-[10px] border-b pb-2 border-stone-100">Safety & Outdoors</h3>
                  <div className="flex justify-between py-1 border-b border-stone-50">
                    <span className="text-stone-500 flex items-center gap-1.5"><BatteryCharging size={14} /> Power Generator Backup</span>
                    <span className="font-bold text-stone-800">{dbHall.generatorBackup !== false ? 'Yes (Full load)' : 'On Demand'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-50">
                    <span className="text-stone-500 flex items-center gap-1.5"><Camera size={14} /> Outdoor Photography garden</span>
                    <span className="font-bold text-stone-800">{dbHall.outdoorPhotographyArea ? 'Access Allowed' : 'Rooftop photography only'}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Gallery Section */}
            <div className="animate-fade-in" style={{ animationDelay: '600ms' }}>
               <div className="flex items-center gap-4 mb-8">
                <h2 className="font-serif text-4xl font-bold text-luxury-emerald-950">Gallery</h2>
                <div className="h-[1px] flex-grow bg-gradient-to-r from-luxury-gold-200 to-transparent"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(dbHall.images && dbHall.images.length > 0 ? dbHall.images : (dbHall.id === 'camilla-sky-hall' ? [
                  'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=800',
                  'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=800',
                  'https://images.unsplash.com/photo-1478812954026-9c750f0e89fc?auto=format&fit=crop&q=80&w=800',
                  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800'
                ] : [
                  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800',
                  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
                  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80'
                ])).map((img, i) => (
                  <div key={i} className="aspect-square rounded-2xl bg-stone-200 overflow-hidden group relative shadow-sm">
                    <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={`${dbHall.hallName} - Detail ${i + 1}`} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Section */}
            <div className="animate-fade-in" style={{ animationDelay: '700ms' }}>
               <div className="flex items-center gap-4 mb-8">
                <h2 className="font-serif text-4xl font-bold text-luxury-emerald-950">Location</h2>
                <div className="h-[1px] flex-grow bg-gradient-to-r from-luxury-gold-200 to-transparent"></div>
              </div>
              <div className="w-full h-[400px] rounded-3xl overflow-hidden border border-stone-200/60 shadow-xl relative group">
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-md border border-stone-100 flex items-center gap-2 text-luxury-emerald-950 font-semibold text-sm max-w-[80%]">
                  <MapPin size={18} className="text-luxury-gold-600 shrink-0" />
                  <span className="truncate">{dbHall.location}</span>
                </div>

                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dbHall.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-6 right-6 z-10 bg-luxury-emerald-950 hover:bg-luxury-emerald-900 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 font-bold text-sm tracking-wide transition-all hover:scale-105 active:scale-95"
                >
                  <MapPin size={16} className="text-luxury-gold-400" />
                  Get Directions
                </a>

                <iframe
                  title="Google Maps Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)' }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps?q=${encodeURIComponent(dbHall.location)}&output=embed`}
                ></iframe>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="animate-fade-in" style={{ animationDelay: '800ms' }}>
               <div className="flex items-center gap-4 mb-8">
                <h2 className="font-serif text-4xl font-bold text-luxury-emerald-950">Guest Experiences</h2>
                <div className="h-[1px] flex-grow bg-gradient-to-r from-luxury-gold-200 to-transparent"></div>
              </div>
              <ReviewList hallId={dbHall.id} />
            </div>

          </div>

          {/* Sticky Booking Widget */}
          <div className="lg:col-span-1" id="reserve">
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-stone-200/50 border border-white sticky top-32 animate-slide-up z-40">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-luxury-gold-500/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <h3 className="font-serif text-3xl font-bold text-luxury-emerald-950 mb-3">Reserve Hall</h3>
              <p className="text-stone-500 text-sm mb-8 leading-relaxed">Select your preferred date to check real-time availability and begin your bespoke booking journey.</p>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 tracking-widest uppercase mb-3">Select Event Date</label>
                  <AvailabilityCalendar 
                    hallId={dbHall.id} 
                    selectedDate={date} 
                    onSelectDate={setDate} 
                    blockedDates={blockedDates} 
                    availability={availability}
                    loading={availabilityLoading}
                  />
                </div>

                <div className={`transition-all duration-500 overflow-hidden ${date ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  {date && (
                    <div className="p-5 rounded-2xl flex items-start gap-4 border bg-emerald-50/50 border-emerald-200 text-emerald-800">
                      <div className="p-2 rounded-full bg-emerald-100">
                        <Check size={18} className="text-emerald-600 shrink-0" />
                      </div>
                      <div className="pt-1">
                        <h4 className="font-bold text-sm mb-1">Date Available</h4>
                        <p className="text-xs opacity-80 leading-relaxed">
                          Excellent choice. This date is open for reservations.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-8 border-t border-stone-100">
                  <div className="flex flex-col mb-8">
                    <span className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-1">Base Price Estimate</span>
                    <span className="font-serif text-4xl font-bold text-luxury-emerald-950 flex items-baseline gap-1">
                      <span className="text-xl text-stone-400 font-sans">LKR</span> 
                      {dbHall.basePrice.toLocaleString()}
                    </span>
                  </div>
                  
                  <Link 
                    to={`/booking/packages?hall=${dbHall.id}&date=${date}`}
                    className={`group relative flex items-center justify-center w-full py-5 px-6 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all duration-300 overflow-hidden ${
                      !date
                        ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                        : 'bg-luxury-emerald-950 text-white hover:bg-luxury-emerald-900 shadow-xl shadow-luxury-emerald-950/20 hover:-translate-y-1'
                    }`}
                    onClick={(e) => !date && e.preventDefault()}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Proceed to Packages
                      {date && <ChevronLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform" />}
                    </span>
                    {date && (
                      <div className="absolute inset-0 bg-gradient-to-r from-luxury-emerald-900 to-luxury-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
