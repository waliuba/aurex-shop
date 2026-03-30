import { createContext, useContext, useMemo, useState } from 'react';

const SessionContext = createContext(null);

export const useSession = () => {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession must be used within SessionProvider');
  return value;
};

export const SessionProvider = ({ children, initialUser }) => {
  const [user, setUser] = useState(
    initialUser || {
      name: 'Avery Carter',
      role: 'customer',
    }
  );

  const value = useMemo(
    () => ({
      user,
      setUser,
      logout: () => setUser({ name: 'Guest', role: 'guest' }),
    }),
    [user]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

