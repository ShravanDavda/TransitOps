
import { Search, X } from "lucide-react";
import "./common.css";

function SearchBar({
  value = "",
  onChange,
  onClear,
  placeholder = "Search...",
  className = "",
}) {
  return (
    <div className={ui-search ${className}}>
      <Search
        className="ui-searchicon"
        size={18}
        strokeWidth={1.8}
        aria-hidden="true"
      />

      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="ui-searchinput"
        aria-label={placeholder}
      />

      {value && onClear && (
        <button
          type="button"
          className="ui-search__clear"
          onClick={onClear}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
