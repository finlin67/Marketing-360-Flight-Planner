import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface PreFlightOptionButtonProps {
  label: string;
  sublabel?: string;
  icon: LucideIcon;
  isSelected: boolean;
  onSelect: () => void;
  index?: number;
}

export const PreFlightOptionButton: React.FC<PreFlightOptionButtonProps> = ({
  label,
  sublabel,
  icon: Icon,
  isSelected,
  onSelect,
  index = 0,
}) => {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      className={`
        w-full text-left p-4 rounded-xl border-2 transition-colors flex items-center gap-4
        focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950
        min-h-[52px]
        ${isSelected
          ? 'bg-cyan-500/15 border-cyan-500 shadow-lg shadow-cyan-500/20'
          : 'bg-slate-800/80 border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800'
        }
      `}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      aria-pressed={isSelected}
    >
      <motion.div
        className={`
          flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center
          ${isSelected ? 'bg-cyan-500/30' : 'bg-slate-700/50'}
        `}
        animate={{
          scale: isSelected ? 1.05 : 1,
          rotate: isSelected ? [0, -5, 5, 0] : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 20,
          rotate: { duration: 0.4 },
        }}
      >
        <Icon
          className={`w-5 h-5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`}
          strokeWidth={2}
        />
      </motion.div>
      <div className="flex-1 min-w-0">
        <div className={`font-semibold ${isSelected ? 'text-cyan-50' : 'text-white'}`}>
          {label}
        </div>
        {sublabel && (
          <div className="text-sm text-slate-400 mt-0.5">{sublabel}</div>
        )}
      </div>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-checkmark-draw-sm"
            style={{ strokeDasharray: 14 }}
          >
            <path d="M2 6 L5 9 L10 3" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
};
