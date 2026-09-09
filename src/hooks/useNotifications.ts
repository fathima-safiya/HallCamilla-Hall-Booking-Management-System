import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notificationService';
import type { AppNotification } from '../types/app';

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const userId = user.uid || user.email;

    // Listen for customer's notifications
    const unsubscribeCustomer = notificationService.subscribeToUserNotifications(userId, (data) => {
      setNotifications(prev => {
        // Merge with existing admin notifications if any, then sort
        const nonCustomer = prev.filter(n => n.userId !== userId);
        const merged = [...nonCustomer, ...data].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        return merged;
      });
    });

    // If user is admin, also listen for 'admin' notifications
    let unsubscribeAdmin: (() => void) | undefined;
    if (user.role === 'admin') {
      unsubscribeAdmin = notificationService.subscribeToUserNotifications('admin', (data) => {
        setNotifications(prev => {
          const nonAdmin = prev.filter(n => n.userId !== 'admin');
          const merged = [...nonAdmin, ...data].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          return merged;
        });
      });
    }

    return () => {
      unsubscribeCustomer();
      if (unsubscribeAdmin) unsubscribeAdmin();
    };
  }, [user]);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.isRead).length);
  }, [notifications]);

  const markAsRead = async (notificationId: string) => {
    await notificationService.markAsRead(notificationId);
  };

  const markAllAsRead = async () => {
    if (!user) return;
    const userId = user.uid || user.email;
    await notificationService.markAllAsRead(userId);
    if (user.role === 'admin') {
      await notificationService.markAllAsRead('admin');
    }
  };

  const deleteNotification = async (notificationId: string) => {
    await notificationService.deleteNotification(notificationId);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
}
