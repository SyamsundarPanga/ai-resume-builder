import React from 'react';

interface ProgressProps {
  value: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Progress: React.FC<ProgressProps> = ({ value, label, size = 'md' }) => {
  const height = {
    sm: 'h-1.5',
    md: 'h-3',
    lg: 'h-5'
  };

  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full text-left space-y-1">
      {(label || value !== undefined) && (
        <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>{label}</span>
          <span className="text-[#B8860B]">{clampedValue}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${height[size]} border border-[#B8860B]/10`}>
        <div
          className="h-full bg-gradient-to-r from-[#B8860B] to-[#7A4E1D] transition-all duration-500 ease-out"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};

export default Progress;
