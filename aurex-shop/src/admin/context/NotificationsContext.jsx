import { createContext, useCallback, useContext, useMemo, useReducer } from 'react';

const NotificationsContext = createContext(null);

const initial = {
  items: [
    {
      id: 'n_welcome',
      type: 'info',
      message: 'Welcome to Aurex Admin. You are viewing mock data.',
      at: '2026-03-26 12:00',
      read: false,
    },
  ],
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return { ...state, items: [action.item, ...state.items].slice(0, 25) };
    case 'MARK_READ':
      return { ...state, items: state.items.map((n) => (n.id === action.id ? { ...n, read: true } : n)) };
    case 'MARK_ALL_READ':
      return { ...state, items: state.items.map((n) => ({ ...n, read: true })) };
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
}

const uid = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

export const NotificationsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initial);

  const addNotification = useCallback((input) => {
    const item = {
      id: uid(),
      type: input.type || 'info',
      message: input.message || '',
      at: input.at || new Date().toISOString().slice(0, 16).replace('T', ' '),
      read: false,
    };
    dispatch({ type: 'ADD', item });
    return item;
  }, []);

  const markRead = useCallback((id) => dispatch({ type: 'MARK_READ', id }), []);
  const markAllRead = useCallback(() => dispatch({ type: 'MARK_ALL_READ' }), []);
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const unreadCount = state.items.reduce((sum, n) => sum + (n.read ? 0 : 1), 0);
  const value = useMemo(
    () => ({ items: state.items, unreadCount, addNotification, markRead, markAllRead, clear }),
    [state.items, unreadCount, addNotification, markRead, markAllRead, clear]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
};

