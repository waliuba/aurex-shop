import colorstring from '../universal components/colorstrings';
import Text from '../universal components/textstring';
import fonts from '../universal components/fonts';
import sizes from '../universal components/sizes';
import Btn from '../universal components/ui/btns';
import './pages.css';

const Login = () => {
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
          <h1 className="hero__title">{Text.tittle.hero_tittle2}</h1>
          <p className="hero__subtitle">
           {Text.tittle.hero_sub_tittle2} 
          </p>
        </section>

        <section className="card">
          <h2 className="sectionTitle">{Text.login.sectiontile}</h2>
          <form className="form" onSubmit={(event) => event.preventDefault()}>
            <div className="field">
              <label htmlFor="login-email">{Text.login.form.email.label}</label>
              <input id="login-email" name="email" placeholder={Text.login.form.email.placeholder} />
            </div>
            <div className="field">
              <label htmlFor="login-password">{Text.login.form.password.label}</label>
              <input
                id="login-password"
                name="password"
                type="password"
                placeholder= {Text.login.form.password.placeholder}
              />
            </div>
            <div className="actions">
              <Btn type="submit">{Text.btns.login2}</Btn>
              <Btn variant="secondary" href="/#/register">
                {Text.btns.register2}
              </Btn>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Login;
