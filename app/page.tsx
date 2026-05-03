"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ForestIntro from './components/ForestIntro';
import FlowerScene from './components/FlowerScene';
import ManifestoSection from './components/ManifestoSection';
import ImageSection from './components/ImageSection';
import Navigation from './components/Navigation';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <AnimatePresence mode="wait">
      {showIntro ? (
        <motion.div
          key="intro"
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <ForestIntro onComplete={() => setShowIntro(false)} />
        </motion.div>
      ) : (
        <motion.div
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.15 }}
          className="bg-[#f5f3ee]"
        >
          <Navigation />

          {/* Hero: 3D Flower Garden */}
          <section id="hero" className="h-[100dvh] w-full">
            <FlowerScene />
          </section>

          {/* Section 1: Manifesto */}
          <ManifestoSection />

          {/* Section 2: Project Gallery */}
          <ImageSection />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
