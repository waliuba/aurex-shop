import { CartProvider } from './context/CartContext';
import { SessionProvider } from './context/SessionContext';
import Dashboard from '../../pages/dashboard.jsx';
import './pages/styles/Aurex.css';


function AurexApp () {
  return (
    <SessionProvider initialUser={{ name: 'Avery Carter', email: 'avery@aurex.shop', role: 'customer' }}>
      <CartProvider>
        <Dashboard />
      </CartProvider>
    </SessionProvider>
  );
};

export default AurexApp;
