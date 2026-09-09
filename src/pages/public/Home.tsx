import { ChevronRight, Calendar, Users, Maximize2, Camera, Paintbrush, Wind, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useHalls } from '../../hooks/useHalls';

export default function Home() {
  const navigate = useNavigate();
  const { halls } = useHalls();
  
  // Show all available halls
  const featuredHalls = halls.filter(h => h.status !== 'Hidden');

  return (
    <>
      {/* 2. Hero Section */}
      <section className="relative min-h-[90vh] md:min-h-[95vh] flex items-center justify-center pt-20 overflow-hidden w-full">
        {/* Background Image with Dark Emerald Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero_bg.png" 
            alt="Luxury Banquet Hall" 
            className="w-full h-full object-cover scale-105 filter brightness-[0.85] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-emerald-950/80 via-luxury-emerald-950/65 to-luxury-emerald-950/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white mt-12 animate-fade-in w-full">
          
          <span className="inline-block text-[11px] md:text-xs font-bold tracking-[0.25em] text-luxury-gold-400 uppercase mb-4">
            EXQUISITE EVENTS & CELEBRATIONS
          </span>
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[1.1] text-white mb-6 text-shine">
            Celebrate in Grandeur
          </h1>
          
          <p className="text-stone-200 text-base md:text-lg lg:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-10">
            Discover a sanctuary of elegance in Kurunegala, where timeless luxury meets impeccable service for your most precious moments.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/halls"
              className="w-full sm:w-auto px-8 py-4 bg-luxury-emerald-900 border border-luxury-gold-500/30 text-white font-semibold tracking-wider text-xs rounded hover:bg-luxury-emerald-800 transition-all duration-300 shadow-lg gold-glow-hover flex items-center justify-center gap-2"
            >
              BROWSE OUR HALLS
              <ChevronRight size={14} className="text-luxury-gold-400" />
            </Link>
            
            <Link 
              to="/halls"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/40 text-white font-semibold tracking-wider text-xs rounded hover:bg-white/10 hover:border-luxury-gold-400 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Calendar size={14} className="text-luxury-gold-400" />
              CHECK AVAILABILITY
            </Link>
          </div>
        </div>

        {/* Decorative Bottom Wave/Curve */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-stone-50 to-transparent pointer-events-none" />
      </section>

      {/* 3. Our Signature Spaces Section */}
      <section id="signature-spaces" className="py-24 max-w-7xl mx-auto px-6 scroll-mt-20 w-full">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-luxury-emerald-950 mb-4">
            Our Signature Spaces
          </h2>
          <div className="w-20 h-0.5 bg-luxury-gold-500 mx-auto" />
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid md:grid-cols-2 gap-10">
          {featuredHalls.map((hall, i) => (
            <div 
              key={hall.id}
              className="bg-white rounded-lg overflow-hidden border border-stone-200/80 shadow-md gold-glow-hover flex flex-col group cursor-pointer animate-slide-up"
              style={{ animationDelay: `${i * 150}ms` }}
              onClick={() => navigate(`/halls/${hall.id}`)}
            >
              {/* Image Showcase */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img 
                  src={hall.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80'} 
                  alt={hall.hallName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <span className="absolute top-4 left-4 bg-luxury-emerald-950/90 text-luxury-gold-300 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded border border-luxury-gold-500/20">
                  {hall.floor || 'Ground Floor'}
                </span>
              </div>

              {/* Details & Specs */}
              <div className="p-8 flex flex-col flex-grow text-left">
                <h3 className="font-serif text-2xl font-bold text-luxury-emerald-950 mb-3">
                  {hall.hallName}
                </h3>
                
                <p className="text-stone-600 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                  {hall.description}
                </p>

                {/* Grid of features */}
                <div className="grid grid-cols-2 gap-4 border-t border-stone-100 pt-6 mb-6">
                  <div className="flex items-center space-x-3 text-stone-700">
                    <Users size={16} className="text-luxury-gold-600" />
                    <span className="text-xs font-semibold">{hall.capacity} Guests Max</span>
                  </div>
                  <div className="flex items-center space-x-3 text-stone-700">
                    <Maximize2 size={16} className="text-luxury-gold-600" />
                    <span className="text-xs font-semibold">{hall.size || 'Not specified'}</span>
                  </div>
                </div>

                {/* Action button */}
                <button 
                  className="w-full py-3.5 border border-luxury-emerald-900/40 text-luxury-emerald-900 font-semibold tracking-wider text-xs rounded hover:bg-luxury-emerald-900 hover:text-white transition-all duration-300 text-center"
                >
                  VIEW DETAILS
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Why Camilla Banquet Hotel? Section */}
      <section className="py-24 bg-stone-100 border-y border-stone-200/50 w-full">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block text-[10px] md:text-xs font-bold tracking-widest text-luxury-gold-600 uppercase mb-2">
              OUR EXCELLENCE
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-luxury-emerald-950">
              Why Camilla Banquet Hotel?
            </h2>
          </div>

          {/* Luxury Custom Layout Grid */}
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Left Box - Big Exquisite Catering */}
            <div className="lg:col-span-5 relative rounded-lg overflow-hidden min-h-[350px] shadow-lg group animate-slide-up">
              <img 
                src="/catering.png" 
                alt="Exquisite Gourmet Catering" 
                className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-emerald-950 via-luxury-emerald-950/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 text-left text-white">
                <h3 className="font-serif text-2xl font-bold text-luxury-gold-300 mb-2">
                  Exquisite Catering
                </h3>
                <p className="text-stone-200 text-xs leading-relaxed max-w-sm">
                  A culinary journey curated by master chefs, blending local heritage with international finesse.
                </p>
              </div>
            </div>

            {/* Right Box - 3 Cards */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
              
              {/* Wide Card */}
              <div className="bg-white p-8 rounded-lg border border-stone-200/60 shadow-sm flex items-start space-x-6 text-left hover:shadow-md transition-shadow">
                <div className="p-4 bg-luxury-gold-100/70 rounded-full text-luxury-gold-700 shrink-0">
                  <Wind size={24} />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-luxury-emerald-950 mb-1.5 uppercase tracking-wide">
                    Climate Controlled
                  </h4>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    Centralized high-capacity AC systems ensuring guest comfort through all seasons.
                  </p>
                </div>
              </div>

              {/* Split Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Photo Card */}
                <div className="bg-white p-8 rounded-lg border border-stone-200/60 shadow-sm flex flex-col justify-between text-left hover:shadow-md transition-shadow">
                  <div className="p-3 bg-luxury-gold-100/70 rounded-full text-luxury-gold-700 w-fit mb-5">
                    <Camera size={20} />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-luxury-emerald-950 mb-1.5 uppercase tracking-wide">
                      Photography
                    </h4>
                    <p className="text-stone-600 text-xs leading-relaxed">
                      In-house studio partners for capturing memories.
                    </p>
                  </div>
                </div>

                {/* Decor Card */}
                <div className="bg-white p-8 rounded-lg border border-stone-200/60 shadow-sm flex flex-col justify-between text-left hover:shadow-md transition-shadow">
                  <div className="p-3 bg-luxury-gold-100/70 rounded-full text-luxury-gold-700 w-fit mb-5">
                    <Paintbrush size={20} />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-luxury-emerald-950 mb-1.5 uppercase tracking-wide">
                      Artful Decor
                    </h4>
                    <p className="text-stone-600 text-xs leading-relaxed">
                      Custom floral and stage designs tailored to your vision.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. Your Journey to a Perfect Event Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-20">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-luxury-emerald-950 mb-4">
            Your Journey to a Perfect Event
          </h2>
          <div className="w-16 h-0.5 bg-luxury-gold-500 mx-auto" />
        </div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-10 left-12 right-12 h-[1px] bg-stone-200 z-0" />

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-luxury-emerald-950 text-white font-bold text-lg rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border-2 border-luxury-gold-400">
              1
            </div>
            <h3 className="font-serif text-base font-bold text-luxury-emerald-950 mb-2 uppercase tracking-wider">
              Select Hall
            </h3>
            <p className="text-stone-600 text-xs leading-relaxed max-w-[200px]">
              Choose from Grand or Sky Hall based on your guest list.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-luxury-emerald-950 text-white font-bold text-lg rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border-2 border-luxury-gold-400">
              2
            </div>
            <h3 className="font-serif text-base font-bold text-luxury-emerald-950 mb-2 uppercase tracking-wider">
              Check Dates
            </h3>
            <p className="text-stone-600 text-xs leading-relaxed max-w-[200px]">
              Verify availability for your preferred wedding or event date.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-luxury-emerald-950 text-white font-bold text-lg rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border-2 border-luxury-gold-400">
              3
            </div>
            <h3 className="font-serif text-base font-bold text-luxury-emerald-950 mb-2 uppercase tracking-wider">
              Customize
            </h3>
            <p className="text-stone-600 text-xs leading-relaxed max-w-[200px]">
              Personalize your catering menu and decor packages.
            </p>
          </div>

          {/* Step 4 */}
          <div className="relative z-10 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-luxury-emerald-950 text-white font-bold text-lg rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border-2 border-luxury-gold-400">
              4
            </div>
            <h3 className="font-serif text-base font-bold text-luxury-emerald-950 mb-2 uppercase tracking-wider">
              Secure Booking
            </h3>
            <p className="text-stone-600 text-xs leading-relaxed max-w-[200px]">
              Confirm your reservation with a secure payment.
            </p>
          </div>

        </div>
      </section>

      {/* 6. Unforgettable Experiences (Testimonials) Section */}
      <section className="py-24 bg-luxury-emerald-950 text-white w-full">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <span className="inline-block text-[10px] md:text-xs font-bold tracking-[0.2em] text-luxury-gold-400 uppercase mb-2">
              CLIENT VOICES
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-white">
              Unforgettable Experiences
            </h2>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Testimonial 1 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-lg flex flex-col justify-between hover:bg-white/[0.08] transition-colors duration-300">
              <div>
                <div className="flex space-x-1 mb-5 text-luxury-gold-400">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
                <p className="text-stone-300 text-xs leading-relaxed italic mb-6">
                  "The Camilla Grand Hall was the perfect setting for our wedding. The attention to detail in the decor and the quality of the catering exceeded our expectations."
                </p>
              </div>
              <div className="flex items-center space-x-4 border-t border-white/10 pt-4">
                <div className="w-10 h-10 rounded-full bg-luxury-emerald-900 border border-luxury-gold-500/40 flex items-center justify-center font-bold text-xs text-luxury-gold-300 shrink-0">
                  SP
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white tracking-wider">SAJITH PERERA</h4>
                  <p className="text-[10px] text-luxury-gold-400 uppercase tracking-widest mt-0.5">Wedding Groom</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-lg flex flex-col justify-between hover:bg-white/[0.08] transition-colors duration-300">
              <div>
                <div className="flex space-x-1 mb-5 text-luxury-gold-400">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
                <p className="text-stone-300 text-xs leading-relaxed italic mb-6">
                  "Hosted our annual corporate summit at the Sky Hall. The panoramic views and modern layout provided an inspiring atmosphere for our executive team."
                </p>
              </div>
              <div className="flex items-center space-x-4 border-t border-white/10 pt-4">
                <div className="w-10 h-10 rounded-full bg-luxury-emerald-900 border border-luxury-gold-500/40 flex items-center justify-center font-bold text-xs text-luxury-gold-300 shrink-0">
                  NF
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white tracking-wider">D. NIMAL FERNANDO</h4>
                  <p className="text-[10px] text-luxury-gold-400 uppercase tracking-widest mt-0.5">Corporate Lead</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-lg flex flex-col justify-between hover:bg-white/[0.08] transition-colors duration-300">
              <div>
                <div className="flex space-x-1 mb-5 text-luxury-gold-400">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
                <p className="text-stone-300 text-xs leading-relaxed italic mb-6">
                  "The staff at Camilla are true professionals. They anticipated every need and made our family celebration completely stress-free."
                </p>
              </div>
              <div className="flex items-center space-x-4 border-t border-white/10 pt-4">
                <div className="w-10 h-10 rounded-full bg-luxury-emerald-900 border border-luxury-gold-500/40 flex items-center justify-center font-bold text-xs text-luxury-gold-300 shrink-0">
                  AW
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white tracking-wider">ANJALI WICKRAMASINGHE</h4>
                  <p className="text-[10px] text-luxury-gold-400 uppercase tracking-widest mt-0.5">Family Celebration</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    </>
  );
}
