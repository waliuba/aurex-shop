import colorstring from '../universal components/colorstring';
import Text from '../universal components/texttring';
import fonts from '../universal components/fonts';
import sizes from '../universal components/sizes';
import Btn from '../universal components/ui/btns';
import './pages.css';

const Register = () => {
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
          <h1 className="hero__title">{Text.tittle.hero_tittle}</h1>
          <p className="hero__subtitle">{Text.tittle.hero_sub_tittle}</p>
        </section>

        <section className="card">
          <h2 className="sectionTitle">{Text.reg.sectiontile}</h2>
          <form className="form" onSubmit={(event) => event.preventDefault()}>
            <div className="field">
              <label htmlFor="reg-name">{Text.reg.form.name.label}</label>
              <input id="reg-name" name="name" placeholder= {Text.reg.form.name.placeholder} />
            </div>
            <div className="field">
              <label htmlFor="reg-email">{Text.reg.form.email.label}</label>
              <input id="reg-email" name="email" placeholder= {Text.reg.form.email.placeholder} />
            </div>
            <div className="field">
              <label htmlFor="reg-password">{Text.reg.form.password.label}</label>
              <input
                id="reg-password"
                name="password"
                type="password"
                placeholder={Text.reg.form.password.placeholder}
              />
            </div>
            <div className="actions">
              <Btn type="submit">{Text.btns.register}</Btn>
              <Btn variant="secondary" href="/#/login">
               {Text.btns.login}
              </Btn>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Register;
