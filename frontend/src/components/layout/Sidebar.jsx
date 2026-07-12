import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  ChartNoAxesCombined,
  Settings,
  X,
} from "lucide-react";

const navigationItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Vehicles",
    icon: Truck,
    path: "/vehicles",
  },
  {
    label: "Drivers",
    icon: Users,
    path: "/drivers",
  },
  {
    label: "Trips",
    icon: Route,
    path: "/trips",
  },
  {
    label: "Maintenance",
    icon: Wrench,
    path: "/maintenance",
  },
  {
    label: "Fuel & Expenses",
    icon: Fuel,
    path: "/fuel-expenses",
  },
  {
    label: "Analytics",
    icon: ChartNoAxesCombined,
    path: "/analytics",
  },
];

function Sidebar({
  activePath = "/dashboard",
  onNavigate,
  isOpen = false,
  onClose,
}) {
  const handleNavigation = (path) => {
    if (onNavigate) {
      onNavigate(path);
    }

    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={onClose}
          className="sidebar-overlay"
        />
      )}

      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar__brand">
          <div className="sidebar__brand-icon">
            <Truck size={22} />
          </div>

          <div>
            <h1 className="sidebar__brand-title">TransitOps</h1>
            <p className="sidebar__brand-subtitle">Fleet Intelligence</p>
          </div>

          <button
            type="button"
            className="sidebar__close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar__navigation" aria-label="Main navigation">
          <p className="sidebar__section-label">OPERATIONS</p>

          <div className="sidebar__nav-list">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePath === item.path;

              return (
                <button
                  key={item.path}
                  type="button"
                  className={`sidebar__nav-item ${
                    isActive ? "sidebar__nav-item--active" : ""
                  }`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <Icon size={19} strokeWidth={1.8} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="sidebar__footer">
          <button
            type="button"
            className={`sidebar__nav-item ${
              activePath === "/settings"
                ? "sidebar__nav-item--active"
                : ""
            }`}
            onClick={() => handleNavigation("/settings")}
          >
            <Settings size={19} strokeWidth={1.8} />
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;