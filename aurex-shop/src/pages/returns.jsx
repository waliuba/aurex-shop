import colorstring from '../universal components/colorstring';
import fonts from '../universal components/fonts';
import sizes from '../universal components/sizes';
import Btn from '../universal components/ui/btns';
import './pages.css';

const Returns = () => {
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
          <h1 className="hero__title">Returns</h1>
          <p className="hero__subtitle">
            Simple return policy UI. Replace the text with your real policy.
          </p>
          <div className="actions">
            <Btn variant="secondary" href="/#/contact">
              Contact support
            </Btn>
          </div>
        </section>

        <section className="card">
          <h2 className="sectionTitle">Return window</h2>
          <p className="card__meta">
            Returns accepted within 7–14 days of delivery if items are unused
            and in original condition.
          </p>
        </section>

        <section className="card">
          <h2 className="sectionTitle">How to return</h2>
          <p className="card__meta">
            Reach out via the Contact page with your order details, then follow
            the provided instructions.
          </p>
        </section>
      </div>
    </main>
  );
};

export default Returns;
