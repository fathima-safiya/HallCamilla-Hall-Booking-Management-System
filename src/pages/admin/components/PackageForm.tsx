import React, { useState } from 'react';
import type { Package } from '../../../types/app';
import { Save, X } from 'lucide-react';

interface PackageFormProps {
  pkg?: Package;
  onSave: (pkg: Omit<Package, 'id' | 'createdAt'> | Partial<Package>) => Promise<void>;
  onCancel: () => void;
}

export default function PackageForm({ pkg, onSave, onCancel }: PackageFormProps) {
  const [formData, setFormData] = useState<Partial<Package>>({
    packageName: '',
    packagePrice: 0,
    guestLimit: 100,
    extraGuestCharge: 0,
    notes: '',
    includedServices: [],
    image: '',
    status: 'Active',
    ...pkg,
  });

  const [newService, setNewService] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addIncludedService = () => {
    if (newService.trim()) {
      setFormData(prev => ({ 
        ...prev, 
        includedServices: [...(prev.includedServices || []), newService.trim()] 
      }));
      setNewService('');
    }
  };

  const removeIncludedService = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      includedServices: (prev.includedServices || []).filter((_, i) => i !== index) 
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setFormData(prev => ({ ...prev, image: dataUrl }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // clear input
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Package Name</label>
          <input
            type="text"
            required
            value={formData.packageName || ''}
            onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
            className="w-full border border-stone-200 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-luxury-emerald-500"
            placeholder="e.g. Platinum Feast"
          />
        </div>
        <div>
          <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Base Package Price (LKR)</label>
          <input
            type="number"
            required
            min="0"
            value={formData.packagePrice === undefined ? '' : formData.packagePrice}
            onChange={(e) => setFormData({ ...formData, packagePrice: e.target.value === '' ? ('' as any) : Number(e.target.value) })}
            className="w-full border border-stone-200 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-luxury-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Included Guest Limit</label>
          <input
            type="number"
            required
            min="1"
            value={formData.guestLimit === undefined ? '' : formData.guestLimit}
            onChange={(e) => setFormData({ ...formData, guestLimit: e.target.value === '' ? ('' as any) : Number(e.target.value) })}
            className="w-full border border-stone-200 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-luxury-emerald-500"
          />
        </div>
        <div>
          <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Extra Guest Charge (LKR/person)</label>
          <input
            type="number"
            required
            min="0"
            value={formData.extraGuestCharge === undefined ? '' : formData.extraGuestCharge}
            onChange={(e) => setFormData({ ...formData, extraGuestCharge: e.target.value === '' ? ('' as any) : Number(e.target.value) })}
            className="w-full border border-stone-200 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-luxury-emerald-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Package Notes & Description</label>
        <textarea
          rows={3}
          required
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full border border-stone-200 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-luxury-emerald-500"
          placeholder="Detailed description of the package..."
        />
      </div>

      <div>
        <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Status</label>
        <select
          required
          value={formData.status || 'Active'}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
          className="w-full border border-stone-200 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-luxury-emerald-500"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Package Image</label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full border border-stone-200 rounded px-3 py-2 text-xs focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-luxury-gold-50 file:text-luxury-gold-700 hover:file:bg-luxury-gold-100 transition-colors"
            />
          </div>
          {formData.image && (
            <div className="w-16 h-12 rounded overflow-hidden border border-stone-200 shrink-0">
              <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Included Services</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addIncludedService();
              }
            }}
            placeholder="e.g. 5 Main Courses"
            className="flex-1 border border-stone-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-luxury-emerald-500"
          />
          <button
            type="button"
            onClick={addIncludedService}
            className="px-4 py-2 bg-stone-200 text-stone-700 rounded text-xs font-bold hover:bg-stone-300 transition-colors"
          >
            Add
          </button>
        </div>
        
        <ul className="space-y-2 max-h-32 overflow-y-auto border border-stone-100 p-2 rounded bg-stone-50">
          {(formData.includedServices || []).map((service, index) => (
            <li key={index} className="flex items-center justify-between bg-white px-3 py-2 rounded border border-stone-200 text-xs text-stone-700">
              <span>{service}</span>
              <button
                type="button"
                onClick={() => removeIncludedService(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={14} />
              </button>
            </li>
          ))}
          {(!formData.includedServices || formData.includedServices.length === 0) && (
            <li className="text-xs text-stone-400 p-2 text-center">No services added yet</li>
          )}
        </ul>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-white border border-stone-200 text-stone-600 font-bold tracking-wider text-xs rounded hover:bg-stone-50 uppercase transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-luxury-emerald-950 text-white font-bold tracking-wider text-xs rounded hover:bg-luxury-emerald-900 border border-luxury-gold-500/50 shadow-md flex items-center gap-2 uppercase transition-all disabled:opacity-50"
        >
          <Save size={14} className="text-luxury-gold-400" />
          <span>{pkg ? 'Update Package' : 'Create Package'}</span>
        </button>
      </div>
    </form>
  );
}
