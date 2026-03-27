import Images from '../imagestring';
import colorstring from '../colorstring';
import fonts from '../fonts';
import sizes from '../sizes';
import './footer.css';

const footerLinks = {
  Company: [
    { label: 'About', href: '/#/about' },
    { label: 'Shop', href: '/#/shop' },
    { label: 'Contact', href: '/#/contact' },
  ],
  Support: [
    { label: 'Shipping', href: '/' },
    { label: 'Returns', href: '/' },
    { label: 'FAQ', href: '/' },
  ],
};

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="footer"
      aria-label="Footer"
      style={{
        '--footer-padding-x': `${sizes.footer.paddingX}px`,
        '--footer-padding-y': `${sizes.footer.paddingY}px`,
        '--footer-gap': `${sizes.footer.gap}px`,
        '--footer-logo-height': `${sizes.footer.logoHeight}px`,
        '--footer-bg': colorstring.footer.footerbg,
        '--footer-fg': colorstring.fonts.footertxt,
        '--footer-muted': colorstring.brand.third,
        '--footer-font-title': fonts.FontFamily.headlines,
        '--footer-font-body': fonts.FontFamily.bodytxt,
        '--footer-font-links': fonts.FontFamily.btns,
      }}
    >
      <div className="footer__inner">
        <div>
          <div className="footer__brand">
            <img className="footer__logo" src={Images.logo} alt="Aurex" />
            <h3 className="footer__title">Aurex</h3>
          </div>
          <p className="footer__tagline">
            Quality pieces, curated with care. Shop the latest and timeless
            essentials.
          </p>
        </div>

        {Object.entries(footerLinks).map(([sectionTitle, links]) => (
          <div key={sectionTitle}>
            <h4 className="footer__sectionTitle">{sectionTitle}</h4>
            <ul className="footer__links">
              {links.map((link) => (
                <li key={link.label}>
                  <a className="footer__link" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer__bottom">
        <span>{'\u00A9'} {year} Aurex. All rights reserved.</span>
        <span>Made with care.</span>
      </div>
    </footer>
  );
};

export default Footer;
