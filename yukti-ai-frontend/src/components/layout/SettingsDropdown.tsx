import React from 'react';
import { useDropdown } from '@hooks/useDropdown';
import { useAuth } from '@hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiLogOut, FiTrash2 } from 'react-icons/fi';

interface SettingsDropdownProps {
  onClose: () => void;
}

export const SettingsDropdown: React.FC<SettingsDropdownProps> = ({ onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useDropdown(onClose);

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    const confirm = window.confirm(
      'WARNING: Deleting your account will remove all your data permanently. This action CANNOT be undone. Proceed?'
    );
    if (confirm) {
      toast.error('Account deletion is restricted in this demo build.');
      onClose();
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#141311] border border-[#B8860B]/15 rounded-2xl shadow-xl z-50 p-2 text-left"
    >
      <button
        onClick={handleLogout}
        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-[#F7F4ED]/50 dark:hover:bg-slate-800/20 text-[#1A1A1A] dark:text-[#F7F4ED] text-sm transition"
      >
        <FiLogOut className="text-[#B8860B]" />
        <div>
          <p className="font-bold text-xs">Logout Session</p>
          <p className="text-[10px] text-slate-500">Sign out of this candidate account</p>
        </div>
      </button>

      <button
        onClick={() => alert('Yukti AI Resume Builder & ATS Optimizer v1.0.0. Tailoring truthful resumes with Gemini AI.')}
        className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-[#F7F4ED]/50 dark:hover:bg-slate-800/20 text-[#1A1A1A] dark:text-[#F7F4ED] text-xs transition"
      >
        <div className="w-1 h-1 rounded-full bg-[#B8860B]" />
        <span>About Yukti AI</span>
      </button>

      <button
        onClick={() => alert('Privacy Policy: All uploaded resumes are encrypted, Cloudinary assets are private, and user data is never shared.')}
        className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-[#F7F4ED]/50 dark:hover:bg-slate-800/20 text-[#1A1A1A] dark:text-[#F7F4ED] text-xs transition"
      >
        <div className="w-1 h-1 rounded-full bg-[#B8860B]" />
        <span>Privacy Policy</span>
      </button>

      <button
        onClick={() => alert('Terms of Service: User agrees to optimize truthful experience records and prevent fraudulent credentials.')}
        className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-[#F7F4ED]/50 dark:hover:bg-slate-800/20 text-[#1A1A1A] dark:text-[#F7F4ED] text-xs transition"
      >
        <div className="w-1 h-1 rounded-full bg-[#B8860B]" />
        <span>Terms & Conditions</span>
      </button>

      <div className="border-t border-[#B8860B]/10 my-1 pt-1 text-center">
        <p className="text-[9px] text-slate-400 font-mono">Yukti AI Suite v1.0.0</p>
      </div>

      <button
        onClick={handleDeleteAccount}
        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/5 text-red-600 text-sm transition"
      >
        <FiTrash2 />
        <div>
          <p className="font-bold text-xs">Delete Account</p>
          <p className="text-[10px] text-red-500/80">Permanently purge all data</p>
        </div>
      </button>
    </div>
  );
};

export default SettingsDropdown;
