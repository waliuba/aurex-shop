import { useEffect, useMemo, useReducer } from 'react';
import { getOrders, updateOrderStatus } from '../../services/api';
import { useNotifications } from '../context/NotificationsContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import Table from '../components/ui/Table';

const initial = {
  loading: true,
  error: null,
  orders: [],
  updating: {},
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_SUCCESS':
      return { ...state, loading: false, error: null, orders: action.orders };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.error || 'Failed to load data' };
    case 'UPDATING':
      return { ...state, updating: { ...state.updating, [action.id]: true } };
    case 'UPDATED': {
      const nextUpdating = { ...state.updating };
      delete nextUpdating[action.order.id];
      return {
        ...state,
        updating: nextUpdating,
        orders: state.orders.map((o) => (o.id === action.order.id ? action.order : o)),
      };
    }
    case 'UPDATE_FAILED': {
      const nextUpdating = { ...state.updating };
      delete nextUpdating[action.id];
      return { ...state, updating: nextUpdating };
    }
    default:
      return state;
  }
}

const statusTone = (status) => {
  if (status === 'Delivered') return 'ok';
  if (status === 'Shipped') return 'ok';
  if (status === 'Pending') return 'warn';
  return 'default';
};

const Orders = () => {
  const [state, dispatch] = useReducer(reducer, initial);
  const notifications = useNotifications();

  const load = async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const orders = await getOrders();
      dispatch({ type: 'LOAD_SUCCESS', orders });
    } catch (e) {
      dispatch({ type: 'LOAD_ERROR', error: e?.message || 'Failed to load data' });
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = useMemo(
    () => [
      { key: 'id', header: 'Order' },
      { key: 'customerName', header: 'Customer' },
      { key: 'createdAt', header: 'Date' },
      { key: 'total', header: 'Total', render: (o) => `$${o.total}` },
      { key: 'status', header: 'Status', render: (o) => <Badge tone={statusTone(o.status)}>{o.status}</Badge> },
      {
        key: 'update',
        header: 'Update',
        render: (o) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Input
              as="select"
              value={o.status}
              onChange={async (e) => {
                const next = e.target.value;
                dispatch({ type: 'UPDATING', id: o.id });
                try {
                  const updated = await updateOrderStatus(o.id, next);
                  dispatch({ type: 'UPDATED', order: updated });
                  notifications.addNotification({
                    type: 'info',
                    message: `Order ${updated.id} updated to ${updated.status}.`,
                  });
                } catch {
                  dispatch({ type: 'UPDATE_FAILED', id: o.id });
                }
              }}
              disabled={Boolean(state.updating[o.id])}
            >
              <option>Pending</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </Input>
            {state.updating[o.id] ? <span className="uiHelpText">Saving…</span> : null}
          </div>
        ),
      },
    ],
    [state.updating]
  );

  return (
    <Card title="Orders">
      {state.loading ? (
        <Spinner label="Loading orders" />
      ) : state.error ? (
        <div style={{ display: 'grid', gap: 12 }}>
          <div className="uiErrorText">{state.error}</div>
          <Button variant="secondary" onClick={load}>
            Retry
          </Button>
        </div>
      ) : (
        <Table columns={columns} data={state.orders} />
      )}
    </Card>
  );
};

export default Orders;
