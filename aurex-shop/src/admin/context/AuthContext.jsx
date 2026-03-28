import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'aurex_admin_auth_v1';

const initialState = {
  status: 'anonymous',
  user: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'RESTORE':
      return action.payload?.user ? { status: 'authenticated', user: action.payload.user } : initialState;
    case 'LOGIN_SUCCESS':
      return { status: 'authenticated', user: action.user };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      dispatch({ type: 'RESTORE', payload: JSON.parse(raw) });
    } catch {
      dispatch({ type: 'RESTORE', payload: null });
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: state.user }));
    } catch {
      // ignore
    }
  }, [state.user]);

  const login = useCallback(async ({ email, password }) => {
    await new Promise((r) => setTimeout(r, 550));
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedPassword = String(password || '').trim();

    const ok =
      (normalizedEmail === 'admin@aurex.com' && normalizedPassword === 'aurexadmin') ||
      (normalizedEmail !== '' && normalizedPassword.length >= 4);

    if (!ok) {
      const error = new Error('Invalid credentials');
      error.code = 'AUTH_INVALID';
      throw error;
    }

    const user = {
      id: 'admin_001',
      name: 'Aurex Admin',
      email: normalizedEmail || 'admin@aurex.com',
      role: 'Admin',
    };
    dispatch({ type: 'LOGIN_SUCCESS', user });
    return user;
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  const value = useMemo(() => ({ ...state, login, logout }), [state, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

