import { useEffect, useReducer } from 'react';
import { getDashboard } from '../../services/api';
import { useNotifications } from '../context/NotificationsContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';
import BarChart from '../components/charts/BarChart';
import sizes from '../../universal components/sizes';
import Text from '../../universal components/textstring';
import colorstring from '../../universal components/colorstrings';

const initial = {
  loading: true,
  error: null,
  metrics: null,
  revenue: [],
  activity: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_SUCCESS':
      return { loading: false, error: null, ...action.payload };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.error || Text.admin.common.failedToLoad };
    default:
      return state;
  }
}

const money = (n) => `$${Number(n || 0).toLocaleString()}`;

const Dashboard = () => {
  const [state, dispatch] = useReducer(reducer, initial);
  const notifications = useNotifications();

  const load = async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const data = await getDashboard();
      dispatch({ type: 'LOAD_SUCCESS', payload: data });
      if (data?.metrics?.lowStock) {
        notifications.addNotification({
          type: 'warn',
          message: Text.admin.dashboard.notifications.lowStockAlert(data.metrics.lowStock),
        });
      }
    } catch (e) {
      dispatch({ type: 'LOAD_ERROR', error: e?.message || Text.admin.common.failedToLoad });
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state.error) {
    return (
      <Card title={Text.admin.dashboard.title}>
        <div style={{ display: 'grid', gap: sizes.admin.dashboard.errorGap }}>
          <div className="uiErrorText">{state.error}</div>
          <div>
            <Button variant="secondary" onClick={load}>
              {Text.admin.actions.retry}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const metrics = state.metrics;

  return (
    <div className="adminGrid" style={{ gap: sizes.admin.dashboard.gridGap }}>
      <div className="adminGrid adminGrid--3">
        <Card title={Text.admin.dashboard.cards.totalSales}>
          {state.loading ? (
            <Skeleton height={34} width="60%" />
          ) : (
            <div className="uiCardValue">{money(metrics?.totalSales)}</div>
          )}
          <div className="uiHelpText">{Text.admin.dashboard.cards.allTime}</div>
        </Card>
        <Card title={Text.admin.dashboard.cards.orders}>
          {state.loading ? <Skeleton height={34} width="40%" /> : <div className="uiCardValue">{metrics?.orders}</div>}
          <div className="uiHelpText">{Text.admin.dashboard.cards.processed}</div>
        </Card>
        <Card title={Text.admin.dashboard.cards.customers}>
          {state.loading ? (
            <Skeleton height={34} width="40%" />
          ) : (
            <div className="uiCardValue">{metrics?.customers}</div>
          )}
          <div className="uiHelpText">{Text.admin.dashboard.cards.active}</div>
        </Card>
      </div>

      <div className="adminGrid adminGrid--2">
        <Card
          title={Text.admin.dashboard.cards.revenue}
          action={
            state.loading ? null : (
              <Badge tone="ok">
                {Text.admin.dashboard.cards.todayPrefix}{' '}
                <strong style={{ color: 'inherit' }}>{money(metrics?.revenueToday)}</strong>
              </Badge>
            )
          }
        >
          {state.loading ? (
            <div style={{ display: 'grid', gap: sizes.admin.dashboard.skeletonGap }}>
              <Skeleton height={140} />
            </div>
          ) : (
            <BarChart data={state.revenue} />
          )}
        </Card>

        <Card
          title={Text.admin.dashboard.cards.recentActivity}
          action={
            state.loading ? null : metrics?.lowStock ? (
              <Badge tone="warn">
                {Text.admin.dashboard.cards.lowStockPrefix} {metrics.lowStock}
              </Badge>
            ) : null
          }
        >
          {state.loading ? (
            <div style={{ display: 'grid', gap: sizes.admin.dashboard.skeletonGap }}>
              <Skeleton height={12} />
              <Skeleton height={12} width="90%" />
              <Skeleton height={12} width="82%" />
              <Skeleton height={12} width="88%" />
            </div>
          ) : (
            <div style={{ display: 'grid', gap: sizes.admin.dashboard.skeletonGap }}>
              {state.activity.map((a) => (
                <div
                  key={a.id}
                  style={{
                    border: `1px solid ${colorstring.admin.borderSoft}`,
                    background: colorstring.admin.panelSoft,
                    borderRadius: sizes.admin.dashboard.activityCardRadius,
                    padding: sizes.admin.dashboard.activityCardPadding,
                    display: 'grid',
                    gap: sizes.admin.dashboard.activityCardGap,
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{a.message}</div>
                  <div className="uiHelpText">{a.at}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
