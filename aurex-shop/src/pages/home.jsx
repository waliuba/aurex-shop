import colorstring from '../universal components/colorstring';
import fonts from '../universal components/fonts';
import sizes from '../universal components/sizes';
import './pages.css';

const Home = () => {
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
          <h1 className="hero__title">Aurex Shop</h1>
          <p className="hero__subtitle">
            Discover curated essentials with a clean, modern look. Shop new
            arrivals, explore categories, and find pieces that fit your style.
          </p>
          <div className="actions">
            <a className="btn btn--primary" href="/#/shop">
              Browse Shop
            </a>
            <a className="btn btn--secondary" href="/#/about">
              Learn More
            </a>
          </div>
        </section>

        <section className="stack">
          <h2 className="sectionTitle">Featured</h2>
          <div className="grid">
            {[
              { name: 'Everyday Tote', desc: 'Minimal, durable, and ready to go.', price: '$29' },
              { name: 'Classic Tee', desc: 'Soft fabric with a clean silhouette.', price: '$19' },
              { name: 'Street Cap', desc: 'Easy fit with a premium finish.', price: '$14' },
              { name: 'Weekend Hoodie', desc: 'Cozy layer for cool evenings.', price: '$39' },
            ].map((item) => (
              <div className="card" key={item.name}>
                <h3 className="card__name">{item.name}</h3>
                <p className="card__meta">{item.desc}</p>
                <div className="price">{item.price}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
