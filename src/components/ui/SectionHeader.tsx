import React from 'react';
import { cn } from '../../utils/cn';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
  align?: 'left' | 'center';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  className,
  align = 'left'
}) => {
  return (
    <div className={cn(
      'space-y-2',
      align === 'center' && 'text-center',
      className
    )}>
      {Icon && (
        <div className={cn(
          'inline-flex items-center justify-center w-12 h-12 bg-cyan-500/10 rounded-xl mb-2',
          align === 'center' && 'mx-auto'
        )}>
          <Icon className="text-cyan-400" size={24} />
        </div>
      )}
      <h2 className="text-3xl font-bold text-white">{title}</h2>
      {subtitle && (
        <p className="text-lg text-slate-400 max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};

