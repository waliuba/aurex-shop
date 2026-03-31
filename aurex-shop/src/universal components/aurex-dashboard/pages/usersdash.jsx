import { useEffect, useMemo, useState } from 'react';
import { useCart } from '../context/CartContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProfileSummary from '../components/profile/ProfileSummary';
import OrderHistory from '../components/orders/OrderHistory';
import CartPreview from '../components/cart/CartPreview';
import Wishlist from '../components/wishlist/Wishlist';
import AddressBook from '../components/address/AddressBook';
import CartModal from '../CartModal';

const getRouteKey = () => {
  const hash = window.location.hash || '#/aurex';
  const cleaned = hash.replace(/^#\/?/, '');
  const lower = cleaned.toLowerCase();
  if (!lower.startsWith('aurex')) return 'overview';
  const rest = lower.replace(/^aurex\/?/, '');
  const key = rest.split('/')[0];
  return key || 'overview';
};

const AurexDashboard = () => {
  const cart = useCart();
  const [routeKey, setRouteKey] = useState(getRouteKey());

  useEffect(() => {
    const onChange = () => setRouteKey(getRouteKey());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const orders = useMemo(
    () => [
      { id: 'ARX-10021', date: '2026-03-28', total: 620, status: 'Delivered' },
      { id: 'ARX-10018', date: '2026-03-27', total: 980, status: 'Pending' },
      { id: 'ARX-10011', date: '2026-03-22', total: 710, status: 'Cancelled' },
      { id: 'ARX-10007', date: '2026-03-20', total: 540, status: 'Delivered' },
    ],
    []
  );

  const [wishlistItems, setWishlistItems] = useState(() => [
    { name: 'Midnight Navy Bespoke Suit', sku: 'MDN-SUIT-001', stock: 8, swatch: '#0b1d3a', price: 620 },
    { name: 'Charcoal Peak Lapel Suit', sku: 'CHR-SUIT-014', stock: 3, swatch: '#3f3f46', price: 710 },
    { name: 'Sand Linen Summer Suit', sku: 'SND-SUIT-008', stock: 0, swatch: '#d6c7a7', price: 540 },
  ]);

  const [addresses, setAddresses] = useState(() => [
    { id: 'addr-1', label: 'Home', line1: 'Kilimani, Apartment 12B', city: 'Nairobi', country: 'Kenya', isDefault: true },
    { id: 'addr-2', label: 'Office', line1: 'Westlands, Suite 6', city: 'Nairobi', country: 'Kenya', isDefault: false },
  ]);

  const content =
    routeKey === 'orders' ? (
      <OrderHistory orders={orders} />
    ) : routeKey === 'wishlist' ? (
      <Wishlist
        items={wishlistItems}
        onAddToCart={(p) => cart.addItem(p, 1)}
        onRemove={(sku) => setWishlistItems((prev) => prev.filter((x) => x.sku !== sku))}
      />
    ) : routeKey === 'addresses' ? (
      <AddressBook
        addresses={addresses}
        onAdd={(payload) =>
          setAddresses((prev) => [{ id: `addr-${Date.now()}`, ...payload, isDefault: prev.length === 0 }, ...prev])
        }
        onRemove={(id) => setAddresses((prev) => prev.filter((x) => x.id !== id))}
        onSetDefault={(id) => setAddresses((prev) => prev.map((x) => ({ ...x, isDefault: x.id === id })))}
      />
    ) : (
      <div className="mdGrid mdGrid--user">
        <ProfileSummary />
        <CartPreview />
        <OrderHistory orders={orders} limit={3} />
        <Wishlist
          items={wishlistItems}
          limit={3}
          onAddToCart={(p) => cart.addItem(p, 1)}
          onRemove={(sku) => setWishlistItems((prev) => prev.filter((x) => x.sku !== sku))}
        />
        <AddressBook
          addresses={addresses}
          limit={2}
          onAdd={() => {}}
          onRemove={(id) => setAddresses((prev) => prev.filter((x) => x.id !== id))}
          onSetDefault={(id) => setAddresses((prev) => prev.map((x) => ({ ...x, isDefault: x.id === id })))}
        />
      </div>
    );

  return (
    <>
      <DashboardLayout
        active={routeKey === 'overview' ? 'overview' : routeKey}
        title="Your dashboard"
        subtitle="Track your orders, saved suits, addresses, and cart in one place."
      >
        {content}
      </DashboardLayout>
      <CartModal />
    </>
  );
};

export default AurexDashboard;

