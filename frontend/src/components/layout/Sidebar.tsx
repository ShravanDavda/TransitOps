import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../common/Toast';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Route, 
  Wrench, 
  Fuel, 
  BarChart3, 
  Settings, 
  LogOut, 
  X,
  Compass
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast('Logged out successfully', 'info');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
    { name: 'Vehicles', path: '/vehicles', icon: <Truck className="w-4.5 h-4.5" /> },
    { name: 'Drivers', path: '/drivers', icon: <Users className="w-4.5 h-4.5" /> },
    { name: 'Trips', path: '/trips', icon: <Route className="w-4.5 h-4.5" /> },
    { name: 'Maintenance', path: '/maintenance', icon: <Wrench className="w-4.5 h-4.5" /> },
    { name: 'Fuel & Expenses', path: '/fuel', icon: <Fuel className="w-4.5 h-4.5" /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 className="w-4.5 h-4.5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-4.5 h-4.5" /> }
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col bg-slate-900 text-slate-300 border-r border-slate-800 shadow-xl select-none">
      {/* Top Brand Identity */}
      <div className="px-6 py-5.5 flex items-center justify-between border-b border-slate-800">
        <NavLink to="/" className="flex items-center gap-3 group focus:outline-hidden" onClick={onClose}>
          <div className="p-2 bg-brand-600 text-white rounded-lg shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
            <Compass className="w-5 h-5 animate-spin-slow stroke-[2]" />
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-wide font-display">
              TransitOps
            </span>
            <span className="block text-[9px] font-semibold text-brand-400 tracking-widest uppercase">
              Fleet Commander
            </span>
          </div>
        </NavLink>
        {/* Mobile close trigger */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 group cursor-pointer
              ${isActive 
                ? 'bg-brand-600/10 text-brand-400 border-l-2 border-brand-500 font-semibold' 
                : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
              }
            `}
          >
            <span className="flex-shrink-0 transition-transform duration-150 group-hover:scale-105">
              {item.icon}
            </span>
            <span className="tracking-wide">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User / Account Info Section at bottom */}
      <div className="p-4.5 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 mb-3.5 px-1.5">
          {/* Avatar with initials */}
          <div className="w-9 h-9 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-xs tracking-wider border border-brand-400 shadow-xs">
            {user?.name?.split(' ').map(n => n[0]).join('') || 'SK'}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-white truncate leading-tight">
              {user?.name || 'Guest User'}
            </h4>
            <p className="text-[10px] text-slate-400 truncate mt-0.5 font-medium">
              {user?.role || 'Manager'} • {user?.organization || 'TransitOps'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold text-rose-400 bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10 hover:border-rose-500/25 hover:text-rose-300 transition-all duration-150 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out System</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar Desktop - Fixed & Persistent */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 z-20">
        {sidebarContent}
      </aside>

      {/* Sidebar Mobile Drawer with responsive toggle transitions */}
      <div className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Dark overlay backdrop */}
        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs" onClick={onClose} />
        <div className={`absolute top-0 bottom-0 left-0 w-64 transform transition-transform duration-300 ease-out h-full ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {sidebarContent}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
