import React from 'react';
import Loader from './Loader';

interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'AI is compiling data...' }) => {
  return (
    <div className="fixed inset-0 bg-[#0A0A09]/75 backdrop-blur-md flex flex-col items-center justify-center z-50 transition-all duration-300">
      <div className="space-y-4 text-center">
        <Loader variant="spinner" className="h-16 w-16" />
        <p className="text-[#B8860B] font-bold text-sm tracking-widest uppercase animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
