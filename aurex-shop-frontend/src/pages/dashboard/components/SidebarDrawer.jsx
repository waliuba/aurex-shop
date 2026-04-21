import { useEffect } from 'react';
import { DASHBOARD_LINKS } from './dashboardLinks';

const SidebarDrawer = ({ open, active, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="md:tw-hidden tw-fixed tw-inset-0 tw-z-[100]">
      <button type="button" aria-label="Close menu" onClick={onClose} className="tw-absolute tw-inset-0 tw-bg-black/40" />
      <aside className="tw-absolute tw-left-0 tw-top-0 tw-bottom-0 tw-w-[min(320px,86vw)] tw-bg-white dark:tw-bg-slate-950 tw-border-r tw-border-slate-200 dark:tw-border-slate-800 tw-shadow-soft">
        <div className="tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-4 tw-border-b tw-border-slate-200 dark:tw-border-slate-800">
          <a className="tw-font-semibold tw-tracking-tight" href="#/" onClick={onClose}>
            Aurex Shop
          </a>
          <button
            type="button"
            onClick={onClose}
            className="tw-rounded-xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-px-3 tw-py-2 tw-text-sm hover:tw-bg-slate-50 dark:hover:tw-bg-slate-900"
          >
            Close
          </button>
        </div>

        <nav className="tw-p-2">
          {DASHBOARD_LINKS.map((l) => {
            const isActive = l.key === active;
            return (
              <a
                key={l.key}
                href={l.href}
                onClick={onClose}
                className={[
                  'tw-flex tw-items-center tw-gap-3 tw-rounded-2xl tw-px-3 tw-py-2 tw-text-sm tw-transition',
                  isActive
                    ? 'tw-bg-slate-900 tw-text-white dark:tw-bg-white dark:tw-text-slate-900'
                    : 'tw-text-slate-700 hover:tw-bg-slate-100 dark:tw-text-slate-200 dark:hover:tw-bg-slate-900',
                ].join(' ')}
                aria-current={isActive ? 'page' : undefined}
              >
                <span
                  className={[
                    'tw-grid tw-place-items-center tw-h-9 tw-w-9 tw-rounded-2xl tw-shrink-0',
                    isActive ? 'tw-bg-white/10 dark:tw-bg-slate-900/10' : 'tw-bg-slate-100 dark:tw-bg-slate-900',
                  ].join(' ')}
                >
                  {l.icon({ className: 'tw-h-5 tw-w-5' })}
                </span>
                <span className="tw-font-medium">{l.label}</span>
              </a>
            );
          })}
        </nav>
      </aside>
    </div>
  );
};

export default SidebarDrawer;

