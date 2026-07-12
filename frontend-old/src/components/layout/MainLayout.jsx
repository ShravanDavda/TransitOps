import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./layout.css";

function MainLayout({ children, activePage, onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (page) => {
    onNavigate(page);
    setSidebarOpen(false);
  };

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation menu"
        />
      )}

      <div className="app-shell__main">
        <Navbar
          activePage={activePage}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="app-shell__content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;