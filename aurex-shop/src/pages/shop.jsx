import colorstring from '../universal components/colorstring';
import fonts from '../universal components/fonts';
import sizes from '../universal components/sizes';
import './pages.css';

const products = [
  { name: 'Everyday Tote', desc: 'Minimal carry for daily essentials.', price: '$29' },
  { name: 'Classic Tee', desc: 'Soft and breathable. Easy match.', price: '$19' },
  { name: 'Street Cap', desc: 'Clean look with a structured crown.', price: '$14' },
  { name: 'Weekend Hoodie', desc: 'Warm layer, premium feel.', price: '$39' },
  { name: 'Sleek Bottle', desc: 'Keeps drinks cool and clean.', price: '$12' },
  { name: 'Light Sneakers', desc: 'Comfort with a minimal profile.', price: '$49' },
  { name: 'Modern Sunglasses', desc: 'Simple shape, all-day wear.', price: '$22' },
  { name: 'Canvas Belt', desc: 'Durable with a classic buckle.', price: '$11' },
];

const Shop = () => {
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
          <h1 className="hero__title">Shop</h1>
          <p className="hero__subtitle">
            A simple product grid to match your current styling. Replace these
            items with real data when you’re ready.
          </p>
        </section>

        <section className="stack">
          <h2 className="sectionTitle">Products</h2>
          <div className="grid">
            {products.map((product) => (
              <div className="card" key={product.name}>
                <h3 className="card__name">{product.name}</h3>
                <p className="card__meta">{product.desc}</p>
                <div className="price">{product.price}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Shop;
