import { useEffect } from 'react';
import { useToasts } from '../components/ui/ToastProvider';
import { useSession } from '../context/SessionContext';
import { textStrings } from '../constants/textStrings';

const RequireUserAuth = ({ children, nextHash }) => {
  const session = useSession();
  const toasts = useToasts();

  useEffect(() => {
    if (session.status === 'loading') return;
    if (session.isAuthenticated) return;

    toasts.push({
      type: 'info',
      title: textStrings.pages.auth.signInRequiredTitle,
      message: textStrings.pages.auth.signInRequiredMessage,
    });

    const next = nextHash ? `?next=${encodeURIComponent(nextHash)}` : '';
    window.location.hash = `#/login${next}`;
  }, [session.status, session.isAuthenticated, toasts, nextHash]);

  if (session.status === 'loading') return null;
  if (!session.isAuthenticated) return null;
  return children;
};

export default RequireUserAuth;

