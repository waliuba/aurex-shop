import { useEffect, useReducer } from 'react';
import { getDashboard } from '../../services/api';
import { useNotifications } from '../context/NotificationsContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';
import BarChart from '../components/charts/BarChart';

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
      return { ...state, loading: false, error: action.error || 'Failed to load data' };
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
          message: `Low stock alert: ${data.metrics.lowStock} item(s) need restock.`,
        });
      }
    } catch (e) {
      dispatch({ type: 'LOAD_ERROR', error: e?.message || 'Failed to load data' });
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state.error) {
    return (
      <Card title="Dashboard">
        <div style={{ display: 'grid', gap: 12 }}>
          <div className="uiErrorText">{state.error}</div>
          <div>
            <Button variant="secondary" onClick={load}>
              Retry
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const metrics = state.metrics;

  return (
    <div className="adminGrid" style={{ gap: 14 }}>
      <div className="adminGrid adminGrid--3">
        <Card title="Total Sales">
          {state.loading ? (
            <Skeleton height={34} width="60%" />
          ) : (
            <div className="uiCardValue">{money(metrics?.totalSales)}</div>
          )}
          <div className="uiHelpText">All time</div>
        </Card>
        <Card title="Orders">
          {state.loading ? <Skeleton height={34} width="40%" /> : <div className="uiCardValue">{metrics?.orders}</div>}
          <div className="uiHelpText">Processed</div>
        </Card>
        <Card title="Customers">
          {state.loading ? (
            <Skeleton height={34} width="40%" />
          ) : (
            <div className="uiCardValue">{metrics?.customers}</div>
          )}
          <div className="uiHelpText">Active</div>
        </Card>
      </div>

      <div className="adminGrid adminGrid--2">
        <Card
          title="Revenue"
          action={
            state.loading ? null : (
              <Badge tone="ok">
                Today: <strong style={{ color: 'inherit' }}>{money(metrics?.revenueToday)}</strong>
              </Badge>
            )
          }
        >
          {state.loading ? (
            <div style={{ display: 'grid', gap: 10 }}>
              <Skeleton height={140} />
            </div>
          ) : (
            <BarChart data={state.revenue} />
          )}
        </Card>

        <Card
          title="Recent Activity"
          action={
            state.loading ? null : metrics?.lowStock ? <Badge tone="warn">Low stock: {metrics.lowStock}</Badge> : null
          }
        >
          {state.loading ? (
            <div style={{ display: 'grid', gap: 10 }}>
              <Skeleton height={12} />
              <Skeleton height={12} width="90%" />
              <Skeleton height={12} width="82%" />
              <Skeleton height={12} width="88%" />
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {state.activity.map((a) => (
                <div
                  key={a.id}
                  style={{
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: 14,
                    padding: 10,
                    display: 'grid',
                    gap: 2,
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
