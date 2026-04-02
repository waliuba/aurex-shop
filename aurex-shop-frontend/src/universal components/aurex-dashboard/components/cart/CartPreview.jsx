import { useCart } from '../../context/CartContext';
import Button from '../../Button';

const money = (n) => `$${Number(n || 0).toLocaleString()}`;

const CartPreview = () => {
  const cart = useCart();

  return (
    <section className="mdCard">
      <div className="mdSectionHeader">
        <div>
          <div className="mdSectionTitle">Cart preview</div>
          <div className="mdMuted">Quick access without going back to shop.</div>
        </div>
        <Button variant="outline" onClick={cart.toggleCart}>
          Open cart
        </Button>
      </div>

      {cart.items.length === 0 ? (
        <div className="mdMuted">Your cart is empty.</div>
      ) : (
        <div className="mdCartPreviewList">
          {cart.items.slice(0, 3).map((item) => (
            <div key={item.sku} className="mdCartPreviewRow">
              <div>
                <div style={{ fontWeight: 800 }}>{item.name}</div>
                <div className="mdMuted">
                  {item.qty} × {money(item.price)}
                </div>
              </div>
              <div style={{ fontWeight: 900 }}>{money((Number(item.price) || 0) * (Number(item.qty) || 0))}</div>
            </div>
          ))}
          <div className="mdCartPreviewFooter">
            <div className="mdMuted">Total</div>
            <div style={{ fontWeight: 950 }}>{money(cart.totals.subtotal)}</div>
          </div>
          <div className="mdCartPreviewActions">
            <Button variant="outline" onClick={cart.clear}>
              Clear
            </Button>
            <Button onClick={() => alert('Checkout flow goes here (demo).')}>Checkout</Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default CartPreview;

