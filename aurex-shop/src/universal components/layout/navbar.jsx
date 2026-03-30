import Images from '../imagestring';
import colorstring from '../colorstrings';
import fonts from '../fonts';
import sizes from '../sizes';
import Btn from '../ui/btns';
import './navbar.css';
import Text from '../textstring';
import { useCart } from '../../context/CartContext';
import { useSession } from '../../context/SessionContext';

// navlinks

const navLinks = [
  { label: Text.navbar.home, href: '/#/' },
  { label: Text.navbar.shop, href: '/#/Shop' },
  { label: Text.navbar.about, href: '/#/About' },
  { label: Text.navbar.contact, href: '/#/Contact' },
];

const Navbar = () => {
  const cart = useCart();
  const session = useSession();

  return (
    <nav
      className="navbar"
      aria-label={Text.navbar.ariaLabelPrimary}
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
        <img className="navbar__logo" src={Images.logo} alt={Text.tittle.head} />
        <span>{Text.tittle.head}</span>
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
        <Btn variant="secondary" href="/#/dashboard">
          Dashboard
        </Btn>
        <Btn variant="secondary" onClick={cart.toggleCart}>
          Cart ({cart.totals.itemCount})
        </Btn>
        {session.user.role === 'guest' ? <Btn href="/#/register">{Text.navbar.registerCta}</Btn> : null}
      </div>
    </nav>
  );
};

export default Navbar;
