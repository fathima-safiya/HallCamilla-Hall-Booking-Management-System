import React, { useState } from 'react';
import { useHalls } from '../../hooks/useHalls';
import type { Hall } from '../../types/app';
import HallForm from './components/HallForm';
import { ConfirmModal } from '../shared/components/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import {
  Building2, Plus, Edit3, Trash2, Search, CheckCircle, AlertCircle,
  EyeOff, Wrench, Loader2, X
} from 'lucide-react';

type ModalMode = 'add' | 'edit' | null;

/** Badge color per hall status */
function StatusBadge({ status }: { status: Hall['status'] }) {
  const styles: Record<Hall['status'], string> = {
    Available: 'bg-emerald-100 text-emerald-800',
    Maintenance: 'bg-amber-100 text-amber-800',
    Hidden: 'bg-stone-100 text-stone-600',
  };
  const icons: Record<Hall['status'], React.ReactNode> = {
    Available: <CheckCircle size={11} />,
    Maintenance: <Wrench size={11} />,
    Hidden: <EyeOff size={11} />,
  };
  return (
    <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  );
}

export default function AdminHalls() {
  const { halls, loading, error, addHall, updateHall, deleteHall } = useHalls();

  const [searchTerm, setSearchTerm] = useState('');
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedHall, setSelectedHall] = useState<Hall | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { showToast } = useToast();

  const filteredHalls = halls.filter(h =>
    h.hallName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = async (hallData: Omit<Hall, 'id' | 'createdAt'>) => {
    try {
      await addHall(hallData);
      setModalMode(null);
      showToast(`"${hallData.hallName}" has been added successfully.`);
    } catch {
      showToast('Failed to add hall. Please try again.', 'error');
    }
  };

  const handleUpdate = async (hallData: Partial<Hall>) => {
    if (!selectedHall) return;
    try {
      await updateHall(selectedHall.id, hallData);
      setModalMode(null);
      setSelectedHall(null);
      showToast(`"${selectedHall.hallName}" has been updated.`);
    } catch {
      showToast('Failed to update hall. Please try again.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    const hall = halls.find(h => h.id === id);
    try {
      await deleteHall(id);
      setDeleteConfirmId(null);
      showToast(`"${hall?.hallName}" has been deleted.`);
    } catch {
      showToast('Failed to delete hall. Please try again.', 'error');
    }
  };

  const openEdit = (hall: Hall) => {
    setSelectedHall(hall);
    setModalMode('edit');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 text-stone-400">
        <Loader2 size={36} className="animate-spin text-luxury-emerald-700" />
        <p className="text-sm font-semibold">Loading halls from Firestore…</p>
      </div>
    );
  }

  const getHallImage = (hall: Hall) => {
    return hall.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop';
  };

  return (
    <div className="space-y-8 animate-fade-in w-full">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-luxury-emerald-950">Hall Management</h1>
          <p className="text-stone-500 text-sm mt-1">Add, edit, and manage all banquet halls and their availability.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setModalMode('add')}
            className="flex items-center gap-2 px-5 py-3 bg-luxury-emerald-950 text-white text-xs font-bold tracking-wider rounded-lg border border-luxury-gold-500/50 shadow-md hover:bg-luxury-emerald-900 transition-all shrink-0 uppercase"
          >
            <Plus size={16} className="text-luxury-gold-400" />
            Add New Hall
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-3.5 text-stone-400" />
        <input
          type="text"
          placeholder="Search by name, location, type…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-lg text-xs bg-stone-50 focus:outline-none focus:border-luxury-gold-500 focus:bg-white"
        />
      </div>

      {/* Halls Grid */}
      {filteredHalls.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400">
          <Building2 size={48} className="mb-4 opacity-30" />
          <p className="font-semibold text-sm">No halls found</p>
          <p className="text-xs mt-1">Try a different search or add a new hall.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredHalls.map(hall => (
            <div key={hall.id} className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              {/* Hall image */}
              <div className="relative h-44 bg-stone-100 overflow-hidden">
                <img 
                  src={getHallImage(hall)} 
                  alt={hall.hallName} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 right-3">
                  <StatusBadge status={hall.status} />
                </div>
                {hall.images.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    +{hall.images.length - 1} photos
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-serif font-bold text-luxury-emerald-950 text-lg leading-tight">{hall.hallName}</h3>
                  <p className="text-stone-400 text-xs mt-0.5">{hall.location} · {hall.type}</p>
                </div>
                <p className="text-stone-500 text-xs line-clamp-2">{hall.description}</p>
                <div className="flex justify-between items-center pt-2 border-t border-stone-100">
                  <div>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Capacity</p>
                    <p className="font-bold text-stone-800 text-sm">{hall.capacity.toLocaleString()} guests</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Base Price</p>
                    <p className="font-bold text-luxury-gold-700 text-sm">LKR {hall.basePrice.toLocaleString()}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => openEdit(hall)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-stone-50 border border-stone-200 text-stone-700 text-xs font-bold rounded-lg hover:bg-luxury-emerald-950 hover:text-white hover:border-luxury-emerald-950 transition-colors uppercase tracking-wider"
                  >
                    <Edit3 size={13} />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(hall.id)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors"
                    title="Delete Hall"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setModalMode(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 z-10">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center">
              <div>
                <h3 className="font-serif text-xl font-bold text-luxury-emerald-950">
                  {modalMode === 'add' ? 'Add New Hall' : `Edit: ${selectedHall?.hallName}`}
                </h3>
                <p className="text-stone-400 text-xs mt-0.5">
                  {modalMode === 'add' ? 'Fill in the details to create a new banquet hall.' : 'Update the hall details below.'}
                </p>
              </div>
              <button onClick={() => setModalMode(null)} className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <HallForm
                hall={modalMode === 'edit' ? selectedHall ?? undefined : undefined}
                onSave={modalMode === 'add' ? handleAdd as unknown as (hallData: Partial<Hall>) => Promise<void> : handleUpdate}
                onCancel={() => setModalMode(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <ConfirmModal
          title="Delete Hall?"
          message={`This will permanently remove ${halls.find(h => h.id === deleteConfirmId)?.hallName} and cannot be undone.`}
          confirmLabel="Yes, Delete"
          onConfirm={() => handleDelete(deleteConfirmId)}
          onCancel={() => setDeleteConfirmId(null)}
          danger={true}
        />
      )}
    </div>
  );
}
