import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  to, 
  label = 'Back',
  className = ''
}) => {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => to ? navigate(to) : navigate(-1)}
      className={`flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 rounded px-2 py-1 min-h-[44px] ${className}`}
      aria-label={`Go back to ${label.toLowerCase()}`}
    >
      <ArrowLeft size={18} aria-hidden="true" />
      {label}
    </button>
  );
};

