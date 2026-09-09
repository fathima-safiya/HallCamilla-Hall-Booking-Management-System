import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../../hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { ADMIN_EMAILS } from '../../../lib/firebase';
import { Bell, CheckCircle, CreditCard, Info, CalendarCheck, XCircle, Check, ArrowRight } from 'lucide-react';
import type { AppNotification } from '../../../types/app';

/**
 * Helper to get an icon based on notification type
 */
function getNotificationIcon(type: AppNotification['type']) {
  switch (type) {
    case 'booking_approved':
    case 'booking_confirmed':
      return <CheckCircle size={16} className="text-emerald-500" />;
    case 'payment_received':
      return <CreditCard size={16} className="text-blue-500" />;
    case 'cancellation':
    case 'booking_rejected':
      return <XCircle size={16} className="text-red-500" />;
    case 'new_booking':
      return <CalendarCheck size={16} className="text-purple-500" />;
    default:
      return <Info size={16} className="text-stone-400" />;
  }
}

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email) : false;
  const notificationsPage = isAdmin ? '/admin/notifications' : '/notifications';

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleNotificationClick = async (notification: AppNotification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    setIsOpen(false);
    if (notification.link) {
      let fixedLink = notification.link.replace('/dashboard/bookings/', '/dashboard/booking/');
      if (fixedLink === '/dashboard/customers') fixedLink = '/admin/customers';
      navigate(fixedLink);
    }
  };

  const handleViewAll = () => {
    setIsOpen(false);
    navigate(notificationsPage);
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAllAsRead();
  };

  const displayNotifications = notifications.slice(0, 5); // Show top 5

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-stone-700 hover:text-luxury-emerald-900 transition-colors rounded-full hover:bg-stone-100 relative group outline-none"
        aria-label="View Notifications"
      >
        <Bell size={21} className={`transition-transform ${isOpen ? 'scale-110 text-luxury-emerald-800' : 'group-hover:scale-110'}`} />
        
        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popup */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-stone-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col animate-scale-in origin-top-right">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 bg-stone-50/50">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-luxury-emerald-950 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-luxury-emerald-100 text-luxury-emerald-800 text-[10px] font-bold rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-[10px] font-bold uppercase tracking-wider text-stone-500 hover:text-luxury-emerald-700 transition-colors flex items-center gap-1"
              >
                <Check size={12} /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[350px] overflow-y-auto">
            {displayNotifications.length > 0 ? (
              <div className="divide-y divide-stone-100">
                {displayNotifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`w-full text-left p-4 hover:bg-stone-50 transition-colors flex items-start gap-3 ${!notif.isRead ? 'bg-luxury-emerald-50/30' : ''}`}
                  >
                    <div className="mt-0.5 shrink-0 bg-white rounded-full p-1.5 shadow-sm border border-stone-100">
                      {getNotificationIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className={`text-sm truncate pr-2 ${!notif.isRead ? 'font-bold text-luxury-emerald-950' : 'font-semibold text-stone-800'}`}>
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-stone-400 whitespace-nowrap">{timeAgo(notif.createdAt)}</span>
                      </div>
                      <p className={`text-xs line-clamp-2 ${!notif.isRead ? 'text-stone-700' : 'text-stone-500'}`}>
                        {notif.message}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full bg-luxury-emerald-600 shrink-0 mt-1.5" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-stone-500 flex flex-col items-center justify-center">
                <Bell size={32} className="text-stone-200 mb-3" />
                <p className="text-sm font-medium">You're all caught up!</p>
                <p className="text-xs mt-1">No new notifications right now.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-stone-100 p-2">
            <button 
              onClick={handleViewAll}
              className="w-full py-2 text-xs font-bold text-luxury-emerald-800 hover:bg-luxury-emerald-50 rounded-lg transition-colors flex items-center justify-center gap-1 group"
            >
              View All Notifications
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
