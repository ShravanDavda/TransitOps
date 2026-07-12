import {
  Bell,
  ChevronDown,
  Menu,
  Search,
} from "lucide-react";

const pageTitles = {
  dashboard: {
    title: "Dashboard",
    description: "Overview of your fleet operations",
  },
  vehicles: {
    title: "Vehicles",
    description: "Manage and monitor your fleet",
  },
  drivers: {
    title: "Drivers",
    description: "Manage drivers and availability",
  },
  trips: {
    title: "Trips",
    description: "Plan and monitor fleet trips",
  },
  maintenance: {
    title: "Maintenance",
    description: "Track vehicle service and maintenance",
  },
  fuel: {
    title: "Fuel & Expenses",
    description: "Monitor operational costs and expenses",
  },
  analytics: {
    title: "Analytics",
    description: "Review fleet performance and insights",
  },
  settings: {
    title: "Settings",
    description: "Configure your TransitOps workspace",
  },
};

function Navbar({
  activePage = "dashboard",
  onMenuClick,
}) {
  const currentPage =
    pageTitles[activePage] || pageTitles.dashboard;

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button
          type="button"
          className="navbar__menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu size={21} />
        </button>

        <div className="navbar__page-info">
          <h2>{currentPage.title}</h2>
          <p>{currentPage.description}</p>
        </div>
      </div>

      <div className="navbar__right">
        <div className="navbar__search">
          <Search
            size={17}
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <input
            type="search"
            placeholder="Search..."
            aria-label="Search"
          />
        </div>

        <button
          type="button"
          className="navbar__icon-button"
          aria-label="Notifications"
        >
          <Bell size={19} strokeWidth={1.8} />

          <span className="navbar__notification-dot" />
        </button>

        <button
          type="button"
          className="navbar__profile"
        >
          <span className="navbar__avatar">
            AD
          </span>

          <span className="navbar__profile-info">
            <strong>Admin</strong>
            <small>Fleet Manager</small>
          </span>

          <ChevronDown
            size={16}
            strokeWidth={1.8}
          />
        </button>
      </div>
    </header>
  );
}

export default Navbar;