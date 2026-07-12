import "./common.css";

function Select({
  label,
  options = [],
  error,
  placeholder = "Select an option",
  id,
  className = "",
  ...props
}) {
  const selectId =
    id  `select-${label?.toLowerCase().replace(/\s+/g, "-") 
 "field"};

  return (
    <div className={ui-field ${className}}>
      {label && (
        <label className="ui-field__label" htmlFor={selectId}>
          {label}
        </label>
      )}

      <select
        id={selectId}
        className={ui-select ${error ? "ui-input--error" : ""}`}
        {...props}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => {
          const value =
            typeof option === "string" ? option : option.value;

          const optionLabel =
            typeof option === "string" ? option : option.label;

          return (
            <option key={value} value={value}>
              {optionLabel}
            </option>
          );
        })}
      </select>

      {error && <span className="ui-field__error">{error}</span>}
    </div>
  );
}

export default Select;
