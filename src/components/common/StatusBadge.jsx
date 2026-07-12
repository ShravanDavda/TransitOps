
import "./common.css";

const statusMap = {
  available: "success",
  active: "success",
  completed: "success",
  valid: "success",

  "on trip": "info",
  dispatched: "info",

  pending: "warning",
  "in shop": "warning",
  maintenance: "warning",

  suspended: "danger",
  expired: "danger",
  cancelled: "danger",

  retired: "neutral",
  draft: "neutral",
  "off duty": "neutral",
};

function StatusBadge({ status = "Unknown", className = "" }) {
  const normalizedStatus = String(status).toLowerCase();
  const variant = statusMap[normalizedStatus] || "neutral";

  return (
    <span
      className={ui-status ui-status--${variant} ${className}}
    >
      <span className="ui-status__dot" />
      {status}
    </span>
  );
}

export default StatusBadge;
