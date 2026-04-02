import Images from '../imagestring';
import colorstring from '../colorstrings';
import fonts from '../fonts';
import sizes from '../sizes';
import './footer.css';
import Text from '../textstring';

const footerLinks = [
  {
    title: Text.footer.sections.company,
    links: [
      { label: Text.navbar.about, href: '/#/about' },
      { label: Text.navbar.shop, href: '/#/shop' },
      { label: Text.navbar.contact, href: '/#/contact' },
    ],
  },
  {
    title: Text.footer.sections.support,
    links: [
      { label: Text.footer.Shipping, href: '/#/shipping' },
      { label: Text.footer.Returns, href: '/#/returns' },
      { label: Text.footer.Faq, href: '/#/faq' },
    ],
  },
];

const Footer = () => {
  

  return (
    <footer
      className="footer"
      aria-label={Text.footer.ariaLabel}
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
            <img className="footer__logo" src={Images.logo} alt={Text.tittle.head} />
            <h3 className="footer__title">{Text.tittle.head}</h3>
          </div>
          <p className="footer__tagline">
            {Text.footer.tagline}
          </p>
        </div>

        {footerLinks.map((section) => (
          <div key={section.title}>
            <h4 className="footer__sectionTitle">{section.title}</h4>
            <ul className="footer__links">
              {section.links.map((link) => (
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
        <span>{Text.declaration.Copyright}</span>
        <span>{Text.declaration.madewith}</span>
      </div>
    </footer>
  );
};

export default Footer;
