import { useMemo } from 'react';
import { AuthProvider } from './context/AuthContext';
import { NotificationsProvider } from './context/NotificationsContext';
import RequireAdminAuth from './routes/RequireAdminAuth';
import AdminLayout from './components/layout/AdminLayout';
import AdminLogin from './pages/Login';
import './styles/admin.css';

const parseHash = () => {
  const hash = window.location.hash || '#/admin';
  const cleaned = hash.replace(/^#\/?/, '');
  const [pathPart, queryPart] = cleaned.split('?');
  const path = (pathPart || '').toLowerCase();

  const query = new URLSearchParams(queryPart || '');
  return { path, query };
};

const AdminApp = ({ path }) => {
  const hashInfo = useMemo(parseHash, [path]);
  const adminPath = path.replace(/^admin\/?/, '');
  const isLogin = adminPath.startsWith('login');

  return (
    <div className="admin">
      <AuthProvider>
        <NotificationsProvider>
          {isLogin ? (
            <AdminLogin next={hashInfo.query.get('next') || '#/admin'} />
          ) : (
            <RequireAdminAuth nextHash={`#/${path}`}>
              <AdminLayout path={adminPath} />
            </RequireAdminAuth>
          )}
        </NotificationsProvider>
      </AuthProvider>
    </div>
  );
};

export default AdminApp;
