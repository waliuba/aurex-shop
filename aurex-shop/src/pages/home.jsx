import { useEffect, useRef, useState } from 'react';
import colorstring from '../universal components/colorstring';
import fonts from '../universal components/fonts';
import sizes from '../universal components/sizes';
import './pages.css';

const featuredItems = [
  { name: 'Everyday Tote', desc: 'Minimal, durable, and ready to go.', price: '$29' },
  { name: 'Classic Tee', desc: 'Soft fabric with a clean silhouette.', price: '$19' },
  { name: 'Street Cap', desc: 'Easy fit with a premium finish.', price: '$14' },
  { name: 'Weekend Hoodie', desc: 'Cozy layer for cool evenings.', price: '$39' },
];

const Home = () => {
  const viewportRef = useRef(null);
  const slideRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;

    let rafId = 0;
    const updateActiveIndex = () => {
      rafId = 0;
      const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2;
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      slideRefs.current.forEach((slide, index) => {
        if (!slide) return;
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const distance = Math.abs(slideCenter - viewportCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      setActiveIndex(nearestIndex);
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateActiveIndex);
    };

    viewport.addEventListener('scroll', onScroll, { passive: true });
    updateActiveIndex();
    return () => {
      viewport.removeEventListener('scroll', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToIndex = (index) => {
    const clampedIndex = Math.max(0, Math.min(index, featuredItems.length - 1));
    const slide = slideRefs.current[clampedIndex];
    if (!slide) return;
    slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  return (
    <main
      className="page"
      style={{
        '--page-max-width': `${sizes.page.maxWidth}px`,
        '--page-padding-x': `${sizes.page.paddingX}px`,
        '--page-padding-y': `${sizes.page.paddingY}px`,
        '--page-section-gap': `${sizes.page.sectionGap}px`,
        '--page-card-radius': `${sizes.page.cardRadius}px`,
        '--page-bg': colorstring.brand.primary,
        '--page-title': colorstring.brand.secondary,
        '--page-border': colorstring.brand.third,
        '--page-fg': colorstring.fonts.main,
        '--page-muted': colorstring.fonts.sub,
        '--btn-primary-bg': colorstring.buttons.btn2,
        '--btn-primary-fg': colorstring.buttons.btn1,
        '--btn-secondary-border': colorstring.brand.third,
        '--btn-secondary-fg': colorstring.brand.secondary,
        '--font-title': fonts.FontFamily.headlines,
        '--font-body': fonts.FontFamily.bodytxt,
        '--font-links': fonts.FontFamily.btns,
      }}
    >
      <div className="container stack">
        <section className="hero">
          <h1 className="hero__title">Aurex Shop</h1>
          <p className="hero__subtitle">
            Discover curated essentials with a clean, modern look. Shop new
            arrivals, explore categories, and find pieces that fit your style.
          </p>
          <div className="actions">
            <a className="btn btn--primary" href="/#/shop">
              Browse Shop
            </a>
            <a className="btn btn--secondary" href="/#/about">
              Learn More
            </a>
          </div>
        </section>

        <section className="stack">
          <div className="carouselHeader">
            <h2 className="sectionTitle">Featured</h2>
            <div className="carouselControls">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => scrollToIndex(activeIndex - 1)}
                disabled={activeIndex === 0}
              >
                Prev
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => scrollToIndex(activeIndex + 1)}
                disabled={activeIndex === featuredItems.length - 1}
              >
                Next
              </button>
            </div>
          </div>

          <div className="carousel" aria-roledescription="carousel" aria-label="Featured products">
            <div className="carousel__viewport" ref={viewportRef} tabIndex={0}>
              <div className="carousel__track">
                {featuredItems.map((item, index) => (
                  <article
                    className="card carousel__slide"
                    key={item.name}
                    ref={(node) => {
                      slideRefs.current[index] = node;
                    }}
                    aria-roledescription="slide"
                    aria-label={`${item.name}, ${item.price}`}
                  >
                    <h3 className="card__name">{item.name}</h3>
                    <p className="card__meta">{item.desc}</p>
                    <div className="price">{item.price}</div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
