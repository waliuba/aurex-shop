import colorstring from '../universal components/colorstring';
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
          <h1 className="hero__title">Register</h1>
          <p className="hero__subtitle">
            Create an account to save your details and checkout faster. (UI-only
            for now.)
          </p>
        </section>

        <section className="card">
          <h2 className="sectionTitle">Create account</h2>
          <form className="form" onSubmit={(event) => event.preventDefault()}>
            <div className="field">
              <label htmlFor="reg-name">Full name</label>
              <input id="reg-name" name="name" placeholder="Your name" />
            </div>
            <div className="field">
              <label htmlFor="reg-email">Email</label>
              <input id="reg-email" name="email" placeholder="you@example.com" />
            </div>
            <div className="field">
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                name="password"
                type="password"
                placeholder="Create a password"
              />
            </div>
            <div className="actions">
              <Btn type="submit">Register</Btn>
              <Btn variant="secondary" href="/#/login">
                I have an account
              </Btn>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Register;
