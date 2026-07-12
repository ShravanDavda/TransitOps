
import { X } from "lucide-react";
import "./common.css";

function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "medium",
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="ui-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        className={ui-modal ui-modal--${size}}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ui-modal-title"
      >
        <div className="ui-modalheader">
          <div>
            <h2 id="ui-modal-title">{title}</h2>

            {description && <p>{description}</p>}
          </div>

          <button
            type="button"
            className="ui-icon-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="ui-modalbody">{children}</div>

        {footer && <div className="ui-modal__footer">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
