
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import "./common.css";

const toastIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

function Toast({
  type = "info",
  title,
  message,
  onClose,
}) {
  const Icon = toastIcons[type] || Info;

  return (
    <div className={ui-toast ui-toast--${type}} role="status">
      <div className="ui-toasticon">
        <Icon size={20} />
      </div>

      <div className="ui-toastcontent">
        {title && <strong>{title}</strong>}
        {message && <p>{message}</p>}
      </div>

      {onClose && (
        <button
          type="button"
          className="ui-toast__close"
          onClick={onClose}
          aria-label="Close notification"
        >
          <X size={17} />
        </button>
      )}
    </div>
  );
}

export default Toast;
