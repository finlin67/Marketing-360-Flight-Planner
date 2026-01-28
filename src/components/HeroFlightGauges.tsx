import React from 'react';
import { motion } from 'framer-motion';

interface GaugeProps {
  label: string;
  value: string;
  unit?: string;
  delay?: number;
  className?: string;
}

const Gauge: React.FC<GaugeProps> = ({ label, value, unit = '', delay = 0, className = '' }) => (
  <motion.div
    className={`flex flex-col items-center rounded-lg glass px-3 py-2 min-w-[72px] ${className}`}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <span className="text-[10px] uppercase tracking-wider text-cyan-400/80 font-medium">{label}</span>
    <motion.span
      className="font-mono text-sm font-bold text-white tabular-nums"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: delay + 0.15 }}
    >
      {value}
      {unit && <span className="text-cyan-400/70 text-xs ml-0.5">{unit}</span>}
    </motion.span>
  </motion.div>
);

interface HeroFlightGaugesProps {
  className?: string;
}

export const HeroFlightGauges: React.FC<HeroFlightGaugesProps> = ({ className = '' }) => {
  return (
    <div
      className={`pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center gap-3 px-4 sm:gap-4 ${className}`}
      aria-hidden="true"
    >
      <Gauge label="ALT" value="072" unit="×100" delay={0.5} />
      <Gauge label="SPD" value="340" unit="kt" delay={0.6} />
      <Gauge label="HDG" value="090" unit="°" delay={0.7} />
    </div>
  );
};
