import Button from '../../Button';

const Modal = ({ open, title, onClose, children, footer }) => {
  if (!open) return null;

  return (
    <div className="mdModalOverlay" role="presentation" onClick={onClose}>
      <div className="mdModal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="mdModal__header">
          <div className="mdModal__title">{title}</div>
          <Button variant="outline" onClick={onClose} aria-label="Close modal">
            Close
          </Button>
        </div>
        <div className="mdModal__body">{children}</div>
        {footer ? <div className="mdModal__footer">{footer}</div> : null}
      </div>
    </div>
  );
};

export default Modal;

