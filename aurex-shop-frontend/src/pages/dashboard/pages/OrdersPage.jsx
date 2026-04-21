import React, { useEffect, useMemo, useState } from 'react';
import Skeleton from '../components/Skeleton';
import Modal from '../components/Modal';
// import { Order } from '../../../services/types';
import { useNotifications } from '../../../context/NotificationsContext';
import { useCommerceData } from '../../../context/CommerceDataContext';
import { textStrings } from '../../../constants/textStrings';

const money = (n) => {
  const value = Number(n) || 0;
  return `${textStrings.currency.symbol}${value.toLocaleString()}`;
};

const statusClass = (status) => {
  const s = (status || '').toLowerCase();
  if (s.includes('deliver') || s.includes('complete')) return 'tw-bg-emerald-600 tw-text-white';
  if (s.includes('ship')) return 'tw-bg-blue-600 tw-text-white';
  if (s.includes('cancel')) return 'tw-bg-rose-600 tw-text-white';
  return 'tw-bg-amber-600 tw-text-white';
};

const buildInvoiceHtml = (o) => {
  const invoice = textStrings.userDashboard.orders.invoice;
  const rows = (o.items || [])
    .map(
      (it) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;">${it.name}</td><td style="padding:8px 0;border-bottom:1px solid #eee; text-align:right;">${it.qty}</td><td style="padding:8px 0;border-bottom:1px solid #eee; text-align:right;">${textStrings.currency.symbol}${Number(
          it.price || 0
        ).toFixed(
          2
        )}</td></tr>`
    )
    .join('');

  return `<!doctype html>
  <html><head><meta charset="utf-8"><title>${invoice.documentTitle}</title></head>
  <body style="font-family: ui-sans-serif, system-ui; padding:24px; max-width: 900px; margin: 0 auto;">
    <h1 style="margin:0 0 8px;">${invoice.storeName}</h1>
    <div style="color:#555; margin-bottom:24px;">${invoice.subtitle(String(o.id).slice(-6))}</div>
    <div style="display:flex; justify-content:space-between; gap:12px; margin-bottom: 18px;">
      <div><strong>${invoice.labels.date}</strong><div>${o.createdAt || ''}</div></div>
      <div><strong>${invoice.labels.status}</strong><div>${o.status || ''}</div></div>
      <div><strong>${invoice.labels.total}</strong><div>${money(o.total)}</div></div>
    </div>
    <table style="width:100%; border-collapse:collapse;">
      <thead><tr><th style="text-align:left;border-bottom:2px solid #111;padding:8px 0;">${invoice.table.item}</th><th style="text-align:right;border-bottom:2px solid #111;padding:8px 0;">${invoice.table.qty}</th><th style="text-align:right;border-bottom:2px solid #111;padding:8px 0;">${invoice.table.price}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="margin-top:18px; text-align:right; font-size: 18px;"><strong>${invoice.totalLine(money(o.total))}</strong></div>
    <script>window.onload = () => window.print();</script>
  </body></html>`;
};

const OrdersPage = () => {
  const notifs = useNotifications();
  const data = useCommerceData();
  const [selected, setSelected] = useState  (null);

  useEffect(() => {
    if (data.orders.status !== 'ready') return;
    if (!data.orders.data.length) return;
    const latest = data.orders.data[0];
    notifs.push({
      title: textStrings.userDashboard.orders.notifications.syncedTitle,
      message: textStrings.userDashboard.orders.notifications.syncedMessage(String(latest.id).slice(-6), latest.status),
      read: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.orders.status]);

  const loading = data.orders.status === 'loading' || data.orders.status === 'idle';
  const error = data.orders.status === 'error' ? data.orders.error : '';
  const orders = data.orders.data;

  const totals = useMemo(() => {
    const totalSpent = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const pending = orders.filter((o) => (o.status || '').toLowerCase().includes('pending')).length;
    return { totalSpent, pending };
  }, [orders]);

  return (
    <div className="tw-grid tw-gap-4">
      <div className="tw-rounded-3xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-p-5 tw-shadow-soft">
        <div className="tw-flex tw-items-end tw-justify-between tw-gap-3 tw-flex-wrap">
          <div>
            <div className="tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.orders.header.kicker}</div>
            <div className="tw-text-lg tw-font-semibold">{textStrings.userDashboard.orders.header.title}</div>
          </div>
          <div className="tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">
            {textStrings.userDashboard.orders.summary.totalSpentLabel} <strong>{money(totals.totalSpent)}</strong> {textStrings.common.dotSeparator}{' '}
            {textStrings.userDashboard.orders.summary.pendingLabel} <strong>{totals.pending}</strong>
          </div>
        </div>
      </div>

      <div className="tw-rounded-3xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-p-5 tw-shadow-soft">
        {loading ? (
          <div className="tw-grid tw-gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="tw-h-16" />
            ))}
          </div>
        ) : error ? (
          <div className="tw-text-sm tw-text-rose-600">{error}</div>
        ) : orders.length === 0 ? (
          <div className="tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">
            {textStrings.userDashboard.orders.empty.prefix}{' '}
            <a className="tw-underline" href="#/shop">
              {textStrings.userDashboard.orders.empty.browseLink}
            </a>
          </div>
        ) : (
          <div className="tw-overflow-x-auto">
            <table className="tw-w-full tw-text-sm">
              <thead>
                <tr className="tw-text-left tw-text-slate-600 dark:tw-text-slate-300">
                  <th className="tw-py-3">{textStrings.userDashboard.orders.table.headers.order}</th>
                  <th className="tw-py-3">{textStrings.userDashboard.orders.table.headers.date}</th>
                  <th className="tw-py-3">{textStrings.userDashboard.orders.table.headers.status}</th>
                  <th className="tw-py-3 tw-text-right">{textStrings.userDashboard.orders.table.headers.total}</th>
                  <th className="tw-py-3 tw-text-right">{textStrings.userDashboard.orders.table.headers.actions}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="tw-border-t tw-border-slate-200 dark:tw-border-slate-800">
                    <td className="tw-py-3 tw-font-medium">#{String(o.id).slice(-6)}</td>
                    <td className="tw-py-3 tw-text-slate-600 dark:tw-text-slate-300">{o.createdAt}</td>
                    <td className="tw-py-3">
                      <span className={['tw-inline-flex tw-items-center tw-rounded-full tw-px-3 tw-py-1 tw-text-xs', statusClass(o.status)].join(' ')}>
                        {o.status}
                      </span>
                    </td>
                    <td className="tw-py-3 tw-text-right">{money(o.total)}</td>
                    <td className="tw-py-3 tw-text-right">
                      <button
                        type="button"
                        onClick={() => setSelected(o)}
                        className="tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-px-3 tw-py-1 tw-text-xs hover:tw-bg-slate-50 dark:hover:tw-bg-slate-900"
                      >
                        {textStrings.userDashboard.orders.table.view}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={Boolean(selected)} title={textStrings.userDashboard.orders.details.modalTitle} onClose={() => setSelected(null)}>
        {selected ? (
          <div className="tw-grid tw-gap-4">
            <div className="tw-flex tw-items-center tw-justify-between tw-gap-3 tw-flex-wrap">
              <div>
                <div className="tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.orders.details.orderLabel}</div>
                <div className="tw-text-lg tw-font-semibold">#{String(selected.id).slice(-6)}</div>
              </div>
              <div className="tw-text-sm">
                <span className={['tw-inline-flex tw-items-center tw-rounded-full tw-px-3 tw-py-1 tw-text-xs', statusClass(selected.status)].join(' ')}>
                  {selected.status}
                </span>
              </div>
            </div>

            <div className="tw-grid md:tw-grid-cols-3 tw-gap-3">
              <div className="tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-p-4">
                <div className="tw-text-xs tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.orders.details.cards.date}</div>
                <div className="tw-font-medium">{selected.createdAt}</div>
              </div>
              <div className="tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-p-4">
                <div className="tw-text-xs tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.orders.details.cards.items}</div>
                <div className="tw-font-medium">{selected.items?.length || 0}</div>
              </div>
              <div className="tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-p-4">
                <div className="tw-text-xs tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.orders.details.cards.total}</div>
                <div className="tw-font-medium">{money(selected.total)}</div>
              </div>
            </div>

            <div className="tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-p-4">
              <div className="tw-text-sm tw-font-semibold">{textStrings.userDashboard.orders.details.itemsTitle}</div>
              <div className="tw-mt-2 tw-grid tw-gap-2">
                {(selected.items || []).map((it, idx) => (
                  <div key={`${it.name}-${idx}`} className="tw-flex tw-items-center tw-justify-between tw-gap-3 tw-text-sm">
                    <div className="tw-min-w-0">
                      <div className="tw-font-medium tw-truncate">{it.name}</div>
                      <div className="tw-text-xs tw-text-slate-600 dark:tw-text-slate-300">
                        {textStrings.userDashboard.orders.details.qtyLabel} {it.qty} {textStrings.common.dotSeparator}{' '}
                        {textStrings.userDashboard.orders.details.unitLabel} {money(it.price)}
                      </div>
                    </div>
                    <div className="tw-font-semibold">{money(Number(it.qty || 0) * Number(it.price || 0))}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tw-flex tw-justify-end tw-gap-2">
              <button
                type="button"
                className="tw-rounded-2xl tw-bg-brand-secondary tw-text-white tw-px-4 tw-py-2 tw-text-sm"
                onClick={() => {
                  const w = window.open('', '_blank');
                  if (!w) return;
                  w.document.open();
                  w.document.write(buildInvoiceHtml(selected));
                  w.document.close();
                }}
              >
                {textStrings.userDashboard.orders.details.downloadInvoice}
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default OrdersPage;
