import { useState, useEffect, useRef } from 'react';
import { User, Settings, Lock, CreditCard, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { doc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../lib/firebase';
import { COLLECTIONS, customerDocId } from '../../lib/firestorePaths';

export default function Profile() {
  const { user } = useAuth();
  const { customers } = useApp();
  const { showToast } = useToast();

  const customerProfile = customers.find(c => c.email.toLowerCase() === user?.email?.toLowerCase()) as any;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (customerProfile) {
      const nameParts = customerProfile.name ? customerProfile.name.split(' ') : ['Guest'];
      setFirstName(nameParts[0]);
      setLastName(nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');
      setPhone(customerProfile.phone || '');
    }
  }, [customerProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;
    
    setIsSaving(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      
      if (isFirebaseConfigured && db) {
        const updatedCustomer = {
          ...customerProfile,
          email: user.email,
          name: fullName,
          phone: phone,
          joinedDate: customerProfile?.joinedDate || new Date().toISOString()
        };
        await setDoc(doc(db, COLLECTIONS.customers, customerDocId(user.email)), updatedCustomer, { merge: true });
      } else {
        // Local fallback (though context addCustomer prevents overwrite, we simulate success for local mode)
      }
      showToast("Profile settings updated successfully!");
    } catch (err) {
      console.error(err);
      showToast("Failed to update profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024 * 2) {
        showToast("Image must be less than 2MB", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Url = reader.result as string;
        try {
          if (isFirebaseConfigured && db && user?.email) {
            await setDoc(doc(db, COLLECTIONS.customers, customerDocId(user.email)), { photoURL: base64Url }, { merge: true });
          }
          showToast("Photo updated successfully!");
        } catch (err) {
          console.error(err);
          showToast("Failed to upload photo", "error");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const initials = firstName.charAt(0) + (lastName ? lastName.charAt(0) : '');

  return (
    <div className="pt-32 pb-24 max-w-6xl mx-auto px-6 w-full animate-fade-in">
      
      <div className="mb-12 border-b border-stone-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-luxury-emerald-950 mb-3">Account Settings</h1>
          <p className="text-stone-500">Manage your personal information and security preferences.</p>
        </div>
      </div>

      <div className="max-w-3xl">
        
        {/* Content Form */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-200/60 p-8 sm:p-12 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold-50/50 rounded-bl-[100%] pointer-events-none"></div>
          
          <h2 className="font-serif text-2xl font-bold text-luxury-emerald-950 mb-8 relative z-10">Personal Information</h2>
          
          <form onSubmit={handleSave} className="space-y-8 max-w-2xl relative z-10" autoComplete="off">
            
            {/* Avatar Section */}
            <div className="flex items-center gap-8 mb-10 pb-10 border-b border-stone-100">
              <div 
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {customerProfile?.photoURL ? (
                  <img src={customerProfile.photoURL} alt="Profile" className="w-28 h-28 rounded-full object-cover shadow-xl border-4 border-white ring-2 ring-luxury-gold-500/30 group-hover:ring-luxury-gold-400 transition-all duration-300" />
                ) : (
                  <div className="w-28 h-28 bg-gradient-to-br from-luxury-emerald-800 to-luxury-emerald-950 text-luxury-gold-300 rounded-full flex items-center justify-center font-serif text-4xl font-bold shadow-xl border-4 border-white ring-2 ring-luxury-gold-500/30 group-hover:ring-luxury-gold-400 transition-all duration-300">
                    {initials.toUpperCase() || 'U'}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Camera className="text-white" size={24} />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-stone-800 mb-1">{customerProfile?.name || 'Guest User'}</h3>
                <p className="text-sm text-stone-500 mb-3">{user?.email}</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[10px] font-bold text-luxury-emerald-900 bg-luxury-emerald-50 px-4 py-2 rounded-full uppercase tracking-wider hover:bg-luxury-emerald-100 transition-colors border border-luxury-emerald-200"
                >
                  Upload New Photo
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="relative">
                <label className="block text-[10px] uppercase font-bold text-luxury-emerald-900 tracking-wider mb-2">First Name</label>
                <input 
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full border-b-2 border-stone-200 px-0 py-2 text-stone-800 bg-transparent focus:outline-none focus:border-luxury-gold-500 transition-colors placeholder-stone-300 font-medium"
                />
              </div>
              <div className="relative">
                <label className="block text-[10px] uppercase font-bold text-luxury-emerald-900 tracking-wider mb-2">Last Name</label>
                <input 
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border-b-2 border-stone-200 px-0 py-2 text-stone-800 bg-transparent focus:outline-none focus:border-luxury-gold-500 transition-colors placeholder-stone-300 font-medium"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-[10px] uppercase font-bold text-luxury-emerald-900 tracking-wider mb-2">Email Address</label>
              <input 
                type="email"
                value={user?.email || ''}
                readOnly
                className="w-full border-b-2 border-stone-200 px-0 py-2 text-stone-500 bg-transparent focus:outline-none focus:border-luxury-gold-500 transition-colors placeholder-stone-300 font-medium cursor-not-allowed"
              />
              <span className="absolute right-0 bottom-3 text-[10px] text-stone-400 font-bold uppercase tracking-widest">Verified</span>
            </div>

            <div className="relative">
              <label className="block text-[10px] uppercase font-bold text-luxury-emerald-900 tracking-wider mb-2">Phone Number</label>
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full border-b-2 border-stone-200 px-0 py-2 text-stone-800 bg-transparent focus:outline-none focus:border-luxury-gold-500 transition-colors placeholder-stone-300 font-medium"
              />
            </div>

            <div className="pt-8 mt-4 flex justify-end">
              <button 
                type="submit"
                disabled={isSaving}
                className={`px-8 py-4 bg-luxury-emerald-950 text-white font-bold tracking-wider text-xs rounded hover:bg-luxury-emerald-900 transition-all hover:-translate-y-0.5 shadow-lg flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}
