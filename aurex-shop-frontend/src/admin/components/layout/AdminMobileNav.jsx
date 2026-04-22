import { textStrings } from '../../../constants/textStrings';

const NavIcon = ({ type }) => {
  if (type === 'products') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M7 7h10v14H7V7Zm2-4h6l1 2H8l1-2Zm-4 4h14a2 2 0 0 1 2 2v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a2 2 0 0 1 2-2Z"
          fill="currentColor"
          opacity="0.9"
        />
      </svg>
    );
  }

  if (type === 'orders') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6 2h12a2 2 0 0 1 2 2v18l-4-2-4 2-4-2-4 2V4a2 2 0 0 1 2-2Zm3 6h6v2H9V8Zm0 4h6v2H9v-2Z"
          fill="currentColor"
          opacity="0.9"
        />
      </svg>
    );
  }

  if (type === 'customers') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9.5 11a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 9.5 11Zm0 2c-3.7 0-6.5 1.9-6.5 4.2V21h13v-3.8C16 14.9 13.2 13 9.5 13Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path
          d="M17.2 11.2a3 3 0 1 0-2.4-5.2 5.6 5.6 0 0 1 .1 3.7 3 3 0 0 0 2.3 1.5Z"
          fill="currentColor"
          opacity="0.65"
        />
        <path
          d="M20.8 20.9v-3c0-1.7-1.3-3.2-3.3-3.9-.4.4-.9.7-1.4.9 1.7.6 2.7 1.6 2.7 2.8v3.2h2Z"
          fill="currentColor"
          opacity="0.65"
        />
      </svg>
    );
  }

  if (type === 'inventory') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 6.5 12 2l8 4.5v11L12 22l-8-4.5v-11Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path
          d="M12 22V11.2L20 6.7v10.8L12 22Z"
          fill="currentColor"
          opacity="0.65"
        />
      </svg>
    );
  }

  if (type === 'profile') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2c-4.7 0-8.5 2.3-8.5 5.1V22h17v-2.9C20.5 16.3 16.7 14 12 14Z"
          fill="currentColor"
          opacity="0.9"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 13.5V20a1 1 0 0 0 1 1h5.5v-7.5H4Zm0-2h6.5V3H5a1 1 0 0 0-1 1v7.5ZM13.5 21H19a1 1 0 0 0 1-1v-5.5h-6.5V21Zm0-8.5H20V4a1 1 0 0 0-1-1h-5.5v9.5Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
};

const NAV_ITEMS = [
  { key: 'dashboard', label: textStrings.admin.nav.dashboard, href: '#/admin', icon: 'dashboard', matches: ['dashboard'] },
  {
    key: 'products-inventory',
    label: `${textStrings.admin.nav.products} & ${textStrings.admin.nav.inventory}`,
    href: '#/admin/products',
    icon: 'products',
    matches: ['products', 'inventory'],
  },
  {
    key: 'orders-customers',
    label: `${textStrings.admin.nav.orders} & ${textStrings.admin.nav.customers}`,
    href: '#/admin/orders',
    icon: 'orders',
    matches: ['orders', 'customers'],
  },
  { key: 'profile', label: textStrings.admin.nav.profile, href: '#/admin/profile', icon: 'profile', matches: ['profile'] },
];

const AdminMobileNav = ({ active }) => {
  return (
    <nav className="adminMobileNav" aria-label={textStrings.admin.nav.ariaLabel}>
      <div className="adminMobileNav__inner">
        {NAV_ITEMS.map((item) => {
          const isActive = item.matches.includes(active);
          return (
            <a
              key={item.key}
              href={item.href}
              className={`adminMobileNav__link${isActive ? ' adminMobileNav__link--active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="adminMobileNav__icon" aria-hidden="true">
                <NavIcon type={item.icon} />
              </span>
              <span className="adminMobileNav__label">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default AdminMobileNav;
