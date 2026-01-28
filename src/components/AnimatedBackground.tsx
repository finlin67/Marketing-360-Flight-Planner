import React, { useMemo } from 'react';

const PARTICLE_COUNT = 24;

interface AnimatedBackgroundProps {
  className?: string;
  particleClassName?: string;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  className = '',
  particleClassName = '',
}) => {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        left: `${(i * 7 + 3) % 100}%`,
        top: `${(i * 11 + 5) % 100}%`,
        size: 2 + (i % 3),
        delay: `${(i * 0.4) % 6}s`,
        duration: 6 + (i % 4),
      })),
    []
  );

  const trailPaths = [
    'M 0 20 Q 25 0 50 20 T 100 20',
    'M 0 60 Q 30 40 60 60 T 100 60',
    'M 0 80 Q 20 50 50 80 T 100 80',
    'M 0 40 Q 40 10 80 40 T 100 40',
  ];

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute rounded-full bg-cyan-400/40 animate-float-particle ${particleClassName}`}
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
      {/* Subtle flight path trails (SVG) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-25"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="trail-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(6, 182, 212)" stopOpacity="0.25" />
            <stop offset="50%" stopColor="rgb(139, 92, 246)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(6, 182, 212)" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        {trailPaths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="url(#trail-grad)"
            strokeWidth="0.4"
            strokeDasharray="3 5"
            className="animate-trail-dash"
            style={{ animationDelay: `${i * 1.2}s` }}
          />
        ))}
      </svg>
    </div>
  );
};
