/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";

interface TreeProps {
  growth: number;
  color?: string;
  className?: string;
}

export function RoundTree({ growth, color = "#587850", className = "" }: TreeProps) {
  return (
    <svg viewBox="0 0 100 150" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.rect
        x="47"
        y={150 - 50 * growth}
        width="6"
        height={50 * growth}
        fill="#8B4513"
        initial={{ height: 0 }}
        animate={{ height: 50 * growth, y: 150 - 50 * growth }}
      />
      <motion.circle
        cx="50"
        cy={100 - 30 * growth}
        r={30 * growth}
        fill={color}
        initial={{ r: 0 }}
        animate={{ r: 30 * growth, cy: 100 - 30 * growth }}
      />
      <motion.circle
        cx="50"
        cy={70 - 20 * growth}
        r={25 * growth}
        fill={color}
        style={{ opacity: 0.8 }}
        initial={{ r: 0 }}
        animate={{ r: 25 * growth, cy: 70 - 20 * growth }}
      />
    </svg>
  );
}

export function TallTree({ growth, color = "#587850", className = "" }: TreeProps) {
  return (
    <svg viewBox="0 0 100 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.rect
        x="48"
        y={200 - 180 * growth}
        width="4"
        height={180 * growth}
        fill="#3d2b1f"
        animate={{ height: 180 * growth, y: 200 - 180 * growth }}
      />
      {[0.2, 0.4, 0.6, 0.8].map((pos, i) => (
        <motion.circle
          key={i}
          cx={50 + (i % 2 === 0 ? 10 : -10) * growth}
          cy={200 - 180 * growth * pos}
          r={15 * growth}
          fill={color}
          initial={{ scale: 0 }}
          animate={{ scale: growth }}
          transition={{ delay: i * 0.1 }}
        />
      ))}
    </svg>
  );
}

export function BlobTree({ growth, color = "#587850", className = "" }: TreeProps) {
  return (
    <svg viewBox="0 0 120 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.path
        d="M55 160V120"
        stroke="#4a3728"
        strokeWidth="10"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: growth }}
      />
      <motion.path
        d="M60 120C30 120 10 100 10 70C10 40 40 10 60 10C80 10 110 40 110 70C110 100 90 120 60 120Z"
        fill={color}
        initial={{ scale: 0, transformOrigin: "bottom" }}
        animate={{ scale: growth }}
      />
      <motion.circle
        cx="40"
        cy="50"
        r={8 * growth}
        fill="#2d3d29"
        animate={{ opacity: growth }}
      />
      <motion.circle
        cx="80"
        cy="70"
        r={6 * growth}
        fill="#2d3d29"
        animate={{ opacity: growth }}
      />
    </svg>
  );
}

export function GeometricTree({ growth, color = "#587850", className = "" }: TreeProps) {
  return (
    <svg viewBox="0 0 100 150" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.rect
        x="45"
        y={150 - 40 * growth}
        width="10"
        height={40 * growth}
        fill="#5a4033"
        animate={{ height: 40 * growth, y: 150 - 40 * growth }}
      />
      <motion.rect
        x={20 + (1 - growth) * 30}
        y={110 - 80 * growth}
        width={60 * growth}
        height={80 * growth}
        fill={color}
        animate={{ 
          width: 60 * growth, 
          height: 80 * growth, 
          y: 110 - 80 * growth,
          x: 20 + (1 - growth) * 30
        }}
      />
    </svg>
  );
}

export function SlimTree({ growth, color = "#587850", className = "" }: TreeProps) {
  return (
    <svg viewBox="0 0 80 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.rect
        x="38"
        y={180 - 150 * growth}
        width="4"
        height={150 * growth}
        fill="#1a1a1a"
        animate={{ height: 150 * growth, y: 180 - 150 * growth }}
      />
      <motion.path
        d="M40 30L10 90H70L40 30Z"
        fill={color}
        initial={{ scale: 0, transformOrigin: "bottom" }}
        animate={{ scale: growth }}
      />
    </svg>
  );
}
