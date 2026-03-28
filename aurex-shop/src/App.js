import './App.css';
import Navbar from './universal components/layout/navbar';
import Footer from './universal components/layout/footer';
import { useEffect, useState } from 'react';
import AdminApp from './admin/AdminApp';

import Home from './pages/home';
import Shop from './pages/shop';
import About from './pages/about';
import Contact from './pages/contact';
import Login from './pages/login';
import Register from './pages/register';
import Shipping from './pages/shipping';
import Returns from './pages/returns';
import Faq from './pages/faq';

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

  const storeRoute = path;
  const Page =
    storeRoute.startsWith('shop')
      ? Shop
      : storeRoute.startsWith('about')
        ? About
        : storeRoute.startsWith('contact')
          ? Contact
          : storeRoute.startsWith('login')
            ? Login
            : storeRoute.startsWith('register')
              ? Register
              : storeRoute.startsWith('shipping')
                ? Shipping
                : storeRoute.startsWith('returns')
                  ? Returns
                  : storeRoute.startsWith('faq')
                    ? Faq
                    : Home;

  return (
    <div className="App">
      {isAdmin ? (
        <AdminApp path={path} />
      ) : (
        <>
          <Navbar />
          <Page />
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
