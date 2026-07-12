import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./layout.css";

function MainLayout({
  children,
  activePath = "/dashboard",
  onNavigate,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        activePath={activePath}
        onNavigate={onNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="app-shell__content">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="app-main">
          <div className="app-main__container">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;