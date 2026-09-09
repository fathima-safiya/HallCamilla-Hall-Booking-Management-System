import React, { useState, useEffect } from 'react';
import { maintenanceService } from '../../services/maintenanceService';
import { useHalls } from '../../hooks/useHalls';
import type { MaintenanceRecord, Hall } from '../../types/app';
import { useToast } from '../../context/ToastContext';
import { Wrench, Plus, Trash2, Calendar, Loader2, X } from 'lucide-react';

export default function AdminHallMaintenance() {
  const { halls, loading: hallsLoading } = useHalls();
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    hallId: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await maintenanceService.getAllMaintenanceRecords();
      setRecords(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      showToast('Failed to load maintenance records', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await maintenanceService.createMaintenanceRecord({
        hallId: formData.hallId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason
      });
      showToast('Maintenance record created successfully');
      setIsModalOpen(false);
      setFormData({ hallId: '', startDate: '', endDate: '', reason: '' });
      fetchRecords(); // Refresh the list
    } catch (error) {
      showToast('Failed to create maintenance record', 'error');
    }
  };

  const handleDelete = async (id: string, hallId: string) => {
    if (!window.confirm('Are you sure you want to remove this maintenance record?')) return;
    try {
      await maintenanceService.deleteMaintenanceRecord(id, hallId);
      showToast('Maintenance record removed');
      fetchRecords(); // Refresh the list
    } catch (error) {
      showToast('Failed to remove maintenance record', 'error');
    }
  };

  const getHallName = (hallId: string) => {
    return halls.find(h => h.id === hallId)?.hallName || hallId;
  };

  if (loading || hallsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 text-stone-400">
        <Loader2 size={36} className="animate-spin text-luxury-emerald-700" />
        <p className="text-sm font-semibold">Loading maintenance schedules…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-luxury-emerald-950">Hall Maintenance</h1>
          <p className="text-stone-500 text-sm mt-1">Schedule maintenance and block out dates for halls.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-luxury-emerald-950 text-white text-xs font-bold tracking-wider rounded-lg border border-luxury-gold-500/50 shadow-md hover:bg-luxury-emerald-900 transition-all shrink-0 uppercase"
        >
          <Plus size={16} className="text-luxury-gold-400" />
          Schedule Maintenance
        </button>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="py-4 px-6 text-xs font-bold text-stone-500 uppercase tracking-wider">Hall</th>
                <th className="py-4 px-6 text-xs font-bold text-stone-500 uppercase tracking-wider">Start Date</th>
                <th className="py-4 px-6 text-xs font-bold text-stone-500 uppercase tracking-wider">End Date</th>
                <th className="py-4 px-6 text-xs font-bold text-stone-500 uppercase tracking-wider">Reason</th>
                <th className="py-4 px-6 text-xs font-bold text-stone-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400">
                    <Wrench size={32} className="mx-auto mb-3 opacity-20" />
                    <p className="font-semibold text-sm">No maintenance records found</p>
                  </td>
                </tr>
              ) : (
                records.map(record => (
                  <tr key={record.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-stone-800">{getHallName(record.hallId)}</td>
                    <td className="py-4 px-6 text-sm text-stone-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-stone-400" />
                        {record.startDate}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-stone-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-stone-400" />
                        {record.endDate}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-stone-600 max-w-xs truncate">{record.reason}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(record.id, record.hallId)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-bold"
                        title="Remove Record"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4 z-10 overflow-hidden">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center">
              <h3 className="font-serif text-xl font-bold text-luxury-emerald-950">Schedule Maintenance</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">Select Hall</label>
                <select
                  required
                  value={formData.hallId}
                  onChange={e => setFormData({...formData, hallId: e.target.value})}
                  className="w-full p-3 border border-stone-200 rounded-lg focus:outline-none focus:border-luxury-gold-500 text-sm"
                >
                  <option value="">-- Choose a Hall --</option>
                  {halls.map(h => (
                    <option key={h.id} value={h.id}>{h.hallName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                    className="w-full p-3 border border-stone-200 rounded-lg focus:outline-none focus:border-luxury-gold-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                    className="w-full p-3 border border-stone-200 rounded-lg focus:outline-none focus:border-luxury-gold-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">Reason</label>
                <textarea
                  required
                  value={formData.reason}
                  onChange={e => setFormData({...formData, reason: e.target.value})}
                  placeholder="e.g. AC Repair and Deep Cleaning"
                  className="w-full p-3 border border-stone-200 rounded-lg focus:outline-none focus:border-luxury-gold-500 text-sm"
                  rows={3}
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-stone-600 font-bold text-xs uppercase tracking-wider hover:bg-stone-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-luxury-emerald-950 text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-luxury-emerald-900 transition-colors shadow-md"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
