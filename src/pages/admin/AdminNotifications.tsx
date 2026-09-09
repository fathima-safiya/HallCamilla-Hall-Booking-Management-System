import { useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import type { AppNotification } from '../../types/app';
import {
  Bell, CheckCircle, CreditCard, Info, CalendarCheck, User, Star,
  Wrench, XCircle, Trash2, BellOff, Filter
} from 'lucide-react';

type FilterType = 'all' | AppNotification['type'];

const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Bookings', value: 'booking' },
  { label: 'Payments', value: 'payment' },
  { label: 'Cancellations', value: 'cancellation' },
  { label: 'Reviews', value: 'review' },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Registrations', value: 'registration' },
];

function getIcon(type: string) {
  switch (type) {
    case 'booking': return <CalendarCheck size={20} className="text-luxury-gold-600" />;
    case 'payment': return <CreditCard size={20} className="text-emerald-600" />;
    case 'registration': return <User size={20} className="text-indigo-500" />;
    case 'review': return <Star size={20} className="text-yellow-500" />;
    case 'maintenance': return <Wrench size={20} className="text-orange-500" />;
    case 'cancellation': return <XCircle size={20} className="text-red-500" />;
    default: return <Info size={20} className="text-blue-500" />;
  }
}

function getIconBg(type: string) {
  switch (type) {
    case 'booking': return 'bg-amber-50 border-amber-200';
    case 'payment': return 'bg-emerald-50 border-emerald-200';
    case 'registration': return 'bg-indigo-50 border-indigo-200';
    case 'review': return 'bg-yellow-50 border-yellow-200';
    case 'maintenance': return 'bg-orange-50 border-orange-200';
    case 'cancellation': return 'bg-red-50 border-red-200';
    default: return 'bg-blue-50 border-blue-200';
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

export default function AdminNotifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);

  const filtered = activeFilter === 'all'
    ? notifications
    : notifications.filter(n => n.type === activeFilter);

  const handleClick = async (notification: AppNotification) => {
    if (!notification.isRead) await markAsRead(notification.id);
    setSelectedNotification(notification);
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-luxury-emerald-950 tracking-tight">
            Notifications
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            All system activity and alerts for the admin panel.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-luxury-emerald-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-luxury-emerald-800 transition-colors shadow-sm"
          >
            <CheckCircle size={14} />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
          <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Total</p>
          <p className="text-2xl font-bold text-luxury-emerald-950 mt-1">{notifications.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-red-100 shadow-sm">
          <p className="text-xs text-red-500 uppercase tracking-wider font-semibold">Unread</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{unreadCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
          <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Read</p>
          <p className="text-2xl font-bold text-stone-700 mt-1">{notifications.length - unreadCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
          <p className="text-xs text-amber-600 uppercase tracking-wider font-semibold">Today</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">
            {notifications.filter(n => {
              const d = new Date(n.createdAt);
              const now = new Date();
              return d.toDateString() === now.toDateString();
            }).length}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
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
          <h3 className="font-serif text-lg font-semibold text-stone-600 mb-1">No notifications found</h3>
          <p className="text-stone-400 text-sm">
            {activeFilter === 'all'
              ? 'You are all caught up! No notifications yet.'
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
                <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 border border-stone-200 rounded px-2 py-0.5">
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
      
      {/* Notification Popup Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxury-emerald-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up border border-luxury-gold-200">
            <div className="p-6 border-b border-stone-100 flex justify-between items-start bg-stone-50/50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${getIconBg(selectedNotification.type)}`}>
                  {getIcon(selectedNotification.type)}
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-luxury-emerald-950">{selectedNotification.title}</h3>
                  <p className="text-xs text-stone-500 font-medium mt-1">{timeAgo(selectedNotification.createdAt)}</p>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedNotification(null); }}
                className="text-stone-400 hover:text-red-500 transition-colors p-1"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-stone-600 leading-relaxed text-sm mb-8">
                {selectedNotification.message}
              </p>
              
              <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 bg-stone-50 border border-stone-200 rounded px-3 py-1.5">
                  {selectedNotification.type} Alert
                </span>
                <button 
                  onClick={() => setSelectedNotification(null)}
                  className="bg-luxury-emerald-950 text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-luxury-emerald-900 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
