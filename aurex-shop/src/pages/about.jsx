import colorstring from '../universal components/colorstrings';
import fonts from '../universal components/fonts';
import sizes from '../universal components/sizes';
import Text from '../universal components/textstring';
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
          <h1 className="hero__title">{Text.pages.about.title}</h1>
          <p className="hero__subtitle">{Text.pages.about.subtitle}</p>
        </section>

        <section className="card">
          <h2 className="sectionTitle">{Text.pages.about.style.title}</h2>
          <p className="card__meta">{Text.pages.about.style.body}</p>
        </section>
      </div>
    </main>
  );
};

export default About;
