import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Upload, Save, Building2, Phone, Mail, Globe, MapPin, Loader2, Sparkles, AlertTriangle, Settings, Percent, Database, CheckCircle, Calendar, Trash2, Plus } from 'lucide-react';
import { seedHalls } from '../../scripts/seedHalls';
import type { SystemSettings } from '../../types/app';
import { hallService } from '../../services/hallService';

export default function AdminSettings() {
  const { settings, updateSettings, isLoading } = useApp();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState<SystemSettings>({
    taxRate: 15,
    contactEmail: '',
    contactPhone: '',
    address: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'taxRate' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings(formData);
      showToast('Settings updated successfully', 'success');
    } catch (error) {
      console.error('Error updating settings:', error);
      showToast('Failed to update settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSeedHalls = async () => {
    if (!window.confirm('WARNING: This will delete ALL existing halls and replace them with the 8 Kurunegala demo halls. Are you sure you want to proceed?')) {
      return;
    }

    setIsSeeding(true);
    try {
      const result = await seedHalls();
      showToast(`✅ ${result.success} signature halls seeded successfully!`, 'success');
    } catch (error) {
      console.error('Failed to seed halls:', error);
      showToast('Failed to seed demo halls', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-stone-500">
        <p className="font-semibold animate-pulse">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in w-full max-w-4xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-luxury-emerald-950 flex items-center gap-3">
            <Settings className="text-luxury-gold-500" />
            System Settings
          </h1>
          <p className="text-sm text-stone-500 mt-1">Manage global configuration for the Camilla Banquet system.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-luxury-emerald-950 uppercase tracking-wider flex items-center gap-2">
              <Percent size={14} className="text-luxury-gold-500" />
              Tax Rate (%)
            </label>
            <input
              type="number"
              name="taxRate"
              value={formData.taxRate}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              required
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-luxury-emerald-900/20 focus:border-luxury-emerald-900 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-luxury-emerald-950 uppercase tracking-wider flex items-center gap-2">
              <Mail size={14} className="text-luxury-gold-500" />
              Contact Email
            </label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-luxury-emerald-900/20 focus:border-luxury-emerald-900 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-luxury-emerald-950 uppercase tracking-wider flex items-center gap-2">
              <Phone size={14} className="text-luxury-gold-500" />
              Contact Phone
            </label>
            <input
              type="text"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-luxury-emerald-900/20 focus:border-luxury-emerald-900 transition-all"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-luxury-emerald-950 uppercase tracking-wider flex items-center gap-2">
              <MapPin size={14} className="text-luxury-gold-500" />
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-luxury-emerald-900/20 focus:border-luxury-emerald-900 transition-all resize-none"
            ></textarea>
          </div>

        </div>

        <div className="pt-6 border-t border-stone-200">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-luxury-emerald-950 text-white rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-luxury-emerald-900 transition-all shadow-md disabled:opacity-50"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Saving...
              </span>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
