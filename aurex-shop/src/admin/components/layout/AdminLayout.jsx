import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Dashboard from '../../pages/Dashboard';
import Products from '../../pages/Products';
import Orders from '../../pages/Orders';
import Customers from '../../pages/Customers';
import Inventory from '../../pages/Inventory';
import Text from '../../../universal components/textstring';

const getPage = (path) => {
  const cleaned = (path || '').replace(/^\/+/, '');
  if (cleaned.startsWith('products')) return { key: 'products', label: Text.admin.nav.products, Page: Products };
  if (cleaned.startsWith('orders')) return { key: 'orders', label: Text.admin.nav.orders, Page: Orders };
  if (cleaned.startsWith('customers')) return { key: 'customers', label: Text.admin.nav.customers, Page: Customers };
  if (cleaned.startsWith('inventory')) return { key: 'inventory', label: Text.admin.nav.inventory, Page: Inventory };
  return { key: 'dashboard', label: Text.admin.nav.dashboard, Page: Dashboard };
};

const AdminLayout = ({ path }) => {
  const page = getPage(path);
  return (
    <div className="adminLayout">
      <Sidebar active={page.key} />
      <div className="adminMain">
        <Topbar pageLabel={page.label} />
        <div className="adminContent">
          <page.Page />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
