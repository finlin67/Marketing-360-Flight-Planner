import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Check } from 'lucide-react';

interface PreFlightProgressProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number;
}

const STEPS = ['Role', 'Industry', 'Company size'];

export const PreFlightProgress: React.FC<PreFlightProgressProps> = ({
  currentStep,
  totalSteps,
  completedSteps,
}) => {
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);
  const pathProgress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="w-full mb-8">
      {/* Step labels + path */}
      <div className="relative px-2 sm:px-4">
        <div className="flex justify-between mb-2">
          {STEPS.map((label, i) => {
            const done = completedSteps > i;
            const active = currentStep === i;
            return (
              <div
                key={label}
                className="flex flex-col items-center relative z-10"
                style={{ flex: 1 }}
              >
                <motion.div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                    border-2 transition-colors
                    ${done ? 'bg-cyan-500 border-cyan-400 text-white' : ''}
                    ${active && !done ? 'bg-slate-800 border-cyan-500 text-cyan-400' : ''}
                    ${!active && !done ? 'bg-slate-800/80 border-slate-600 text-slate-500' : ''}
                  `}
                  initial={false}
                  animate={{
                    scale: active ? 1.1 : 1,
                    boxShadow: active ? '0 0 20px rgba(6, 182, 212, 0.4)' : 'none',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  {done ? (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    >
                      <Check className="w-5 h-5" strokeWidth={2.5} />
                    </motion.span>
                  ) : (
                    i + 1
                  )}
                </motion.div>
                <span
                  className={`
                    mt-2 text-xs font-medium hidden sm:block
                    ${active ? 'text-cyan-400' : done ? 'text-slate-300' : 'text-slate-500'}
                  `}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Path line */}
        <div className="absolute top-5 left-4 right-4 h-0.5 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(completedSteps / totalSteps) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>

        {/* Plane moving along path */}
        <motion.div
          className="absolute top-3.5 w-8 h-8 -ml-4 flex items-center justify-center text-cyan-400"
          initial={{ left: '16px' }}
          animate={{
            left: `calc(16px + ${pathProgress} * (100% - 32px) / 100)`,
          }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Plane className="w-5 h-5 -rotate-45" strokeWidth={2} />
        </motion.div>
      </div>

      {/* Circular progress */}
      <div className="flex justify-center mt-6">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
              fill="none"
              stroke="rgb(51 65 85)"
              strokeWidth="2.5"
            />
            <motion.path
              d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
              fill="none"
              stroke="rgb(6 182 212)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="97.5"
              initial={{ strokeDashoffset: 97.5 }}
              animate={{ strokeDashoffset: 97.5 - (progressPercent / 100) * 97.5 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              key={progressPercent}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-sm font-bold text-white tabular-nums"
            >
              {progressPercent}%
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
};
