import { Info } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-stone-50 min-h-screen pb-20 w-full animate-fade-in font-sans">
      
      {/* Premium Hero Section */}
      <div className="relative pt-32 pb-20 bg-luxury-emerald-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 to-transparent"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-luxury-gold-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-luxury-gold-500/10 text-luxury-gold-400 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-luxury-gold-500/20 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <Info size={32} />
          </div>
          <span className="text-luxury-gold-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block">Our Story</span>
          <h1 className="font-serif text-4xl lg:text-6xl font-bold mb-6 drop-shadow-md">About Camilla Banquet</h1>
          <p className="text-stone-300 max-w-2xl mx-auto text-sm leading-relaxed">
            A legacy of unforgettable weddings, corporate galas, and intimate celebrations in the heart of Kurunegala.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 relative z-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <img 
            src="/grand_hall.png" 
            alt="Camilla Banquet Hotel" 
            className="w-full h-[500px] object-cover rounded-xl shadow-lg border border-stone-200/50"
          />
        </div>
        <div className="space-y-6 text-stone-700">
          <p className="text-lg leading-relaxed">
            Nestled in the heart of Kurunegala, Camilla Banquet Hotel stands as a beacon of luxury and elegance. For over a decade, we have been the premier destination for unforgettable weddings, corporate galas, and intimate celebrations.
          </p>
          <p className="leading-relaxed">
            Our architectural masterpiece features two distinct venues: The Camilla Grand Hall for majestic, large-scale celebrations, and the Camilla Sky Hall for boutique, panoramic events. Every detail, from the crystal chandeliers to the emerald velvet drapes, has been meticulously designed to provide a backdrop of timeless sophistication.
          </p>
          <p className="leading-relaxed">
            But our true excellence lies in our service. Our dedicated event concierges, master chefs, and professional staff work tirelessly behind the scenes to ensure that your special day is executed flawlessly. At Camilla, we don't just host events; we curate memories that last a lifetime.
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
