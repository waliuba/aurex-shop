import React, { useEffect, useMemo, useState } from 'react';
import Skeleton from '../components/Skeleton';
import Modal from '../components/Modal';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { safeJsonParse, safeLocalStorageGet, safeLocalStorageSet } from '../../../utils/storage';
import { highlight } from '../../../utils/text';
import { useCommerceData } from '../../../context/CommerceDataContext';
import { useCart } from '../../../context/CartContext';
import { textStrings } from '../../../constants/textStrings';

const STORAGE_KEY = 'aurex_dash_product_search_v1';

const defaultFilters = {
  q: '',
  category: 'all',
  minPrice: '',
  maxPrice: '',
  sort: 'newest',
};

const money = (n) => {
  const value = Number(n) || 0;
  return `${textStrings.currency.symbol}${value.toLocaleString()}`;
};

const getStockMeta = (stock) => {
  const count = Number(stock) || 0;

  if (count <= 0) {
    return {
      label: textStrings.userDashboard.products.card.outOfStock,
      className:
        'tw-bg-rose-50 tw-text-rose-700 tw-border-rose-200 dark:tw-bg-rose-950/30 dark:tw-text-rose-300 dark:tw-border-rose-900',
    };
  }

  if (count <= 3) {
    return {
      label: textStrings.userDashboard.products.card.lowStock,
      className:
        'tw-bg-amber-50 tw-text-amber-700 tw-border-amber-200 dark:tw-bg-amber-950/30 dark:tw-text-amber-300 dark:tw-border-amber-900',
    };
  }

  return {
    label: textStrings.userDashboard.products.card.inStock,
    className:
      'tw-bg-emerald-50 tw-text-emerald-700 tw-border-emerald-200 dark:tw-bg-emerald-950/30 dark:tw-text-emerald-300 dark:tw-border-emerald-900',
  };
};

const clampStyle = {
  maxHeight: '6rem',
  overflowY: 'auto',
  paddingRight: '0.25rem',
};

