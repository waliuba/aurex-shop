import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const RequireAdminAuth = ({ children, nextHash }) => {
  const auth = useAuth();

  useEffect(() => {
    if (auth.status === 'authenticated') return;
    const next = nextHash ? `?next=${encodeURIComponent(nextHash)}` : '';
    window.location.hash = `#/admin/login${next}`;
  }, [auth.status, nextHash]);

  if (auth.status !== 'authenticated') return null;
  return children;
};

export default RequireAdminAuth;

