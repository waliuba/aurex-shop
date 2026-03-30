import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart must be used within CartProvider');
  return value;
};

const normalizeQty = (qty) => {
  const next = Number(qty);
  if (!Number.isFinite(next)) return 1;
  return Math.max(1, Math.floor(next));
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  const openCart = useCallback(() => setOpen(true), []);
  const closeCart = useCallback(() => setOpen(false), []);
  const toggleCart = useCallback(() => setOpen((v) => !v), []);

  const addItem = useCallback((product, qty = 1) => {
    const quantity = normalizeQty(qty);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (!existing) return [...prev, { ...product, qty: quantity }];
      return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + quantity } : i));
    });
    setOpen(true);
  }, []);

  const removeItem = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== id)), []);

  const updateQty = useCallback((id, qty) => {
    const quantity = normalizeQty(qty);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: quantity } : i)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totals = useMemo(() => {
    const itemCount = items.reduce((sum, i) => sum + (Number(i.qty) || 0), 0);
    const subtotal = items.reduce((sum, i) => sum + (Number(i.qty) || 0) * (Number(i.price) || 0), 0);
    return { itemCount, subtotal };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      totals,
      open,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQty,
      clear,
    }),
    [items, totals, open, openCart, closeCart, toggleCart, addItem, removeItem, updateQty, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

