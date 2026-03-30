import { useEffect, useMemo, useReducer, useState } from 'react';
import { getCustomerOrders, getCustomers } from '../../services/api';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import Table from '../components/ui/Table';
import sizes from '../../universal components/sizes';
import Text from '../../universal components/textstring';

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
      return { ...state, loading: false, error: action.error || Text.admin.common.failedToLoad };
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
          return { ...s, loading: false, error: a.error || Text.admin.common.failedToLoad };
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
        dispatch({ type: 'LOAD_ERROR', error: e?.message || Text.admin.common.failedToLoad });
      }
    };
    load();
  }, [open, customer]);

  const orderCols = useMemo(
    () => [
      { key: 'id', header: Text.admin.customers.columns.order },
      { key: 'createdAt', header: Text.admin.customers.columns.date },
      {
        key: 'status',
        header: Text.admin.customers.columns.status,
        render: (o) => <Badge tone={o.status === 'Pending' ? 'warn' : 'ok'}>{o.status}</Badge>,
      },
      { key: 'total', header: Text.admin.customers.columns.total, render: (o) => `$${o.total}` },
    ],
    []
  );

  return (
    <Modal
      title={Text.admin.customers.profileTitle}
      open={open}
      onClose={onClose}
      footer={
        <Button variant="secondary" onClick={onClose}>
          {Text.admin.actions.close}
        </Button>
      }
    >
      {customer ? (
        <div style={{ display: 'grid', gap: sizes.admin.customers.profileGap }}>
          <div className="uiCard" style={{ padding: sizes.admin.customers.cardPadding }}>
            <div style={{ display: 'grid', gap: sizes.admin.customers.detailsGap }}>
              <div style={{ fontWeight: sizes.admin.customers.nameFontWeight, fontSize: sizes.admin.customers.nameFontSize }}>
                {customer.name}
              </div>
              <div className="uiHelpText">{customer.email}</div>
              <div style={{ marginTop: sizes.admin.customers.badgeMarginTop }}>
                <Badge tone={customer.tier === 'Gold' ? 'ok' : customer.tier === 'Silver' ? 'warn' : 'default'}>
                  {Text.admin.customers.tierPrefix} {customer.tier}
                </Badge>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: sizes.admin.customers.orderSectionGap }}>
            <div style={{ fontWeight: sizes.admin.customers.sectionTitleFontWeight }}>{Text.admin.customers.orderHistoryTitle}</div>
            {ordersState.loading ? (
              <Spinner label={Text.admin.customers.loadingOrderHistory} />
            ) : ordersState.error ? (
              <div className="uiErrorText">{ordersState.error}</div>
            ) : (
              <Table columns={orderCols} data={ordersState.orders} emptyLabel={Text.admin.customers.emptyOrders} />
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
      dispatch({ type: 'LOAD_ERROR', error: e?.message || Text.admin.common.failedToLoad });
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = useMemo(
    () => [
      { key: 'name', header: Text.admin.customers.columns.customer, render: (c) => <strong>{c.name}</strong> },
      { key: 'email', header: Text.admin.customers.columns.email },
      {
        key: 'tier',
        header: Text.admin.customers.columns.tier,
        render: (c) => (
          <Badge tone={c.tier === 'Gold' ? 'ok' : c.tier === 'Silver' ? 'warn' : 'default'}>{c.tier}</Badge>
        ),
      },
    ],
    []
  );

  return (
    <>
      <Card title={Text.admin.customers.title}>
        {state.loading ? (
          <Spinner label={Text.admin.customers.loadingCustomers} />
        ) : state.error ? (
          <div style={{ display: 'grid', gap: sizes.admin.gaps.lg }}>
            <div className="uiErrorText">{state.error}</div>
            <Button variant="secondary" onClick={load}>
              {Text.admin.actions.retry}
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
