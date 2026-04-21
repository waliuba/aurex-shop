import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { safeJsonParse, safeLocalStorageGet, safeLocalStorageSet } from '../utils/storage';

const NotificationsContext = createContext(null);

const STORAGE_KEY = 'aurex_notifications_v1';

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    const raw = safeLocalStorageGet(STORAGE_KEY);
    const list = safeJsonParse(raw, []);
    return Array.isArray(list) ? list : [];
  });

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEY, JSON.stringify(notifications.slice(0, 50)));
  }, [notifications]);

  const push = useCallback((n) => {
    const next = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: n.title,
      message: n.message,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      read: Boolean(n.read),
    };
    setNotifications((prev) => [next, ...prev].slice(0, 50));
  }, []);

  const markRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clear = useCallback(() => setNotifications([]), []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
  const value = useMemo(
    () => ({ notifications, unreadCount, push, markRead, markAllRead, clear }),
    [notifications, unreadCount, push, markRead, markAllRead, clear]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
}

