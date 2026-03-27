import colorstring from '../universal components/colorstring';
import fonts from '../universal components/fonts';
import sizes from '../universal components/sizes';
import Btn from '../universal components/ui/btns';
import './pages.css';

const Shipping = () => {
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
          <h1 className="hero__title">Shipping</h1>
          <p className="hero__subtitle">
            Clear, simple shipping information. Update these details to match
            your real delivery options.
          </p>
          <div className="actions">
            <Btn variant="secondary" href="/#/shop">
              Continue shopping
            </Btn>
          </div>
        </section>

        <section className="card">
          <h2 className="sectionTitle">Delivery times</h2>
          <p className="card__meta">
            Standard delivery: 2–5 business days. Express delivery: 1–2 business
            days (where available).
          </p>
        </section>

        <section className="card">
          <h2 className="sectionTitle">Shipping fees</h2>
          <p className="card__meta">
            Shipping fees are calculated at checkout based on location and
            order size.
          </p>
        </section>
      </div>
    </main>
  );
};

export default Shipping;
