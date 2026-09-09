import { useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import type { AppNotification } from '../../types/app';
import {
  Bell, CheckCircle, CreditCard, Info, CalendarCheck,
  XCircle, Trash2, BellOff, Filter
} from 'lucide-react';

type FilterType = 'all' | 'booking' | 'payment' | 'cancellation' | 'general';

const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Bookings', value: 'booking' },
  { label: 'Payments', value: 'payment' },
  { label: 'Cancellations', value: 'cancellation' },
  { label: 'General', value: 'general' },
];

function getIcon(type: string) {
  switch (type) {
    case 'booking': return <CalendarCheck size={20} className="text-luxury-gold-600" />;
    case 'payment': return <CreditCard size={20} className="text-emerald-600" />;
    case 'cancellation': return <XCircle size={20} className="text-red-500" />;
    default: return <Info size={20} className="text-blue-500" />;
  }
}

function getIconBg(type: string) {
  switch (type) {
    case 'booking': return 'bg-amber-50 border-amber-200';
    case 'payment': return 'bg-emerald-50 border-emerald-200';
    case 'cancellation': return 'bg-red-50 border-red-200';
    default: return 'bg-blue-50 border-blue-200';
  }
}

function getTypeBadgeColor(type: string) {
  switch (type) {
    case 'booking': return 'bg-amber-100 text-amber-700';
    case 'payment': return 'bg-emerald-100 text-emerald-700';
    case 'cancellation': return 'bg-red-100 text-red-700';
    default: return 'bg-blue-100 text-blue-700';
  }
}

function timeAgo(dateString: string) {
  const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

export default function CustomerNotifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filtered = activeFilter === 'all'
    ? notifications
    : notifications.filter(n => {
        if (activeFilter === 'general') {
          return !['booking', 'payment', 'cancellation'].includes(n.type);
        }
        return n.type === activeFilter;
      });

  const handleClick = async (notification: AppNotification) => {
    if (!notification.isRead) await markAsRead(notification.id);
    if (notification.link) {
      const fixedLink = notification.link.replace('/dashboard/bookings/', '/dashboard/booking/');
      navigate(fixedLink);
    }
  };

  return (
    <main className="pt-32 pb-24 max-w-4xl mx-auto px-6 md:px-8 w-full animate-fade-in font-sans">

      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-luxury-emerald-950 tracking-tight">
            My Notifications
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Your personal inbox — booking updates, payment confirmations, and more.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-luxury-emerald-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-luxury-emerald-800 transition-colors shadow-sm shrink-0 mt-1"
          >
            <CheckCircle size={14} />
            Mark All Read
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <div className="bg-white rounded-xl px-5 py-3 border border-stone-200 shadow-sm flex items-center gap-3">
          <Bell size={18} className="text-stone-400" />
          <div>
            <p className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">Total</p>
            <p className="text-lg font-bold text-luxury-emerald-950">{notifications.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl px-5 py-3 border border-red-100 shadow-sm flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div>
            <p className="text-[10px] text-red-400 uppercase tracking-wider font-semibold">Unread</p>
            <p className="text-lg font-bold text-red-600">{unreadCount}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter size={14} className="text-stone-400 shrink-0" />
        {FILTER_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setActiveFilter(opt.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
              activeFilter === opt.value
                ? 'bg-luxury-emerald-900 text-white border-luxury-emerald-900 shadow-sm'
                : 'bg-white text-stone-500 border-stone-200 hover:border-luxury-emerald-700 hover:text-luxury-emerald-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-16 text-center shadow-sm">
          <BellOff size={48} className="text-stone-300 mx-auto mb-4" />
          <h3 className="font-serif text-lg font-semibold text-stone-600 mb-1">No notifications here</h3>
          <p className="text-stone-400 text-sm">
            {activeFilter === 'all'
              ? "You're all caught up! We'll notify you about your bookings and payments here."
              : `No ${activeFilter} notifications to display.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(notification => (
            <div
              key={notification.id}
              className={`group bg-white rounded-xl border shadow-sm transition-all hover:shadow-md flex gap-4 p-5 cursor-pointer ${
                !notification.isRead
                  ? 'border-luxury-gold-300 bg-luxury-gold-50/20'
                  : 'border-stone-200'
              }`}
              onClick={() => handleClick(notification)}
            >
              {/* Icon */}
              <div className={`shrink-0 w-11 h-11 rounded-full border flex items-center justify-center ${getIconBg(notification.type)}`}>
                {getIcon(notification.type)}
              </div>

              {/* Content */}
              <div className="flex-grow min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className={`text-sm ${!notification.isRead ? 'font-bold text-luxury-emerald-950' : 'font-semibold text-stone-700'}`}>
                    {notification.title}
                  </h4>
                  <span className="text-[10px] text-stone-400 shrink-0 font-medium mt-0.5">
                    {timeAgo(notification.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-stone-500 mt-1 leading-relaxed">
                  {notification.message}
                </p>
                <span className={`inline-block mt-2 text-[10px] font-bold uppercase tracking-widest rounded-full px-2.5 py-0.5 ${getTypeBadgeColor(notification.type)}`}>
                  {notification.type}
                </span>
              </div>

              {/* Actions */}
              <div className="shrink-0 flex flex-col items-center justify-between gap-2">
                {!notification.isRead && (
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-200" />
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                  className="text-stone-300 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                  aria-label="Delete notification"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
