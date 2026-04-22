import { createContext, useContext, useMemo, useState } from 'react';
import { safeJsonParse, safeLocalStorageGet, safeLocalStorageRemove, safeLocalStorageSet } from '../utils/storage';

const SessionContext = createContext(null);

export const useSession = () => {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession must be used within SessionProvider');
  return value;
};

export const SessionProvider = ({ children }) => {
  const STORAGE_KEY = 'aurex_mock_me_v1';

  const [user, setUserState] = useState(() => {
    const raw = safeLocalStorageGet(STORAGE_KEY);
    const parsed = safeJsonParse(raw, null);
    if (parsed && typeof parsed === 'object') return parsed;
    return { name: 'Adrian Miles', email: 'adrian@example.com', role: 'customer' };
  });

  const setUser = (next) => {
    setUserState(next);
    safeLocalStorageSet(STORAGE_KEY, JSON.stringify(next || {}));
  };

  const logout = () => {
    setUserState({ name: 'Guest', role: 'guest' });
    safeLocalStorageRemove(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      logout,
      status: 'ready',
      isAuthenticated: String(user?.role || '').toLowerCase() !== 'guest',
    }),
    [user]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

