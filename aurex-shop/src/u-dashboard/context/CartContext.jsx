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
  const [cartOpen, setCartOpen] = useState(false);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const toggleCart = useCallback(() => setCartOpen((v) => !v), []);

  const addItem = useCallback((product, qty = 1) => {
    const quantity = normalizeQty(qty);
    setItems((prev) => {
      const existing = prev.find((i) => i.sku === product.sku);
      if (!existing) {
        return [
          ...prev,
          {
            sku: product.sku,
            name: product.name,
            swatch: product.swatch,
            price: product.price ?? 0,
            qty: quantity,
          },
        ];
      }
      return prev.map((i) => (i.sku === product.sku ? { ...i, qty: i.qty + quantity } : i));
    });
    setCartOpen(true);
  }, []);

  const removeItem = useCallback((sku) => {
    setItems((prev) => prev.filter((i) => i.sku !== sku));
  }, []);

  const updateQty = useCallback((sku, qty) => {
    const quantity = normalizeQty(qty);
    setItems((prev) => prev.map((i) => (i.sku === sku ? { ...i, qty: quantity } : i)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totals = useMemo(() => {
    const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = items.reduce((sum, i) => sum + i.qty * (Number(i.price) || 0), 0);
    return { itemCount, subtotal };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      cartOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQty,
      clear,
      totals,
    }),
    [items, cartOpen, openCart, closeCart, toggleCart, addItem, removeItem, updateQty, clear, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

