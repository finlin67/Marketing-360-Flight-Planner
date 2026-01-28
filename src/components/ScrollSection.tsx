import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const dirOffset = {
  up: { y: 28 },
  down: { y: -28 },
  left: { x: 28 },
  right: { x: -28 },
};

export const ScrollSection: React.FC<ScrollSectionProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const o = dirOffset[direction];
  const axis = direction === 'up' || direction === 'down' ? 'y' : 'x';
  const value = o[axis as keyof typeof o];

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        [axis]: value,
      }}
      animate={
        inView
          ? {
              opacity: 1,
              [axis]: 0,
            }
          : {}
      }
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