const ProductsPage = () => {
  const data = useCommerceData();
  const cart = useCart();

  const [filters, setFilters] = useState(() => {
    const raw = safeLocalStorageGet(STORAGE_KEY);
    return safeJsonParse(raw, defaultFilters);
  });
  const [selectedId, setSelectedId] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);

  const debouncedQ = useDebouncedValue(filters.q, 250);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const products = useMemo(() => (Array.isArray(data.products.data) ? data.products.data : []), [data.products.data]);
  const loading = data.products.status === 'loading' || data.products.status === 'idle';
  const error = data.products.status === 'error' ? data.products.error : '';

  const categories = useMemo(() => {
    const set = new Set();

    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });

    return ['all', ...Array.from(set).sort((a, b) => (a > b ? 1 : -1))];
  }, [products]);

  const recentSearches = useMemo(() => {
    const raw = safeLocalStorageGet(`${STORAGE_KEY}:recent`);
    const list = safeJsonParse(raw, []);
    return Array.isArray(list) ? list.slice(0, 6) : [];
  }, []);

  const filtered = useMemo(() => {
    const min = filters.minPrice ? Number(filters.minPrice) : Number.NEGATIVE_INFINITY;
    const max = filters.maxPrice ? Number(filters.maxPrice) : Number.POSITIVE_INFINITY;
    const cat = filters.category;
    const q = debouncedQ.trim().toLowerCase();

    let list = products.filter((p) => {
      if (cat !== 'all' && (p.category || '') !== cat) return false;
      if (Number(p.price || 0) < min) return false;
      if (Number(p.price || 0) > max) return false;

      if (q) {
        const hay = `${p.name} ${p.description || ''} ${p.category || ''} ${p.size || ''} ${p.color || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });

    if (filters.sort === 'price_asc') list = [...list].sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    else if (filters.sort === 'price_desc') list = [...list].sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    else list = [...list].sort((a, b) => (String(a.id) > String(b.id) ? -1 : 1));

    return list;
  }, [products, filters.category, filters.minPrice, filters.maxPrice, filters.sort, debouncedQ]);

  useEffect(() => {
    const q = filters.q.trim();
    if (!q) return;
    const raw = safeLocalStorageGet(`${STORAGE_KEY}:recent`);
    const prev = safeJsonParse(raw, []);
    const next = [q, ...prev.filter((x) => x !== q)].slice(0, 6);
    safeLocalStorageSet(`${STORAGE_KEY}:recent`, JSON.stringify(next));
  }, [filters.q]);

  useEffect(() => {
    if (!filtered.length) {
      setSelectedId('');
      setDetailOpen(false);
      return;
    }

    if (selectedId && filtered.some((product) => String(product.id) === String(selectedId))) return;
    setSelectedId(String(filtered[0].id));
  }, [filtered, selectedId]);

  const selectedProduct = useMemo(
    () => filtered.find((product) => String(product.id) === String(selectedId)) || null,
    [filtered, selectedId]
  );

  const featuredProduct = filtered[0] || null;
  const inStockCount = filtered.filter((product) => Number(product.stock) > 0).length;

  const handleAddToCart = (product) => {
    if (!product || Number(product.stock) <= 0) return;
    cart.addItem(product, 1);
  };

  const openDetails = (product) => {
    if (!product) return;
    setSelectedId(String(product.id));
    setDetailOpen(true);
  };

  return (
    <div className="tw-grid tw-gap-4">
      <div className="tw-rounded-3xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-p-5 tw-shadow-soft">
        <div className="tw-flex tw-items-end tw-justify-between tw-gap-3 tw-flex-wrap">
          <div>
            <div className="tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.products.header.kicker}</div>
            <div className="tw-text-lg tw-font-semibold">{textStrings.userDashboard.products.header.title}</div>
          </div>
          <a className="tw-text-sm tw-underline" href="#/shop">
            {textStrings.userDashboard.products.header.openStorefront}
          </a>
        </div>

        <div className="tw-mt-4 tw-grid md:tw-grid-cols-5 tw-gap-3">
          <div className="md:tw-col-span-2 md:tw-pr-3">
            <label className="tw-text-xs tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.products.filters.search.label}</label>
            <input
              value={filters.q}
              onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
              placeholder={textStrings.userDashboard.products.filters.search.placeholder}
              className="tw-mt-1 tw-w-full tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-px-3 tw-py-2 tw-text-sm"
            />
            {recentSearches.length ? (
              <div className="tw-mt-2 tw-flex tw-flex-wrap tw-gap-2">
                {recentSearches.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, q }))}
                    className="tw-rounded-full tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-px-3 tw-py-1 tw-text-xs tw-text-slate-600 dark:tw-text-slate-200 hover:tw-bg-slate-50 dark:hover:tw-bg-slate-900"
                  >
                    {q}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="md:tw-pl-3">
            <label className="tw-text-xs tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.products.filters.category.label}</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
              className="tw-mt-1 tw-w-full tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-px-3 tw-py-2 tw-text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? textStrings.userDashboard.products.filters.category.allLabel : category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="tw-text-xs tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.products.filters.priceRange.label}</label>
            <div className="tw-mt-1 tw-flex tw-gap-2">
              <input
                value={filters.minPrice}
                onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
                placeholder={textStrings.userDashboard.products.filters.priceRange.minPlaceholder}
                inputMode="numeric"
                className="tw-w-full tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-px-3 tw-py-2 tw-text-sm"
              />
              <input
                value={filters.maxPrice}
                onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
                placeholder={textStrings.userDashboard.products.filters.priceRange.maxPlaceholder}
                inputMode="numeric"
                className="tw-w-full tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-px-3 tw-py-2 tw-text-sm"
              />
            </div>
          </div>

          <div>
            <label className="tw-text-xs tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.products.filters.sort.label}</label>
            <select
              value={filters.sort}
              onChange={(e) => {
                const value = e.target.value;
                const allowed = ['newest', 'price_asc', 'price_desc'];

                if (allowed.includes(value)) {
                  setFilters((prev) => ({ ...prev, sort: value }));
                }
              }}
              className="tw-mt-1 tw-w-full tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-px-3 tw-py-2 tw-text-sm"
            >
              <option value="newest">{textStrings.userDashboard.products.filters.sort.options.newest}</option>
              <option value="price_asc">{textStrings.userDashboard.products.filters.sort.options.priceAsc}</option>
              <option value="price_desc">{textStrings.userDashboard.products.filters.sort.options.priceDesc}</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="tw-grid tw-gap-4">
          <div className="tw-grid lg:tw-grid-cols-[1.6fr_1fr] tw-gap-4">
            <Skeleton className="tw-h-60" />
            <div className="tw-grid tw-gap-4">
              <Skeleton className="tw-h-28" />
              <Skeleton className="tw-h-28" />
            </div>
          </div>
          <div className="tw-grid md:tw-grid-cols-2 xl:tw-grid-cols-3 tw-gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="tw-h-80" />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="tw-rounded-3xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-p-5 tw-shadow-soft">
          <div className="tw-text-sm tw-text-rose-600">{error}</div>
        </div>
      ) : (
        <>
          <div className="tw-grid lg:tw-grid-cols-[1.6fr_1fr] tw-gap-4">
            <div className="tw-rounded-3xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-gradient-to-br tw-from-slate-900 tw-to-slate-800 dark:tw-from-slate-950 dark:tw-to-slate-900 tw-text-white tw-overflow-hidden tw-shadow-soft">
              <div className="tw-grid md:tw-grid-cols-[1.2fr_1fr]">
                <div className="tw-p-6 md:tw-p-7">
                  <div className="tw-text-xs tw-uppercase tw-tracking-[0.2em] tw-text-white/70">
                    {textStrings.userDashboard.products.summary.featuredLabel}
                  </div>
                  <div className="tw-mt-3 tw-text-2xl tw-font-semibold tw-tracking-tight">
                    {featuredProduct ? featuredProduct.name : textStrings.userDashboard.products.results.empty}
                  </div>
                  <div className="tw-mt-2 tw-max-h-28 tw-max-w-xl tw-overflow-y-auto tw-pr-1 tw-text-sm tw-leading-6 tw-text-white/80">
                    {featuredProduct?.description || textStrings.userDashboard.products.card.noDescription}
                  </div>

                  {featuredProduct ? (
                    <div className="tw-mt-5 tw-flex tw-flex-wrap tw-items-center tw-gap-3">
                      <span className="tw-inline-flex tw-items-center tw-rounded-full tw-bg-white/10 tw-px-3 tw-py-1 tw-text-xs">
                        {featuredProduct.category || textStrings.userDashboard.products.card.uncategorized}
                      </span>
                      {featuredProduct.size ? (
                        <span className="tw-inline-flex tw-items-center tw-rounded-full tw-bg-white/10 tw-px-3 tw-py-1 tw-text-xs">
                          {textStrings.userDashboard.products.card.sizeLabel}: {featuredProduct.size}
                        </span>
                      ) : null}
                      {featuredProduct.color ? (
                        <span className="tw-inline-flex tw-items-center tw-rounded-full tw-bg-white/10 tw-px-3 tw-py-1 tw-text-xs">
                          {textStrings.userDashboard.products.card.colorLabel}: {featuredProduct.color}
                        </span>
                      ) : null}
                    </div>
                  ) : null}

                  {featuredProduct ? (
                    <div className="tw-mt-6 tw-flex tw-flex-wrap tw-items-center tw-gap-3">
                      <button
                        type="button"
                        onClick={() => openDetails(featuredProduct)}
                        className="tw-inline-flex tw-items-center tw-gap-2 tw-rounded-2xl tw-bg-white tw-px-4 tw-py-2.5 tw-text-sm tw-font-medium tw-text-slate-900 hover:tw-bg-slate-100"
                      >
                        {textStrings.userDashboard.products.card.viewDetails}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(featuredProduct)}
                        disabled={Number(featuredProduct.stock) <= 0}
                        className="tw-inline-flex tw-items-center tw-gap-2 tw-rounded-2xl tw-border tw-border-white/20 tw-bg-white/10 tw-px-4 tw-py-2.5 tw-text-sm tw-font-medium tw-text-white hover:tw-bg-white/15 disabled:tw-cursor-not-allowed disabled:tw-opacity-50"
                      >
                        {Number(featuredProduct.stock) <= 0 ? textStrings.btns.outOfStock : textStrings.btns.cart}
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="tw-min-h-[220px] tw-bg-slate-100/10">
                  {featuredProduct?.image ? (
                    <img src={featuredProduct.image} alt={featuredProduct.name} className="tw-h-full tw-w-full tw-object-cover" />
                  ) : (
                    <div className="tw-flex tw-h-full tw-items-center tw-justify-center tw-p-8 tw-text-center tw-text-sm tw-text-white/60">
                      {textStrings.userDashboard.products.card.noDescription}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="tw-grid tw-gap-4">
              <div className="tw-rounded-3xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-p-5 tw-shadow-soft">
                <div className="tw-text-xs tw-uppercase tw-tracking-[0.2em] tw-text-slate-500 dark:tw-text-slate-400">
                  {textStrings.userDashboard.products.summary.selectedLabel}
                </div>
                <div className="tw-mt-2 tw-text-lg tw-font-semibold tw-tracking-tight">
                  {selectedProduct?.name || textStrings.common.emDash}
                </div>
                <div className="tw-mt-2 tw-text-sm tw-text-slate-600 dark:tw-text-slate-300" style={clampStyle}>
                  {selectedProduct?.description || textStrings.userDashboard.products.card.noDescription}
                </div>
                <div className="tw-mt-4 tw-flex tw-items-center tw-justify-between tw-gap-3">
                  <div>
                    <div className="tw-text-xs tw-text-slate-500 dark:tw-text-slate-400">{textStrings.userDashboard.products.card.priceLabel}</div>
                    <div className="tw-text-xl tw-font-semibold">{selectedProduct ? money(selectedProduct.price) : textStrings.common.emDash}</div>
                  </div>
                  {selectedProduct ? (
                    <span
                      className={`tw-inline-flex tw-items-center tw-rounded-full tw-border tw-px-3 tw-py-1 tw-text-xs ${getStockMeta(selectedProduct.stock).className}`}
                    >
                      {getStockMeta(selectedProduct.stock).label}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="tw-rounded-3xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-p-5 tw-shadow-soft">
                <div className="tw-text-xs tw-uppercase tw-tracking-[0.2em] tw-text-slate-500 dark:tw-text-slate-400">
                  {textStrings.userDashboard.products.summary.quickBuyLabel}
                </div>
                <div className="tw-mt-2 tw-text-3xl tw-font-semibold tw-tracking-tight">{inStockCount}</div>
                <div className="tw-mt-2 tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">
                  {textStrings.userDashboard.products.results.showing(filtered.length)}
                </div>
              </div>
            </div>
          </div>

          <div className="tw-rounded-3xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-p-5 tw-shadow-soft">
            <div className="tw-flex tw-items-center tw-justify-between tw-gap-3 tw-flex-wrap">
              <div className="tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">
                {textStrings.userDashboard.products.results.showing(filtered.length)}
              </div>
              <button type="button" onClick={() => setFilters(defaultFilters)} className="tw-text-sm tw-underline">
                {textStrings.userDashboard.products.results.resetFilters}
              </button>
            </div>

            {filtered.length === 0 ? (
              <div className="tw-mt-4 tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.products.results.empty}</div>
            ) : (
              <div className="tw-mt-4 tw-grid md:tw-grid-cols-2 xl:tw-grid-cols-3 tw-gap-4">
                {filtered.map((product) => {
                  const stockMeta = getStockMeta(product.stock);

                  return (
                    <div
                      key={product.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => openDetails(product)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openDetails(product);
                        }
                      }}
                      className="tw-group tw-overflow-hidden tw-rounded-3xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-shadow-sm hover:tw-shadow-soft tw-transition-all tw-duration-200 hover:-tw-translate-y-0.5 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-slate-300 dark:focus:tw-ring-slate-700"
                    >
                      <div className="tw-relative tw-aspect-[4/3] tw-overflow-hidden tw-bg-slate-100 dark:tw-bg-slate-900">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="tw-h-full tw-w-full tw-object-cover tw-transition-transform tw-duration-300 group-hover:tw-scale-[1.03]"
                          />
                        ) : (
                          <div className="tw-flex tw-h-full tw-items-center tw-justify-center tw-p-6 tw-text-center tw-text-sm tw-text-slate-500 dark:tw-text-slate-400">
                            {textStrings.userDashboard.products.card.noDescription}
                          </div>
                        )}

                        <div className="tw-absolute tw-left-3 tw-top-3 tw-flex tw-gap-2">
                          <span className={`tw-inline-flex tw-items-center tw-rounded-full tw-border tw-bg-white/95 tw-px-3 tw-py-1 tw-text-xs tw-font-medium dark:tw-bg-slate-950/90 ${stockMeta.className}`}>
                            {stockMeta.label}
                          </span>
                        </div>

                        <div className="tw-absolute tw-inset-x-0 tw-bottom-0 tw-bg-gradient-to-t tw-from-slate-950/70 tw-to-transparent tw-p-4 tw-text-white">
                          <div className="tw-flex tw-items-center tw-justify-between tw-gap-3">
                            <span className="tw-text-xs tw-font-medium tw-uppercase tw-tracking-[0.18em] tw-text-white/75">
                              {product.category || textStrings.userDashboard.products.card.uncategorized}
                            </span>
                            <span className="tw-text-sm tw-font-semibold">{money(product.price)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="tw-p-4">
                        <div className="tw-flex tw-items-start tw-justify-between tw-gap-3">
                          <div>
                            <div className="tw-font-semibold tw-tracking-tight">{highlight(product.name, debouncedQ)}</div>
                            <div className="tw-mt-1 tw-text-sm tw-text-slate-600 dark:tw-text-slate-300" style={clampStyle}>
                              {product.description ? (
                                highlight(product.description, debouncedQ)
                              ) : (
                                <span className="tw-italic">{textStrings.userDashboard.products.card.noDescription}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="tw-mt-4 tw-flex tw-flex-wrap tw-gap-2">
                          {product.size ? (
                            <span className="tw-rounded-full tw-bg-slate-100 dark:tw-bg-slate-900 tw-px-3 tw-py-1 tw-text-xs tw-text-slate-600 dark:tw-text-slate-300">
                              {textStrings.userDashboard.products.card.sizeLabel}: {product.size}
                            </span>
                          ) : null}
                          {product.color ? (
                            <span className="tw-rounded-full tw-bg-slate-100 dark:tw-bg-slate-900 tw-px-3 tw-py-1 tw-text-xs tw-text-slate-600 dark:tw-text-slate-300">
                              {textStrings.userDashboard.products.card.colorLabel}: {product.color}
                            </span>
                          ) : null}
                        </div>

                        <div className="tw-mt-4 tw-flex tw-items-center tw-justify-between tw-gap-3">
                          <div className="tw-text-xs tw-text-slate-500 dark:tw-text-slate-400">
                            {textStrings.userDashboard.products.card.stockLabel}{' '}
                            <strong className={Number(product.stock) <= 3 ? 'tw-text-amber-600' : ''}>{Number(product.stock) || 0}</strong>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDetails(product);
                            }}
                            className="tw-text-xs tw-font-medium tw-text-slate-700 dark:tw-text-slate-200 hover:tw-underline"
                          >
                            {textStrings.userDashboard.products.card.quickView}
                          </button>
                        </div>

                        <div className="tw-mt-4 tw-grid tw-grid-cols-2 tw-gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDetails(product);
                            }}
                            className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-px-4 tw-py-2.5 tw-text-sm tw-font-medium hover:tw-bg-slate-50 dark:hover:tw-bg-slate-900"
                          >
                            {textStrings.userDashboard.products.card.viewDetails}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            disabled={Number(product.stock) <= 0}
                            className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-2xl tw-bg-brand-secondary tw-px-4 tw-py-2.5 tw-text-sm tw-font-medium tw-text-white hover:tw-opacity-95 disabled:tw-cursor-not-allowed disabled:tw-opacity-50"
                          >
                            {Number(product.stock) <= 0 ? textStrings.btns.outOfStock : textStrings.btns.cart}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      <Modal
        open={detailOpen && Boolean(selectedProduct)}
        title={textStrings.userDashboard.products.details.title}
        onClose={() => setDetailOpen(false)}
      >
        {selectedProduct ? (
          <div className="tw-grid tw-max-h-[75vh] tw-overflow-y-auto tw-pr-1 md:tw-grid-cols-[1.1fr_1fr] tw-gap-6">
            <div className="tw-overflow-hidden tw-rounded-3xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-slate-100 dark:tw-bg-slate-900">
              {selectedProduct.image ? (
                <img src={selectedProduct.image} alt={selectedProduct.name} className="tw-h-full tw-w-full tw-object-cover" />
              ) : (
                <div className="tw-flex tw-min-h-[320px] tw-items-center tw-justify-center tw-p-6 tw-text-center tw-text-sm tw-text-slate-500 dark:tw-text-slate-400">
                  {textStrings.userDashboard.products.card.noDescription}
                </div>
              )}
            </div>

            <div>
              <div className="tw-flex tw-items-start tw-justify-between tw-gap-3">
                <div>
                  <div className="tw-text-xs tw-uppercase tw-tracking-[0.18em] tw-text-slate-500 dark:tw-text-slate-400">
                    {selectedProduct.category || textStrings.userDashboard.products.card.uncategorized}
                  </div>
                  <div className="tw-mt-2 tw-text-2xl tw-font-semibold tw-tracking-tight">{selectedProduct.name}</div>
                </div>
                <span
                  className={`tw-inline-flex tw-items-center tw-rounded-full tw-border tw-px-3 tw-py-1 tw-text-xs ${getStockMeta(selectedProduct.stock).className}`}
                >
                  {getStockMeta(selectedProduct.stock).label}
                </span>
              </div>

              <div className="tw-mt-4 tw-text-3xl tw-font-semibold">{money(selectedProduct.price)}</div>

              <div className="tw-mt-5">
                <div className="tw-text-sm tw-font-semibold">{textStrings.userDashboard.products.details.about}</div>
                <div className="tw-mt-2 tw-max-h-40 tw-overflow-y-auto tw-pr-1 tw-text-sm tw-leading-6 tw-text-slate-600 dark:tw-text-slate-300">
                  {selectedProduct.description || textStrings.userDashboard.products.card.noDescription}
                </div>
              </div>

              <div className="tw-mt-5 tw-grid sm:tw-grid-cols-2 tw-gap-3">
                <div className="tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-p-3">
                  <div className="tw-text-xs tw-text-slate-500 dark:tw-text-slate-400">{textStrings.userDashboard.products.details.categoryLabel}</div>
                  <div className="tw-mt-1 tw-font-medium">{selectedProduct.category || textStrings.userDashboard.products.card.uncategorized}</div>
                </div>
                <div className="tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-p-3">
                  <div className="tw-text-xs tw-text-slate-500 dark:tw-text-slate-400">{textStrings.userDashboard.products.details.stockLabel}</div>
                  <div className="tw-mt-1 tw-font-medium">{Number(selectedProduct.stock) || 0}</div>
                </div>
                <div className="tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-p-3">
                  <div className="tw-text-xs tw-text-slate-500 dark:tw-text-slate-400">{textStrings.userDashboard.products.details.sizeLabel}</div>
                  <div className="tw-mt-1 tw-font-medium">{selectedProduct.size || textStrings.common.emDash}</div>
                </div>
                <div className="tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-p-3">
                  <div className="tw-text-xs tw-text-slate-500 dark:tw-text-slate-400">{textStrings.userDashboard.products.details.colorLabel}</div>
                  <div className="tw-mt-1 tw-font-medium">{selectedProduct.color || textStrings.common.emDash}</div>
                </div>
              </div>

              <div className="tw-mt-6 tw-flex tw-flex-wrap tw-gap-3">
                <button
                  type="button"
                  onClick={() => handleAddToCart(selectedProduct)}
                  disabled={Number(selectedProduct.stock) <= 0}
                  className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-2xl tw-bg-brand-secondary tw-px-5 tw-py-3 tw-text-sm tw-font-medium tw-text-white hover:tw-opacity-95 disabled:tw-cursor-not-allowed disabled:tw-opacity-50"
                >
                  {Number(selectedProduct.stock) <= 0 ? textStrings.btns.outOfStock : textStrings.btns.cart}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default ProductsPage;
