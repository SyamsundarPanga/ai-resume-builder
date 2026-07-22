import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`luxury-card rounded-3xl p-6 transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
