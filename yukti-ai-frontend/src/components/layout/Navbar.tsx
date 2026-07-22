import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSettings, FiUser, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '@contexts/ThemeContext';
import SettingsDropdown from './SettingsDropdown';
import ProfileDropdown from './ProfileDropdown';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="h-16 bg-white/80 dark:bg-[#141311]/80 backdrop-blur-md border-b border-[#B8860B]/10 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Left: Brand Logo & Title */}
      <div className="flex items-center space-x-3">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/LOGO1.png" alt="Yukti AI" className="h-8 w-auto object-contain" />
        </Link>
      </div>

      {/* Center: Title */}
      <div className="font-extrabold text-sm uppercase tracking-widest text-[#B8860B] hidden md:block">
        AI Workspace
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-[#B8860B]/15 hover:bg-[#B8860B]/10 transition-all duration-200 text-[#B8860B] cursor-pointer"
          title="Toggle theme"
        >
          {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
        </button>

        {/* Settings Toggle */}
        <div className="relative">
          <button
            onClick={() => {
              setSettingsOpen(!settingsOpen);
              setProfileOpen(false);
            }}
            className={`p-2.5 rounded-xl border border-[#B8860B]/15 hover:bg-[#B8860B]/10 transition text-[#B8860B] ${
              settingsOpen ? 'bg-[#B8860B]/10' : ''
            }`}
            title="Settings"
          >
            <FiSettings size={16} />
          </button>
          {settingsOpen && <SettingsDropdown onClose={() => setSettingsOpen(false)} />}
        </div>

        {/* Profile Toggle */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setSettingsOpen(false);
            }}
            className={`p-2.5 rounded-xl border border-[#B8860B]/15 hover:bg-[#B8860B]/10 transition text-[#B8860B] ${
              profileOpen ? 'bg-[#B8860B]/10' : ''
            }`}
            title="Profile"
          >
            <FiUser size={16} />
          </button>
          {profileOpen && <ProfileDropdown onClose={() => setProfileOpen(false)} />}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
