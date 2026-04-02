import colorstring from '../universal components/colorstrings';
import fonts from '../universal components/fonts';
import sizes from '../universal components/sizes';
import Btn from '../universal components/ui/btns';
import Text from '../universal components/textstring';
import './pages.css';

const Contact = () => {
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
        '--font-title': fonts.FontFamily.headlines,
        '--font-body': fonts.FontFamily.bodytxt,
        '--font-links': fonts.FontFamily.btns,
      }}
    >
      <div className="container stack">
        <section className="hero">
          <h1 className="hero__title">{Text.pages.contact.title}</h1>
          <p className="hero__subtitle">{Text.pages.contact.subtitle}</p>
        </section>

        <section className="card">
          <h2 className="sectionTitle">{Text.pages.contact.messageTitle}</h2>
          <form className="form" onSubmit={(event) => event.preventDefault()}>
            <div className="field">
              <label htmlFor="name">{Text.pages.contact.form.name.label}</label>
              <input id="name" name="name" placeholder={Text.pages.contact.form.name.placeholder} />
            </div>
            <div className="field">
              <label htmlFor="email">{Text.pages.contact.form.email.label}</label>
              <input id="email" name="email" placeholder={Text.pages.contact.form.email.placeholder} />
            </div>
            <div className="field">
              <label htmlFor="message">{Text.pages.contact.form.message.label}</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder={Text.pages.contact.form.message.placeholder}
              />
            </div>
            <div className="actions">
              <Btn type="submit">{Text.pages.contact.form.submit}</Btn>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Contact;
