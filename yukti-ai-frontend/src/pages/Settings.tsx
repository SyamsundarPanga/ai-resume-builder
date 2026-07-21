import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import toast, { Toaster } from 'react-hot-toast';
import { FiLogOut, FiSun, FiMoon, FiTrash2 } from 'react-icons/fi';

const Settings: React.FC = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    const confirm = window.confirm(
      'WARNING: Deleting your account will remove all your data permanently, including all resumes, JD matches, and optimized templates. This action CANNOT be undone. Proceed?'
    );
    if (confirm) {
      toast.error('Account deletion is restricted in this demo build.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-1">
          Manage system preferences, appearance, and sessions.
        </p>
      </div>

      <div className="bg-white dark:bg-[#141311] border border-[#B8860B]/15 rounded-3xl p-6 shadow-sm space-y-6">
        {/* App Appearance */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold">App Appearance</h2>
          <p className="text-xs text-slate-500">
            Switch between Light and Dark gold themes.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => { if (theme !== 'light') toggleTheme(); }}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-xl border text-sm font-semibold transition ${
                theme === 'light'
                  ? 'border-[#B8860B] bg-[#B8860B]/10 text-[#B8860B]'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/10'
              }`}
            >
              <FiSun />
              <span>Royal Light Gold</span>
            </button>
            <button
              onClick={() => { if (theme !== 'dark') toggleTheme(); }}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-xl border text-sm font-semibold transition ${
                theme === 'dark'
                  ? 'border-[#B8860B] bg-[#B8860B]/10 text-[#B8860B]'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/10'
              }`}
            >
              <FiMoon />
              <span>Royal Dark Gold (Black)</span>
            </button>
          </div>
        </div>

        {/* Security / Session management */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <h2 className="text-lg font-bold">Account Management</h2>
          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 bg-[#F7F4ED]/30 dark:bg-slate-900/10 hover:bg-[#F7F4ED]/60 border border-slate-200 dark:border-slate-800 rounded-xl transition text-left"
            >
              <div className="flex items-center space-x-3">
                <FiLogOut className="text-slate-400" />
                <div>
                  <p className="text-sm font-bold">Logout Session</p>
                  <p className="text-xs text-slate-500">Sign out of this candidate account</p>
                </div>
              </div>
            </button>

            <button
              onClick={handleDeleteAccount}
              className="w-full flex items-center justify-between p-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-xl transition text-left text-red-600"
            >
              <div className="flex items-center space-x-3">
                <FiTrash2 className="shrink-0" />
                <div>
                  <p className="text-sm font-bold">Delete Account</p>
                  <p className="text-xs text-red-500/85">Permanently purge all data from databases</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
