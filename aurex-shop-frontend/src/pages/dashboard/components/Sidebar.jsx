import { DASHBOARD_LINKS } from './dashboardLinks';

const ChevronLeft = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path d="M14.5 5 8 12l6.5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path d="M9.5 19 16 12 9.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Sidebar = ({ active, collapsed, onToggle }) => {
  return (
    <aside
      className={[
        'tw-sticky tw-top-0 tw-h-screen tw-border-r tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950',
        collapsed ? 'tw-w-[72px]' : 'tw-w-[260px]',
        'tw-transition-[width] tw-duration-200',
        'tw-hidden md:tw-block',
      ].join(' ')}
      aria-label="Dashboard sidebar"
    >
      <div className="tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-4 tw-border-b tw-border-slate-200 dark:tw-border-slate-800">
        <a className="tw-font-semibold tw-tracking-tight" href="#/">
          {collapsed ? 'AX' : 'Aurex Shop'}
        </a>
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="tw-rounded-xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-p-2 tw-text-slate-600 dark:tw-text-slate-300 hover:tw-bg-slate-50 dark:hover:tw-bg-slate-900"
        >
          {collapsed ? <ChevronRight className="tw-h-4 tw-w-4" /> : <ChevronLeft className="tw-h-4 tw-w-4" />}
        </button>
      </div>

      <nav className="tw-px-2 tw-py-3">
        {DASHBOARD_LINKS.map((l) => {
          const isActive = l.key === active;
          return (
            <a
              key={l.key}
              href={l.href}
              className={[
                'tw-flex tw-items-center tw-gap-3 tw-rounded-2xl tw-px-3 tw-py-2 tw-text-sm tw-transition',
                isActive
                  ? 'tw-bg-slate-900 tw-text-white dark:tw-bg-white dark:tw-text-slate-900'
                  : 'tw-text-slate-700 hover:tw-bg-slate-100 dark:tw-text-slate-200 dark:hover:tw-bg-slate-900',
              ].join(' ')}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? l.label : undefined}
            >
              <span
                className={[
                  'tw-grid tw-place-items-center tw-h-9 tw-w-9 tw-rounded-2xl tw-shrink-0',
                  isActive ? 'tw-bg-white/10 dark:tw-bg-slate-900/10' : 'tw-bg-slate-100 dark:tw-bg-slate-900',
                ].join(' ')}
              >
                {l.icon({ className: 'tw-h-5 tw-w-5' })}
              </span>
              {collapsed ? null : <span className="tw-font-medium">{l.label}</span>}
            </a>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

