"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-8 left-8 md:top-12 md:left-12 z-[100] p-4 text-[#587850] opacity-60 hover:opacity-100 hover:scale-105 transition-all cursor-pointer"
        aria-label="Open Menu"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="10" y1="6" x2="21" y2="6" />
          <line x1="10" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[200] bg-[#fff4e3ee] backdrop-blur-lg flex flex-col justify-center px-12 md:px-32"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-8 left-8 md:top-12 md:left-12 p-4 hover:scale-110 transition-all cursor-pointer text-[#587850] opacity-60 hover:opacity-100"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <nav className="flex flex-col gap-10 font-sans font-medium text-4xl md:text-6xl text-[#587850] tracking-widest relative">
              <div className="absolute left-[-2rem] top-0 bottom-0 w-[1px] bg-[#587850]/40 hidden md:block" />
              
              <Link href="#manifesto" onClick={() => setIsOpen(false)} className="opacity-40 hover:opacity-100 hover:translate-x-6 transition-all duration-500 w-fit">
                MANIFESTO
              </Link>
              <Link href="#gallery" onClick={() => setIsOpen(false)} className="opacity-40 hover:opacity-100 hover:translate-x-6 transition-all duration-500 w-fit">
                PROJECTS
              </Link>
              <Link href="#" onClick={() => setIsOpen(false)} className="opacity-40 hover:opacity-100 hover:translate-x-6 transition-all duration-500 w-fit">
                ARCHIVE
              </Link>
              <Link href="#" onClick={() => setIsOpen(false)} className="opacity-40 hover:opacity-100 hover:translate-x-6 transition-all duration-500 w-fit">
                INFO
              </Link>
            </nav>
            
            <div className="absolute bottom-12 left-12 md:left-32 text-xs tracking-[0.3em] font-sans text-[#1A1A1A]/40">
              © {new Date().getFullYear()} ALL RIGHTS RESERVED
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
