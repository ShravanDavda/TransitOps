import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, Search, Globe, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface NavbarProps {
  onMenuToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  // Derive page title from path
  const getPageTitleAndBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/') return { title: 'Operational Command', breadcrumb: 'Dashboard' };
    if (path.startsWith('/vehicles')) return { title: 'Fleet Management', breadcrumb: 'Vehicles' };
    if (path.startsWith('/drivers')) return { title: 'Driver Operations', breadcrumb: 'Drivers' };
    if (path.startsWith('/trips')) return { title: 'Dispatch & Trips Control', breadcrumb: 'Trips' };
    if (path.startsWith('/maintenance')) return { title: 'Maintenance Logs', breadcrumb: 'Maintenance' };
    if (path.startsWith('/fuel')) return { title: 'Operational Costs', breadcrumb: 'Expenses' };
    if (path.startsWith('/analytics')) return { title: 'Fleet Performance', breadcrumb: 'Analytics' };
    if (path.startsWith('/settings')) return { title: 'System Configurations', breadcrumb: 'Settings' };
    return { title: 'System Hub', breadcrumb: '404 Error' };
  };

  const { title, breadcrumb } = getPageTitleAndBreadcrumbs();

  const mockAlerts = [
    { id: 1, text: 'Vehicle GJ-05-PQ-7788 next service is overdue.', type: 'error' },
    { id: 2, text: 'Driver Sandeep Singh license expires in 12 days.', type: 'warning' },
    { id: 3, text: 'Trip TRP-001 departure delayed by 20 mins.', type: 'info' }
  ];

  return (
    <header className="sticky top-0 z-30 h-16.5 bg-white border-b border-slate-150 px-4 md:px-6 flex items-center justify-between shadow-xs">
      {/* Left Area: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-hidden cursor-pointer"
          aria-label="Toggle Mobile Menu"
        >
          <Menu className="w-5 h-5 stroke-[2.2]" />
        </button>

        <div>
          {/* Breadcrumbs */}
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>TransitOps</span>
            <ChevronRight className="w-3 h-3 text-slate-300 stroke-[2.5]" />
            <span className="text-brand-500">{breadcrumb}</span>
          </div>

          <h1 className="text-base md:text-lg font-bold text-slate-800 tracking-tight mt-0.5 font-display leading-none">
            {title}
          </h1>
        </div>
      </div>

      {/* Right Area: Actions, Search, Notifications, Avatar */}
      <div className="flex items-center gap-3.5">
        {/* Connection status badge (clean/professional, not larping) */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-bold text-emerald-700 tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Operations Live</span>
        </div>

        {/* Dynamic Alerts notification dropdown trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50/20 transition-all cursor-pointer relative"
          >
            <Bell className="w-4.5 h-4.5 stroke-[2]" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full animate-bounce" />
          </button>

          {/* Notifications Dropdown Container */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2.5 w-80 md:w-90 bg-white rounded-xl border border-slate-150 shadow-lg z-40 py-2 animate-fade-in">
                <div className="px-4.5 py-2.5 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">
                    Operational Alerts
                  </span>
                  <span className="text-[10px] bg-rose-50 text-rose-600 font-bold px-1.5 py-0.5 rounded border border-rose-100">
                    {mockAlerts.length} Action Items
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                  {mockAlerts.map((alert) => (
                    <div key={alert.id} className="p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                      <span className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0
                        ${alert.type === 'error' ? 'bg-rose-500' : ''}
                        ${alert.type === 'warning' ? 'bg-amber-500' : ''}
                        ${alert.type === 'info' ? 'bg-blue-500' : ''}
                      `} />
                      <p className="text-xs font-medium text-slate-600 leading-relaxed">
                        {alert.text}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="px-4.5 py-2.5 border-t border-slate-100 text-center bg-slate-50/50">
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-[10px] font-bold text-brand-600 hover:text-brand-700 uppercase tracking-wider focus:outline-hidden cursor-pointer"
                  >
                    Close Notification Center
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User profile avatar (compact) */}
        <div className="flex items-center gap-2.5 pl-1.5 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shadow-2xs select-none">
            {user?.name?.split(' ').map(n => n[0]).join('') || 'SK'}
          </div>
          <div className="hidden sm:block leading-tight text-left select-none">
            <span className="block text-xs font-semibold text-slate-800">
              {user?.name || 'Director'}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              HQ Control Station
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
