import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className
}) => {
  const baseStyles = 'inline-flex items-center font-semibold rounded-full';
  
  const variantStyles = {
    default: 'bg-slate-800 text-slate-300 border border-slate-700',
    success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    info: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
    error: 'bg-red-500/20 text-red-400 border border-red-500/30',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}>
      {children}
    </span>
  );
};

