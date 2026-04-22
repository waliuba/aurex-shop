import { useMemo } from 'react';
import StatCard from '../components/StatCard';
import Skeleton from '../components/Skeleton';
import MiniLineChart from '../components/charts/MiniLineChart';
import { useCommerceData } from '../../../context/CommerceDataContext';
import { textStrings } from '../../../constants/textStrings';

const money = (n) => {
  const value = Number(n) || 0;
  return `${textStrings.currency.symbol}${value.toLocaleString()}`;
};

const groupByMonth = (orders) => {
  const map = new Map();
  (orders || []).forEach((o) => {
    const month = (o.createdAt || '').slice(0, 7) || 'unknown';
    const entry = map.get(month) || { label: month, value: 0, count: 0 };
    entry.value += Number(o.total || 0);
    entry.count += 1;
    map.set(month, entry);
  });
  return Array.from(map.values()).sort((a, b) => (a.label > b.label ? 1 : -1));
};

const OverviewPage = () => {
  const data = useCommerceData();

  const metrics = useMemo(() => {
    if (data.orders.status !== 'ready' || data.products.status !== 'ready') return null;
    const orders = data.orders.data || [];

    const totalOrders = orders.length;
    const totalSpending = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const accountStatus =
      totalOrders >= textStrings.userDashboard.overview.accountStatus.activeMinOrders
        ? textStrings.userDashboard.overview.accountStatus.active
        : textStrings.userDashboard.overview.accountStatus.new;

    const revenueByMonth = groupByMonth(orders).slice(-6);
    const chartData = revenueByMonth.map((m) => ({
      label: m.label,
      value: Math.round(m.value),
    }));

    const prev = revenueByMonth[revenueByMonth.length - 2];
    const last = revenueByMonth[revenueByMonth.length - 1];
    const monthDelta =
      prev && last && prev.value > 0 ? Math.round(((last.value - prev.value) / prev.value) * 100) : 0;

    const productById = new Map((data.products.data || []).map((p) => [p.id, p]));
    const categoryCounts = new Map();
    orders.forEach((o) => {
      (o.items || []).forEach((it) => {
        const productId = it.product || '';
        const p = productById.get(productId);
        const category = p?.category || textStrings.userDashboard.products.card.uncategorized;
        categoryCounts.set(category, (categoryCounts.get(category) || 0) + Number(it.qty || 0));
      });
    });
    const topCategory =
      Array.from(categoryCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || textStrings.common.emDash;

    const recent = orders.slice(0, 6).map((o) => ({
      id: o.id,
      at: o.createdAt,
      message: textStrings.userDashboard.overview.recent.orderStatus(String(o.id).slice(-6), o.status),
    }));

    return { totalOrders, totalSpending, accountStatus, chartData, monthDelta, topCategory, recent };
  }, [data.orders.status, data.orders.data, data.products.status, data.products.data]);

  if (
    data.orders.status === 'loading' ||
    data.products.status === 'loading' ||
    data.orders.status === 'idle' ||
    data.products.status === 'idle'
  ) {
    return (
      <div className="tw-grid tw-gap-4">
        <div className="tw-grid md:tw-grid-cols-3 tw-gap-4">
          <Skeleton className="tw-h-28" />
          <Skeleton className="tw-h-28" />
          <Skeleton className="tw-h-28" />
        </div>
        <Skeleton className="tw-h-56" />
        <Skeleton className="tw-h-56" />
      </div>
    );
  }

  if (data.orders.status === 'error' || data.products.status === 'error' || !metrics) {
    const error =
      data.orders.status === 'error'
        ? data.orders.error
        : data.products.status === 'error'
          ? data.products.error
          : '';

    return (
      <div className="tw-rounded-3xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-p-6">
        <div className="tw-font-semibold">{textStrings.userDashboard.overview.errors.couldNotLoad}</div>
        <div className="tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">{error}</div>
        <div className="tw-mt-4">
          <a className="tw-underline" href="#/dashboard">
            {textStrings.userDashboard.overview.actions.retry}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="tw-grid tw-gap-4">
      <div className="tw-grid md:tw-grid-cols-3 tw-gap-4">
        <StatCard
          label={textStrings.userDashboard.overview.cards.totalOrders}
          value={metrics.totalOrders}
          hint={textStrings.userDashboard.overview.cards.allTime}
        />
        <StatCard
          label={textStrings.userDashboard.overview.cards.totalSpending}
          value={money(metrics.totalSpending)}
          hint={textStrings.userDashboard.overview.cards.allTime}
        />
        <StatCard
          label={textStrings.userDashboard.overview.cards.accountStatus}
          value={metrics.accountStatus}
          hint={
            metrics.accountStatus === textStrings.userDashboard.overview.accountStatus.new
              ? textStrings.userDashboard.overview.cards.accountStatusHints.new
              : textStrings.userDashboard.overview.cards.accountStatusHints.active
          }
        />
      </div>

      <div className="tw-grid lg:tw-grid-cols-3 tw-gap-4">
        <div className="tw-rounded-3xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-p-5 tw-shadow-soft lg:tw-col-span-2">
          <div className="tw-flex tw-items-end tw-justify-between tw-gap-3 tw-flex-wrap">
            <div>
              <div className="tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.overview.trend.kicker}</div>
              <div className="tw-text-lg tw-font-semibold">{textStrings.userDashboard.overview.trend.title}</div>
            </div>
            <div className="tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">
              {textStrings.userDashboard.overview.trend.monthlyChangeLabel}{' '}
              <strong className={metrics.monthDelta >= 0 ? 'tw-text-emerald-600' : 'tw-text-rose-600'}>
                {metrics.monthDelta >= 0 ? '+' : ''}
                {metrics.monthDelta}%
              </strong>
            </div>
          </div>

          <div className="tw-mt-3 tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-p-3">
            <MiniLineChart data={metrics.chartData} />
            <div className="tw-mt-2 tw-flex tw-justify-between tw-text-[11px] tw-text-slate-500 dark:tw-text-slate-400">
              {metrics.chartData.map((d) => (
                <span key={d.label}>{d.label.slice(5)}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="tw-rounded-3xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-p-5 tw-shadow-soft">
          <div className="tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.overview.insights.kicker}</div>
          <div className="tw-mt-1 tw-font-semibold">{textStrings.userDashboard.overview.insights.mostPurchasedCategory}</div>
          <div className="tw-mt-2 tw-text-2xl tw-font-semibold tw-tracking-tight">{metrics.topCategory}</div>
          <div className="tw-mt-4 tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">
            {textStrings.userDashboard.overview.insights.tip}
          </div>
          <div className="tw-mt-4">
            <a
              className="tw-inline-flex tw-items-center tw-gap-2 tw-rounded-2xl tw-bg-brand-secondary tw-text-white tw-px-4 tw-py-2 tw-text-sm"
              href="#/dashboard/products"
            >
              {textStrings.userDashboard.overview.insights.browseShop} <span aria-hidden="true">{textStrings.common.arrowRight}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="tw-rounded-3xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-p-5 tw-shadow-soft">
        <div className="tw-flex tw-items-center tw-justify-between tw-gap-3 tw-flex-wrap">
          <div>
            <div className="tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.overview.activity.kicker}</div>
            <div className="tw-text-lg tw-font-semibold">{textStrings.userDashboard.overview.activity.title}</div>
          </div>
          <a className="tw-text-sm tw-underline" href="#/dashboard/orders">
            {textStrings.userDashboard.overview.activity.viewAllOrders}
          </a>
        </div>

        <div className="tw-mt-3 tw-grid tw-gap-2">
          {metrics.recent.length ? (
            metrics.recent.map((a) => (
              <div
                key={a.id}
                className="tw-flex tw-items-center tw-justify-between tw-gap-3 tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-px-4 tw-py-3"
              >
                <div className="tw-text-sm">{a.message}</div>
                <div className="tw-text-xs tw-text-slate-500 dark:tw-text-slate-400">{a.at}</div>
              </div>
            ))
          ) : (
            <div className="tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.overview.activity.empty}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
