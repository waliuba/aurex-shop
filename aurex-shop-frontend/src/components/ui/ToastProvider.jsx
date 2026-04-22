import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const ToastContext = createContext(null);

const styles = {
  success: 'tw-bg-emerald-600 tw-text-white',
  error: 'tw-bg-rose-600 tw-text-white',
  info: 'tw-bg-slate-900 tw-text-white',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current[id];
    if (timer) window.clearTimeout(timer);
    delete timers.current[id];
  }, []);

  const push = useCallback(
    (toast) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const next = { id, ...toast };
      setToasts((prev) => [next, ...prev].slice(0, 5));
      timers.current[id] = window.setTimeout(() => remove(id), 3500);
    },
    [remove]
  );

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="tw-fixed tw-right-4 tw-top-4 tw-z-[1000] tw-flex tw-w-[min(420px,calc(100vw-32px))] tw-flex-col tw-gap-2">
        {toasts.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => remove(t.id)}
            className={[
              'tw-text-left tw-rounded-2xl tw-shadow-soft tw-px-4 tw-py-3 tw-transition tw-duration-150 hover:tw-opacity-90',
              styles[t.type] || styles.info,
            ].join(' ')}
          >
            {t.title ? <div className="tw-font-semibold tw-text-sm">{t.title}</div> : null}
            <div className="tw-text-sm tw-opacity-95">{t.message}</div>
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToasts() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToasts must be used within ToastProvider');
  return ctx;
}

