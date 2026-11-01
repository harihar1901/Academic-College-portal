import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  User as UserIcon, 
  ShieldCheck, 
  GraduationCap, 
  LogOut,
  ChevronDown, 
  LayoutDashboard,
  Home,
  Layers,
  Calendar,
  Building2,
  Compass,
  Sparkles
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { UserRole } from '../types';
import Dock, { DockItemData } from './Dock';

interface NavbarProps {
  onOpenAuth: (initialMode?: 'login' | 'register') => void;
  onOpenDashboard: () => void;
  onOpenAdmin: () => void;
  onOpenAi: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenDashboard,
  onOpenAdmin,
  onOpenAi
}) => {
  const { currentUser, logout, notifications, markNotificationRead, markAllNotificationsRead } = usePortal();
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState('#home');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['home', 'how-it-works', 'events', 'resources', 'quick-access'];
      const scrollPos = window.scrollY + 180;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveHref(`#${section}`);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const unreadCount = notifications.filter(
    n => !n.read && (n.userId === currentUser.id || n.userId === 'all' || (n.userId === 'admin' && currentUser.role === 'admin'))
  ).length;

  const scrollTo = (id: string) => {
    setActiveHref(`#${id}`);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const dockNavItems: DockItemData[] = [
    {
      icon: <Home className="w-4 h-4" />,
      label: 'Home',
      isActive: activeHref === '#home',
      onClick: () => scrollTo('home')
    },
    {
      icon: <Layers className="w-4 h-4" />,
      label: 'How It Works',
      isActive: activeHref === '#how-it-works',
      onClick: () => scrollTo('how-it-works')
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: 'Events',
      isActive: activeHref === '#events',
      onClick: () => scrollTo('events')
    },
    {
      icon: <Building2 className="w-4 h-4" />,
      label: 'Resources',
      isActive: activeHref === '#resources',
      onClick: () => scrollTo('resources')
    },
    {
      icon: <Compass className="w-4 h-4" />,
      label: 'Quick Access',
      isActive: activeHref === '#quick-access',
      onClick: () => scrollTo('quick-access')
    },
    {
      icon: <Sparkles className="w-4 h-4 text-emerald-300" />,
      label: 'AI Finder',
      onClick: onOpenAi
    },
    {
      icon: <LayoutDashboard className="w-4 h-4" />,
      label: 'Dashboard',
      onClick: onOpenDashboard
    }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-brand-cream/90 backdrop-blur-md shadow-sm border-b border-brand-dark/10 py-1.5' 
          : 'bg-brand-cream/70 backdrop-blur-sm py-2 sm:py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 min-h-[52px]">
          
          {/* Left: Brand Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="#home" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-brand-dark flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <GraduationCap className="w-5 h-5 text-brand-light" />
              </div>
              <div>
                <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-brand-dark">
                  CAMPUS<span className="text-brand-green">PORTAL</span>
                </span>
                <span className="hidden xl:block text-[9px] uppercase tracking-[0.2em] text-brand-dark/60 font-semibold leading-none mt-0.5">
                  Academic Scheduling
                </span>
              </div>
            </a>
          </div>

          {/* Center: React Bits <Dock /> Component */}
          <div className="flex-1 flex justify-center px-1 sm:px-4">
            <Dock
              items={dockNavItems}
              panelHeight={46}
              baseItemSize={38}
              magnification={54}
              distance={130}
              tooltipPosition="bottom"
            />
          </div>

          {/* Right: User Authentication & Role Management */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Authenticated Role Tag */}
            <div className="relative hidden md:block">
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border border-brand-dark/20 bg-white/90 text-brand-dark shadow-xs">
                <span className={`w-2 h-2 rounded-full ${
                  currentUser.role === 'admin' ? 'bg-amber-600' : currentUser.role === 'faculty' ? 'bg-blue-600' : 'bg-emerald-600'
                }`} />
                <span className="uppercase tracking-wider font-mono font-bold text-[10px] text-brand-dark/80">
                  {currentUser.role}
                </span>
                <span className="text-brand-dark/30">|</span>
                <span className="text-[11px] font-semibold text-brand-dark max-w-[100px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full text-brand-dark hover:bg-brand-dark/5 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-96 bg-white rounded-2xl shadow-2xl border border-brand-dark/10 p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-brand-dark/10 mb-3">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-brand-green" />
                      <h4 className="font-display text-sm font-bold text-brand-dark">Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green text-[10px] font-bold">
                          {unreadCount} New
                        </span>
                      )}
                    </div>
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-brand-green hover:underline font-medium"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-brand-dark/60 text-center py-4">No notifications yet.</p>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                            n.read 
                              ? 'bg-brand-cream/30 border-transparent text-brand-dark/70' 
                              : 'bg-brand-light/70 border-brand-dark/10 text-brand-dark font-medium shadow-xs'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-brand-dark text-xs">{n.title}</span>
                            <span className="text-[10px] text-brand-dark/50">{n.timestamp}</span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-brand-dark/80">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Hub Link (Only if admin role) */}
            {currentUser.role === 'admin' && (
              <button
                onClick={onOpenAdmin}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-700 text-white text-xs font-semibold uppercase tracking-wider hover:bg-amber-800 transition-all shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Hub</span>
              </button>
            )}

            {/* User Account / Portal Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 bg-brand-dark text-white text-xs tracking-wider uppercase rounded-full hover:bg-brand-green transition-colors shadow-sm font-semibold"
              >
                <UserIcon className="w-3.5 h-3.5 text-white/80" />
                <span className="hidden sm:inline">Portals</span>
                <ChevronDown className="w-3 h-3 text-white/60" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-brand-dark/10 p-3 z-50 animate-fade-down">
                  <div className="px-3 py-2 border-b border-brand-dark/10 mb-2">
                    <p className="text-[10px] uppercase font-mono tracking-widest text-brand-dark/50 font-bold">
                      Current Session
                    </p>
                    <p className="text-xs font-bold text-brand-dark truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-brand-green font-semibold capitalize">{currentUser.role} Account</p>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenAuth('login');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-brand-dark hover:bg-brand-light flex items-center justify-between transition-colors"
                    >
                      <span>Switch / Sign In Role Gate</span>
                      <GraduationCap className="w-3.5 h-3.5 text-brand-green" />
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenDashboard();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-brand-dark hover:bg-brand-light flex items-center justify-between transition-colors"
                    >
                      <span>My Bookings &amp; Passes</span>
                      <LayoutDashboard className="w-3.5 h-3.5 text-brand-dark/50" />
                    </button>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenAdmin();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 flex items-center justify-between transition-colors"
                      >
                        <span>Open Admin Operations</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                      </button>
                    )}

                    <div className="pt-2 border-t border-brand-dark/10 mt-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 flex items-center justify-between transition-colors"
                      >
                        <span>Sign Out</span>
                        <LogOut className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
