import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Dashboard from '../../pages/Dashboard';
import Products from '../../pages/Products';
import Orders from '../../pages/Orders';
import Customers from '../../pages/Customers';
import Inventory from '../../pages/Inventory';

const getPage = (path) => {
  const cleaned = (path || '').replace(/^\/+/, '');
  if (cleaned.startsWith('products')) return { key: 'products', label: 'Products', Page: Products };
  if (cleaned.startsWith('orders')) return { key: 'orders', label: 'Orders', Page: Orders };
  if (cleaned.startsWith('customers')) return { key: 'customers', label: 'Customers', Page: Customers };
  if (cleaned.startsWith('inventory')) return { key: 'inventory', label: 'Inventory', Page: Inventory };
  return { key: 'dashboard', label: 'Dashboard', Page: Dashboard };
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
