import { useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import Modal from './Modal';
import Btn from './btns';

const money = (n) => `$${Number(n || 0).toLocaleString()}`;

const CartModal = () => {
  const cart = useCart();

  const footer = useMemo(
    () => (
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'grid', gap: 4 }}>
          <span className="uiHelpText">Subtotal</span>
          <strong>{money(cart.totals.subtotal)}</strong>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <Btn variant="secondary" onClick={cart.clear} disabled={cart.items.length === 0}>
            Clear
          </Btn>
          <Btn onClick={() => alert('Checkout flow goes here (demo).')} disabled={cart.items.length === 0}>
            Checkout
          </Btn>
        </div>
      </div>
    ),
    [cart]
  );

  return (
    <Modal open={cart.open} title="Cart" onClose={cart.closeCart} footer={footer}>
      {cart.items.length === 0 ? (
        <div className="uiHelpText">Your cart is empty.</div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {cart.items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                alignItems: 'center',
                flexWrap: 'wrap',
                border: '1px solid var(--page-border)',
                borderRadius: 14,
                padding: 12,
              }}
            >
              <div style={{ display: 'grid', gap: 4 }}>
                <strong>{item.name}</strong>
                <span className="uiHelpText">SKU: {item.id}</span>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="number"
                  min={1}
                  value={item.qty}
                  onChange={(e) => cart.updateQty(item.id, e.target.value)}
                  style={{
                    width: 80,
                    height: 40,
                    borderRadius: 12,
                    border: '1px solid var(--page-border)',
                    padding: '0 10px',
                  }}
                />
                <div style={{ minWidth: 90, textAlign: 'right' }}>{money((Number(item.price) || 0) * (Number(item.qty) || 0))}</div>
                <Btn variant="ghost" onClick={() => cart.removeItem(item.id)}>
                  Remove
                </Btn>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default CartModal;

