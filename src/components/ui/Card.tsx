import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: 'default' | 'highlight' | 'gradient';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  hover = false,
  variant = 'default',
  onClick 
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-300';
  
  const variantStyles = {
    default: 'bg-slate-900 border border-slate-800',
    highlight: 'bg-slate-900 border-2 border-cyan-500/30',
    gradient: 'bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700',
  };

  const hoverStyles = hover 
    ? 'hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer' 
    : '';

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        hoverStyles,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

