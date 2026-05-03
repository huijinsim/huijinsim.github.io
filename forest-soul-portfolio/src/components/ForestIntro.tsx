/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RoundTree, TallTree, BlobTree, GeometricTree, SlimTree } from "./TreeGraphics";
import { MousePointer2 } from "lucide-react";

interface Seedling {
  id: number;
  x: number;
  y: number;
  type: number;
  growth: number;
}

export default function ForestIntro({ onComplete }: { onComplete: () => void }) {
  const [seedlings, setSeedlings] = useState<Seedling[]>([]);
  const [isReady, setIsReady] = useState(false);

  const addSeedling = (e: ReactMouseEvent) => {
    if (seedlings.length >= 12) return;
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newSeedling: Seedling = {
      id: Date.now(),
      x,
      y,
      type: Math.floor(Math.random() * 5),
      growth: 0.1,
    };

    setSeedlings([...seedlings, newSeedling]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSeedlings((prev) =>
        prev.map((s) => ({
          ...s,
          growth: Math.min(1, s.growth + 0.05),
        }))
      );
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (seedlings.length >= 8 && seedlings.every(s => s.growth >= 0.8)) {
      setIsReady(true);
    }
  }, [seedlings]);

  const renderTree = (s: Seedling) => {
    const props = { growth: s.growth, className: "w-24 h-48 sm:w-32 sm:h-64" };
    switch (s.type) {
      case 0: return <RoundTree {...props} />;
      case 1: return <TallTree {...props} />;
      case 2: return <BlobTree {...props} />;
      case 3: return <GeometricTree {...props} />;
      case 4: return <SlimTree {...props} />;
      default: return <RoundTree {...props} />;
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-cream cursor-crosshair select-none flex flex-col items-center justify-center p-8">
      <div className="absolute top-12 text-center pointer-events-none z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-serif text-forest mb-4"
        >
          Forest Soul
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.5 }}
          className="text-ink/60 max-w-md mx-auto"
        >
          {seedlings.length < 8 
            ? "Click anywhere to plant your forest. (Need 8 trees)"
            : "The forest is flourishing."}
        </motion.p>
      </div>

      <div 
        className="absolute inset-0 w-full h-full"
        onClick={addSeedling}
      >
        <AnimatePresence shadow-none>
          {seedlings.map((s) => (
            <motion.div
              key={s.id}
              initial={{ scale: 0, x: `${s.x}%`, y: `${s.y}%` }}
              animate={{ scale: 1, x: `${s.x}%`, y: `${s.y}%` }}
              style={{ position: 'absolute', transform: 'translate(-50%, -100%)' }}
              className="pointer-events-none origin-bottom"
            >
              {renderTree(s)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isReady && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="absolute bottom-24 z-20 px-8 py-3 bg-forest text-white rounded-full font-serif text-xl shadow-lg border-2 border-forest hover:bg-transparent hover:text-forest transition-colors"
        >
          Begin Journey
        </motion.button>
      )}

      {!isReady && seedlings.length === 0 && (
        <motion.div 
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-24 text-forest flex flex-col items-center gap-2"
        >
          <MousePointer2 className="w-8 h-8" />
          <span className="text-sm font-medium tracking-widest uppercase">Click to Bloom</span>
        </motion.div>
      )}
    </div>
  );
}
