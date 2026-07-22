import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-bold transition-all duration-200 focus:outline-none';
  
  const variants = {
    primary: 'luxury-button',
    secondary: 'bg-[#7A4E1D] hover:bg-[#5D3A15] text-white rounded-[10px] shadow-sm',
    danger: 'bg-red-600 hover:bg-red-700 text-white rounded-[10px] shadow-sm',
    ghost: 'border border-[#B8860B]/20 text-[#B8860B] hover:bg-[#B8860B]/10 rounded-[10px]'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base'
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
