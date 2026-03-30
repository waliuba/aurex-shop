import { useCart } from '../../context/CartContext';
import Button from '../ui/Button';

const money = (n) => `$${Number(n || 0).toLocaleString()}`;

const CartModal = () => {
  const cart = useCart();
  if (!cart.cartOpen) return null;

  return (
    <div className="mdModalOverlay" role="presentation" onClick={cart.closeCart}>
      <div className="mdModal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="mdModal__header">
          <div>
            <div className="mdModal__title">Cart</div>
            <div className="mdMuted">{cart.totals.itemCount} item(s)</div>
          </div>
          <Button variant="outline" onClick={cart.closeCart}>
            Close
          </Button>
        </div>

        <div className="mdModal__body">
          {cart.items.length === 0 ? (
            <div className="mdMuted">Your cart is empty.</div>
          ) : (
            <div className="mdCartList">
              {cart.items.map((item) => (
                <div className="mdCartRow" key={item.sku}>
                  <div>
                    <div className="mdCartRow__name">{item.name}</div>
                    <div className="mdMuted">SKU: {item.sku}</div>
                  </div>
                  <div className="mdCartRow__right">
                    <input
                      className="mdQty"
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => cart.updateQty(item.sku, e.target.value)}
                    />
                    <div className="mdCartRow__price">{money(item.qty * (Number(item.price) || 0))}</div>
                    <Button variant="outline" onClick={() => cart.removeItem(item.sku)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mdModal__footer">
          <div className="mdModal__total">
            <span className="mdMuted">Subtotal</span>
            <strong>{money(cart.totals.subtotal)}</strong>
          </div>
          <div className="mdModal__footerActions">
            <Button variant="outline" disabled={cart.items.length === 0} onClick={cart.clear}>
              Clear
            </Button>
            <Button disabled={cart.items.length === 0} onClick={() => alert('Checkout flow goes here (demo).')}>
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;

