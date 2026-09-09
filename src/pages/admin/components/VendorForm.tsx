import React, { useState } from 'react';
import type { Vendor } from '../../../types/app';
import { Upload, X, Save } from 'lucide-react';

interface VendorFormProps {
  initialData?: Vendor | null;
  onSubmit: (data: Omit<Vendor, 'id' | 'createdAt'>) => Promise<void>;
  onCancel: () => void;
}

const CATEGORIES = [
  'Photographer',
  'Videographer',
  'DJ',
  'Live Band',
  'Decoration',
  'Catering',
  'Makeup Artist',
  'Entertainment',
  'Other'
];

export default function VendorForm({ initialData, onSubmit, onCancel }: VendorFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<Vendor, 'id' | 'createdAt'>>({
    name: initialData?.name || '',
    category: initialData?.category || CATEGORIES[0],
    contact: initialData?.contact || '',
    description: initialData?.description || '',
    image: initialData?.image || '',
    status: initialData?.status || 'Active'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] uppercase font-bold text-stone-500 tracking-wider mb-2">Vendor Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-sm focus:border-luxury-emerald-900 focus:ring-1 focus:ring-luxury-emerald-900 transition-colors"
            placeholder="e.g., Elegance Photography"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-stone-500 tracking-wider mb-2">Category</label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-sm focus:border-luxury-emerald-900 focus:ring-1 focus:ring-luxury-emerald-900 transition-colors"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-stone-500 tracking-wider mb-2">Contact Details</label>
          <input
            type="text"
            required
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-sm focus:border-luxury-emerald-900 focus:ring-1 focus:ring-luxury-emerald-900 transition-colors"
            placeholder="Phone / Email"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-stone-500 tracking-wider mb-2">Status</label>
          <select
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
            className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-sm focus:border-luxury-emerald-900 focus:ring-1 focus:ring-luxury-emerald-900 transition-colors"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[10px] uppercase font-bold text-stone-500 tracking-wider mb-2">Description</label>
        <textarea
          required
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-sm focus:border-luxury-emerald-900 focus:ring-1 focus:ring-luxury-emerald-900 transition-colors"
          placeholder="Brief details about the vendor's services..."
        />
      </div>

      <div>
        <label className="block text-[10px] uppercase font-bold text-stone-500 tracking-wider mb-2">Cover Image URL</label>
        <div className="flex gap-2">
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="flex-1 bg-white border border-stone-200 rounded-lg px-4 py-3 text-sm focus:border-luxury-emerald-900 focus:ring-1 focus:ring-luxury-emerald-900 transition-colors"
            placeholder="https://images.unsplash.com/..."
          />
        </div>
        {formData.image && (
          <div className="mt-4 relative rounded-xl overflow-hidden h-32 w-48 border border-stone-200">
            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-stone-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-2.5 text-sm font-bold text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-luxury-emerald-950 text-white text-sm font-bold rounded-lg hover:bg-luxury-emerald-900 transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {loading ? 'Saving...' : initialData ? 'Update Vendor' : 'Add Vendor'}
        </button>
      </div>
    </form>
  );
}
