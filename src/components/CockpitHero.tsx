import React from 'react';

interface CockpitHeroProps {
  className?: string;
}

export const CockpitHero: React.FC<CockpitHeroProps> = ({ className = '' }) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Gauge-style arc left - hidden on small screens */}
      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-24 h-24 opacity-20 hidden sm:block" viewBox="0 0 64 64">
        <defs>
          <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(6, 182, 212)" />
            <stop offset="100%" stopColor="rgb(139, 92, 246)" />
          </linearGradient>
        </defs>
        <path
          d="M 8 32 A 24 24 0 0 1 56 32"
          fill="none"
          stroke="url(#gauge-grad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="38 76"
          className="animate-gauge-sweep"
          style={{ animation: 'gauge-sweep 4s ease-in-out infinite' }}
        />
      </svg>

      {/* Gauge-style arc right */}
      <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-24 opacity-20 rotate-180 hidden sm:block" viewBox="0 0 64 64">
        <defs>
          <linearGradient id="gauge-grad-r" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(6, 182, 212)" />
            <stop offset="100%" stopColor="rgb(139, 92, 246)" />
          </linearGradient>
        </defs>
        <path
          d="M 8 32 A 24 24 0 0 1 56 32"
          fill="none"
          stroke="url(#gauge-grad-r)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="38 76"
          className="animate-gauge-sweep"
          style={{ animation: 'gauge-sweep 4s ease-in-out infinite 0.5s' }}
        />
      </svg>

      {/* HUD-style corners - hidden on small screens */}
      <div className="absolute left-6 top-6 w-12 h-12 border-l-2 border-t-2 border-cyan-500/30 rounded-tl-lg hidden sm:block" />
      <div className="absolute right-6 top-6 w-12 h-12 border-r-2 border-t-2 border-cyan-500/30 rounded-tr-lg hidden sm:block" />
      <div className="absolute left-6 bottom-6 w-12 h-12 border-l-2 border-b-2 border-cyan-500/20 rounded-bl-lg hidden sm:block" />
      <div className="absolute right-6 bottom-6 w-12 h-12 border-r-2 border-b-2 border-cyan-500/20 rounded-br-lg hidden sm:block" />

      {/* Center horizon line - subtle on mobile */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-60 sm:opacity-100"
        style={{ maxWidth: '480px' }}
      />
    </div>
  );
}
