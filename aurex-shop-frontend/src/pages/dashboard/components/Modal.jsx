import { useEffect } from 'react';

const Modal = ({ open, title, onClose, children }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="tw-fixed tw-inset-0 tw-z-[1000] tw-grid tw-place-items-center tw-p-4">
      <button type="button" aria-label="Close modal" onClick={onClose} className="tw-absolute tw-inset-0 tw-bg-black/40" />
      <div className="tw-relative tw-w-[min(780px,100%)] tw-rounded-3xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-shadow-soft">
        <div className="tw-flex tw-items-center tw-justify-between tw-gap-3 tw-border-b tw-border-slate-200 dark:tw-border-slate-800 tw-px-5 tw-py-4">
          <div className="tw-font-semibold">{title}</div>
          <button
            type="button"
            onClick={onClose}
            className="tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-px-3 tw-py-1 tw-text-sm"
          >
            Close
          </button>
        </div>
        <div className="tw-p-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

