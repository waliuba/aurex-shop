import { useEffect, useMemo, useReducer } from 'react';
import { getOrders, updateOrderStatus } from '../../services/api';
import { useNotifications } from '../context/NotificationsContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import Table from '../components/ui/Table';
import sizes from '../../universal components/sizes';
import Text from '../../universal components/textstring';

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
      return { ...state, loading: false, error: action.error || Text.admin.common.failedToLoad };
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
      dispatch({ type: 'LOAD_ERROR', error: e?.message || Text.admin.common.failedToLoad });
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = useMemo(
    () => [
      { key: 'id', header: Text.admin.orders.columns.order },
      { key: 'customerName', header: Text.admin.orders.columns.customer },
      { key: 'createdAt', header: Text.admin.orders.columns.date },
      { key: 'total', header: Text.admin.orders.columns.total, render: (o) => `$${o.total}` },
      {
        key: 'status',
        header: Text.admin.orders.columns.status,
        render: (o) => <Badge tone={statusTone(o.status)}>{o.status}</Badge>,
      },
      {
        key: 'update',
        header: Text.admin.orders.columns.update,
        render: (o) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: sizes.admin.orders.updateRowGap }}>
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
                    message: Text.admin.orders.notifications.statusUpdated(updated.id, updated.status),
                  });
                } catch {
                  dispatch({ type: 'UPDATE_FAILED', id: o.id });
                }
              }}
              disabled={Boolean(state.updating[o.id])}
            >
              <option>{Text.admin.orders.status.pending}</option>
              <option>{Text.admin.orders.status.shipped}</option>
              <option>{Text.admin.orders.status.delivered}</option>
            </Input>
            {state.updating[o.id] ? <span className="uiHelpText">{Text.admin.orders.updating.saving}</span> : null}
          </div>
        ),
      },
    ],
    [state.updating, notifications]
  );

  return (
    <Card title={Text.admin.orders.title}>
      {state.loading ? (
        <Spinner label={Text.admin.orders.loading} />
      ) : state.error ? (
        <div style={{ display: 'grid', gap: sizes.admin.gaps.lg }}>
          <div className="uiErrorText">{state.error}</div>
          <Button variant="secondary" onClick={load}>
            {Text.admin.actions.retry}
          </Button>
        </div>
      ) : (
        <Table columns={columns} data={state.orders} />
      )}
    </Card>
  );
};

export default Orders;
