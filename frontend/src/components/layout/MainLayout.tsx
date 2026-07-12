import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ringPos, setRingPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDesktop, setIsHoverableDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Responsive mobile toggle menu helper
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Monitor prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Monitor hoverable device (precise mouse pointer required, Section 36)
  useEffect(() => {
    const preciseMouse = window.matchMedia('(pointer: fine)');
    setIsHoverableDevice(preciseMouse.matches);
    const listener = (e: MediaQueryListEvent) => setIsHoverableDevice(e.matches);
    preciseMouse.addEventListener('change', listener);
    return () => preciseMouse.removeEventListener('change', listener);
  }, []);

  // Tracking desktop cursor position (Section 36)
  useEffect(() => {
    if (!isDesktop || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    // Expand cursor on hovering interactive items
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.closest('button') || 
        target.closest('a') || 
        target.closest('input') || 
        target.closest('select') || 
        target.closest('tr') || 
        target.closest('.card-hover-effect');
      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isDesktop, prefersReducedMotion]);

  // Secondary ring lag follow loop (RequestAnimationFrame for optimal GPU rendering, Section 36)
  useEffect(() => {
    if (!isDesktop || prefersReducedMotion) return;

    let frameId: number;
    const followCursor = () => {
      setRingPos((prev) => {
        // Calculate incremental distance with damping multiplier
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15
        };
      });
      frameId = requestAnimationFrame(followCursor);
    };
    frameId = requestAnimationFrame(followCursor);

    return () => cancelAnimationFrame(frameId);
  }, [mousePos, isDesktop, prefersReducedMotion]);

  return (
    <div className={`min-h-screen bg-slate-50 flex ${isHovering ? 'custom-cursor-hover' : ''}`}>
      {/* Desktop Custom Cursor Elements */}
      {isDesktop && !prefersReducedMotion && (
        <>
          <div 
            className="custom-cursor-dot" 
            style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }} 
          />
          <div 
            className="custom-cursor-ring" 
            style={{ left: `${ringPos.x}px`, top: `${ringPos.y}px` }} 
          />
        </>
      )}

      {/* Main navigation shell */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Primary content area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Navbar onMenuToggle={toggleSidebar} />
        
        {/* Main page content layout grid (Cinematic Grid Background, Section 36) */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:p-6 lg:p-8 max-w-7xl mx-auto w-full relative cinematic-grid animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
