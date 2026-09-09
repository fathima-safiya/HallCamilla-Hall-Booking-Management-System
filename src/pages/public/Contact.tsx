import { Mail, Phone, MapPin, Clock, MessageSquare, Compass, Car, Navigation } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Contact() {
  const { user } = useAuth();

  return (
    <div className="bg-stone-50 min-h-screen pb-20 w-full animate-fade-in font-sans">
      
      {/* Premium Hero Section */}
      <div className="relative pt-32 pb-20 bg-luxury-emerald-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 to-transparent"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-luxury-gold-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-luxury-gold-500/10 text-luxury-gold-400 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-luxury-gold-500/20 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <MessageSquare size={32} />
          </div>
          <span className="text-luxury-gold-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block">Get In Touch</span>
          <h1 className="font-serif text-4xl lg:text-6xl font-bold mb-6 drop-shadow-md">Contact Us</h1>
          <p className="text-stone-300 max-w-2xl mx-auto text-sm leading-relaxed">
            We are here to assist you with all your event planning needs. Reach out to our dedicated team for inquiries, viewings, and bookings.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 relative z-20 space-y-12">
        {/* Contact Form & Info Grid */}
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-xl border border-stone-200/80 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-luxury-emerald-950 mb-6">Send us a Message</h2>
            <form className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">Name</label>
                <input 
                  type="text" 
                  defaultValue={user?.displayName || (user?.email ? user.email.split('@')[0] : '')}
                  className="w-full p-3 border border-stone-200 rounded-lg focus:outline-none focus:border-luxury-gold-500" 
                  placeholder="Your Name" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">Email</label>
                <input 
                  type="email" 
                  defaultValue={user?.email || ''}
                  className="w-full p-3 border border-stone-200 rounded-lg focus:outline-none focus:border-luxury-gold-500" 
                  placeholder="your@email.com" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">Message</label>
                <textarea rows={5} className="w-full p-3 border border-stone-200 rounded-lg focus:outline-none focus:border-luxury-gold-500" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="w-full py-3.5 bg-luxury-emerald-950 text-white font-bold tracking-wider text-xs rounded hover:bg-luxury-emerald-900 transition-all uppercase">
                Send Inquiry
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-stone-50 p-6 rounded-xl flex items-start space-x-4 border border-stone-100">
              <div className="p-3 bg-white rounded-full text-luxury-gold-600 shadow-sm">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-luxury-emerald-950 mb-1">Our Location</h3>
                <p className="text-stone-600 text-sm">📍 Camilla Banquet Hotel<br/>Dambulla Road, Kurunegala, Sri Lanka</p>
              </div>
            </div>
            <div className="bg-stone-50 p-6 rounded-xl flex items-start space-x-4 border border-stone-100">
              <div className="p-3 bg-white rounded-full text-luxury-gold-600 shadow-sm">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-luxury-emerald-950 mb-1">Phone Number</h3>
                <p className="text-stone-600 text-sm">+94 37 123 4567<br/>+94 77 123 4567</p>
              </div>
            </div>
            <div className="bg-stone-50 p-6 rounded-xl flex items-start space-x-4 border border-stone-100">
              <div className="p-3 bg-white rounded-full text-luxury-gold-600 shadow-sm">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-luxury-emerald-950 mb-1">Email Address</h3>
                <p className="text-stone-600 text-sm">admincamillahotel@gmail.com<br/>bookings@hallcamilla.com</p>
              </div>
            </div>
            <div className="bg-stone-50 p-6 rounded-xl flex items-start space-x-4 border border-stone-100">
              <div className="p-3 bg-white rounded-full text-luxury-gold-600 shadow-sm">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="font-bold text-luxury-emerald-950 mb-1">Business Hours</h3>
                <p className="text-stone-600 text-sm">Everyday: 8:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map, Directions, Parking and Landmarks Section */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden grid lg:grid-cols-3">
          
          {/* Embedded Google Map */}
          <div className="lg:col-span-2 min-h-[400px] relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.5358055627254!2d80.36263597476537!3d7.4834400925282925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae33a0100000001%3A0x6b8db5e62f026a7e!2sKurunegala+Clock+Tower!5e0!3m2!1sen!2slk!4v1715424564883!5m2!1sen!2slk"
              width="100%" 
              height="100%" 
              style={{ border: 0, minHeight: '400px' }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Camilla Banquet Hotel Location Map"
            ></iframe>
          </div>

          {/* Location details card */}
          <div className="p-8 bg-stone-50 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-stone-200">
            <div className="space-y-6">
              <div>
                <span className="text-luxury-gold-600 text-[10px] font-bold tracking-widest uppercase block mb-1">Location Details</span>
                <h2 className="font-serif text-2xl font-bold text-luxury-emerald-950">Getting Here</h2>
              </div>

              {/* Parking Information */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 flex items-center gap-2">
                  <Car size={16} className="text-luxury-gold-600" /> Parking Facility
                </h4>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Valet parking is complimentary for banquet guests. Secure, on-site parking is available for up to 150 vehicles, including dedicated EV charging points and bus laybys.
                </p>
              </div>

              {/* Nearby Landmarks */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 flex items-center gap-2">
                  <Compass size={16} className="text-luxury-gold-600" /> Nearby Landmarks
                </h4>
                <ul className="text-stone-600 text-sm space-y-1">
                  <li>📍 Kurunegala Clock Tower (5 mins drive)</li>
                  <li>📍 Ethagala (Elephant Rock) Viewpoint (8 mins drive)</li>
                  <li>📍 Kurunegala Lake Walkway (6 mins drive)</li>
                </ul>
              </div>
            </div>

            {/* Directions Action */}
            <div className="pt-8 border-t border-stone-200 mt-6 lg:mt-0">
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=Kurunegala+Clock+Tower" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 bg-luxury-emerald-950 text-white font-bold tracking-widest text-xs rounded hover:bg-luxury-gold-500 hover:text-luxury-emerald-950 transition-all uppercase shadow-md"
              >
                <Navigation size={14} /> Get Directions
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
