
import { Inbox } from "lucide-react";
import "./common.css";

function EmptyState({
  icon: Icon = Inbox,
  title = "No data found",
  description = "There is nothing to display yet.",
  action,
}) {
  return (
    <div className="ui-empty-state">
      <div className="ui-empty-stateicon">
        <Icon size={26} strokeWidth={1.7} />
      </div>

      <h3>{title}</h3>
      <p>{description}</p>

      {action && <div className="ui-empty-stateaction">{action}</div>}
    </div>
  );
}

export default EmptyState;
