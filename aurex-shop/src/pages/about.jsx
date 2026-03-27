import colorstring from '../universal components/colorstring';
import fonts from '../universal components/fonts';
import sizes from '../universal components/sizes';
import './pages.css';

const About = () => {
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
          <h1 className="hero__title">About Aurex</h1>
          <p className="hero__subtitle">
            Aurex is built around clean design and curated essentials. The goal
            is simple: make it easy to find quality pieces that look good and
            feel right.
          </p>
        </section>

        <section className="card">
          <h2 className="sectionTitle">Our Style</h2>
          <p className="card__meta">
            We keep the palette calm and premium, focus on typography, and let
            the product speak. This project is structured to scale: you can
            plug in real products, categories, and payments later without
            changing the visual system.
          </p>
        </section>
      </div>
    </main>
  );
};

export default About;
