import { useEffect, useMemo, useState } from 'react';
import colorstring from '../universal components/colorstrings';
import fonts from '../universal components/fonts';
import sizes from '../universal components/sizes';
import Text from '../universal components/textstring';
import Btn from '../universal components/ui/btns';
import InputField from '../universal components/ui/InputField';
import ProductCard from '../universal components/ui/ProductCard';
import { useCart } from '../context/CartContext';
import { useSession } from '../context/SessionContext';
import { getProducts } from '../services/api';
import './pages.css';

const swatchFor = (name) => {
  const key = String(name || '').toLowerCase();
  if (key.includes('navy')) return '#0b1d3a';
  if (key.includes('charcoal')) return '#3f3f46';
  if (key.includes('tan')) return '#b89a6a';
  if (key.includes('white')) return '#f5f5f5';
  return '#ced1c8';
};

const Dashboard = () => {
  const cart = useCart();
  const session = useSession();
  const [query, setQuery] = useState('');
  const [state, setState] = useState({ loading: true, error: '', products: [] });

  useEffect(() => {
    let active = true;
    const load = async () => {
      setState({ loading: true, error: '', products: [] });
      try {
        const products = await getProducts();
        if (!active) return;
        setState({ loading: false, error: '', products });
      } catch (e) {
        if (!active) return;
        setState({ loading: false, error: e?.message || Text.admin.common.failedToLoad, products: [] });
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return state.products;
    return state.products.filter((p) => `${p.name} ${p.id} ${p.category}`.toLowerCase().includes(q));
  }, [query, state.products]);

  return (
    <main
      className="page"
      style={{
        '--page-max-width': `${sizes.page.maxWidth}px`,
        '--page-padding-x': `${sizes.page.paddingX}px`,
        '--page-padding-y': `${sizes.page.paddingY}px`,
        '--page-section-gap': `${sizes.page.sectionGap}px`,
        '--page-card-radius': `${sizes.page.cardRadius}px`,
        '--page-bg': colorstring.brand.primary,
        '--page-title': colorstring.brand.secondary,
        '--page-border': colorstring.brand.third,
        '--page-fg': colorstring.fonts.main,
        '--page-muted': colorstring.fonts.sub,
        '--btn-primary-bg': colorstring.buttons.btn2,
        '--btn-primary-fg': colorstring.buttons.btn1,
        '--btn-secondary-border': colorstring.brand.third,
        '--btn-secondary-fg': colorstring.brand.secondary,
        '--font-title': fonts.FontFamily.headlines,
        '--font-body': fonts.FontFamily.bodytxt,
        '--font-links': fonts.FontFamily.btns,
      }}
    >
      <div className="container stack">
        <section className="hero">
          <h1 className="hero__title">Dashboard</h1>
          <p className="hero__subtitle">
            Welcome, <strong>{session.user.name}</strong>. Manage your orders, saved items, and cart.
          </p>
          <div className="actions">
            <Btn variant="secondary" href="/#/shop">
              Continue shopping
            </Btn>
            <Btn onClick={cart.openCart}>Open cart ({cart.totals.itemCount})</Btn>
          </div>
        </section>

        <section className="card">
          <h2 className="sectionTitle">Quick actions</h2>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <Btn href="/#/shop" variant="secondary">
              Browse shop
            </Btn>
            <Btn variant="ghost" onClick={session.logout}>
              Logout
            </Btn>
          </div>
        </section>

        <section className="stack">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'baseline' }}>
            <h2 className="sectionTitle" style={{ margin: 0 }}>
              Recommended suits
            </h2>
            <div style={{ minWidth: 260 }}>
              <InputField placeholder="Search products…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>

          {state.loading ? (
            <div className="uiHelpText">Loading products…</div>
          ) : state.error ? (
            <div style={{ display: 'grid', gap: 10 }}>
              <div className="uiErrorText">{state.error}</div>
              <div>
                <Btn onClick={() => window.location.reload()} variant="secondary">
                  Retry
                </Btn>
              </div>
            </div>
          ) : (
            <div className="grid">
              {filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  name={p.name}
                  sku={p.id}
                  stock={p.stock}
                  swatchColor={swatchFor(p.color)}
                  onAddToCart={() => cart.addItem(p, 1)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
