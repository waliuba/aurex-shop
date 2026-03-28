import Button from '../ui/Button';

const nav = [
  { key: 'dashboard', label: 'Dashboard', href: '#/admin' },
  { key: 'products', label: 'Products', href: '#/admin/products' },
  { key: 'orders', label: 'Orders', href: '#/admin/orders' },
  { key: 'customers', label: 'Customers', href: '#/admin/customers' },
  { key: 'inventory', label: 'Inventory', href: '#/admin/inventory' },
];

const Sidebar = ({ active }) => {
  return (
    <aside className="adminSidebar">
      <div className="adminSidebar__brand">
        <div className="adminSidebar__logo" aria-hidden="true" />
        <div>
          <div className="adminSidebar__kicker">Aurex</div>
          <div className="adminSidebar__title">Admin</div>
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
          Back to store
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;

