import { useEffect, useMemo, useReducer } from 'react';
import { getInventory } from '../../services/api';
import { useNotifications } from '../context/NotificationsContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Table from '../components/ui/Table';

const initial = { loading: true, error: null, items: [] };

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_SUCCESS':
      return { loading: false, error: null, items: action.items };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.error || 'Failed to load data' };
    default:
      return state;
  }
}

const Inventory = () => {
  const [state, dispatch] = useReducer(reducer, initial);
  const notifications = useNotifications();

  const load = async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const items = await getInventory();
      dispatch({ type: 'LOAD_SUCCESS', items });
      const low = items.filter((i) => i.lowStock).length;
      if (low) {
        notifications.addNotification({
          type: 'warn',
          message: `Inventory warning: ${low} product(s) are low stock.`,
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

  const columns = useMemo(
    () => [
      { key: 'name', header: 'Product', render: (i) => <strong>{i.name}</strong> },
      { key: 'category', header: 'Category' },
      {
        key: 'stock',
        header: 'Stock',
        render: (i) => (i.lowStock ? <Badge tone="warn">Low ({i.stock})</Badge> : <Badge tone="ok">{i.stock}</Badge>),
      },
      { key: 'lowStock', header: 'Alert', render: (i) => (i.lowStock ? <Badge tone="warn">Low stock</Badge> : <Badge tone="ok">OK</Badge>) },
    ],
    []
  );

  return (
    <Card title="Inventory">
      {state.loading ? (
        <Spinner label="Loading inventory" />
      ) : state.error ? (
        <div style={{ display: 'grid', gap: 12 }}>
          <div className="uiErrorText">{state.error}</div>
          <Button variant="secondary" onClick={load}>
            Retry
          </Button>
        </div>
      ) : (
        <Table columns={columns} data={state.items} />
      )}
    </Card>
  );
};

export default Inventory;
