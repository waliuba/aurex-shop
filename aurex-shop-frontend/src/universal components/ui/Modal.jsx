import Btn from './btns';
import './modal.css';

const Modal = ({ open, title, onClose, children, footer }) => {
  if (!open) return null;

  return (
    <div className="uModalOverlay" role="presentation" onClick={onClose}>
      <div className="uModal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="uModal__header">
          <div className="uModal__title">{title}</div>
          <Btn variant="ghost" onClick={onClose} aria-label="Close modal">
            Close
          </Btn>
        </div>
        <div className="uModal__body">{children}</div>
        {footer ? <div className="uModal__footer">{footer}</div> : null}
      </div>
    </div>
  );
};

export default Modal;

