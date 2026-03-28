import { useEffect, useMemo, useReducer, useState } from 'react';
import { getCustomerOrders, getCustomers } from '../../services/api';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import Table from '../components/ui/Table';

const initial = {
  loading: true,
  error: null,
  customers: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_SUCCESS':
      return { loading: false, error: null, customers: action.customers };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.error || 'Failed to load data' };
    default:
      return state;
  }
}

const CustomerProfile = ({ customer, open, onClose }) => {
  const [ordersState, dispatch] = useReducer(
    (s, a) => {
      switch (a.type) {
        case 'LOAD_START':
          return { ...s, loading: true, error: null };
        case 'LOAD_SUCCESS':
          return { loading: false, error: null, orders: a.orders };
        case 'LOAD_ERROR':
          return { ...s, loading: false, error: a.error || 'Failed to load data' };
        default:
          return s;
      }
    },
    { loading: false, error: null, orders: [] }
  );

  useEffect(() => {
    if (!open || !customer) return;
    const load = async () => {
      dispatch({ type: 'LOAD_START' });
      try {
        const orders = await getCustomerOrders(customer.id);
        dispatch({ type: 'LOAD_SUCCESS', orders });
      } catch (e) {
        dispatch({ type: 'LOAD_ERROR', error: e?.message || 'Failed to load data' });
      }
    };
    load();
  }, [open, customer]);

  const orderCols = useMemo(
    () => [
      { key: 'id', header: 'Order' },
      { key: 'createdAt', header: 'Date' },
      { key: 'status', header: 'Status', render: (o) => <Badge tone={o.status === 'Pending' ? 'warn' : 'ok'}>{o.status}</Badge> },
      { key: 'total', header: 'Total', render: (o) => `$${o.total}` },
    ],
    []
  );

  return (
    <Modal
      title="Customer profile"
      open={open}
      onClose={onClose}
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      {customer ? (
        <div style={{ display: 'grid', gap: 14 }}>
          <div className="uiCard" style={{ padding: 12 }}>
            <div style={{ display: 'grid', gap: 4 }}>
              <div style={{ fontWeight: 850, fontSize: 16 }}>{customer.name}</div>
              <div className="uiHelpText">{customer.email}</div>
              <div style={{ marginTop: 8 }}>
                <Badge tone={customer.tier === 'Gold' ? 'ok' : customer.tier === 'Silver' ? 'warn' : 'default'}>
                  Tier: {customer.tier}
                </Badge>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ fontWeight: 800 }}>Order history</div>
            {ordersState.loading ? (
              <Spinner label="Loading order history" />
            ) : ordersState.error ? (
              <div className="uiErrorText">{ordersState.error}</div>
            ) : (
              <Table columns={orderCols} data={ordersState.orders} emptyLabel="No orders for this customer" />
            )}
          </div>
        </div>
      ) : null}
    </Modal>
  );
};

const Customers = () => {
  const [state, dispatch] = useReducer(reducer, initial);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const customers = await getCustomers();
      dispatch({ type: 'LOAD_SUCCESS', customers });
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
      { key: 'name', header: 'Customer', render: (c) => <strong>{c.name}</strong> },
      { key: 'email', header: 'Email' },
      { key: 'tier', header: 'Tier', render: (c) => <Badge tone={c.tier === 'Gold' ? 'ok' : c.tier === 'Silver' ? 'warn' : 'default'}>{c.tier}</Badge> },
    ],
    []
  );

  return (
    <>
      <Card title="Customers">
        {state.loading ? (
          <Spinner label="Loading customers" />
        ) : state.error ? (
          <div style={{ display: 'grid', gap: 12 }}>
            <div className="uiErrorText">{state.error}</div>
            <Button variant="secondary" onClick={load}>
              Retry
            </Button>
          </div>
        ) : (
          <Table columns={columns} data={state.customers} rowAction={(row) => setSelected(row)} />
        )}
      </Card>

      <CustomerProfile customer={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
    </>
  );
};

export default Customers;

