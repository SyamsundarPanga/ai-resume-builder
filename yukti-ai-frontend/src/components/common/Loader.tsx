import React from 'react';

interface LoaderProps {
  variant?: 'spinner' | 'skeleton';
  height?: string;
  width?: string;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  variant = 'spinner',
  height = 'h-10',
  width = 'w-10',
  className = ''
}) => {
  if (variant === 'skeleton') {
    return (
      <div
        className={`animate-pulse bg-slate-200 dark:bg-slate-800/60 rounded-xl ${height} ${width} ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-[#B8860B] ${height} ${width}`} />
    </div>
  );
};

export default Loader;
