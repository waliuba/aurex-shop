import './App.css';
import Navbar from './universal components/layout/navbar';
import Footer from './universal components/layout/footer';
import { useEffect, useState } from 'react';

import Home from './pages/home';
import Shop from './pages/shop';
import About from './pages/about';
import Contact from './pages/contact';

const getHashRoute = () => {
  const hash = window.location.hash || '#/';
  const cleaned = hash.replace(/^#\/?/, '');
  const path = cleaned.split('?')[0].toLowerCase();

  if (path === '' || path === '/') return 'home';
  if (path.startsWith('shop')) return 'shop';
  if (path.startsWith('about')) return 'about';
  if (path.startsWith('contact')) return 'contact';

  return 'home';
};

function App() {
  const [route, setRoute] = useState(getHashRoute());

  useEffect(() => {
    const onChange = () => setRoute(getHashRoute());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const Page =
    route === 'shop'
      ? Shop
      : route === 'about'
        ? About
        : route === 'contact'
          ? Contact
          : Home;

  return (
    <div className="App">
      <Navbar />
      <Page />
      <Footer />
    </div>
  );
}

export default App;
