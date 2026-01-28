'use client';
import React from 'react';
import { motion, Variants } from 'framer-motion';

export default function Airplane({ variant = 'variant1' }: { variant?: string }) {
  const isGearDown = variant === 'variant1';

  const gearVariants: Variants = {
    down: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } // Custom easing for mechanical feel
    },
    up: { 
      y: -25, 
      opacity: 0, 
      transition: { duration: 0.8, ease: "easeInOut" } 
    }
  };

  return (
    <motion.svg
      className="w-full h-auto drop-shadow-2xl"
      fill="none"
      height="180"
      viewBox="0 0 540 180"
      width="540"
      xmlns="http://www.w3.org/2000/svg"
      animate={{
        y: [0, -12, 0],
        rotate: [0, 1, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <defs>
        {/* Advanced Metallic Gradient for Fuselage */}
        <linearGradient id="fuselageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" /> {/* White highlight top */}
          <stop offset="30%" stopColor="#e2e8f0" /> {/* Light grey */}
          <stop offset="60%" stopColor="#94a3b8" /> {/* Mid grey shadow */}
          <stop offset="85%" stopColor="#cbd5e1" /> {/* Reflected light from clouds */}
          <stop offset="100%" stopColor="#64748b" /> {/* Darker bottom */}
        </linearGradient>

        {/* Vertical Stabilizer Gradient */}
        <linearGradient id="tailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>

        {/* Engine Cowling Gradient */}
        <linearGradient id="engineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
           <stop offset="0%" stopColor="#cbd5e1" />
           <stop offset="40%" stopColor="#64748b" />
           <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        
        {/* Cockpit Glass */}
        <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.6" />
        </linearGradient>

        {/* Gear Strut Gradient */}
        <linearGradient id="strutGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        {/* Glow Filter for lights */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Intense Engine Heat Filter */}
        <filter id="engineGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feFlood floodColor="#38bdf8" floodOpacity="0.6" result="glowColor" />
          <feComposite in="glowColor" in2="coloredBlur" operator="in" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* --- Far Side Wing (Visual Depth) --- */}
      <path d="M280 68 L340 35 L400 68 Z" fill="#64748b" opacity="0.6" />

      {/* --- Tail Section --- */}
      <path d="M60 78 L30 18 L100 18 L140 78 Z" fill="url(#tailGrad)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      <path d="M55 25 L105 25" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      <path d="M45 45 L115 45" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      <path d="M50 78 L30 88 L70 88 Z" fill="#475569" />

      {/* --- Main Fuselage --- */}
      <path 
        d="M50 78 
           Q50 78 140 78 
           L440 78 
           C480 78 510 93 510 103 
           C510 113 480 128 440 128 
           L140 128 
           C90 128 50 113 50 103 
           Q50 93 50 78 
           Z" 
        fill="url(#fuselageGrad)" 
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="0.5"
      />

      {/* --- Fuselage Details --- */}
      <rect x="360" y="108" width="25" height="15" rx="3" fill="none" stroke="#1e293b" strokeOpacity="0.2" strokeWidth="0.5" />
      <rect x="120" y="108" width="20" height="15" rx="2" fill="none" stroke="#1e293b" strokeOpacity="0.2" strokeWidth="0.5" />
      <path d="M160 78 L160 128" stroke="#1e293b" strokeOpacity="0.1" strokeWidth="0.5" />
      <path d="M280 78 L280 128" stroke="#1e293b" strokeOpacity="0.1" strokeWidth="0.5" />
      <path d="M400 78 L400 128" stroke="#1e293b" strokeOpacity="0.1" strokeWidth="0.5" />

      {/* --- Cockpit Area --- */}
      <path d="M465 85 L490 88 L500 98 L498 103 L470 98 Z" fill="#1e293b" />
      <path d="M465 85 L490 88 L500 98 L498 103 L470 98 Z" fill="url(#glassGrad)" />
      <path d="M478 87 L482 99" stroke="#1e293b" strokeWidth="1" />
      <path d="M488 89 L492 100" stroke="#1e293b" strokeWidth="1" />
      <path d="M470 90 L495 94" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />

      {/* --- Passenger Windows --- */}
      <g fill="#0f172a" opacity="0.8">
         {Array.from({ length: 14 }).map((_, i) => (
            <circle key={i} cx={170 + i * 18} cy="93" r="2.2" />
         ))}
      </g>

      {/* --- LANDING GEAR: NOSE --- */}
      <motion.g 
        initial="down" 
        animate={isGearDown ? "down" : "up"} 
        variants={gearVariants}
      >
        {/* Gear Door (Partial) */}
        <path d="M410 128 L435 128" stroke="#475569" strokeWidth="2" />
        
        {/* Main Strut */}
        <rect x="420" y="128" width="5" height="28" fill="url(#strutGrad)" rx="1" />
        <rect x="421" y="150" width="3" height="10" fill="#94a3b8" /> {/* Piston chrome */}
        
        {/* Torque Link / Scissors */}
        <path d="M422 138 L430 144 L422 150" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinejoin="round" />
        
        {/* Wheels */}
        <g transform="translate(422, 162)">
           <circle cx="0" cy="0" r="8" fill="#1e293b" /> {/* Tire */}
           <circle cx="0" cy="0" r="4" fill="#94a3b8" /> {/* Rim */}
           <circle cx="0" cy="0" r="1.5" fill="#e2e8f0" /> {/* Hub */}
        </g>
      </motion.g>

      {/* --- LANDING GEAR: MAIN --- */}
      {/* Placed BEFORE Near Side Wing so the strut top is hidden by the wing */}
      <motion.g 
        initial="down" 
        animate={isGearDown ? "down" : "up"} 
        variants={gearVariants}
      >
        {/* Main Strut Assembly */}
        <path d="M260 120 L260 155" stroke="url(#strutGrad)" strokeWidth="6" strokeLinecap="square" />
        
        {/* Side Brace / Drag Strut */}
        <path d="M260 135 L280 125" stroke="#64748b" strokeWidth="2" />
        
        {/* Bogie Beam */}
        <rect x="250" y="152" width="20" height="4" rx="1" fill="#475569" />
        
        {/* Wheels (Twin visible) */}
        <g transform="translate(260, 165)">
           <circle cx="-5" cy="0" r="10" fill="#1e293b" />
           <circle cx="-5" cy="0" r="5" fill="#64748b" />
           
           <circle cx="5" cy="1" r="10" fill="#0f172a" /> {/* Front wheel slightly offset */}
           <circle cx="5" cy="1" r="5" fill="#94a3b8" />
           <circle cx="5" cy="1" r="2" fill="#e2e8f0" />
        </g>
      </motion.g>

      {/* --- Near Side Wing --- */}
      {/* Opaque fill will mask the top of the Main Gear strut */}
      <path d="M260 103 L180 155 L340 155 L380 103 Z" fill="#94a3b8" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      <path d="M200 155 L210 140" stroke="#1e293b" strokeOpacity="0.3" strokeWidth="0.5" />
      <path d="M280 155 L285 140" stroke="#1e293b" strokeOpacity="0.3" strokeWidth="0.5" />
      <path d="M265 108 L190 150" stroke="rgba(255,255,255,0.15)" strokeWidth="4" strokeLinecap="round" />
      
      {/* --- Engine (High Bypass Turbofan) --- */}
      <g transform="translate(-5, 12)">
        <path d="M315 110 L315 125 L340 125 Z" fill="#64748b" />
        <path d="M285 125 L265 135 L285 145 Z" fill="#334155" />
        
        {/* Exhaust Spike (Central cone tip) with Pulsating Glow */}
        <path d="M280 130 L260 135 L280 140 Z" fill="#0f172a" />
        <path d="M280 130 L260 135 L280 140 Z" fill="#38bdf8" filter="url(#engineGlow)" opacity="0.6">
             <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
        </path>

        <path d="M285 120 H355 C365 120 365 150 355 150 H285 C275 150 275 120 285 120 Z" fill="url(#engineGrad)" />
        <path d="M285 120 L280 125 L285 130 L280 135 L285 140 L280 145 L285 150" fill="none" stroke="#475569" strokeWidth="1" />
        <path d="M315 121 L315 149" stroke="#1e293b" strokeOpacity="0.2" strokeWidth="0.5" />
        <circle cx="330" cy="135" r="1.5" fill="#1e293b" opacity="0.3" />
        <ellipse cx="355" cy="135" rx="6" ry="15" fill="#e2e8f0" />
        <ellipse cx="355" cy="135" rx="4" ry="13" fill="#0f172a" />
        <path d="M355 122 Q353 135 355 148" stroke="#334155" strokeWidth="0.5" />
        <path d="M353 124 Q351 135 353 146" stroke="#334155" strokeWidth="0.5" />
        <path d="M357 124 Q359 135 357 146" stroke="#334155" strokeWidth="0.5" />
        <circle cx="355" cy="135" r="2" fill="#94a3b8" />
        <path d="M355 135 L357 135" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" transform="rotate(-45 355 135)" />
      </g>

      {/* --- Lights --- */}
      <circle cx="280" cy="78" r="2" fill="#ef4444" filter="url(#glow)">
        <animate attributeName="opacity" values="0.2;1;0.2" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="140" cy="78" r="1.5" fill="#fff" filter="url(#glow)">
         <animate attributeName="opacity" values="0;1;0;0" dur="1.2s" repeatCount="indefinite" />
      </circle>
       <circle cx="185" cy="153" r="2" fill="#22c55e" filter="url(#glow)" opacity="0.9">
          <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
       </circle>

    </motion.svg>
  );
}