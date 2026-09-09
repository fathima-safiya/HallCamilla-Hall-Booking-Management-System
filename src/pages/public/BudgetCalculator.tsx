import { useState, useEffect } from 'react';
import { Calculator, Users, Plus, Check, Info, Minus, ChevronRight, Sparkles } from 'lucide-react';
import { useHalls } from '../../hooks/useHalls';
import { useCatalog } from '../../hooks/useCatalog';
import { Link, useNavigate } from 'react-router-dom';
import { getHotelServiceImage, getExactServiceImage } from '../../utils/imageUtils';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import { Calendar, AlertCircle, Loader2 } from 'lucide-react';

export default function BudgetCalculator() {
  const navigate = useNavigate();
  const { halls } = useHalls();
  const { packages, services } = useCatalog();
  const { user } = useAuth();

  const [selectedHall, setSelectedHall] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [selectedExtraServices, setSelectedExtraServices] = useState<string[]>([]);
  const [guestCount, setGuestCount] = useState<number>(100);
  const [eventDate, setEventDate] = useState<string>('');
  const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');

  useEffect(() => {
    if (!selectedHall || !eventDate) {
      setAvailabilityStatus('idle');
      return;
    }
    
    let isMounted = true;
    setAvailabilityStatus('checking');
    
    bookingService.checkAvailability(selectedHall, eventDate)
      .then(isAvailable => {
        if (isMounted) {
          setAvailabilityStatus(isAvailable ? 'available' : 'unavailable');
        }
      })
      .catch(() => {
        if (isMounted) setAvailabilityStatus('unavailable');
      });
      
    return () => { isMounted = false; };
  }, [selectedHall, eventDate]);

  const toggleExtraService = (id: string) => {
    setSelectedExtraServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const incrementGuests = () => setGuestCount(prev => prev + 10);
  const decrementGuests = () => setGuestCount(prev => Math.max(10, prev - 10));

  const hallObj = halls.find(h => h.id === selectedHall);
  const packageObj = packages.find(p => p.id === selectedPackage);
  const extraServicesObjs = services.filter(s => selectedExtraServices.includes(s.id));

  const hallPrice = hallObj?.basePrice || 0;
  const packagePrice = packageObj?.packagePrice || 0;
  const extraServicesPrice = extraServicesObjs.reduce((acc, curr) => acc + curr.price, 0);
  
  let additionalGuestCharges = 0;
  if (packageObj && guestCount > packageObj.guestLimit) {
    additionalGuestCharges = (guestCount - packageObj.guestLimit) * packageObj.extraGuestCharge;
  }

  const totalBudget = hallPrice + packagePrice + extraServicesPrice + additionalGuestCharges;

  return (
    <div className="bg-stone-50 min-h-screen pb-40 font-sans animate-fade-in relative">
      
      {/* Premium Hero Section */}
      <div className="relative pt-32 pb-20 bg-luxury-emerald-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 to-transparent"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-luxury-gold-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-luxury-gold-500/10 text-luxury-gold-400 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-luxury-gold-500/20 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <Calculator size={32} />
          </div>
          <span className="text-luxury-gold-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block">Interactive Planning Tool</span>
          <h1 className="font-serif text-4xl lg:text-6xl font-bold mb-6 drop-shadow-md">Event Budget Calculator</h1>
          <p className="text-stone-300 max-w-2xl mx-auto text-sm leading-relaxed">
            Design your perfect event and estimate costs instantly. Select a breathtaking venue, a curated package, and bespoke services to see your estimated investment.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12 mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          
          {/* Selections Column */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Step 1: Guest Count & Venue */}
            <section className="bg-white p-8 rounded-3xl border border-stone-100 shadow-xl shadow-stone-200/40">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
                <h2 className="font-serif text-2xl font-bold text-luxury-emerald-950 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-luxury-emerald-50 text-luxury-emerald-800 flex items-center justify-center text-sm font-bold">1</span>
                  Guests & Venue
                </h2>
              </div>
              
              <div className="mb-10 bg-stone-50 rounded-2xl p-6 border border-stone-100 max-w-3xl mx-auto flex flex-col md:flex-row gap-8">
                
                <div className="flex-1">
                  <label className="block text-xs uppercase font-bold text-stone-500 tracking-wider mb-4 text-center md:text-left">Expected Guest Count</label>
                  <div className="flex items-center justify-center md:justify-start gap-8">
                    <button onClick={decrementGuests} className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-luxury-emerald-50 hover:text-luxury-emerald-800 hover:border-luxury-emerald-200 transition-colors shadow-sm active:scale-95 shrink-0">
                      <Minus size={20} />
                    </button>
                    <div className="flex items-center justify-center gap-3 min-w-[120px]">
                      <Users size={24} className="text-luxury-gold-500 shrink-0" />
                      <span className="font-serif text-4xl font-bold text-luxury-emerald-950 text-center">{guestCount}</span>
                    </div>
                    <button onClick={incrementGuests} className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-luxury-emerald-50 hover:text-luxury-emerald-800 hover:border-luxury-emerald-200 transition-colors shadow-sm active:scale-95 shrink-0">
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <div className="hidden md:block w-px bg-stone-200"></div>

                <div className="flex-1">
                  <label className="block text-xs uppercase font-bold text-stone-500 tracking-wider mb-4 text-center md:text-left">Event Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-luxury-gold-500" size={20} />
                    <input 
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-luxury-emerald-500/20 focus:border-luxury-emerald-500 outline-none transition-all font-bold text-stone-800"
                    />
                  </div>
                  
                  {availabilityStatus === 'checking' && (
                    <div className="mt-3 flex items-center gap-2 text-stone-500 text-xs font-bold animate-pulse">
                      <Loader2 size={14} className="animate-spin" /> Checking availability...
                    </div>
                  )}
                  {availabilityStatus === 'available' && (
                    <div className="mt-3 flex items-center gap-2 text-luxury-emerald-700 text-xs font-bold">
                      <Check size={14} /> Available on this date!
                    </div>
                  )}
                  {availabilityStatus === 'unavailable' && (
                    <div className="mt-3 flex items-center gap-2 text-red-600 text-xs font-bold bg-red-50 p-2 rounded-lg border border-red-100">
                      <AlertCircle size={14} /> Sorry, this hall is unavailable on the selected date.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs uppercase font-bold text-stone-500 tracking-wider mb-4">Select a Banquet Hall</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {halls.map(h => {
                    const hallImage = h.images && h.images.length > 0 ? h.images[0] : 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';
                    return (
                    <div 
                      key={h.id}
                      onClick={() => setSelectedHall(h.id)}
                      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2 flex flex-col ${selectedHall === h.id ? 'border-luxury-emerald-700 shadow-lg scale-[1.02]' : 'border-stone-100 shadow-sm hover:shadow-md hover:border-luxury-emerald-200'}`}
                    >
                      <div className="h-48 w-full relative shrink-0">
                        <img src={hallImage} alt={h.hallName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        {selectedHall === h.id && (
                          <div className="absolute top-4 right-4 w-8 h-8 bg-luxury-gold-500 rounded-full flex items-center justify-center shadow-lg text-white">
                            <Check size={18} strokeWidth={3} />
                          </div>
                        )}
                        <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start">
                           <span className="text-luxury-gold-300 text-[9px] font-bold tracking-widest uppercase mb-1.5 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-sm border border-luxury-gold-500/30">
                             {h.type || 'Premium Venue'}
                           </span>
                           <h4 className="font-serif text-xl font-bold mb-0.5 text-white drop-shadow-md">{h.hallName}</h4>
                           <span className="text-xs uppercase tracking-wider text-stone-300 font-bold drop-shadow-md">Cap: {h.capacity} PAX</span>
                        </div>
                      </div>
                      <div className={`p-5 flex-grow flex flex-col ${selectedHall === h.id ? 'bg-luxury-emerald-950 text-white' : 'bg-white text-stone-800'}`}>
                          <p className={`text-xs leading-relaxed mb-4 line-clamp-2 ${selectedHall === h.id ? 'text-stone-300' : 'text-stone-500'}`}>{h.description || 'Experience elegance and comfort in this premium banquet venue, tailored for your specific needs.'}</p>
                          <div className={`mt-auto pt-4 border-t flex items-center justify-between ${selectedHall === h.id ? 'border-white/10' : 'border-stone-100'}`}>
                            <span className={`text-[10px] uppercase font-bold ${selectedHall === h.id ? 'text-white/50' : 'text-stone-500'}`}>Base Price</span>
                            <span className={`font-bold text-lg ${selectedHall === h.id ? 'text-luxury-gold-400' : 'text-luxury-emerald-950'}`}>LKR {h.basePrice.toLocaleString()}</span>
                          </div>
                      </div>
                    </div>
                  )})}
                </div>
              </div>
            </section>

            {/* Step 2: Base Package */}
            <section className="bg-white p-8 rounded-3xl border border-stone-100 shadow-xl shadow-stone-200/40">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
                <h2 className="font-serif text-2xl font-bold text-luxury-emerald-950 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-luxury-emerald-50 text-luxury-emerald-800 flex items-center justify-center text-sm font-bold">2</span>
                  Base Package
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {packages.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => setSelectedPackage(p.id)}
                    className={`relative rounded-2xl border-2 cursor-pointer transition-all duration-500 flex flex-col overflow-hidden group shadow-md hover:shadow-xl hover:-translate-y-1 ${
                      selectedPackage === p.id 
                        ? 'border-luxury-gold-500 ring-4 ring-luxury-gold-500/20 bg-luxury-emerald-950 scale-[1.02]' 
                        : 'border-transparent hover:border-luxury-gold-400/30 bg-white'
                    }`}
                  >
                    <div className="h-40 overflow-hidden relative shrink-0">
                      <img 
                        src={p.image || "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80"} 
                        alt={p.packageName} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                      {selectedPackage === p.id && (
                        <div className="absolute top-3 right-3 w-8 h-8 bg-luxury-gold-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-fade-in z-20">
                          <Check size={16} className="text-white" />
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h4 className="font-serif text-xl font-bold mb-1 leading-tight">{p.packageName}</h4>
                        <p className="text-[10px] uppercase tracking-[0.15em] font-bold flex items-center gap-1.5 text-stone-300">
                          <Users size={12} /> {p.guestLimit} Guests
                        </p>
                      </div>
                    </div>
                    
                    <div className={`p-5 flex-grow flex flex-col ${selectedPackage === p.id ? 'bg-luxury-emerald-950 text-white' : 'bg-white text-stone-800'}`}>
                      <p className={`text-xs leading-relaxed mb-4 line-clamp-2 ${selectedPackage === p.id ? 'text-stone-300' : 'text-stone-500'}`}>{p.notes}</p>
                      
                      <div className="space-y-2 mb-6">
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${selectedPackage === p.id ? 'text-luxury-gold-400' : 'text-stone-400'}`}>Included Features</span>
                        <ul className="space-y-1">
                          {p.includedServices.slice(0, 3).map((feat, i) => (
                            <li key={i} className={`flex items-start gap-2 text-xs ${selectedPackage === p.id ? 'text-stone-200' : 'text-stone-600'}`}>
                              <Check size={12} className={`mt-0.5 shrink-0 ${selectedPackage === p.id ? 'text-luxury-gold-500' : 'text-luxury-emerald-700'}`} />
                              <span className="truncate">{feat}</span>
                            </li>
                          ))}
                          {p.includedServices.length > 3 && (
                            <li className={`text-[10px] italic pl-5 ${selectedPackage === p.id ? 'text-stone-400' : 'text-stone-400'}`}>+{p.includedServices.length - 3} more items</li>
                          )}
                        </ul>
                      </div>

                      <div className={`mt-auto pt-4 border-t ${selectedPackage === p.id ? 'border-white/10' : 'border-stone-100'}`}>
                        <div className={`text-[9px] mb-1 uppercase font-bold tracking-[0.2em] ${selectedPackage === p.id ? 'text-white/50' : 'text-stone-400'}`}>Base Price</div>
                        <p className={`font-bold text-lg ${selectedPackage === p.id ? 'text-luxury-gold-400' : 'text-luxury-emerald-950'}`}>LKR {p.packagePrice.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Step 3: Hotel Extra Services */}
            <section className="bg-white p-8 rounded-3xl border border-stone-100 shadow-xl shadow-stone-200/40">
               <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
                <h2 className="font-serif text-2xl font-bold text-luxury-emerald-950 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-luxury-emerald-50 text-luxury-emerald-800 flex items-center justify-center text-sm font-bold">3</span>
                  Hotel Extra Services
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {services.map(s => {
                  const isSelected = selectedExtraServices.includes(s.id);
                  return (
                    <div 
                      key={s.id}
                      onClick={() => toggleExtraService(s.id)}
                      className={`rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-300 group relative shadow-sm hover:shadow-xl hover:-translate-y-1 ${
                        isSelected 
                          ? 'border-luxury-emerald-900 ring-4 ring-luxury-emerald-100' 
                          : 'border-transparent hover:border-luxury-gold-400/50'
                      }`}
                    >
                      <div className="h-40 overflow-hidden relative shrink-0 bg-stone-100">
                        <img 
                          src={getExactServiceImage(s.serviceName) || s.image || getHotelServiceImage(s.serviceName)} 
                          alt={s.serviceName} 
                          className={`w-full h-full object-cover transition-transform duration-700 ${isSelected ? 'scale-105' : 'group-hover:scale-110'}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-8 h-8 bg-luxury-gold-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-fade-in z-20">
                            <Check size={16} className="text-white" />
                          </div>
                        )}

                        <div className="absolute bottom-3 left-4 right-4 text-white">
                          <span className="text-[9px] uppercase font-bold tracking-widest text-luxury-gold-400 block mb-0.5 bg-black/40 px-2 py-0.5 rounded-sm border border-luxury-gold-500/30 w-max">{s.category || 'Service'}</span>
                        </div>
                      </div>

                      <div className={`p-5 flex-grow flex flex-col ${isSelected ? 'bg-luxury-emerald-950 text-white' : 'bg-white text-stone-800'}`}>
                        <h4 className="font-serif text-lg font-bold leading-tight mb-2">{s.serviceName}</h4>
                        <p className={`text-xs leading-relaxed mb-4 line-clamp-2 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>{s.description || 'Add an extra touch of luxury to your event with this bespoke service.'}</p>
                        
                        <div className={`mt-auto pt-4 border-t flex items-center justify-between ${isSelected ? 'border-white/10' : 'border-stone-100'}`}>
                          <span className={`text-[9px] uppercase font-bold tracking-[0.2em] ${isSelected ? 'text-white/50' : 'text-stone-400'}`}>Price</span>
                          <span className={`font-bold text-lg ${isSelected ? 'text-luxury-gold-400' : 'text-luxury-emerald-950'}`}>+LKR {s.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Sticky Summary Column */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-luxury-emerald-950 to-black text-white rounded-3xl p-8 sticky top-32 shadow-2xl overflow-hidden relative border border-white/10">
              <div className="absolute top-0 right-0 w-48 h-48 bg-luxury-gold-500/10 rounded-bl-full pointer-events-none blur-2xl"></div>
              
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-luxury-gold-500/20 rounded-xl flex items-center justify-center border border-luxury-gold-500/30">
                  <Calculator size={20} className="text-luxury-gold-400" />
                </div>
                <h3 className="font-serif text-2xl font-bold">Estimation</h3>
              </div>
              
              <div className="space-y-6 relative z-10">
                <div className="group">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">Venue Selection</p>
                  <div className="flex justify-between items-end border-b border-white/5 pb-2 group-hover:border-luxury-gold-500/30 transition-colors">
                    <span className={`text-sm ${hallObj ? 'text-white' : 'text-white/40 italic'}`}>{hallObj?.hallName || 'Not Selected'}</span>
                    <span className="font-bold text-luxury-gold-400">LKR {hallPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="group">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">Base Package</p>
                  <div className="flex justify-between items-end border-b border-white/5 pb-2 group-hover:border-luxury-gold-500/30 transition-colors">
                    <span className={`text-sm ${packageObj ? 'text-white' : 'text-white/40 italic'}`}>{packageObj?.packageName || 'Not Selected'}</span>
                    <span className="font-bold text-luxury-gold-400">LKR {packagePrice.toLocaleString()}</span>
                  </div>
                </div>

                {additionalGuestCharges > 0 && (
                  <div className="bg-amber-950/30 p-3 rounded-lg border border-amber-500/20">
                    <p className="text-[10px] text-amber-500 uppercase tracking-widest font-bold mb-1 flex items-center gap-2">
                      <Users size={10} /> Additional Guests
                    </p>
                    <div className="flex justify-between items-start text-sm">
                      <span className="text-amber-100/80">
                        {guestCount - (packageObj?.guestLimit || 0)} extra guests<br/>
                        <span className="text-xs opacity-70">@ LKR {packageObj?.extraGuestCharge.toLocaleString()}/guest</span>
                      </span>
                      <span className="font-bold text-amber-400">LKR {additionalGuestCharges.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {extraServicesPrice > 0 && (
                  <div className="group">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-2">Hotel Extra Services ({selectedExtraServices.length})</p>
                    <div className="space-y-2 border-b border-white/5 pb-3 group-hover:border-luxury-gold-500/30 transition-colors">
                      {extraServicesObjs.map(s => (
                        <div key={s.id} className="flex justify-between items-end">
                          <span className="text-xs text-stone-300">{s.serviceName}</span>
                          <span className="font-bold text-sm text-luxury-gold-400">LKR {s.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-8 mt-8 border-t border-white/20 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-luxury-emerald-950 px-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold-500"></div>
                  </div>
                  <p className="text-xs text-center text-white/60 uppercase tracking-[0.2em] font-bold mb-2">Estimated Total</p>
                  <p className="font-serif text-3xl xl:text-4xl font-bold text-center text-white drop-shadow-lg leading-none mb-6">
                    <span className="text-lg text-luxury-gold-400 font-sans tracking-widest mr-1.5 align-top">LKR</span>
                    {totalBudget.toLocaleString()}
                  </p>
                  
                  <div className="bg-black/20 rounded-xl p-4 border border-white/10 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-stone-300">Advance Payment (20%)</span>
                      <span className="font-bold text-white">LKR {(totalBudget * 0.2).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-stone-400">Remaining Balance</span>
                      <span className="font-bold text-white">LKR {(totalBudget * 0.8).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl mt-6 flex gap-3 items-start">
                  <Info size={16} className="text-luxury-gold-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-white/70 leading-relaxed uppercase tracking-wider font-semibold">
                    This is a preliminary estimation. Final pricing may vary based on specific customization.
                  </p>
                </div>

                <button 
                  disabled={availabilityStatus === 'unavailable' || availabilityStatus === 'checking' || !eventDate || !selectedHall}
                  onClick={() => {
                    if (!hallObj) {
                      navigate('/halls');
                      return;
                    }
                    if (!user) {
                      navigate('/login', {
                        state: {
                          from: {
                            pathname: '/booking/packages',
                            search: `?hall=${hallObj.id}&guests=${guestCount}`,
                            state: {
                              packageId: packageObj?.id,
                              extraServiceIds: selectedExtraServices.map(s => s.id),
                              date: eventDate
                            }
                          }
                        }
                      });
                      return;
                    }
                    navigate(`/booking/packages?hall=${hallObj.id}&guests=${guestCount}`, {
                      state: {
                        packageId: packageObj?.id,
                        extraServiceIds: selectedExtraServices.map(s => s.id),
                        date: eventDate
                      }
                    });
                  }}
                  className={`w-full mt-4 group flex items-center justify-center py-4 font-bold uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg ${
                    availabilityStatus === 'unavailable' || !eventDate || !selectedHall
                      ? 'bg-stone-800 text-stone-500 cursor-not-allowed opacity-70' 
                      : 'bg-gradient-to-r from-luxury-gold-600 to-luxury-gold-400 text-luxury-emerald-950 hover:from-luxury-gold-500 hover:to-luxury-gold-300 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:-translate-y-0.5'
                  }`}
                >
                  {availabilityStatus === 'unavailable' ? 'Not Available' : !eventDate ? 'Select Date' : !selectedHall ? 'Select Hall' : 'Continue to Reservation'}
                  {availabilityStatus !== 'unavailable' && eventDate && selectedHall && <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
