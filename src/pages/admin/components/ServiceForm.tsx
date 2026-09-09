import React, { useState } from 'react';
import type { Service } from '../../../types/app';
import { Save, Loader2 } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../lib/firebase';

interface ServiceFormProps {
  service?: Service;
  onSave: (service: Omit<Service, 'id'> | Partial<Service>) => Promise<void>;
  onCancel: () => void;
}

export default function ServiceForm({ service, onSave, onCancel }: ServiceFormProps) {
  const isCustom = service?.category && !['Food', 'Decoration', 'Photography', 'Entertainment', 'Other'].includes(service.category);
  const [showCustomInput, setShowCustomInput] = useState(isCustom || service?.category === 'Other' || !service);

  const [formData, setFormData] = useState<Partial<Service>>({
    serviceName: '',
    category: 'Other',
    price: 0,
    description: '',
    image: '',
    status: 'Active',
    ...service,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const storageRef = ref(storage, `services/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please check your Firebase Storage rules or try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return;
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Service Name</label>
          <input
            type="text"
            required
            value={formData.serviceName || ''}
            onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
            className="w-full border border-stone-200 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-luxury-emerald-500"
            placeholder="e.g. DJ Service"
          />
        </div>
        <div>
          <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Category</label>
          <select
            required={!showCustomInput}
            value={showCustomInput ? 'Other' : formData.category}
            onChange={(e) => {
              if (e.target.value === 'Other') {
                setShowCustomInput(true);
                setFormData({ ...formData, category: 'Other' });
              } else {
                setShowCustomInput(false);
                setFormData({ ...formData, category: e.target.value });
              }
            }}
            className="w-full border border-stone-200 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-luxury-emerald-500"
          >
            <option value="Food">Food</option>
            <option value="Decoration">Decoration</option>
            <option value="Photography">Photography</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
          {showCustomInput && (
            <input
              type="text"
              required
              placeholder="Type your custom category..."
              value={formData.category === 'Other' ? '' : formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value || 'Other' })}
              className="w-full mt-2 border border-stone-200 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-luxury-emerald-500"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Price (LKR)</label>
          <input
            type="number"
            required
            min="0"
            value={formData.price === undefined ? '' : formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value === '' ? ('' as any) : Number(e.target.value) })}
            className="w-full border border-stone-200 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-luxury-emerald-500"
          />
        </div>
        <div>
          <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Status</label>
          <select
            value={formData.status || 'Active'}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
            className="w-full border border-stone-200 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-luxury-emerald-500"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Image Upload (Optional)</label>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="w-full border border-stone-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-luxury-emerald-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-luxury-emerald-950 file:text-white hover:file:bg-luxury-emerald-900 transition-all cursor-pointer"
            />
            {isUploading && <Loader2 className="w-5 h-5 text-luxury-emerald-600 animate-spin" />}
          </div>
          {formData.image && (
            <div className="relative w-24 h-16 rounded overflow-hidden border border-stone-200 shadow-sm">
              <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Description</label>
        <textarea
          rows={3}
          required
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full border border-stone-200 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-luxury-emerald-500"
          placeholder="Brief description of the service..."
        />
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
          <span>{service ? 'Update Service' : 'Create Service'}</span>
        </button>
      </div>
    </form>
  );
}
