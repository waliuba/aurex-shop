import { useEffect, useMemo, useReducer } from 'react';
import { getInventory } from '../../services/api';
import { useNotifications } from '../context/NotificationsContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Table from '../components/ui/Table';
import sizes from '../../universal components/sizes';
import Text from '../../universal components/textstring';

const initial = { loading: true, error: null, items: [] };

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_SUCCESS':
      return { loading: false, error: null, items: action.items };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.error || Text.admin.common.failedToLoad };
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
          message: Text.admin.inventory.notifications.lowStockWarning(low),
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

  const columns = useMemo(
    () => [
      { key: 'name', header: Text.admin.inventory.columns.product, render: (i) => <strong>{i.name}</strong> },
      { key: 'category', header: Text.admin.inventory.columns.category },
      {
        key: 'stock',
        header: Text.admin.inventory.columns.stock,
        render: (i) =>
          i.lowStock ? <Badge tone="warn">{Text.admin.inventory.stock.low(i.stock)}</Badge> : <Badge tone="ok">{i.stock}</Badge>,
      },
      {
        key: 'lowStock',
        header: Text.admin.inventory.columns.alert,
        render: (i) =>
          i.lowStock ? (
            <Badge tone="warn">{Text.admin.inventory.badges.lowStock}</Badge>
          ) : (
            <Badge tone="ok">{Text.admin.inventory.badges.ok}</Badge>
          ),
      },
    ],
    []
  );

  return (
    <Card title={Text.admin.inventory.title}>
      {state.loading ? (
        <Spinner label={Text.admin.inventory.loading} />
      ) : state.error ? (
        <div style={{ display: 'grid', gap: sizes.admin.gaps.lg }}>
          <div className="uiErrorText">{state.error}</div>
          <Button variant="secondary" onClick={load}>
            {Text.admin.actions.retry}
          </Button>
        </div>
      ) : (
        <Table columns={columns} data={state.items} />
      )}
    </Card>
  );
};

export default Inventory;
