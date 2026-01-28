import React from 'react';

interface RadarScanProps {
  className?: string;
}

export const RadarScan: React.FC<RadarScanProps> = ({ className = '' }) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Concentric radar rings */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vmax,420px)] h-[min(90vmax,420px)] opacity-[0.07]">
        {[1, 2, 3, 4].map((r) => (
          <div
            key={r}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/60"
            style={{
              width: `${r * 25}%`,
              height: `${r * 25}%`,
            }}
          />
        ))}
      </div>

      {/* Rotating sweep - conic gradient wedge; keyframes handle translate(-50%,-50%) */}
      <div
        className="radar-sweep absolute left-1/2 top-1/2 w-[min(88vmax,400px)] h-[min(88vmax,400px)] rounded-full opacity-25"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(6, 182, 212, 0.4) 35deg, transparent 45deg)`,
        }}
      />
    </div>
  );
};
