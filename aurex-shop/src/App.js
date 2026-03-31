import './App.css';
import Navbar from './universal components/layout/navbar';
import Footer from './universal components/layout/footer';
import { useEffect, useState } from 'react';
import AdminApp from './admin/AdminApp';
import Aurex from './universal components/aurex-dashboard/Aurex-shop';
import { CartProvider } from './context/CartContext';
import { SessionProvider } from './context/SessionContext';
import CartModal from './universal components/ui/CartModal';

import Home from './pages/home';
import Shop from './pages/shop';
import About from './pages/about';
import Contact from './pages/contact';
import Login from './pages/login';
import Register from './pages/register';
import Shipping from './pages/shipping';
import Returns from './pages/returns';
import Faq from './pages/faq';
import Dashboard from './pages/dashboard';

const getHashPath = () => {
  const hash = window.location.hash || '#/';
  const cleaned = hash.replace(/^#\/?/, '');
  const path = cleaned.split('?')[0].toLowerCase();
  return path === '/' ? '' : path;
};

function App() {
  const [path, setPath] = useState(getHashPath());

  useEffect(() => {
    const onChange = () => setPath(getHashPath());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const isAdmin = path.startsWith('admin');
  const isAurex = path.startsWith('aurex');

  const pages = {
    '': Home,
    home: Home,
    register: Register,
    login: Login,
    dashboard: Dashboard,
    shop: Shop,
    about: About,
    contact: Contact,
    shipping: Shipping,
    returns: Returns,
    faq: Faq,
  };

  const routeKey = path.split('/')[0];
  const Page = pages[routeKey] || Home;




  return (
    <div className="App">
      {isAdmin ? (
        <AdminApp path={path} />
      ) : isAurex ? (
        <Aurex />
      ) : (
        <SessionProvider>
          <CartProvider>
            <Navbar />
            <Page />
            <Footer />
            <CartModal />
          </CartProvider>
        </SessionProvider>
      )}
    </div>
  );
}

export default App;
