import { useState } from "react";
import MainLayout from "./components/layout/MainLayout";

import Dashboard from "./pages/dashboard/Dashboard";
import Vehicles from "./pages/vehicles/Vehicles";
import Drivers from "./pages/drivers/Drivers";
import Trips from "./pages/trips/Trips";
import Maintenance from "./pages/maintenance/Maintenance";
import FuelExpenses from "./pages/fuel/FuelExpenses";
import Analytics from "./pages/analytics/Analytics";
import Settings from "./pages/settings/Settings";

const pages = {
  dashboard: Dashboard,
  vehicles: Vehicles,
  drivers: Drivers,
  trips: Trips,
  maintenance: Maintenance,
  fuel: FuelExpenses,
  analytics: Analytics,
  settings: Settings,
};

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const ActivePage = pages[activePage] || Dashboard;

  return (
    <MainLayout
      activePage={activePage}
      onNavigate={setActivePage}
    >
      <ActivePage />
    </MainLayout>
  );
}

export default App;