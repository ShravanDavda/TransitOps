function Button({
  children,
  variant = "primary",
  size = "medium",
  type = "button",
  icon: Icon,
  disabled = false,
  loading = false,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={ui-button ui-button--${variant} ui-button--${size} ${className}}
      {...props}
    >
      {loading && <span className="ui-button__spinner" />}

      {!loading && Icon && (
        <Icon size={17} strokeWidth={2} aria-hidden="true" />
      )}

      <span>{loading ? "Please wait..." : children}</span>
    </button>
  );
}

export default Button;