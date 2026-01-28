import React from 'react';
import { motion } from 'framer-motion';

interface StaggeredHeadlineProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

export const StaggeredHeadline: React.FC<StaggeredHeadlineProps> = ({
  text,
  className = '',
  delay = 0,
  stagger = 0.022,
}) => {
  const letters = text.split('');
  const container = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const letter = {
    initial: { opacity: 0, y: 18 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <motion.h1
      className={className}
      variants={container}
      initial="initial"
      animate="animate"
    >
      {letters.map((char, i) => (
        <motion.span
          key={i}
          variants={letter}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ))}
    </motion.h1>
  );
};
