"use client";

import { motion } from "motion/react";

interface TreeProps {
  growth: number;
  color?: string;
  className?: string;
}

// Light sage color so stems pop on the background
const STEM_COLOR = "#a8b5a1"; 
const STEM_WIDTH = 2;

// 1. Stacked Circle Tree (Like dandelion bursts from reference)
export function StackedCircleTree({ growth, color = "#587850", className = "" }: TreeProps) {
  const bloom = Math.max(0, growth - 0.6) * 2.5;

  return (
    <svg viewBox="0 0 200 600" className={`overflow-visible ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.path
        d="M100 600 C 130 400, 40 200, 100 80"
        stroke={STEM_COLOR} strokeWidth={STEM_WIDTH} strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: growth }}
      />
      
      <motion.g 
        initial={{ scale: 0, opacity: 0 }} 
        animate={{ scale: bloom, opacity: bloom }} 
        style={{ originX: "100px", originY: "80px", filter: `drop-shadow(0 0 15px ${color})` }}
      >
        <motion.circle 
          cx="100" cy="80" r="55" fill={color} 
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="100" cy="80" r="30" fill={color} opacity="0.7" />
        <circle cx="100" cy="80" r="12" fill="#f5f5f0" opacity="0.9" />
        
        {/* Bursting data points pointing naturally outwards */}
        <line x1="100" y1="80" x2="60" y2="30" stroke={STEM_COLOR} strokeWidth="1" />
        <motion.circle cx="60" cy="30" r="5" fill="#a4c3b2" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
        
        <line x1="100" y1="80" x2="150" y2="50" stroke={STEM_COLOR} strokeWidth="1" />
        <motion.circle cx="150" cy="50" r="8" fill="#a4c3b2" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5, ease: "easeInOut" }} />
        
        <line x1="100" y1="80" x2="80" y2="10" stroke={STEM_COLOR} strokeWidth="1" />
        <motion.circle cx="80" cy="10" r="4" fill="#a4c3b2" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 1, ease: "easeInOut" }} />
        
        <line x1="100" y1="80" x2="160" y2="110" stroke={STEM_COLOR} strokeWidth="1" />
        <motion.circle cx="160" cy="110" r="6" fill="#a4c3b2" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.2, repeat: Infinity, delay: 1.5, ease: "easeInOut" }} />
      </motion.g>
    </svg>
  );
}

// 2. Oval Berry Tree (Sweeping curve rightwards with clustered heads)
export function OvalBerryTree({ growth, color = "#587850", className = "" }: TreeProps) {
  const bloom = Math.max(0, growth - 0.6) * 2.5;
  const branchGrowth = Math.max(0, growth - 0.3) * 1.4;
  const lateBloom = Math.max(0, growth - 0.7) * 3.33;

  return (
    <svg viewBox="0 0 200 600" className={`overflow-visible ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.path
        d="M100 600 Q 30 350, 150 120"
        stroke={STEM_COLOR} strokeWidth={STEM_WIDTH} strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: growth }}
      />
      
      {/* Branch upward */}
      <motion.path
        d="M71 425 Q 130 380, 170 280"
        stroke={STEM_COLOR} strokeWidth="1.5" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: branchGrowth }}
      />

      <motion.g 
        initial={{ scale: 0, opacity: 0 }} 
        animate={{ scale: bloom, opacity: bloom }} 
        style={{ originX: "150px", originY: "120px", filter: `drop-shadow(0 0 15px ${color})` }}
      >
        <motion.ellipse cx="150" cy="120" rx="35" ry="70" fill={color} 
          animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} />
        <circle cx="150" cy="120" r="18" fill={color} />
        <motion.circle cx="130" cy="80" r="10" fill="#8fb086" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
        <motion.circle cx="170" cy="160" r="12" fill="#8fb086" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.5 }} />
        <motion.circle cx="170" cy="80" r="8" fill="#8fb086" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.8, repeat: Infinity, delay: 1 }} />
      </motion.g>

      <motion.g 
        initial={{ scale: 0, opacity: 0 }} 
        animate={{ scale: lateBloom, opacity: lateBloom }} 
        style={{ originX: "170px", originY: "280px", filter: `drop-shadow(0 0 10px ${color})` }}
      >
        <motion.circle cx="170" cy="280" r="24" fill={color} 
          animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.95, 1.05, 0.95] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
        <circle cx="170" cy="255" r="8" fill="#8fb086" />
      </motion.g>
    </svg>
  );
}

