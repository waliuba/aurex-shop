import { useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import { useSession } from '../../context/SessionContext';
import Button from '../../Button';

const navItems = [
  { key: 'overview', label: 'Overview', href: '#/aurex' },
  { key: 'orders', label: 'Order history', href: '#/aurex/orders' },
  { key: 'wishlist', label: 'Wishlist', href: '#/aurex/wishlist' },
  { key: 'addresses', label: 'Addresses', href: '#/aurex/addresses' },
];

const DashboardLayout = ({ active = 'overview', title = 'Dashboard', subtitle, children }) => {
  const cart = useCart();
  const session = useSession();

  const userLine = useMemo(() => {
    const name = session?.user?.name || 'Guest';
    const email = session?.user?.email ? ` · ${session.user.email}` : '';
    return `${name}${email}`;
  }, [session?.user?.email, session?.user?.name]);

  return (
    <div className="aurex">
      <div className="mdLayout">
        <aside className="mdSidebar">
          <div className="mdBrand">
            <div className="mdBrand__kicker">Style journey</div>
            <div className="mdBrand__title">Aurex</div>
            <div className="mdMuted">{userLine}</div>
          </div>

          <nav className="mdNav" aria-label="User dashboard navigation">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className={active === item.key ? 'mdNavLink mdNavLink--active' : 'mdNavLink'}
              >
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="mdSidebar__footer">
            <Button variant="outline" onClick={session.logout}>
              Logout
            </Button>
          </div>
        </aside>

        <main className="mdMain">
          <header className="mdTopbar">
            <div className="mdTopbar__title">
              <h1>{title}</h1>
              {subtitle ? <p>{subtitle}</p> : null}
            </div>

            <div className="mdTopbar__actions">
              <Button variant="outline" onClick={cart.toggleCart} aria-label="Open cart">
                Cart ({cart.totals.itemCount})
              </Button>
            </div>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

