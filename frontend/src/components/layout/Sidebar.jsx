import {
  BarChart3,
  Fuel,
  LayoutDashboard,
  Route,
  Settings,
  Truck,
  Users,
  Wrench,
  X,
} from "lucide-react";

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "vehicles",
    label: "Vehicles",
    icon: Truck,
  },
  {
    id: "drivers",
    label: "Drivers",
    icon: Users,
  },
  {
    id: "trips",
    label: "Trips",
    icon: Route,
  },
  {
    id: "maintenance",
    label: "Maintenance",
    icon: Wrench,
  },
  {
    id: "fuel",
    label: "Fuel & Expenses",
    icon: Fuel,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
  },
];

function Sidebar({
  activePage,
  onNavigate,
  isOpen = false,
  onClose,
}) {
  return (
    <aside
      className={`sidebar ${
        isOpen ? "sidebar--open" : ""
      }`}
    >
      <div className="sidebar__header">
        <div className="sidebar__brand">
          <div className="sidebar__brand-icon">
            <Truck size={21} strokeWidth={2} />
          </div>

          <div className="sidebar__brand-text">
            <strong>TransitOps</strong>
            <span>Fleet Management</span>
          </div>
        </div>

        <button
          type="button"
          className="sidebar__close"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          <X size={20} />
        </button>
      </div>

      <div className="sidebar__section-label">
        Operations
      </div>

      <nav
        className="sidebar__navigation"
        aria-label="Main navigation"
      >
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar__item ${
                isActive ? "sidebar__item--active" : ""
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon
                size={19}
                strokeWidth={isActive ? 2.2 : 1.8}
              />

              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar__footer">
        <button
          type="button"
          className={`sidebar__item ${
            activePage === "settings"
              ? "sidebar__item--active"
              : ""
          }`}
          onClick={() => onNavigate("settings")}
        >
          <Settings
            size={19}
            strokeWidth={
              activePage === "settings" ? 2.2 : 1.8
            }
          />

          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;