import { useMemo, useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileNav from './MobileNav';
import { dashboardTitleFor } from './dashboardLinks';

const DashboardShell = ({ active, children, onToggleTheme, themeMode }) => {
  const [collapsed, setCollapsed] = useState(false);

  const crumbs = useMemo(() => {
    const base = [{ label: 'Dashboard', href: '#/dashboard' }];
    if (active === 'overview') return base;
    return [...base, { label: dashboardTitleFor(active), href: `#/dashboard/${active}` }];
  }, [active]);

  return (
    <div className="tw-min-h-screen tw-bg-slate-50 dark:tw-bg-slate-950 tw-text-slate-900 dark:tw-text-slate-50 tw-pb-16 md:tw-pb-0">
      <div className="tw-flex">
        <Sidebar active={active} collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

        <div className="tw-flex-1 tw-min-w-0">
          <Topbar title={dashboardTitleFor(active)} breadcrumbs={crumbs} onToggleTheme={onToggleTheme} themeMode={themeMode} />

          <main className="tw-px-4 tw-py-4 md:tw-px-8 md:tw-py-6">
            <div className="tw-mx-auto tw-max-w-6xl">{children}</div>
          </main>
        </div>
      </div>

      <MobileNav active={active} />
    </div>
  );
};

export default DashboardShell;
