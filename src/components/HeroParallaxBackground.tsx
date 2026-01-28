import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AnimatedBackground } from './AnimatedBackground';
import { RadarScan } from './RadarScan';
import { CockpitHero } from './CockpitHero';

interface HeroParallaxBackgroundProps {
  heroRef: React.RefObject<HTMLElement | null>;
  className?: string;
}

export const HeroParallaxBackground: React.FC<HeroParallaxBackgroundProps> = ({
  heroRef,
  className = '',
}) => {
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const particlesY = useTransform(scrollYProgress, [0, 1], [0, 48]);
  const radarY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const cockpitY = useTransform(scrollYProgress, [0, 1], [0, 24]);

  return (
    <>
      <motion.div
        className={`pointer-events-none absolute inset-0 ${className}`}
        style={{ y: particlesY }}
      >
        <AnimatedBackground />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ y: radarY }}
      >
        <RadarScan />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ y: cockpitY }}
      >
        <CockpitHero />
      </motion.div>
    </>
  );
};
