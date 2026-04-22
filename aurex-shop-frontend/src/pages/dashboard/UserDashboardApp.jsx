import { useMemo } from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';
import { useTheme } from '../../context/ThemeContext';
import { useSession } from '../../context/SessionContext';
import DashboardShell from './components/DashboardShell';
import OverviewPage from './pages/OverviewPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import { CommerceDataProvider } from '../../context/CommerceDataContext';

const parseRoute = (fullPath) => {
  const dashPath = String(fullPath || '').replace(/^dashboard\/?/, '');
  const key = (dashPath.split('/')[0] || 'overview').toLowerCase();
  if (key === 'products') return { routeKey: 'products' };
  if (key === 'orders') return { routeKey: 'orders' };
  if (key === 'profile') return { routeKey: 'profile' };
  if (key === 'settings') return { routeKey: 'settings' };
  return { routeKey: 'overview' };
};

const UserDashboardApp = ({ path }) => {
  const theme = useTheme();
  const session = useSession();

  const { routeKey } = useMemo(() => parseRoute(path), [path]);

  const Page =
    routeKey === 'products' ? (
      <ProductsPage />
    ) : routeKey === 'orders' ? (
      <OrdersPage />
    ) : routeKey === 'profile' ? (
      <ProfilePage />
    ) : routeKey === 'settings' ? (
      <SettingsPage />
    ) : (
      <OverviewPage />
    );

  if (session.status === 'loading') return null;
  if (!session.isAuthenticated) return null;

  return (
    <ErrorBoundary>
      <CommerceDataProvider>
        <DashboardShell active={routeKey} onToggleTheme={theme.toggle} themeMode={theme.mode}>
          {Page}
        </DashboardShell>
      </CommerceDataProvider>
    </ErrorBoundary>
  );
};

export default UserDashboardApp;
