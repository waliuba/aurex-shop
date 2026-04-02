import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext';
import Button from '../ui/Button';
import sizes from '../../../universal components/sizes';
import Text from '../../../universal components/textstring';

const Topbar = ({ pageLabel }) => {
  const auth = useAuth();
  const notifications = useNotifications();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="adminTopbar">
      <div className="adminTopbar__title">
        <h1>{Text.admin.topbar.title}</h1>
        <p>{pageLabel}</p>
      </div>

      <div className="adminTopbar__actions">
        <div className="adminTopbar__profile">
          <button
            type="button"
            className="adminIconBtn"
            onClick={() => {
              setNotifOpen((v) => !v);
              setProfileOpen(false);
            }}
            aria-label={Text.admin.topbar.notificationsAria}
          >
            <span aria-hidden="true">!</span>
            {notifications.unreadCount ? <span className="adminPill">{notifications.unreadCount}</span> : null}
          </button>
          {notifOpen ? (
            <div className="adminMenu" role="menu" style={{ minWidth: 340 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: sizes.admin.gaps.md }}>
                <div style={{ fontWeight: 850 }}>{Text.admin.topbar.notificationsTitle}</div>
                <div style={{ display: 'flex', gap: sizes.admin.gaps.md }}>
                  <Button variant="ghost" onClick={notifications.markAllRead}>
                    {Text.admin.actions.markAllRead}
                  </Button>
                </div>
              </div>
              <div style={{ display: 'grid', gap: sizes.admin.gaps.md, maxHeight: 320, overflow: 'auto', paddingRight: 4 }}>
                {notifications.items.length === 0 ? (
                  <div className="uiHelpText">{Text.admin.topbar.noNotifications}</div>
                ) : (
                  notifications.items.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => notifications.markRead(n.id)}
                      className="adminNotifRow"
                      style={{ opacity: n.read ? 0.75 : 1 }}
                    >
                      <div style={{ fontWeight: 750 }}>{n.message}</div>
                      <div className="uiHelpText">{n.at}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="adminTopbar__profile">
          <button
            type="button"
            className="adminProfileBtn"
            onClick={() => {
              setProfileOpen((v) => !v);
              setNotifOpen(false);
            }}
          >
            <span className="adminProfileBtn__dot" aria-hidden="true" />
            <span className="adminProfileBtn__text">
              {auth.user?.name || Text.admin.topbar.defaultUserName}{' '}
              <span className="adminProfileBtn__muted">{auth.user?.email}</span>
            </span>
          </button>
          {profileOpen ? (
            <div className="adminMenu" role="menu">
              <div className="adminMenu__meta">
                <div className="adminMenu__name">{auth.user?.name}</div>
                <div className="adminMenu__email">{auth.user?.email}</div>
              </div>
              <Button
                variant="secondary"
                onClick={() => {
                  auth.logout();
                  window.location.hash = '#/admin/login';
                }}
              >
                {Text.admin.actions.logout}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
