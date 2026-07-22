import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@components/layout/Navbar';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F4ED] dark:bg-[#0A0A09] text-[#1A1A1A] dark:text-[#F7F4ED] flex flex-col font-sans transition-colors duration-200">
      {/* Reusable sticky top navbar */}
      <Navbar />

      {/* Centered Scrollable Workspace */}
      <main className="flex-grow p-4 md:p-8 max-w-5xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
