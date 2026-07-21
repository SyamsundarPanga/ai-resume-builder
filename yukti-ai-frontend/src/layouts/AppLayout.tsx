import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  FiActivity,
  FiCompass,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiSliders,
  FiSun,
  FiMoon,
  FiUploadCloud,
  FiUser,
  FiX
} from 'react-icons/fi';

const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: FiCompass },
    { name: 'Upload Resume', path: '/upload', icon: FiUploadCloud },
    { name: 'Optimize & ATS Score', path: '/optimize', icon: FiSliders },
    { name: 'History & Download', path: '/history', icon: FiActivity },
    { name: 'Profile', path: '/profile', icon: FiUser },
    { name: 'Settings', path: '/settings', icon: FiSettings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F7F4ED] dark:bg-[#0A0A09] text-[#1A1A1A] dark:text-[#F7F4ED] flex font-sans">
      {/* Sidebar for desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#141311] border-r border-[#B8860B]/15 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-250 flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#B8860B]/10">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/LOGO1.png" alt="Yukti AI" className="h-9 w-auto object-contain" />
          </Link>
          <button className="md:hidden text-slate-500" onClick={() => setSidebarOpen(false)}>
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#B8860B] to-[#7A4E1D] text-white shadow-lg shadow-[#B8860B]/20'
                    : 'text-slate-600 hover:bg-[#F7F4ED] hover:text-[#B8860B]'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#B8860B]/10">
          <div className="flex items-center space-x-3 px-4 py-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-[#B8860B]/10 flex items-center justify-center text-[#B8860B] font-bold border border-[#B8860B]/20">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <FiLogOut size={18} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white/80 dark:bg-[#141311]/80 backdrop-blur-md border-b border-[#B8860B]/10 flex items-center justify-between px-6 sticky top-0 z-40">
          <button className="md:hidden text-slate-500" onClick={() => setSidebarOpen(true)}>
            <FiMenu size={22} />
          </button>
          
          <div className="font-semibold text-lg hidden md:block">
            {menuItems.find((item) => item.path === location.pathname)?.name || 'Optimize Resume'}
          </div>

          <div className="flex items-center space-x-4 ml-auto">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleTheme();
              }}
              className="p-2.5 rounded-xl border border-[#B8860B]/15 hover:bg-[#B8860B]/10 transition-all duration-200 text-[#B8860B] cursor-pointer z-50 relative"
              title="Toggle Royal Light / Royal Dark Gold theme"
            >
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <span className="text-xs font-semibold px-3 py-1.5 bg-[#B8860B]/10 text-[#B8860B] rounded-full border border-[#B8860B]/20">
              Candidate Account
            </span>
          </div>
        </header>

        {/* Inner Outlet Container */}
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
