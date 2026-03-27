import Images from '../imagestring';
import colorstring from '../colorstring';
import fonts from '../fonts';
import sizes from '../sizes';
import Btn from '../ui/btns';
import './navbar.css';
import Text from '../texttring';

// navlinks

const navLinks = [
  { label: Text.navbar.home, href: '/#/' },
  { label: Text.navbar.shop, href: '/#/Shop' },
  { label: Text.navbar.about, href: '/#/About' },
  { label: Text.navbar.contact, href: '/#/Contact' },
];

const Navbar = () => {
  return (
    <nav
      className="navbar"
      aria-label="Primary"
      style={{
        '--navbar-height': `${sizes.navbar.height}px`,
        '--navbar-padding-x': `${sizes.navbar.paddingX}px`,
        '--navbar-gap': `${sizes.navbar.gap}px`,
        '--navbar-logo-height': `${sizes.navbar.logoHeight}px`,
        '--navbar-bg': colorstring.brand.primary,
        '--navbar-fg': colorstring.brand.secondary,
        '--navbar-border': colorstring.brand.third,
        '--navbar-link': colorstring.fonts.sub,
        '--navbar-link-hover': colorstring.brand.secondary,
        '--navbar-link-hover-bg': colorstring.brand.third,
        '--navbar-font': fonts.FontFamily.btns,
      }}
    >
      <a className="navbar__brand" href="/#/">
        <img className="navbar__logo" src={Images.logo} alt="Aurex" />
        <span>Aurex</span>
      </a>

      <ul className="navbar__links">
        {navLinks.map((link) => (
          <li key={link.label}>
            <a className="navbar__link" href={link.href}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="navbar__actions">
        <Btn href="/#/register">Register</Btn>
      </div>
    </nav>
  );
};

export default Navbar;
