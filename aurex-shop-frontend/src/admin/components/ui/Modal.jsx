import { useEffect } from 'react';

const Modal = ({ title, open, onClose, children, footer }) => {
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="uiModalOverlay" role="presentation" onMouseDown={onClose}>
      <div
        className="uiModal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="uiModalHeader">
          <h3>{title}</h3>
          <button className="uiButton uiButton--ghost" type="button" onClick={onClose}>
            Close
          </button>
        </header>
        <div className="uiModalBody">{children}</div>
        {footer ? <footer className="uiModalFooter">{footer}</footer> : null}
      </div>
    </div>
  );
};

export default Modal;

