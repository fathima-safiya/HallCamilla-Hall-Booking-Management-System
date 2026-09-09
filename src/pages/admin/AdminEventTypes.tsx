import { useState } from 'react';
import { useEventTypes } from '../../hooks/useEventTypes';
import { useToast } from '../../context/ToastContext';
import { Plus, Loader2, Trash2, Edit2, AlertCircle, X, Check } from 'lucide-react';
import { ConfirmModal } from '../shared/components/ConfirmModal';

export default function AdminEventTypes() {
  const { eventTypes, loading, error, createEventType, updateEventType, deleteEventType } = useEventTypes();
  const { showToast } = useToast();

  const [isAdding, setIsAdding] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!newTypeName.trim()) return;
    try {
      await createEventType(newTypeName.trim());
      showToast('Event type added successfully');
      setNewTypeName('');
      setIsAdding(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to add event type', 'error');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editName.trim()) return;
    try {
      await updateEventType(editingId, { name: editName.trim() });
      showToast('Event type updated');
      setEditingId(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to update event type', 'error');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateEventType(id, { isActive: !currentStatus });
      showToast(`Event type ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch {
      showToast('Failed to toggle status', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEventType(deleteTarget);
      showToast('Event type deleted');
    } catch {
      showToast('Failed to delete event type', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 text-stone-400">
        <Loader2 size={36} className="animate-spin text-luxury-emerald-700" />
        <p className="text-sm font-semibold">Loading event types…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in w-full max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-serif text-3xl font-bold text-luxury-emerald-950">Event Types</h1>
          <p className="text-stone-500 text-sm mt-1">Manage the types of events customers can select during booking.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-luxury-emerald-950 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-luxury-emerald-900 transition-colors"
          >
            <Plus size={16} /> Add Event Type
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Add Form */}
      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-2">New Event Type Name</label>
            <input 
              type="text" 
              value={newTypeName}
              onChange={e => setNewTypeName(e.target.value)}
              placeholder="e.g. Baby Shower"
              className="w-full border border-stone-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-luxury-gold-500"
              autoFocus
            />
          </div>
          <div className="flex gap-2 mt-4 sm:mt-6">
            <button onClick={handleAdd} disabled={!newTypeName.trim()} className="bg-luxury-emerald-950 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-luxury-emerald-900 disabled:opacity-50 transition-colors">
              Save
            </button>
            <button onClick={() => { setIsAdding(false); setNewTypeName(''); }} className="bg-stone-100 text-stone-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-stone-200 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              <th className="p-4 pl-6">Name</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-stone-700 divide-y divide-stone-100">
            {eventTypes.map(type => (
              <tr key={type.id} className="hover:bg-stone-50/50 transition-colors group">
                <td className="p-4 pl-6">
                  {editingId === type.id ? (
                    <input 
                      type="text" 
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="w-full max-w-xs border border-stone-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-luxury-gold-500"
                      autoFocus
                    />
                  ) : (
                    <span className="font-bold text-stone-800">{type.name}</span>
                  )}
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => handleToggleActive(type.id, type.isActive)}
                    className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full transition-colors ${
                      type.isActive ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                    }`}
                  >
                    {type.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="p-4 pr-6 text-right">
                  {editingId === type.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={handleSaveEdit} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"><Check size={16} /></button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 text-stone-500 hover:bg-stone-100 rounded"><X size={16} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2 transition-opacity">
                      <button onClick={() => { setEditingId(type.id); setEditName(type.name); }} className="p-1.5 text-stone-500 hover:text-luxury-gold-600 hover:bg-stone-100 rounded" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => setDeleteTarget(type.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {eventTypes.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-stone-400 text-sm italic">
                  No event types configured.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteTarget && (
        <ConfirmModal
          title="Delete Event Type?"
          message="Are you sure you want to delete this event type? This action cannot be undone."
          confirmLabel="Delete"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
