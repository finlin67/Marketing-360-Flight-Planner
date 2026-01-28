import React from 'react';
import { Airplane } from './Airplane';

interface HeroPlaneIllustrationProps {
  className?: string;
}

export const HeroPlaneIllustration: React.FC<HeroPlaneIllustrationProps> = ({ className = '' }) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute w-[min(52vw,280px)] max-w-[280px] right-[10%] top-[8%] sm:right-[12%] sm:top-[10%] md:right-[14%] md:top-[12%] opacity-90"
        style={{ transform: 'rotate(-12deg)' }}
      >
        <Airplane variant="variant2" />
      </div>
    </div>
  );
};
