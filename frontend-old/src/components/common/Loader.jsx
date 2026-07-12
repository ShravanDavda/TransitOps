
import "./common.css";

function Loader({
  size = "medium",
  label = "Loading...",
  fullPage = false,
}) {
  return (
    <div
      className={ui-loader-container ${
        fullPage ? "ui-loader-container--full" : ""
      }}
      role="status"
    >
      <span className={ui-loader ui-loader--${size}} />
      {label && <span className="ui-loader__label">{label}</span>}
    </div>
  );
}

export default Loader;
