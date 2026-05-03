/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import ForestIntro from "./components/ForestIntro";
import PortfolioContent from "./components/PortfolioContent";

export default function App() {
  const [showContent, setShowContent] = useState(false);

  return (
    <main className="min-h-screen">
      <AnimatePresence mode="wait">
        {!showContent ? (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <ForestIntro onComplete={() => setShowContent(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <PortfolioContent />
          </motion.div>
        )
        }
      </AnimatePresence>
    </main>
  );
}

