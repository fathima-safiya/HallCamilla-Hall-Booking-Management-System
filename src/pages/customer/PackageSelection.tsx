import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Check, ChevronRight, ArrowLeft, Loader2, Sparkles, Receipt, Plus, Trash2, X, Users, FileText } from 'lucide-react';
import { useCatalog } from '../../hooks/useCatalog';
import { useHalls } from '../../hooks/useHalls';
import { useAuth } from '../../context/AuthContext';
import { useVendors } from '../../hooks/useVendors';
import { quotationService } from '../../services/quotationService';
import type { Package, Service, ExternalVendor } from '../../types/app';

const VENDOR_CATEGORIES = [
  'Photographer', 'Videographer', 'DJ / Music Band', 'Decorator', 
  'Makeup Artist', 'Catering Service', 'Wedding Planner', 'Other'
];
import { getHotelServiceImage, getExactServiceImage } from '../../utils/imageUtils';

export default function PackageSelection() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as any;

  const { packages, services, loading: catalogLoading } = useCatalog();
  const { halls, loading: hallsLoading } = useHalls();
  const { vendors, loading: vendorsLoading } = useVendors();
  const { user } = useAuth();
  
  const activeVendors = vendors.filter(v => v.status === 'Active');

  const hallId = searchParams.get('hall') || '';
  const date = searchParams.get('date') || '';
  const guestsStr = searchParams.get('guests') || '100';
  const guests = parseInt(guestsStr, 10);

  const selectedHall = halls.find(h => h.id === hallId);

  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedExtraServices, setSelectedExtraServices] = useState<Service[]>([]);
  const [selectedExternalVendors, setSelectedExternalVendors] = useState<ExternalVendor[]>([]);
  const [activeExternalVendor, setActiveExternalVendor] = useState<'new' | null>(null);

  // Initialize from location state if available (from Budget Calculator)
  const hasInitializedRef = useRef(false);
  
  useEffect(() => {
    if (hasInitializedRef.current) return;
    
    let initialized = false;
    
    if (state?.packageId && packages.length > 0 && !selectedPackage) {
      const pkg = packages.find(p => p.id === state.packageId);
      if (pkg) {
        setSelectedPackage(pkg);
        initialized = true;
      }
    }
    
    if (state?.extraServiceIds && services.length > 0 && selectedExtraServices.length === 0) {
      const extraSvcs = state.extraServiceIds.map((id: string) => services.find((s: Service) => s.id === id)).filter(Boolean);
      if (extraSvcs.length > 0) {
        setSelectedExtraServices(extraSvcs);
        initialized = true;
      }
    }
    
    if (initialized || (packages.length > 0 && services.length > 0)) {
       // Mark as initialized once we have data, even if nothing was selected
       hasInitializedRef.current = true;
    }
  }, [state, packages, services, selectedPackage, selectedExtraServices.length]);

  // Form state for vendor modal
  const [modalServiceType, setModalServiceType] = useState('');
  const [modalVendorName, setModalVendorName] = useState('');
  const [modalContact, setModalContact] = useState('');
  const [modalBusinessName, setModalBusinessName] = useState('');
  const [modalNotes, setModalNotes] = useState('');

  const toggleExtraService = (service: Service) => {
    setSelectedExtraServices(prev => 
      prev.find(s => s.id === service.id)
        ? prev.filter(s => s.id !== service.id)
        : [...prev, service]
    );
  };

  const handleOpenVendorModal = (category: string = '') => {
    setActiveExternalVendor('new');
    setModalServiceType(category);
    setModalVendorName('');
    setModalContact('');
    setModalBusinessName('');
    setModalNotes('');
  };

  const submitExternalVendorModal = () => {
    if (!activeExternalVendor || !modalServiceType || !modalVendorName || !modalContact) return;

    const newVendor: ExternalVendor = {
      serviceType: modalServiceType,
      vendorName: modalVendorName,
      contactNumber: modalContact,
      businessName: modalBusinessName,
      notes: modalNotes
    };

    setSelectedExternalVendors(prev => [...prev, newVendor]);
    setActiveExternalVendor(null);
  };

  const removeExternalVendor = (idx: number) => {
    setSelectedExternalVendors(prev => prev.filter((_, i) => i !== idx));
  };

  const hallPrice = selectedHall?.basePrice || 0;
  const packagePricePerPerson = selectedPackage?.packagePrice || 0;
  const packagePrice = packagePricePerPerson * guests;
  const extraServicesPrice = selectedExtraServices.reduce((sum, s) => sum + s.price, 0);
  const totalAmount = hallPrice + packagePrice + extraServicesPrice;

  const handleContinueToBooking = () => {
    navigate('/booking', {
      state: {
        hallId,
        date,
        guests,
        packageId: selectedPackage?.id,
        selectedServices: selectedExtraServices.map(s => s.id),
        hotelExtraServices: selectedExtraServices.map(s => s.id),
        externalVendors: selectedExternalVendors,
        hallPrice,
        packagePricePerPerson,
        packagePrice,
        extraServicesPrice,
        totalAmount
      }
    });
  };

  if (catalogLoading || hallsLoading) {
    return (
      <div className="pt-32 pb-24 flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 text-luxury-emerald-900 animate-spin" />
      </div>
    );
  }

  if (!selectedPackage) {
    return (
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 animate-fade-in">
        <div className="text-center max-w-2xl mx-auto mb-16 relative">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-[1px] bg-luxury-gold-400 mt-3 mr-4"></div>
            <Sparkles className="text-luxury-gold-600 animate-pulse" size={24} />
            <div className="w-16 h-[1px] bg-luxury-gold-400 mt-3 ml-4"></div>
          </div>
          <span className="text-luxury-gold-600 text-xs font-bold tracking-widest uppercase mb-4 block">Event Details</span>
          <h1 className="font-serif text-4xl lg:text-6xl text-luxury-emerald-950 font-bold mb-6 leading-tight">Customize Your Event</h1>
          <p className="text-stone-500 text-lg max-w-lg mx-auto">Choose a curated experience to build upon. You can customize extra services in the next step.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.filter(pkg => pkg.status !== 'Inactive').map((pkg, idx) => (
            <div 
              key={pkg.id} 
              className="bg-white border-2 border-transparent hover:border-luxury-gold-400/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 group flex flex-col animate-slide-up relative"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              {/* Premium Top Highlight */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-luxury-gold-300 via-luxury-gold-500 to-luxury-gold-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
              
              <div className="h-56 bg-stone-100 overflow-hidden relative">
                <img 
                  src={pkg.image || "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80"} 
                  alt={pkg.packageName} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-emerald-950/90 via-luxury-emerald-950/30 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 flex items-end">
                  <div className="flex items-center space-x-3 text-white">
                    <Sparkles size={24} className="text-luxury-gold-400 group-hover:animate-pulse" />
                    <h3 className="font-serif text-2xl font-bold tracking-wide">{pkg.packageName}</h3>
                  </div>
                </div>
              </div>
              
              <div className="p-8 flex-grow flex flex-col bg-gradient-to-b from-white to-stone-50/50">
                <div className="flex items-center gap-2 mb-4 text-stone-600">
                  <Users size={16} className="text-luxury-gold-500" />
                  <span className="text-sm font-bold">Capacity: {pkg.guestLimit} Guests</span>
                </div>
                
                <p className="text-sm text-stone-500 leading-relaxed mb-6 flex-grow group-hover:text-stone-700 transition-colors line-clamp-3">{pkg.notes}</p>
                
                <div className="space-y-2 mb-8">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Included Features</span>
                  <ul className="text-sm text-stone-600 space-y-2">
                    {pkg.includedServices.slice(0, 5).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check size={14} className="text-luxury-emerald-700 mt-0.5 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                    {pkg.includedServices.length > 5 && (
                      <li className="text-stone-400 text-xs italic pl-6">+{pkg.includedServices.length - 5} more items</li>
                    )}
                  </ul>
                </div>
                
                <div className="pt-6 border-t border-stone-200/60 flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-luxury-emerald-900/60 block mb-1">Base Price</span>
                    <span className="font-serif text-2xl font-bold text-luxury-emerald-950">
                      LKR {pkg.packagePrice.toLocaleString()} <span className="text-sm font-normal text-stone-500">/ person</span>
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedPackage(pkg)}
                    className="px-6 py-3 bg-luxury-emerald-950 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-luxury-gold-500 hover:text-luxury-emerald-950 hover:shadow-lg transition-all duration-300 transform active:scale-95"
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    );
  }

  // Customization Step
  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 animate-fade-in">
      <div className="mb-8 border-b border-stone-200 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-luxury-gold-600 text-[10px] font-bold tracking-[0.2em] uppercase block mb-2">Step 2</span>
          <h1 className="font-serif text-4xl text-luxury-emerald-950 font-bold">Customize Your Event</h1>
        </div>
        
        <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-stone-100 flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Date</span>
            <span className="text-sm font-bold text-luxury-emerald-950">{date ? new Date(date).toLocaleDateString() : 'Not set'}</span>
          </div>
          <div className="w-px h-8 bg-stone-200"></div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Guests</span>
            <span className="text-sm font-bold text-luxury-emerald-950">{guests}</span>
          </div>
          <div className="w-px h-8 bg-stone-200"></div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Venue</span>
            <span className="text-sm font-bold text-luxury-emerald-950 truncate max-w-[150px]">{selectedHall?.hallName || 'Not set'}</span>
          </div>
        </div>
      </div>

      <button 
        onClick={() => setSelectedPackage(null)}
        className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-500 bg-white hover:bg-luxury-emerald-950 hover:text-white hover:border-luxury-emerald-950 border border-stone-200 active:bg-luxury-emerald-900 active:border-luxury-emerald-900 px-4 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md group mb-8"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Change Package
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Services Selection */}
        <div className="lg:col-span-2 space-y-12 animate-slide-up">
          
          <section>
            <h2 className="font-serif text-3xl font-bold text-luxury-emerald-950 mb-6">Included in {selectedPackage.packageName}</h2>
            <div className="bg-white border border-luxury-gold-200 rounded-xl p-6 shadow-sm">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedPackage.includedServices.map((serviceName, i) => (
                  <li key={i} className="flex items-start space-x-3 text-sm text-stone-600">
                    <div className="w-5 h-5 rounded-full bg-luxury-emerald-50 border border-luxury-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} className="text-luxury-emerald-700" />
                    </div>
                    <span>{serviceName}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-3xl font-bold text-luxury-emerald-950">Hotel Extra Services</h2>
              <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Optional</span>
            </div>
            
            {Object.entries(services.filter(s => s.status !== 'Inactive').reduce((acc, service) => {
              const cat = service.category || 'Other';
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(service);
              return acc;
            }, {} as Record<string, Service[]>)).map(([category, catServices]) => (
              <div key={category} className="mb-10">
                <h3 className="font-serif text-xl font-bold text-luxury-emerald-900 border-b border-stone-200 pb-2 mb-6">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {catServices.map(service => {
                    const isSelected = selectedExtraServices.some(s => s.id === service.id);
                    return (
                      <div 
                        key={service.id}
                        onClick={() => toggleExtraService(service)}
                        className={`rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-300 group relative shadow-sm hover:shadow-xl hover:-translate-y-1 ${
                          isSelected 
                            ? 'border-luxury-emerald-900 ring-4 ring-luxury-emerald-100' 
                            : 'border-transparent hover:border-luxury-gold-400/50'
                        }`}
                      >
                        <div className="h-40 overflow-hidden relative bg-stone-100">
                          <img 
                            src={getExactServiceImage(service.serviceName) || service.image || getHotelServiceImage(service.serviceName)} 
                            alt={service.serviceName} 
                            className={`w-full h-full object-cover transition-transform duration-700 ${isSelected ? 'scale-105' : 'group-hover:scale-110'}`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-luxury-emerald-950/80 to-transparent"></div>
                          
                          {isSelected && (
                            <div className="absolute top-3 right-3 w-8 h-8 bg-luxury-emerald-900 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-fade-in z-20">
                              <Check size={16} className="text-white" />
                            </div>
                          )}

                          <div className="absolute bottom-4 left-4 right-4 text-white">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-luxury-gold-400 block mb-1">{service.category || 'Service'}</span>
                            <h4 className="font-serif text-lg font-bold leading-tight mb-1 drop-shadow-md">{service.serviceName}</h4>
                            <span className="font-bold text-sm drop-shadow-md">+LKR {service.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-3xl font-bold text-luxury-emerald-950">Customer Own Vendors</h2>
                <p className="text-sm text-stone-500 mt-2">You can add your preferred external vendors for your event.</p>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Optional</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {VENDOR_CATEGORIES.map(cat => {
                const vendorCount = selectedExternalVendors.filter(v => v.serviceType === cat).length;
                return (
                <div 
                  key={cat}
                  onClick={() => handleOpenVendorModal(cat)}
                  className="bg-white border-2 border-transparent hover:border-luxury-gold-400/50 rounded-xl p-4 shadow-sm hover:shadow-md cursor-pointer transition-all text-center flex flex-col items-center justify-center gap-3 min-h-[120px] relative group"
                >
                  <Plus size={24} className="text-luxury-gold-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-luxury-emerald-950">{cat}</span>
                  {vendorCount > 0 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-luxury-emerald-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md">
                      {vendorCount}
                    </div>
                  )}
                </div>
              )})}
            </div>

            {selectedExternalVendors.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-luxury-emerald-950 mb-3">Added Vendors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedExternalVendors.map((ext, idx) => (
                    <div key={idx} className="bg-stone-50 border border-stone-200 rounded-xl p-5 shadow-sm relative group">
                      <button 
                        onClick={() => removeExternalVendor(idx)}
                        className="absolute top-3 right-3 p-1.5 bg-white text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                      >
                        <Trash2 size={14} />
                      </button>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold-600 block mb-1">{ext.serviceType}</span>
                      <h4 className="font-bold text-stone-800 text-base mb-1">{ext.vendorName}</h4>
                      <p className="text-xs text-stone-500 mb-2">{ext.contactNumber}</p>
                      {ext.businessName && <p className="text-xs text-stone-500 mb-1"><span className="font-semibold">Business:</span> {ext.businessName}</p>}
                      {ext.notes && <p className="text-[10px] text-stone-400 italic line-clamp-2 mt-2 pt-2 border-t border-stone-200/60">Note: {ext.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

        </div>

        {/* Right Column: Live Summary */}
        <div className="lg:col-span-1 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="bg-white border border-stone-200 rounded-2xl shadow-xl sticky top-32 overflow-hidden">
            <div className="bg-luxury-emerald-950 text-white p-6 flex items-center gap-3">
              <Receipt size={24} className="text-luxury-gold-400" />
              <h3 className="font-serif text-xl font-bold">Booking Summary</h3>
            </div>
            
            <div className="p-6 space-y-6">
              
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">Hall</span>
                  <span className="font-bold text-sm text-stone-800">{selectedHall?.hallName}</span>
                </div>
                <span className="font-bold text-stone-600">LKR {hallPrice.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">Package</span>
                  <span className="font-bold text-sm text-stone-800">{selectedPackage.packageName}</span>
                  <p className="text-[10px] text-stone-500 mt-0.5">LKR {packagePricePerPerson.toLocaleString()} × {guests} guests</p>
                </div>
                <span className="font-bold text-stone-600">LKR {packagePrice.toLocaleString()}</span>
              </div>

              {selectedExtraServices.length > 0 && (
                <div className="pt-4 border-t border-stone-100">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-emerald-900 block mb-3">Hotel Extra Services</span>
                  <ul className="space-y-3">
                    {selectedExtraServices.map(s => (
                      <li key={s.id} className="flex justify-between text-sm">
                        <span className="text-stone-600">{s.serviceName}</span>
                        <span className="font-bold text-stone-600">LKR {s.price.toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedExternalVendors.length > 0 && (
                <div className="pt-4 border-t border-stone-100">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-3">Customer Own Vendors</span>
                  <ul className="space-y-2">
                    {selectedExternalVendors.map((ext, idx) => (
                      <li key={idx} className="flex flex-col text-sm text-stone-600 mb-2 bg-stone-50 p-2 rounded-lg border border-stone-100">
                        <div className="flex items-center space-x-2 font-semibold">
                          <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold-400 shrink-0"></div>
                          <span>{ext.serviceType}</span>
                        </div>
                        {ext.vendorName && <span className="text-xs ml-3.5 mt-0.5 text-stone-500">{ext.vendorName}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-6 border-t-2 border-stone-200 flex justify-between items-end">
                <span className="font-bold uppercase tracking-widest text-luxury-emerald-950">Total Amount</span>
                <span className="font-serif text-2xl font-bold text-luxury-gold-600">
                  LKR {totalAmount.toLocaleString()}
                </span>
              </div>



              <button 
                onClick={handleContinueToBooking}
                className="w-full bg-luxury-gold-500 text-luxury-emerald-950 py-4 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-luxury-gold-400 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ChevronRight size={16} />
              </button>

            </div>
          </div>
        </div>

      </div>
      {activeExternalVendor && createPortal(
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in relative z-[101]">
            <div className="bg-luxury-emerald-950 p-5 flex justify-between items-center text-white">
              <h3 className="font-serif text-xl font-bold">Add External Vendor</h3>
              <button onClick={() => setActiveExternalVendor(null)} className="text-stone-300 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <p className="text-sm text-stone-600 mb-6">Please provide the details for your external vendor.</p>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Service Type *</label>
                  <select 
                    required
                    value={modalServiceType}
                    onChange={e => setModalServiceType(e.target.value)}
                    className="w-full border-2 border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-luxury-emerald-900 transition-colors bg-stone-50"
                  >
                    <option value="" disabled>Select Type</option>
                    {VENDOR_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Vendor Name *</label>
                  <input 
                    type="text"
                    required
                    value={modalVendorName}
                    onChange={e => setModalVendorName(e.target.value)}
                    className="w-full border-2 border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-luxury-emerald-900 transition-colors"
                    placeholder="e.g., Studio XYZ"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Contact Number *</label>
                  <input 
                    type="text"
                    required
                    value={modalContact}
                    onChange={e => setModalContact(e.target.value)}
                    className="w-full border-2 border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-luxury-emerald-900 transition-colors"
                    placeholder="e.g., 0771234567"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Business Name</label>
                  <input 
                    type="text"
                    value={modalBusinessName}
                    onChange={e => setModalBusinessName(e.target.value)}
                    className="w-full border-2 border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-luxury-emerald-900 transition-colors"
                    placeholder="Optional"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Additional Notes</label>
                  <textarea 
                    value={modalNotes}
                    onChange={e => setModalNotes(e.target.value)}
                    rows={2}
                    className="w-full border-2 border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-luxury-emerald-900 transition-colors resize-none"
                    placeholder="E.g., Full day coverage"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-stone-100 bg-stone-50 flex justify-end gap-3">
              <button 
                onClick={() => setActiveExternalVendor(null)}
                className="px-4 py-2 text-stone-500 font-bold text-xs uppercase tracking-wider hover:text-stone-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={submitExternalVendorModal}
                disabled={!modalServiceType || !modalVendorName || !modalContact}
                className="bg-luxury-emerald-950 text-white px-6 py-2 rounded font-bold text-xs uppercase tracking-wider hover:bg-luxury-emerald-900 transition-colors disabled:opacity-50"
              >
                Add Vendor
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
