import { CartProvider } from './context/CartContext';
import { SessionProvider } from './context/SessionContext';
import AurexDashboard from './pages/usersdash';
import './styles/Aurex.css';

const AurexApp = () => {
  return (
    <SessionProvider initialUser={{ name: 'Avery Carter', role: 'owner' }}>
      <CartProvider>
        <AurexDashboard />
      </CartProvider>
    </SessionProvider>
  );
};

export default AurexApp;
