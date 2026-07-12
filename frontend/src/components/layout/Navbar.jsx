import { Bell, ChevronDown, Menu, Search } from "lucide-react";

function Navbar({
  onMenuClick,
  userName = "Fleet Manager",
  userRole = "Administrator",
}) {
  const initials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button
          type="button"
          className="navbar__menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="navbar__search">
          <Search
            className="navbar__search-icon"
            size={18}
            strokeWidth={1.8}
          />

          <input
            type="search"
            placeholder="Search fleet operations..."
            aria-label="Search fleet operations"
          />
        </div>
      </div>

      <div className="navbar__actions">
        <button
          type="button"
          className="navbar__notification-button"
          aria-label="Notifications"
        >
          <Bell size={20} strokeWidth={1.8} />
          <span className="navbar__notification-dot" />
        </button>

        <div className="navbar__divider" />

        <button type="button" className="navbar__profile">
          <div className="navbar__avatar">{initials}</div>

          <div className="navbar__user-info">
            <span className="navbar__user-name">{userName}</span>
            <span className="navbar__user-role">{userRole}</span>
          </div>

          <ChevronDown
            className="navbar__profile-chevron"
            size={17}
            strokeWidth={1.8}
          />
        </button>
      </div>
    </header>
  );
}

export default Navbar;