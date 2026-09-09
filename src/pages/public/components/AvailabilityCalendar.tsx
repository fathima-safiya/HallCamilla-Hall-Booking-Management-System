import { useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, startOfWeek, endOfWeek, isBefore, startOfDay } from 'date-fns';
import type { DateAvailability } from '../../../services/availabilityService';

interface AvailabilityCalendarProps {
  hallId: string;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  blockedDates: string[]; // From AppContext or globally blocked
  availability?: DateAvailability[]; // Array of statuses
  loading?: boolean;
}

export default function AvailabilityCalendar({ 
  selectedDate, 
  onSelectDate, 
  blockedDates,
  availability = [],
  loading = false
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "yyyy-MM-dd";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const today = startOfDay(new Date());

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm relative">
      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-2xl">
          <Loader2 className="w-6 h-6 animate-spin text-luxury-emerald-900" />
        </div>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-600">
          <ChevronLeft size={18} />
        </button>
        <h3 className="font-serif font-bold text-luxury-emerald-950 text-lg">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button onClick={nextMonth} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-600">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-[10px] font-bold text-stone-400 uppercase tracking-wider py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const dateStr = format(day, dateFormat);
          const isSelected = selectedDate === dateStr;
          const isPast = isBefore(day, today);
          const isBlocked = blockedDates?.includes(dateStr) ?? false;
          const availabilityInfo = availability?.find(a => a.date === dateStr);
          const isBooked = availabilityInfo?.status === 'BOOKED';
          const isPending = availabilityInfo?.status === 'PENDING';
          const isMaintenance = availabilityInfo?.status === 'MAINTENANCE';
          const isUnavailable = isPast || isBlocked || isBooked || isPending || isMaintenance;
          const isCurrentMonth = isSameMonth(day, monthStart);

          return (
            <button
              key={idx}
              disabled={isUnavailable || !isCurrentMonth}
              onClick={() => onSelectDate(dateStr)}
              className={`
                aspect-square flex items-center justify-center text-sm rounded-lg transition-all
                ${!isCurrentMonth ? 'text-transparent pointer-events-none' : ''}
                ${isCurrentMonth && isUnavailable ? 'cursor-not-allowed' : ''}
                ${isCurrentMonth && isPast ? 'text-stone-400 bg-stone-100 line-through' : ''}
                ${isCurrentMonth && isBlocked && !isPast ? 'text-stone-400 bg-stone-100 decoration-red-500/50 line-through' : ''}
                ${isCurrentMonth && isBooked && !isPast ? 'text-white bg-red-600 border border-red-700' : ''}
                ${isCurrentMonth && isPending && !isPast ? 'text-white bg-yellow-600 border border-yellow-700' : ''}
                ${isCurrentMonth && isMaintenance && !isPast ? 'text-white bg-purple-600 border border-purple-700' : ''}
                ${isCurrentMonth && !isUnavailable && !isSelected ? 'text-white bg-emerald-600 hover:bg-emerald-700 border border-emerald-700 cursor-pointer' : ''}
                ${isSelected ? 'bg-luxury-emerald-950 text-white font-bold shadow-md ring-2 ring-offset-2 ring-luxury-emerald-950' : ''}
              `}
              title={isUnavailable ? (isMaintenance ? 'Under Maintenance' : isBooked ? 'Booked' : isPending ? 'Pending' : isBlocked ? 'Blocked' : 'Past Date') : 'Available'}
            >
              <span className={isCurrentMonth && (isPast || isBlocked) ? 'line-through' : ''}>
                {format(day, 'd')}
              </span>
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap items-center gap-3 text-[10px] text-stone-500 font-bold uppercase tracking-wider px-2">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-600 border border-emerald-700"></div> Available</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-yellow-600 border border-yellow-700"></div> Pending</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-600 border border-red-700"></div> Booked</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-purple-600 border border-purple-700"></div> Maintenance</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-luxury-emerald-950"></div> Selected</div>
      </div>
    </div>
  );
}
