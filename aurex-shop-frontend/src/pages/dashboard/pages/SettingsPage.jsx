import { useMemo, useState } from 'react';
import Modal from '../components/Modal';
import { useTheme } from '../../../context/ThemeContext';
import { useNotifications } from '../../../context/NotificationsContext';
import { useSession } from '../../../context/SessionContext';
import { useToasts } from '../../../components/ui/ToastProvider';
import { safeJsonParse, safeLocalStorageGet, safeLocalStorageRemove, safeLocalStorageSet } from '../../../utils/storage';
import { deleteMe } from '../../../services/api';
import { textStrings } from '../../../constants/textStrings';

const PREFS_KEY = 'aurex_prefs_v1';

const SettingsPage = () => {
  const theme = useTheme();
  const notifs = useNotifications();
  const session = useSession();
  const toasts = useToasts();

  const [prefs, setPrefs] = useState(() => {
    const raw = safeLocalStorageGet(PREFS_KEY);
    return safeJsonParse(raw, { notificationsEnabled: true });
  });

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const persist = (next) => {
    setPrefs(next);
    safeLocalStorageSet(PREFS_KEY, JSON.stringify(next));
  };

  const summary = useMemo(() => {
    return {
      theme: theme.mode,
      unread: notifs.unreadCount,
      notificationsEnabled: prefs.notificationsEnabled,
    };
  }, [theme.mode, notifs.unreadCount, prefs.notificationsEnabled]);

  return (
    <div className="tw-grid tw-gap-4">
      <div className="tw-rounded-3xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-p-5 tw-shadow-soft">
        <div className="tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.settings.header.kicker}</div>
        <div className="tw-text-lg tw-font-semibold">{textStrings.userDashboard.settings.header.title}</div>
        <div className="tw-mt-2 tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">
          {textStrings.userDashboard.settings.summary.themeLabel} <strong>{summary.theme}</strong> {textStrings.common.dotSeparator}{' '} {textStrings.userDashboard.settings.summary.notificationsLabel} <strong>{summary.notificationsEnabled ? textStrings.common.on : textStrings.common.off}</strong> {textStrings.common.dotSeparator}{' '} {textStrings.userDashboard.settings.summary.unreadLabel} <strong>{summary.unread}</strong>
        </div>
      </div>

      <div className="tw-rounded-3xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-p-5 tw-shadow-soft">
        <div className="tw-font-semibold">{textStrings.userDashboard.settings.appearance.title}</div>
        <div className="tw-mt-1 tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.settings.appearance.description}</div>
        <div className="tw-mt-4 tw-flex tw-items-center tw-justify-between tw-gap-3 tw-flex-wrap">
          <div className="tw-text-sm">
            {textStrings.userDashboard.settings.appearance.currentLabel} <strong>{theme.mode}</strong>
          </div>
          <button
            type="button"
            onClick={theme.toggle}
            className="tw-rounded-2xl tw-bg-brand-secondary tw-text-white tw-px-4 tw-py-2 tw-text-sm"
          >
            {textStrings.userDashboard.settings.appearance.toggle}
          </button>
        </div>
      </div>

      <div className="tw-rounded-3xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-p-5 tw-shadow-soft">
        <div className="tw-font-semibold">{textStrings.userDashboard.settings.notifications.title}</div>
        <div className="tw-mt-1 tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.settings.notifications.description}</div>

        <div className="tw-mt-4 tw-flex tw-items-center tw-justify-between tw-gap-3 tw-flex-wrap">
          <div className="tw-text-sm">{textStrings.userDashboard.settings.notifications.enableLabel}</div>
          <button
            type="button"
            onClick={() => persist({ ...prefs, notificationsEnabled: !prefs.notificationsEnabled })}
            className={[
              'tw-rounded-full tw-border tw-px-4 tw-py-2 tw-text-sm',
              prefs.notificationsEnabled
                ? 'tw-border-emerald-600 tw-text-emerald-700 dark:tw-text-emerald-400'
                : 'tw-border-slate-300 tw-text-slate-700 dark:tw-border-slate-800 dark:tw-text-slate-200',
            ].join(' ')}
          >
            {prefs.notificationsEnabled ? textStrings.common.on : textStrings.common.off}
          </button>
        </div>

        <div className="tw-mt-3 tw-flex tw-justify-end tw-gap-2">
          <button
            type="button"
            onClick={() => {
              notifs.markAllRead();
              toasts.push({ type: 'success', message: textStrings.userDashboard.settings.notifications.toasts.markAllRead });
            }}
            className="tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-px-4 tw-py-2 tw-text-sm hover:tw-bg-slate-50 dark:hover:tw-bg-slate-900"
          >
            {textStrings.userDashboard.settings.notifications.actions.markAllRead}
          </button>
          <button
            type="button"
            onClick={() => {
              notifs.clear();
              toasts.push({ type: 'success', message: textStrings.userDashboard.settings.notifications.toasts.cleared });
            }}
            className="tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-px-4 tw-py-2 tw-text-sm hover:tw-bg-slate-50 dark:hover:tw-bg-slate-900"
          >
            {textStrings.userDashboard.settings.notifications.actions.clear}
          </button>
        </div>
      </div>

      <div className="tw-rounded-3xl tw-border tw-border-rose-200 dark:tw-border-rose-900 tw-bg-white dark:tw-bg-slate-950 tw-p-5 tw-shadow-soft">
        <div className="tw-font-semibold tw-text-rose-700 dark:tw-text-rose-300">{textStrings.userDashboard.settings.danger.title}</div>
        <div className="tw-mt-1 tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.settings.danger.description}</div>
        <div className="tw-mt-4 tw-flex tw-justify-end">
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="tw-rounded-2xl tw-bg-rose-600 tw-text-white tw-px-4 tw-py-2 tw-text-sm"
          >
            {textStrings.userDashboard.settings.danger.deleteAccount}
          </button>
        </div>
      </div>

      <Modal open={confirmDelete} title={textStrings.userDashboard.settings.deleteModal.title} onClose={() => setConfirmDelete(false)}>
        <div className="tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">
          {textStrings.userDashboard.settings.deleteModal.body}
        </div>
        <div className="tw-mt-5 tw-flex tw-justify-end tw-gap-2">
          <button
            type="button"
            onClick={() => setConfirmDelete(false)}
            className="tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-px-4 tw-py-2 tw-text-sm"
          >
            {textStrings.userDashboard.settings.deleteModal.cancel}
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={async () => {
              setDeleting(true);
              try {
                await deleteMe();
                session.logout();
                safeLocalStorageRemove(PREFS_KEY);
                notifs.clear();
                toasts.push({ type: 'success', title: textStrings.userDashboard.settings.deleteModal.toasts.deletedTitle, message: textStrings.userDashboard.settings.deleteModal.toasts.deletedMessage });
                window.location.hash = '#/';
              } catch (e) {
                toasts.push({ type: 'error', title: textStrings.userDashboard.settings.deleteModal.toasts.failedTitle, message: e?.message || textStrings.userDashboard.settings.deleteModal.toasts.tryAgain });
              } finally {
                setDeleting(false);
                setConfirmDelete(false);
              }
            }}
            className="tw-rounded-2xl tw-bg-rose-600 tw-text-white tw-px-4 tw-py-2 tw-text-sm disabled:tw-opacity-60"
          >
            {deleting ? textStrings.userDashboard.settings.deleteModal.deleting : textStrings.userDashboard.settings.deleteModal.confirm}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;
