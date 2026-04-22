import { DASHBOARD_LINKS } from './dashboardLinks';

const MobileNav = ({ active }) => {
  return (
    <nav className="md:tw-hidden tw-fixed tw-bottom-0 tw-left-0 tw-right-0 tw-z-50 tw-border-t tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950">
      <div className="tw-mx-auto tw-max-w-6xl tw-px-3 tw-py-2 tw-grid tw-grid-cols-5 tw-gap-2">
        {DASHBOARD_LINKS.map((i) => {
          const isActive = i.key === active;
          return (
            <a
              key={i.key}
              href={i.href}
              className={[
                'tw-rounded-2xl tw-px-2 tw-py-2 tw-text-center tw-text-[11px] tw-leading-tight tw-transition',
                isActive
                  ? 'tw-bg-slate-900 tw-text-white dark:tw-bg-white dark:tw-text-slate-900'
                  : 'tw-text-slate-700 dark:tw-text-slate-200 hover:tw-bg-slate-50 dark:hover:tw-bg-slate-900',
              ].join(' ')}
            >
              <div className="tw-mx-auto tw-grid tw-place-items-center tw-h-7 tw-w-7 tw-rounded-xl tw-bg-slate-100 dark:tw-bg-slate-900">
                {i.icon({ className: 'tw-h-4 tw-w-4' })}
              </div>
              <div className="tw-mt-1">{i.key === 'overview' ? 'Home' : i.label}</div>
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;

