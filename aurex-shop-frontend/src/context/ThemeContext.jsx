import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { safeLocalStorageGet, safeLocalStorageSet } from '../utils/storage';

const ThemeContext = createContext(null);

const STORAGE_KEY = 'aurex_theme_v1';

const applyToDom = (mode) => {
  const root = document.documentElement;
  if (mode === 'dark') {
    root.classList.add('tw-dark');
    root.classList.remove('dark');
  } else {
    root.classList.remove('tw-dark');
    root.classList.remove('dark');
  }
};

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(() => {
    const raw = safeLocalStorageGet(STORAGE_KEY);
    return raw === 'dark' ? 'dark' : 'light';
  });

  const setMode = useCallback((next) => {
    setModeState(next);
    safeLocalStorageSet(STORAGE_KEY, next);
    applyToDom(next);
  }, []);

  const toggle = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setMode]);

  useEffect(() => {
    applyToDom(mode);
  }, [mode]);

  const value = useMemo(() => ({ mode, setMode, toggle }), [mode, setMode, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
