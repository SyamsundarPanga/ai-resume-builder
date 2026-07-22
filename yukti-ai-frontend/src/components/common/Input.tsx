import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className="space-y-1.5 w-full text-left">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-4 py-3 bg-white dark:bg-[#1A1916] border border-[#B8860B]/15 dark:border-[#B8860B]/30 rounded-xl focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B] focus:outline-none transition-all duration-200 text-sm ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 block">{error}</span>}
    </div>
  );
};

export default Input;
