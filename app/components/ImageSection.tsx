"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ImageSlot {
  id: number;
  src: string | null;
  label: string;
}

const INITIAL_SLOTS: ImageSlot[] = [
  { id: 0, src: null, label: "IMAGE 01" },
  { id: 1, src: null, label: "IMAGE 02" },
  { id: 2, src: null, label: "IMAGE 03" },
];

export default function ImageSection() {
  const [slots, setSlots] = useState<ImageSlot[]>(INITIAL_SLOTS);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFile = (id: number, file: File) => {
    const url = URL.createObjectURL(file);
    setSlots(prev => prev.map(s => s.id === id ? { ...s, src: url } : s));
  };

  const handleChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(id, file);
  };

  const handleDrop = (id: number, e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleFile(id, file);
  };

  return (
    <section id="gallery" className="min-h-[100dvh] w-full flex flex-col justify-center items-center py-20 px-6 md:px-12 select-none relative overflow-hidden bg-transparent">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(88,120,80,0.06) 0%, transparent 60%)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full max-w-5xl flex flex-col items-center gap-10 z-10"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl md:text-4xl font-sans font-medium tracking-widest text-[#587850]">PROJECT GALLERY</h2>
          <p className="mt-3 text-xs md:text-sm text-[#1A1A1A]/60 tracking-widest">새로운 서사가 담긴 시각적 결과물</p>
        </div>

        {/* Image Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {slots.map((slot, i) => (
            <motion.div
              key={slot.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
            >
              <div
                className="aspect-[4/5] rounded-sm border border-[#587850]/30 bg-[#F5F5F0] overflow-hidden relative group cursor-pointer hover:border-[#587850]/60 transition-all duration-500"
                onClick={() => inputRefs.current[slot.id]?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(slot.id, e)}
              >
                <input
                  ref={el => { inputRefs.current[slot.id] = el; }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleChange(slot.id, e)}
                />

                <AnimatePresence mode="wait">
                  {slot.src ? (
                    <motion.img
                      key="img"
                      src={slot.src}
                      alt={slot.label}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                    >
                      {/* Grid texture */}
                      <div
                        className="absolute inset-0 opacity-[0.035]"
                        style={{
                          backgroundImage:
                            "linear-gradient(#c8d4bc 1px, transparent 1px), linear-gradient(90deg, #c8d4bc 1px, transparent 1px)",
                          backgroundSize: "32px 32px",
                        }}
                      />

                      <svg
                        width="26" height="26" viewBox="0 0 24 24"
                        fill="none" stroke="#587850" strokeWidth="1.2"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="opacity-40 group-hover:opacity-80 transition-opacity duration-500 relative z-10"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>

                      <span className="text-[10px] font-sans tracking-[0.2em] text-[#587850] opacity-40 group-hover:opacity-80 transition-opacity duration-500 relative z-10">
                        {slot.label}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Uploaded image overlay hint */}
                {slot.src && (
                  <div className="absolute inset-0 bg-[#fff4e3]/0 group-hover:bg-[#fff4e3]/60 transition-all duration-400 flex items-center justify-center">
                    <span className="text-[#1A1A1A]/0 group-hover:text-[#1A1A1A]/80 text-[10px] tracking-widest transition-all duration-400">
                      변경하기
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-[#1A1A1A]/40 text-[10px] tracking-widest text-center">
          클릭 또는 드래그하여 이미지 추가
        </p>
      </motion.div>
    </section>
  );
}
