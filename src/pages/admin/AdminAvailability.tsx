import { useState, useMemo, useEffect } from 'react';
import { useHalls } from '../../hooks/useHalls';
import { useAvailability } from '../../hooks/useAvailability';
import { useApp } from '../../context/AppContext';
import { Calendar as CalendarIcon, Loader2, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import AvailabilityCalendar from '../public/components/AvailabilityCalendar';

export default function AdminAvailability() {
  const { halls, loading: hallsLoading } = useHalls();
  const [selectedHallId, setSelectedHallId] = useState<string>('');
  
  // Set default hall when loaded
  useEffect(() => {
    if (!selectedHallId && halls.length > 0) {
      setSelectedHallId(halls[0].id);
    }
  }, [halls, selectedHallId]);

  const { availability, loading: availabilityLoading } = useAvailability(selectedHallId);
  const { blockedDates, blockDate, unblockDate } = useApp();
  const { showToast } = useToast();
  const [newBlockedDate, setNewBlockedDate] = useState('');

  const selectedHall = halls.find(h => h.id === selectedHallId);

  const pendingDates = availability?.filter(a => a.status === 'PENDING').map(a => a.date).sort() || [];
  const bookedDates = availability?.filter(a => a.status === 'BOOKED').map(a => a.date).sort() || [];

  if (hallsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 text-stone-400">
        <Loader2 size={36} className="animate-spin text-luxury-emerald-700" />
        <p className="text-sm font-semibold">Loading availability data…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-luxury-emerald-950">Hall Availability</h1>
          <p className="text-stone-500 text-sm mt-1">Check real-time availability and manage blocked dates for each hall.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-stone-200 shadow-sm flex items-center gap-3">
          <CalendarIcon size={18} className="text-luxury-emerald-900" />
          <select 
            value={selectedHallId} 
            onChange={e => setSelectedHallId(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-sm font-bold text-stone-800 outline-none"
          >
            {halls.map(h => (
              <option key={h.id} value={h.id}>{h.hallName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Global System Blocked Dates - ALWAYS VISIBLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
        <h3 className="font-serif text-lg font-bold text-luxury-emerald-950 mb-4 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-stone-300"></span>
          System Blocked Dates
        </h3>
        
        <div className="flex gap-3 items-end mb-6">
          <div className="flex-1">
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Select Date to Block</label>
            <input
              type="date"
              value={newBlockedDate}
              onChange={(e) => setNewBlockedDate(e.target.value)}
              className="w-full p-2 border border-stone-200 rounded-lg focus:outline-none focus:border-luxury-gold-500 text-sm"
            />
          </div>
          <button
            type="button"
            onClick={async () => {
              if (!newBlockedDate) return;
              try {
                await blockDate(newBlockedDate);
                showToast(`Blocked ${newBlockedDate}`, 'success');
                setNewBlockedDate('');
              } catch (e) {
                showToast('Failed to block date', 'error');
              }
            }}
            disabled={!newBlockedDate}
            className="px-4 py-2 bg-luxury-emerald-950 text-white text-xs font-bold tracking-wider rounded-lg hover:bg-luxury-emerald-900 transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
          >
            <Plus size={16} /> Block Date
          </button>
        </div>

        {blockedDates.length === 0 ? (
          <p className="text-stone-400 text-sm italic border-t border-stone-100 pt-4">No blocked dates configured globally.</p>
        ) : (
          <div className="pt-4 border-t border-stone-100">
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Currently Blocked</h4>
            <div className="flex flex-wrap gap-2">
              {blockedDates.map(date => (
                <div key={date} className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-bold">
                  {date}
                  <button
                    onClick={async () => {
                      if (window.confirm(`Unblock ${date}?`)) {
                        try {
                          await unblockDate(date);
                          showToast(`Unblocked ${date}`, 'success');
                        } catch (e) {
                          showToast('Failed to unblock date', 'error');
                        }
                      }
                    }}
                    className="p-1 hover:bg-red-100 rounded-full text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>


      {!selectedHall ? (
        <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg text-stone-500 text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          Please select a hall to view its availability.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Calendar View */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
            <h2 className="font-serif text-xl font-bold text-luxury-emerald-950 mb-6">Calendar View</h2>
            <AvailabilityCalendar 
              hallId={selectedHall.id}
              selectedDate={''}
              onSelectDate={() => {}} // Read-only in admin for now
              blockedDates={blockedDates}
              availability={availability}
              loading={availabilityLoading}
            />
          </div>

          {/* Availability Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
              <h3 className="font-serif text-lg font-bold text-luxury-emerald-950 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                Pending Dates
              </h3>
              {pendingDates.length === 0 ? (
                <p className="text-stone-400 text-sm italic">No pending dates for this hall.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {pendingDates.map(date => (
                    <span key={date} className="px-3 py-1 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-full text-xs font-bold">
                      {date}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
              <h3 className="font-serif text-lg font-bold text-luxury-emerald-950 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                Booked Dates
              </h3>
              {bookedDates.length === 0 ? (
                <p className="text-stone-400 text-sm italic">No booked dates for this hall.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {bookedDates.map(date => (
                    <span key={date} className="px-3 py-1 bg-red-50 text-red-800 border border-red-200 rounded-full text-xs font-bold">
                      {date}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
