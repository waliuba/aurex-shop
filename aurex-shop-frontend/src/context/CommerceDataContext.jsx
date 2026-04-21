import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getMyOrders, getProducts } from '../services/api';

const CommerceDataContext = createContext(null);

const initialState = { status: 'idle', data: [], error: '' };

export function CommerceDataProvider({ children }) {
  const [products, setProducts] = useState(initialState);
  const [orders, setOrders] = useState(initialState);

  const refreshProducts = useCallback(async () => {
    setProducts((p) => ({ status: 'loading', data: p.data, error: '' }));
    try {
      const data = await getProducts();
      setProducts({ status: 'ready', data, error: '' });
    } catch (e) {
      setProducts((p) => ({ status: 'error', data: p.data, error: e?.message || 'Failed to load products' }));
    }
  }, []);

  const refreshOrders = useCallback(async () => {
    setOrders((p) => ({ status: 'loading', data: p.data, error: '' }));
    try {
      const data = await getMyOrders();
      setOrders({ status: 'ready', data, error: '' });
    } catch (e) {
      setOrders((p) => ({ status: 'error', data: p.data, error: e?.message || 'Failed to load orders' }));
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshProducts(), refreshOrders()]);
  }, [refreshProducts, refreshOrders]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const value = useMemo(
    () => ({ products, orders, refreshProducts, refreshOrders, refreshAll }),
    [products, orders, refreshProducts, refreshOrders, refreshAll]
  );

  return <CommerceDataContext.Provider value={value}>{children}</CommerceDataContext.Provider>;
}

export function useCommerceData() {
  const ctx = useContext(CommerceDataContext);
  if (!ctx) throw new Error('useCommerceData must be used within CommerceDataProvider');
  return ctx;
}

