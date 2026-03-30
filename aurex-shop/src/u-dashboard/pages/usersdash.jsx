import { useMemo, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useSession } from '../context/SessionContext';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import MetricCard from '../components/ui/MetricCard';
import ProductCard from '../components/ui/ProductCard';
import StatusPill from '../components/ui/StatusPill';
import CartModal from '../components/cart/CartModal';

const money = (n) => `$${Number(n || 0).toLocaleString()}`;

const AurexDashboard = () => {
  const cart = useCart();
  const session = useSession();
  const [query, setQuery] = useState('');

  const products = useMemo(
    () => [
      { name: 'Midnight Navy Bespoke Suit', sku: 'MDN-SUIT-001', stock: 8, swatch: '#0b1d3a', price: 620 },
      { name: 'Charcoal Peak Lapel Suit', sku: 'CHR-SUIT-014', stock: 3, swatch: '#3f3f46', price: 710 },
      { name: 'Sand Linen Summer Suit', sku: 'SND-SUIT-008', stock: 0, swatch: '#d6c7a7', price: 540 },
      { name: 'Black Tuxedo (Shawl Collar)', sku: 'BLK-TUX-002', stock: 5, swatch: '#0b0b0f', price: 980 },
    ],
    []
  );

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => `${p.name} ${p.sku}`.toLowerCase().includes(q));
  }, [products, query]);

  const orders = useMemo(
    () => [
      { id: 'MRD-10021', customer: 'Avery Carter', placedAt: '2026-03-28', total: 620, status: 'processing' },
      { id: 'MRD-10018', customer: 'Jordan Miles', placedAt: '2026-03-27', total: 980, status: 'shipped' },
      { id: 'MRD-10011', customer: 'Riley Nguyen', placedAt: '2026-03-22', total: 710, status: 'delivered' },
      { id: 'MRD-10007', customer: 'Sofia Patel', placedAt: '2026-03-20', total: 540, status: 'pending' },
    ],
    []
  );

  return (
    <div className="meridian">
      <div className="mdLayout">
        <aside className="mdSidebar">
          <div className="mdBrand">
            <div className="mdBrand__kicker">Bespoke suits</div>
            <div className="mdBrand__title">Meridian</div>
            <div className="mdMuted">
              {session.user.name} · {session.user.role}
            </div>
          </div>
          <nav className="mdNav" aria-label="navigation">
            <a href="#/meridian">
              <span>Overview</span>
              <span className="mdMuted">↵</span>
            </a>
            <a href="#/meridian/orders">
              <span>Orders</span>
              <span className="mdMuted">{orders.length}</span>
            </a>
            <a href="#/meridian/products">
              <span>Products</span>
              <span className="mdMuted">{products.length}</span>
            </a>
            <a href="#/meridian/settings">
              <span>Settings</span>
              <span className="mdMuted">⌘</span>
            </a>
          </nav>
        </aside>

        <main className="mdMain">
          <header className="mdTopbar">
            <div className="mdTopbar__title">
              <h1>Dashboard</h1>
              <p>Tailoring orders, inventory, and client demand at a glance.</p>
            </div>

            <div className="mdTopbar__actions">
              <InputField placeholder="Search suits, SKUs…" value={query} onChange={(e) => setQuery(e.target.value)} />
              <Button variant="outline" onClick={cart.toggleCart} aria-label="Open cart">
                Cart ({cart.totals.itemCount})
              </Button>
            </div>
          </header>

          <section className="mdGrid mdGrid--metrics">
            <div className="mdCard">
              <MetricCard label="Revenue (30d)" value={money(48210)} change="+8.2%" direction="up" />
            </div>
            <div className="mdCard">
              <MetricCard label="Orders" value={orders.length} change="+3" direction="up" />
            </div>
            <div className="mdCard">
              <MetricCard label="Avg. Lead Time" value="12 days" change="-1 day" direction="down" />
            </div>
            <div className="mdCard">
              <MetricCard label="Low Stock" value={products.filter((p) => p.stock <= 3).length} change="Watch list" direction="flat" />
            </div>
          </section>

          <section className="mdGrid mdGrid--main" style={{ marginTop: 14 }}>
            <div className="mdCard">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 900 }}>Orders</div>
                  <div className="mdMuted">Latest client orders and delivery status.</div>
                </div>
                <Button variant="outline" onClick={() => alert('Export goes here (demo).')}>
                  Export
                </Button>
              </div>

              <div style={{ marginTop: 10, overflowX: 'auto' }}>
                <table className="mdTable">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Client</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td style={{ fontWeight: 800 }}>{o.id}</td>
                        <td>{o.customer}</td>
                        <td className="mdMuted">{o.placedAt}</td>
                        <td>{money(o.total)}</td>
                        <td>
                          <StatusPill status={o.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mdCard">
              <div style={{ fontWeight: 900 }}>Top products</div>
              <div className="mdMuted" style={{ marginTop: 4 }}>
                Best sellers and limited stock.
              </div>

              <div className="mdGrid" style={{ marginTop: 10 }}>
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.sku}
                    name={p.name}
                    sku={p.sku}
                    stock={p.stock}
                    swatch={p.swatch}
                    price={p.price}
                    onAddToCart={() => cart.addItem(p, 1)}
                  />
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>

      <CartModal />
    </div>
  );
};

export default AurexDashboard;
