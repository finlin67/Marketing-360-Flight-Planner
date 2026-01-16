import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  children,
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700',
    outline: 'bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10',
    ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/50',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        isLoading && 'cursor-wait',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