// 3. Flower Scallop Tree (Variant: Green floral abstraction)
export function FlowerScallopTree({ growth, color = "#587850", className = "" }: TreeProps) {
  const bloom = Math.max(0, growth - 0.6) * 2.5;

  return (
    <svg viewBox="0 0 200 600" className={`overflow-visible ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.path
        d="M100 600 C 50 450, 170 250, 100 80"
        stroke={STEM_COLOR} strokeWidth={STEM_WIDTH} strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: growth }}
      />
      <motion.path
        d="M100 600 C 58 458, 178 258, 105 85" // Twin stem
        stroke={STEM_COLOR} strokeWidth="1" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: growth }}
      />
      
      <motion.g 
        initial={{ scale: 0, opacity: 0 }} 
        animate={{ scale: bloom, opacity: bloom }} 
        style={{ originX: "100px", originY: "80px", filter: `drop-shadow(0 0 20px ${color})` }}
      >
        {/* Scallop petals in green hues */}
        <motion.g animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} style={{ originX: "100px", originY: "80px" }}>
          <circle cx="80" cy="65" r="35" fill="#587850" opacity="0.8" />
          <circle cx="120" cy="65" r="35" fill="#587850" opacity="0.8" />
          <circle cx="80" cy="100" r="35" fill="#587850" opacity="0.8" />
          <circle cx="120" cy="100" r="35" fill="#587850" opacity="0.8" />
        </motion.g>
        
        {/* Abstract overlays (pointed upwards) */}
        <motion.path d="M 100 45 Q 125 80 100 115 Q 75 80 100 45" fill="#4a6d4b" animate={{ scale: [0.95, 1.05, 0.95] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} style={{ originX: "100px", originY: "80px" }} />
        <path d="M 65 80 Q 100 55 135 80 Q 100 105 65 80" fill="#7ba376" opacity="0.8" />
        
        <circle cx="100" cy="80" r="12" fill="#1a1a1a" />
        <motion.circle cx="100" cy="80" r="4" fill="#ffffff" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
      </motion.g>
    </svg>
  );
}

// 4. Radial Dandelion Tree (organic node map)
export function DotGridTree({ growth, color = "#587850", className = "" }: TreeProps) {
  const bloom = Math.max(0, growth - 0.6) * 2.5;

  return (
    <svg viewBox="0 0 200 600" className={`overflow-visible ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.path
        d="M100 600 C 160 380, 40 220, 130 90"
        stroke={STEM_COLOR} strokeWidth={STEM_WIDTH} strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: growth }}
      />
      
      <motion.g 
        initial={{ scale: 0, opacity: 0 }} 
        animate={{ scale: bloom, opacity: bloom }} 
        style={{ originX: "130px", originY: "90px" }}
      >
        <motion.circle cx="130" cy="90" r="45" fill="#7cb4b8" animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
        {Array.from({ length: 18 }).map((_, i) => {
          const angle = (i / 18) * Math.PI * 2;
          const r = 40 + ((i * 7) % 25); // Pseudo-random radius
          const x = Number((130 + Math.cos(angle) * r).toFixed(2));
          const y = Number((90 + Math.sin(angle) * r).toFixed(2));
          const nodeR = 3 + ((i * 3) % 4); 
          const hue = ((i * 12) % 3) === 0 ? "#7cb4b8" : ((i * 7) % 2) === 0 ? "#a4c3b2" : "#6c9466";
          return (
            <g key={i}>
              <line x1="130" y1="90" x2={x} y2={y} stroke={STEM_COLOR} strokeWidth="0.5" opacity="0.6" />
              <motion.circle cx={x} cy={y} r={nodeR} fill={hue} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }} />
              <circle cx={x} cy={y} r={nodeR * 3} fill={hue} opacity="0.3" />
            </g>
          );
        })}
        <circle cx="130" cy="90" r="14" fill={color} />
        <circle cx="130" cy="90" r="5" fill="#f5f5f0" />
      </motion.g>
    </svg>
  );
}

// 5. Slim Stem Tree (Very dramatic sweeping curve)
export function SlimStemTree({ growth, color = "#587850", className = "" }: TreeProps) {
  const bloom = Math.max(0, growth - 0.6) * 2.5;
  const floatGrowth = Math.max(0, growth - 0.4) * 1.66;
  const lateBloom = Math.max(0, growth - 0.7) * 3.33;

  return (
    <svg viewBox="0 0 200 600" className={`overflow-visible ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.path
        d="M100 600 C 60 400, 190 280, 50 80"
        stroke={STEM_COLOR} strokeWidth="1.5" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: growth }}
      />
      
      {/* Little floating element */}
      <motion.path
        d="M50 80 C 30 70, 10 20, 40 0" 
        stroke={STEM_COLOR} strokeWidth="1.2" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: floatGrowth }}
      />
      
      <motion.g 
        initial={{ scale: 0, opacity: 0 }} 
        animate={{ scale: bloom, opacity: bloom }} 
        style={{ originX: "50px", originY: "80px", filter: `drop-shadow(0 0 20px ${color})` }}
      >
        <motion.circle cx="50" cy="80" r="32" fill="#abc79b" animate={{ opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} />
        <circle cx="50" cy="80" r="12" fill={color} />
        
        {/* Abstract organic floating shapes */}
        <motion.ellipse cx="15" cy="55" rx="18" ry="12" fill="#a4c3b2" opacity="0.7" animate={{ rotate: [-30, -20, -30] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ originX: "15px", originY: "55px" }} />
        <motion.circle cx="85" cy="45" r="26" fill="#86ad7e" opacity="0.6" animate={{ y: [0, -5, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} />
      </motion.g>

      <motion.g 
        initial={{ scale: 0, opacity: 0 }} 
        animate={{ scale: lateBloom, opacity: lateBloom }} 
        style={{ originX: "40px", originY: "0px", filter: `drop-shadow(0 0 10px #4b7545)` }}
      >
        <motion.circle cx="40" cy="0" r="7" fill="#4b7545" animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
      </motion.g>
    </svg>
  );
}

