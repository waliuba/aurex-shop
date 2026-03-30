import Button from '../ui/Button';
import Text from '../../../universal components/textstring';

const nav = [
  { key: 'dashboard', label: Text.admin.nav.dashboard, href: '#/admin' },
  { key: 'products', label: Text.admin.nav.products, href: '#/admin/products' },
  { key: 'orders', label: Text.admin.nav.orders, href: '#/admin/orders' },
  { key: 'customers', label: Text.admin.nav.customers, href: '#/admin/customers' },
  { key: 'inventory', label: Text.admin.nav.inventory, href: '#/admin/inventory' },
];

const Sidebar = ({ active }) => {
  return (
    <aside className="adminSidebar">
      <div className="adminSidebar__brand">
        <div className="adminSidebar__logo" aria-hidden="true" />
        <div>
          <div className="adminSidebar__kicker">{Text.admin.brand.app}</div>
          <div className="adminSidebar__title">{Text.admin.brand.adminLabel}</div>
        </div>
      </div>

      <nav className="adminSidebar__nav" aria-label="Admin navigation">
        {nav.map((item) => (
          <a
            key={item.key}
            href={item.href}
            className={`adminNavLink${active === item.key ? ' adminNavLink--active' : ''}`}
          >
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="adminSidebar__footer">
        <Button href="#/" variant="ghost">
          {Text.admin.actions.backToStore}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
