import React, { useState } from 'react';
import type { Hall } from '../../../types/app';
import { Save, X, Loader2 } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../lib/firebase';

interface HallFormProps {
  hall?: Hall;
  onSave: (hall: Omit<Hall, 'id' | 'createdAt'> | Partial<Hall>) => Promise<void>;
  onCancel: () => void;
}

export default function HallForm({ hall, onSave, onCancel }: HallFormProps) {
  const [formData, setFormData] = useState<Partial<Hall>>({
    hallName: '',
    location: '',
    capacity: 0,
    type: 'Banquet',
    description: '',
    images: [],
    basePrice: 0,
    status: 'Available',
    ...hall,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const storageRef = ref(storage, `halls/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData(prev => ({ ...prev, images: [...(prev.images || []), url] }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please check your Firebase Storage rules or try again.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: (prev.images || []).filter((_, i) => i !== index) }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Hall Name</label>
          <input
            type="text"
            required
            value={formData.hallName || ''}
            onChange={(e) => setFormData({ ...formData, hallName: e.target.value })}
            className="w-full border border-stone-200 rounded px-3 py-2.5 text-xs focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Location</label>
          <input
            type="text"
            required
            value={formData.location || ''}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full border border-stone-200 rounded px-3 py-2.5 text-xs focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Type</label>
          <input
            type="text"
            required
            value={formData.type || ''}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full border border-stone-200 rounded px-3 py-2.5 text-xs focus:outline-none"
            placeholder="e.g. Grand Ballroom"
          />
        </div>
        <div>
          <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Capacity</label>
          <input
            type="number"
            required
            value={formData.capacity || ''}
            onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
            className="w-full border border-stone-200 rounded px-3 py-2.5 text-xs focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Base Price (LKR)</label>
          <input
            type="number"
            required
            value={formData.basePrice || ''}
            onChange={(e) => setFormData({ ...formData, basePrice: e.target.value === '' ? ('' as any) : Number(e.target.value) })}
            className="w-full border border-stone-200 rounded px-3 py-2.5 text-xs focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Description</label>
        <textarea
          required
          rows={3}
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full border border-stone-200 rounded px-3 py-2 text-xs focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Image Upload</label>
        <div className="flex gap-4 items-center mb-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
            className="flex-1 border border-stone-200 rounded px-3 py-2 text-xs focus:outline-none file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-luxury-emerald-950 file:text-white hover:file:bg-luxury-emerald-900 transition-all cursor-pointer"
          />
          {isUploading && <Loader2 className="w-5 h-5 text-luxury-emerald-600 animate-spin" />}
        </div>
        
        {formData.images && formData.images.length > 0 && (
          <div className="grid grid-cols-4 gap-4 mt-2">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative group rounded overflow-hidden border border-stone-200 aspect-video">
                <img src={img} alt={`Hall ${idx}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Status</label>
        <select
          value={formData.status || 'Available'}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as Hall['status'] })}
          className="w-full border border-stone-200 rounded px-3 py-2.5 text-xs focus:outline-none"
        >
          <option value="Available">Available</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Hidden">Hidden</option>
        </select>
      </div>

      {/* Detailed Specifications Fieldset */}
      <div className="bg-stone-50 p-5 rounded-xl border border-stone-200/60 space-y-6">
        <h3 className="text-xs font-bold text-luxury-emerald-950 uppercase tracking-widest border-b pb-2 border-stone-200">
          Detailed Specifications & Amenities
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Floor/Level</label>
            <input
              type="text"
              value={formData.floor || ''}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              className="w-full border border-stone-200 bg-white rounded px-3 py-2 text-xs focus:outline-none"
              placeholder="e.g. Ground Floor"
            />
          </div>
          <div>
            <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Dimensions/Size</label>
            <input
              type="text"
              value={formData.size || ''}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              className="w-full border border-stone-200 bg-white rounded px-3 py-2 text-xs focus:outline-none"
              placeholder="e.g. 8,500 Sq Ft"
            />
          </div>
          <div>
            <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Setting</label>
            <select
              value={formData.indoorOutdoor || 'Indoor'}
              onChange={(e) => setFormData({ ...formData, indoorOutdoor: e.target.value as any })}
              className="w-full border border-stone-200 bg-white rounded px-3 py-2.5 text-xs focus:outline-none"
            >
              <option value="Indoor">Indoor Space</option>
              <option value="Outdoor">Outdoor Area</option>
              <option value="Both">Both (Indoor/Outdoor)</option>
            </select>
          </div>
          <div>
            <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Dining Seating</label>
            <input
              type="number"
              value={formData.diningCapacity || 0}
              onChange={(e) => setFormData({ ...formData, diningCapacity: Number(e.target.value) })}
              className="w-full border border-stone-200 bg-white rounded px-3 py-2 text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Parking Cars</label>
            <input
              type="number"
              value={formData.parkingCapacity || 0}
              onChange={(e) => setFormData({ ...formData, parkingCapacity: Number(e.target.value) })}
              className="w-full border border-stone-200 bg-white rounded px-3 py-2 text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Dressing Suites</label>
            <input
              type="number"
              value={formData.dressingRooms || 0}
              onChange={(e) => setFormData({ ...formData, dressingRooms: Number(e.target.value) })}
              className="w-full border border-stone-200 bg-white rounded px-3 py-2 text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-2">Washrooms</label>
            <input
              type="number"
              value={formData.washrooms || 0}
              onChange={(e) => setFormData({ ...formData, washrooms: Number(e.target.value) })}
              className="w-full border border-stone-200 bg-white rounded px-3 py-2 text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Checkbox settings */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.airConditioned !== false}
              onChange={(e) => setFormData({ ...formData, airConditioned: e.target.checked })}
              className="rounded text-luxury-emerald-950 focus:ring-luxury-emerald-900"
            />
            Air Conditioned (A/C)
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.stageAvailable !== false}
              onChange={(e) => setFormData({ ...formData, stageAvailable: e.target.checked })}
              className="rounded text-luxury-emerald-950 focus:ring-luxury-emerald-900"
            />
            Stage Available
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.bridalRoom || false}
              onChange={(e) => setFormData({ ...formData, bridalRoom: e.target.checked })}
              className="rounded text-luxury-emerald-950 focus:ring-luxury-emerald-900"
            />
            Bridal Room Included
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.wheelchairAccessible || false}
              onChange={(e) => setFormData({ ...formData, wheelchairAccessible: e.target.checked })}
              className="rounded text-luxury-emerald-950 focus:ring-luxury-emerald-900"
            />
            Wheelchair Accessible
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.soundSystem !== false}
              onChange={(e) => setFormData({ ...formData, soundSystem: e.target.checked })}
              className="rounded text-luxury-emerald-950 focus:ring-luxury-emerald-900"
            />
            Sound System
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.ledScreen || false}
              onChange={(e) => setFormData({ ...formData, ledScreen: e.target.checked })}
              className="rounded text-luxury-emerald-950 focus:ring-luxury-emerald-900"
            />
            LED Screen Backdrop
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.wifi !== false}
              onChange={(e) => setFormData({ ...formData, wifi: e.target.checked })}
              className="rounded text-luxury-emerald-950 focus:ring-luxury-emerald-900"
            />
            Guest WiFi
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.generatorBackup !== false}
              onChange={(e) => setFormData({ ...formData, generatorBackup: e.target.checked })}
              className="rounded text-luxury-emerald-950 focus:ring-luxury-emerald-900"
            />
            Generator Backup
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.outdoorPhotographyArea || false}
              onChange={(e) => setFormData({ ...formData, outdoorPhotographyArea: e.target.checked })}
              className="rounded text-luxury-emerald-950 focus:ring-luxury-emerald-900"
            />
            Photo Garden Access
          </label>
        </div>
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
          <span>{hall ? 'Update Hall' : 'Create Hall'}</span>
        </button>
      </div>
    </form>
  );
}
