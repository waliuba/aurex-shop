import { useEffect, useMemo, useRef, useState } from 'react';
import { useNotifications } from '../../../context/NotificationsContext';
import { useSession } from '../../../context/SessionContext';
import { textStrings } from '../../../constants/textStrings';

const initialsFor = (user) => {
  const name = String(user?.name || '').trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] || '';
    const last = (parts.length > 1 ? parts[parts.length - 1]?.[0] : '') || '';
    const value = `${first}${last}`.toUpperCase();
    return value || 'AX';
  }

  const email = String(user?.email || '').trim();
  if (email) return email.slice(0, 2).toUpperCase();
  return 'AX';
};

const Topbar = ({ title, breadcrumbs }) => {
  const session = useSession();
  const notifs = useNotifications();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const menuWrapRef = useRef(null);
  const notifWrapRef = useRef(null);

  useEffect(() => {
    const onHash = () => {
      setMenuOpen(false);
      setNotifOpen(false);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (!menuOpen && !notifOpen) return;
    const onDown = (e) => {
      const target = e.target;
      if (menuOpen && menuWrapRef.current && !menuWrapRef.current.contains(target)) setMenuOpen(false);
      if (notifOpen && notifWrapRef.current && !notifWrapRef.current.contains(target)) setNotifOpen(false);
    };
    window.addEventListener('pointerdown', onDown);
    return () => window.removeEventListener('pointerdown', onDown);
  }, [menuOpen, notifOpen]);

  useEffect(() => {
    if (!menuOpen && !notifOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen, notifOpen]);

  const breadcrumbEl = useMemo(
    () => (
      <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2 tw-text-xs tw-text-slate-500 dark:tw-text-slate-300">
        {(breadcrumbs || []).map((c, idx) => (
          <span key={c.href} className="tw-inline-flex tw-items-center tw-gap-2">
            <a href={c.href} className="hover:tw-underline">
              {c.label}
            </a>
            {idx < breadcrumbs.length - 1 ? <span>{textStrings.common.slashSeparator}</span> : null}
          </span>
        ))}
      </div>
    ),
    [breadcrumbs]
  );

  const user = session.user || {};
  const initials = initialsFor(user);

  return (
    <header className="tw-sticky tw-top-0 tw-z-50 tw-border-b tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white/85 dark:tw-bg-slate-950/85 tw-backdrop-blur">
      <div className="tw-relative tw-mx-auto tw-max-w-6xl tw-px-4 md:tw-px-8 tw-py-3 tw-flex tw-items-center tw-justify-between tw-gap-3">
        <div className="tw-flex tw-items-center tw-gap-3 tw-min-w-0">
          <div className="tw-min-w-0">
            {breadcrumbEl}
            <div className="tw-text-lg tw-font-semibold tw-tracking-tight tw-truncate">{title}</div>
          </div>
        </div>

        <div className="tw-flex tw-items-center tw-gap-2">
          <div className="tw-relative" ref={notifWrapRef}>
            <button
              type="button"
              className="tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-px-3 tw-py-2 tw-text-sm hover:tw-bg-slate-50 dark:hover:tw-bg-slate-900"
              aria-label={textStrings.userDashboard.topbar.notifications.ariaLabel}
              title={textStrings.userDashboard.topbar.notifications.title}
              aria-expanded={notifOpen}
              onClick={() => {
                setNotifOpen((v) => !v);
                setMenuOpen(false);
              }}
            >
              <span aria-hidden="true">{textStrings.userDashboard.topbar.notifications.icon}</span>
              {notifs.unreadCount ? (
                <span className="tw-ml-2 tw-inline-flex tw-h-5 tw-min-w-5 tw-items-center tw-justify-center tw-rounded-full tw-bg-rose-600 tw-px-1 tw-text-[11px] tw-text-white">
                  {notifs.unreadCount}
                </span>
              ) : null}
            </button>

            {notifOpen ? (
              <div className="tw-absolute tw-right-0 tw-mt-2 tw-w-[min(420px,calc(100vw-32px))] tw-overflow-hidden tw-rounded-3xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-shadow-soft">
                <div className="tw-flex tw-items-center tw-justify-between tw-gap-3 tw-border-b tw-border-slate-200 dark:tw-border-slate-800 tw-px-4 tw-py-3">
                  <div className="tw-font-semibold">{textStrings.userDashboard.topbar.notifications.panelTitle}</div>
                  <div className="tw-flex tw-gap-2">
                    <button
                      type="button"
                      onClick={notifs.markAllRead}
                      className="tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-px-3 tw-py-1 tw-text-xs hover:tw-bg-slate-50 dark:hover:tw-bg-slate-900"
                    >
                      {textStrings.userDashboard.topbar.notifications.actions.markAllRead}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotifOpen(false)}
                      className="tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-px-3 tw-py-1 tw-text-xs hover:tw-bg-slate-50 dark:hover:tw-bg-slate-900"
                    >
                      {textStrings.userDashboard.topbar.notifications.actions.close}
                    </button>
                  </div>
                </div>
                <div className="tw-max-h-[60vh] tw-overflow-auto tw-p-2">
                  {notifs.notifications.length ? (
                    notifs.notifications.slice(0, 10).map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => notifs.markRead(n.id)}
                        className={[
                          'tw-w-full tw-text-left tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-p-3 tw-mb-2 hover:tw-bg-slate-50 dark:hover:tw-bg-slate-900',
                          n.read ? 'tw-opacity-80' : '',
                        ].join(' ')}
                      >
                        <div className="tw-flex tw-items-start tw-justify-between tw-gap-2">
                          <div>
                            <div className="tw-font-semibold tw-text-sm">{n.title}</div>
                            <div className="tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">{n.message}</div>
                          </div>
                          <div className="tw-text-xs tw-text-slate-500 dark:tw-text-slate-400">{n.createdAt}</div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="tw-p-4 tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">
                      {textStrings.userDashboard.topbar.notifications.empty}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <div className="tw-relative" ref={menuWrapRef}>
            <button
              type="button"
              onClick={() => {
                setMenuOpen((v) => !v);
                setNotifOpen(false);
              }}
              className="tw-flex tw-items-center tw-gap-2 tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-px-3 tw-py-2 tw-text-sm hover:tw-bg-slate-50 dark:hover:tw-bg-slate-900"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.name || textStrings.userDashboard.topbar.account}
                  className="tw-h-7 tw-w-7 tw-rounded-full tw-object-cover tw-border tw-border-slate-200 dark:tw-border-slate-800"
                />
              ) : (
                <span className="tw-h-7 tw-w-7 tw-rounded-full tw-bg-brand-secondary tw-text-white tw-grid tw-place-items-center tw-text-xs">
                  {initials}
                </span>
              )}
              <span className="tw-hidden md:tw-inline">{textStrings.userDashboard.topbar.account}</span>
            </button>

            {menuOpen ? (
              <div
                role="menu"
                className="tw-absolute tw-right-0 tw-mt-2 tw-w-64 tw-overflow-hidden tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-shadow-soft"
              >
                <div className="tw-px-4 tw-py-3 tw-border-b tw-border-slate-200 dark:tw-border-slate-800">
                  <div className="tw-text-sm tw-font-semibold tw-truncate">{user?.name || textStrings.userDashboard.topbar.account}</div>
                  {user?.email ? <div className="tw-text-xs tw-text-slate-600 dark:tw-text-slate-300 tw-truncate">{user.email}</div> : null}
                </div>
                <a
                  role="menuitem"
                  className="tw-block tw-px-4 tw-py-3 hover:tw-bg-slate-50 dark:hover:tw-bg-slate-900"
                  href="#/dashboard/profile"
                  onClick={() => setMenuOpen(false)}
                >
                  {textStrings.userDashboard.topbar.menuItems.profile}
                </a>
                <a
                  role="menuitem"
                  className="tw-block tw-px-4 tw-py-3 hover:tw-bg-slate-50 dark:hover:tw-bg-slate-900"
                  href="#/dashboard/settings"
                  onClick={() => setMenuOpen(false)}
                >
                  {textStrings.userDashboard.topbar.menuItems.settings}
                </a>
                <button
                  role="menuitem"
                  type="button"
                  className="tw-w-full tw-text-left tw-px-4 tw-py-3 hover:tw-bg-slate-50 dark:hover:tw-bg-slate-900"
                  onClick={() => {
                    setMenuOpen(false);
                    session.logout();
                    window.location.hash = '#/';
                  }}
                >
                  {textStrings.userDashboard.topbar.menuItems.logout}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
