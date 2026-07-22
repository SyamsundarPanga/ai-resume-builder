import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'gold';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'gold' }) => {
  const styles = {
    success: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400',
    warning: 'bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400',
    error: 'bg-red-500/10 text-red-600 border border-red-500/20 dark:text-red-400',
    info: 'bg-blue-500/10 text-blue-600 border border-blue-500/20 dark:text-blue-400',
    gold: 'bg-[#B8860B]/10 text-[#B8860B] border border-[#B8860B]/20'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;
