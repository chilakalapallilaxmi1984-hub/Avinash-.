import React from 'react';
import { motion } from 'motion/react';

interface AvinashLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  subtitle?: string;
}

export const AvinashLogo: React.FC<AvinashLogoProps> = ({
  size = 'md',
  showWordmark = true,
  subtitle,
}) => {
  const dimensionMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  };

  return (
    <div className="inline-flex items-center gap-3 select-none">
      <motion.div
        whileHover={{ scale: 1.05, rotate: 2 }}
        transition={{ duration: 0.18 }}
        className={`relative ${dimensionMap[size]} flex items-center justify-center shrink-0`}
      >
        {/* Outer Neon Halo */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-400/35 via-indigo-500/35 to-pink-500/35 blur-md" />
        {/* 3D Prismatic Vector Core */}
        <svg
          viewBox="0 0 100 100"
          className="relative w-full h-full drop-shadow-[0_0_16px_rgba(34,211,238,0.5)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="avinashOuter" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="50%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="avinashFacetLeft" x1="20" y1="15" x2="55" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
            <linearGradient id="avinashFacetRight" x1="50" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>

          {/* Rounded Obsidian Shield */}
          <rect
            x="6"
            y="6"
            width="88"
            height="88"
            rx="24"
            fill="#080A14"
            stroke="url(#avinashOuter)"
            strokeWidth="3.2"
          />

          {/* Futuristic 3D 'A' Prism + Play Aperture */}
          <path
            d="M50 18L22 78H36.5L50 47.5V18Z"
            fill="url(#avinashFacetLeft)"
          />
          <path
            d="M50 18L78 78H63.5L50 47.5V18Z"
            fill="url(#avinashFacetRight)"
          />
          {/* Glowing Play Core Triangle */}
          <path
            d="M44 53L60 62L44 71V53Z"
            fill="#22D3EE"
          />
          {/* Orbital Ring */}
          <ellipse
            cx="50"
            cy="52"
            rx="36"
            ry="13"
            transform="rotate(-22 50 52)"
            stroke="url(#avinashOuter)"
            strokeWidth="2"
            strokeDasharray="6 4"
            opacity="0.85"
          />
        </svg>
      </motion.div>

      {showWordmark && (
        <div className="flex flex-col">
          <span className="font-display font-extrabold tracking-wider text-lg md:text-xl text-white whitespace-nowrap">
            AVINASH <span className="text-neon-gradient">AI</span>
          </span>
          {subtitle && (
            <span className="text-xs text-slate-400 tracking-wide whitespace-nowrap">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
