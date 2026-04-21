import { useMemo, useState } from 'react';
import colorstring from '../universal components/colorstrings';
import fonts from '../universal components/fonts';
import sizes from '../universal components/sizes';
import Btn from '../universal components/ui/btns';
import './pages.css';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import { textStrings } from '../constants/textStrings';

const money = (n) => `${textStrings.currency.symbol}${Number(n || 0).toLocaleString()}`;

const hasToken = () => {
  try {
    return Boolean(window.localStorage.getItem('token'));
  } catch {
    return false;
  }
};

const Checkout = () => {
  const cart = useCart();
  const [form, setForm] = useState(() => ({
    address: '',
    city: '',
    postalCode: '',
    country: textStrings.pages.checkout.defaults.country,
    paymentMethod: textStrings.pages.checkout.defaults.paymentMethod,
  }));

  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const summary = useMemo(() => {
    const itemCount = cart.totals.itemCount;
    const subtotal = cart.totals.subtotal;
    return { itemCount, subtotal };
  }, [cart.totals]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    try {
      if (!hasToken()) {
        throw new Error(textStrings.pages.checkout.errors.loginRequired);
      }

      if (!cart.items.length) {
        throw new Error(textStrings.pages.checkout.errors.emptyCart);
      }

      const shippingAddress = {
        address: form.address.trim(),
        city: form.city.trim(),
        postalCode: form.postalCode.trim(),
        country: form.country.trim(),
      };

      if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
        throw new Error(textStrings.pages.checkout.errors.missingShippingFields);
      }

      const created = await createOrder({
        items: cart.items,
        shippingAddress,
        paymentMethod: form.paymentMethod,
      });

      cart.clear();

      const createdId = created?._id || created?.id || textStrings.pages.checkout.success.fallbackId;
      setStatus({
        loading: false,
        error: '',
        success: textStrings.pages.checkout.success.orderCreated(createdId),
      });

      window.location.hash = '#/orders';
    } catch (error) {
      setStatus({ loading: false, error: error.message || textStrings.pages.checkout.errors.checkoutFailed, success: '' });
    }
  };

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
          <h1 className="hero__title">{textStrings.pages.checkout.title}</h1>
          <p className="hero__subtitle">{textStrings.pages.checkout.subtitle}</p>
        </section>

        <section className="card">
          <h2 className="sectionTitle">{textStrings.pages.checkout.summary.title}</h2>
          <div className="uiHelpText">
            {textStrings.pages.checkout.summary.itemsLabel} <strong>{summary.itemCount}</strong> {textStrings.common.dotSeparator}{' '}
            {textStrings.pages.checkout.summary.subtotalLabel} <strong>{money(summary.subtotal)}</strong>
          </div>
          <div className="actions" style={{ marginTop: 12 }}>
            <Btn variant="secondary" href="/#/shop">
              {textStrings.pages.checkout.summary.backToShop}
            </Btn>
            <Btn variant="ghost" onClick={cart.openCart} disabled={!cart.items.length}>
              {textStrings.pages.checkout.summary.reviewCart}
            </Btn>
          </div>
        </section>

        <section className="card">
          <h2 className="sectionTitle">{textStrings.pages.checkout.form.title}</h2>
          <form className="form" onSubmit={onSubmit}>
            {status.error ? <p className="form__error">{status.error}</p> : null}
            {status.success ? <p className="form__success">{status.success}</p> : null}

            {!hasToken() ? (
              <p className="uiHelpText">
                {textStrings.pages.checkout.form.loginHint}{' '}
                <a href="/#/login">{textStrings.btns.login2}</a>
              </p>
            ) : null}

            <div className="field">
              <label htmlFor="ship-address">{textStrings.pages.checkout.form.fields.address.label}</label>
              <input
                id="ship-address"
                value={form.address}
                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                placeholder={textStrings.pages.checkout.form.fields.address.placeholder}
              />
            </div>
            <div className="field">
              <label htmlFor="ship-city">{textStrings.pages.checkout.form.fields.city.label}</label>
              <input
                id="ship-city"
                value={form.city}
                onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                placeholder={textStrings.pages.checkout.form.fields.city.placeholder}
              />
            </div>
            <div className="field">
              <label htmlFor="ship-postal">{textStrings.pages.checkout.form.fields.postalCode.label}</label>
              <input
                id="ship-postal"
                value={form.postalCode}
                onChange={(e) => setForm((p) => ({ ...p, postalCode: e.target.value }))}
                placeholder={textStrings.pages.checkout.form.fields.postalCode.placeholder}
              />
            </div>
            <div className="field">
              <label htmlFor="ship-country">{textStrings.pages.checkout.form.fields.country.label}</label>
              <input
                id="ship-country"
                value={form.country}
                onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
              />
            </div>

            <div className="field">
              <label htmlFor="pay-method">{textStrings.pages.checkout.form.fields.paymentMethod.label}</label>
              <select
                id="pay-method"
                value={form.paymentMethod}
                onChange={(e) => setForm((p) => ({ ...p, paymentMethod: e.target.value }))}
              >
                {textStrings.pages.checkout.paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            <div className="actions">
              <Btn type="submit" disabled={status.loading || !cart.items.length}>
                {status.loading ? textStrings.pages.checkout.submitting : textStrings.pages.checkout.submit}
              </Btn>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Checkout;
