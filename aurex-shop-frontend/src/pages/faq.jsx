import colorstring from '../universal components/colorstrings';
import fonts from '../universal components/fonts';
import sizes from '../universal components/sizes';
import Btn from '../universal components/ui/btns';
import Text from '../universal components/textstring';
import './pages.css';

const Faq = () => {
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
          <h1 className="hero__title">{Text.pages.faq.title}</h1>
          <p className="hero__subtitle">{Text.pages.faq.subtitle}</p>
          <div className="actions">
            <Btn variant="secondary" href="/#/contact">
              {Text.pages.faq.askQuestion}
            </Btn>
          </div>
        </section>

        <section className="stack">
          <h2 className="sectionTitle">{Text.pages.faq.questionsTitle}</h2>
          <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
            {Text.pages.faq.items.map((item) => (
              <div className="card" key={item.q}>
                <h3 className="card__name">{item.q}</h3>
                <p className="card__meta">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Faq;
