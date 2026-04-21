import { useEffect, useMemo, useState } from 'react';
import colorstring from '../universal components/colorstrings';
import fonts from '../universal components/fonts';
import sizes from '../universal components/sizes';
import Btn from '../universal components/ui/btns';
import './pages.css';
import { getMyOrders } from '../services/api';
import { textStrings } from '../constants/textStrings';

const money = (n) => `${textStrings.currency.symbol}${Number(n || 0).toLocaleString()}`;

const Orders = () => {
  const [state, setState] = useState({ loading: true, error: '', orders: [] });

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const orders = await getMyOrders();
        if (!mounted) return;
        setState({ loading: false, error: '', orders });
      } catch (error) {
        if (!mounted) return;
        setState({ loading: false, error: error.message || textStrings.pages.orders.errors.failedToLoadOrders, orders: [] });
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const content = useMemo(() => {
    if (state.loading) return <div className="uiHelpText">{textStrings.pages.orders.loadingOrders}</div>;
    if (state.error) return <div className="form__error">{state.error}</div>;
    if (!state.orders.length) return <div className="uiHelpText">{textStrings.pages.orders.emptyOrders}</div>;

    return (
      <div style={{ display: 'grid', gap: 12 }}>
        {state.orders.map((o) => (
          <div
            key={o.id}
            className="card"
            style={{
              display: 'grid',
              gap: 6,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <strong>{textStrings.pages.orders.orderTitle(String(o.id).slice(-6))}</strong>
              <span className="uiHelpText">{o.createdAt}</span>
            </div>
            <div className="uiHelpText">
              {textStrings.pages.orders.labels.status} <strong>{o.status}</strong>
            </div>
            <div className="uiHelpText">
              {textStrings.pages.orders.labels.total} <strong>{money(o.total)}</strong>
            </div>
          </div>
        ))}
      </div>
    );
  }, [state]);

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
        '--font-title': fonts.FontFamily.headlines,
        '--font-body': fonts.FontFamily.bodytxt,
        '--font-links': fonts.FontFamily.btns,
      }}
    >
      <div className="container stack">
        <section className="hero">
          <h1 className="hero__title">{textStrings.pages.orders.title}</h1>
          <p className="hero__subtitle">{textStrings.pages.orders.subtitle}</p>
          <div className="actions">
            <Btn variant="secondary" href="/#/shop">
              {textStrings.pages.orders.continueShopping}
            </Btn>
          </div>
        </section>

        <section className="stack">
          <h2 className="sectionTitle">{textStrings.pages.orders.sectionTitle}</h2>
          {content}
        </section>
      </div>
    </main>
  );
};

export default Orders;
