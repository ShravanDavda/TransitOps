import "./common.css";

function Input({
  label,
  error,
  helperText,
  id,
  className = "",
  ...props
}) {
  const inputId =
    id  `input-${label?.toLowerCase().replace(/\s+/g, "-") 
 "field"};

  return (
    <div className={ui-field ${className}}>
      {label && (
        <label className="ui-field__label" htmlFor={inputId}>
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={ui-input ${error ? "ui-input--error" : ""}`}
        {...props}
      />

      {error ? (
        <span className="ui-fielderror">{error}</span>
      ) : helperText ? (
        <span className="ui-fieldhelper">{helperText}</span>
      ) : null}
    </div>
  );
}

export default Input;