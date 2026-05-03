"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Smartphone, Activity, Info, Zap, Flower, Trees, Plus, Save, RotateCcw } from 'lucide-react';
import LifeTree from './LifeTree';
import { MOCK_DATA } from './constants';
import { ViewMode, ScreenTimeData } from './types';

export default function Dashboard() {
  const [hoveredItem, setHoveredItem] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('flower');
  const [data, setData] = useState<ScreenTimeData>(MOCK_DATA);
  const [isEditing, setIsEditing] = useState(false);

  const formatMinutes = (m: number) => {
    const hours = Math.floor(m / 60);
    const mins = m % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleUpdateMinutes = (categoryIndex: number, appIndex: number, minutes: number) => {
    const newData = { ...data };
    newData.categories[categoryIndex].children[appIndex].minutes = Math.max(0, minutes);
    
    // Recalculate total
    newData.totalMinutes = newData.categories.reduce((acc, cat) => 
      acc + cat.children.reduce((a, b) => a + b.minutes, 0), 0
    );
    
    setData(newData);
  };

  const isFlower = viewMode === 'flower';

  return (
    <div className={`relative min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_350px] transition-colors duration-700 overflow-hidden ${isFlower ? 'bg-[#F5F5F0]' : 'bg-[#0A0A0A]'}`}>
      
      {/* Main Visualization View */}
      <main className="relative flex flex-col items-center justify-center p-8">
        
        {/* Compact Header */}
        <div className="absolute top-8 left-8 max-w-[280px] z-20 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={isFlower ? 'text-ink' : 'text-white'}
          >
            <h1 className="font-serif text-3xl leading-tight tracking-tight">
              Chronos <span className="italic font-light opacity-60">Garden</span>
            </h1>
            <p className="mt-2 font-serif text-xs opacity-50 italic">
              {isFlower 
                ? "Detailed app blooms reflecting specific activity trails."
                : "The aggregate ascending structure of your daily focus."}
            </p>
          </motion.div>
        </div>

        {/* View Switcher Overlay */}
        <div className="absolute top-8 right-8 z-30 flex gap-2">
          <button 
            onClick={() => setViewMode('flower')}
            className={`p-3 rounded-full border transition-all ${isFlower ? 'bg-ink text-white border-ink' : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'}`}
            title="Flower View"
          >
            <Flower size={18} />
          </button>
          <button 
            onClick={() => setViewMode('tree')}
            className={`p-3 rounded-full border transition-all ${!isFlower ? 'bg-white text-black border-white' : 'bg-transparent text-ink/40 border-ink/10 hover:border-ink/30'}`}
            title="Tree View"
          >
            <Trees size={18} />
          </button>
        </div>

        {/* The Garden / Tree */}
        <div className="w-full h-[85vh] flex items-center justify-center">
          <LifeTree data={data} mode={viewMode} onHover={setHoveredItem} />
        </div>

        {/* Legend */}
        <div className="absolute bottom-8 left-8 flex gap-8 items-end z-10">
          <div className="flex flex-col">
            <span className={`font-mono text-[9px] uppercase tracking-widest mb-2 ${isFlower ? 'text-ink/30' : 'text-white/20'}`}>Visual Context</span>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full border ${isFlower ? 'border-ink/20' : 'border-white/20'}`} />
                <span className={`font-serif italic text-[10px] ${isFlower ? 'text-ink/40' : 'text-white/30'}`}>{isFlower ? 'App Petals' : 'Activity Branches'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Input Toggle */}
        <div className="absolute bottom-8 right-8 z-30">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all ${isFlower ? 'bg-ink text-white shadow-xl hover:scale-105' : 'bg-white text-black shadow-xl hover:scale-105'}`}
          >
            {isEditing ? <Save size={14} /> : <Plus size={14} />}
            {isEditing ? 'Close Editor' : 'Adjust Life Cycles'}
          </button>
        </div>

        {/* Data Entry Panel */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className={`absolute bottom-24 right-8 w-80 max-h-[60vh] overflow-y-auto rounded-3xl p-6 z-40 border shadow-2xl ${isFlower ? 'bg-white border-ink/5' : 'bg-[#181818] border-white/10 text-white'}`}
            >
              <h3 className="font-mono text-[10px] uppercase tracking-widest mb-6 opacity-40">Modify Activity (min)</h3>
              <div className="space-y-6">
                {data.categories.map((cat, catIdx) => (
                  <div key={cat.name} className="space-y-3">
                    <h4 className="font-serif italic text-sm border-b border-current opacity-40 pb-1">{cat.name}</h4>
                    <div className="space-y-2">
                      {cat.children.map((app, appIdx) => (
                        <div key={app.name} className="flex items-center justify-between gap-4">
                          <span className="font-serif text-sm truncate opacity-70">{app.name}</span>
                          <input 
                            type="number"
                            value={app.minutes}
                            onChange={(e) => handleUpdateMinutes(catIdx, appIdx, parseInt(e.target.value) || 0)}
                            className={`w-16 px-2 py-1 font-mono text-xs text-right rounded transition-colors ${isFlower ? 'bg-ink/5 hover:bg-ink/10 focus:bg-ink/10 outline-none' : 'bg-white/5 hover:bg-white/10 focus:bg-white/10 outline-none'}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setData(MOCK_DATA)}
                className={`mt-8 w-full py-3 rounded-xl font-mono text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 border transition-all ${isFlower ? 'border-ink/10 hover:bg-ink/5' : 'border-white/10 hover:bg-white/5'}`}
              >
                <RotateCcw size={12} /> Reset to Defaults
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Sidebar - Data Analysis */}
      <aside className={`p-8 flex flex-col justify-between border-l transition-colors duration-700 ${isFlower ? 'bg-white border-ink/5' : 'bg-[#111111] border-white/5 text-white'}`}>
        <div className="space-y-12">
          {/* Global Stats */}
          <section>
            <h2 className={`font-mono text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2 ${isFlower ? 'text-ink/40' : 'text-white/30'}`}>
              <Activity size={12} />
              Telemetry
            </h2>
            <div className="space-y-4">
              <div>
                <span className={`block font-serif italic text-xs mb-1 ${isFlower ? 'text-ink/60' : 'text-white/50'}`}>Life Investment</span>
                <span className="font-mono text-3xl">{formatMinutes(data.totalMinutes)}</span>
              </div>
              <div className={`grid grid-cols-2 gap-4 pt-4 border-t ${isFlower ? 'border-ink/5' : 'border-white/5'}`}>
                <div>
                  <span className={`block font-mono text-[9px] uppercase mb-1 ${isFlower ? 'text-ink/30' : 'text-white/20'}`}>Categories</span>
                  <span className="font-mono text-lg">{data.categories.length}</span>
                </div>
                <div>
                  <span className={`block font-mono text-[9px] uppercase mb-1 ${isFlower ? 'text-ink/30' : 'text-white/20'}`}>Efficiency</span>
                  <span className="font-mono text-lg">74%</span>
                </div>
              </div>
            </div>
          </section>

          {/* Contextual Detail Card */}
          <section className="min-h-[200px]">
            <AnimatePresence mode="wait">
              {hoveredItem ? (
                <motion.div
                  key={hoveredItem.name}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4"
                >
                  <h2 className={`font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 ${isFlower ? 'text-ink/40' : 'text-white/30'}`}>
                    <Info size={12} />
                    Trace Details
                  </h2>
                  <div className="space-y-2">
                    <div 
                      className="w-8 h-1 rounded-full mb-3" 
                      style={{ backgroundColor: hoveredItem.color }}
                    />
                    <h3 className="font-serif text-3xl leading-none">{hoveredItem.name}</h3>
                    <p className="font-mono text-xl opacity-80">{formatMinutes(hoveredItem.value || hoveredItem.minutes)}</p>
                    <p className="font-serif italic opacity-40 text-xs">
                      {hoveredItem.value 
                        ? `${((hoveredItem.value / data.totalMinutes) * 100).toFixed(1)}% of sampled lifespan`
                        : `${hoveredItem.children?.length || 0} active modules`}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center py-8"
                >
                  <Zap size={16} className={`${isFlower ? 'text-ink/10' : 'text-white/10'} mb-4`} />
                  <p className={`font-serif italic text-xs ${isFlower ? 'text-ink/30' : 'text-white/20'}`}>
                    Select an organism branch <br />to decode visual data.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        {/* Footer */}
        <div className={`pt-8 border-t ${isFlower ? 'border-ink/5' : 'border-white/5'}`}>
          <div className="flex items-center justify-between opacity-30">
            <span className="font-mono text-[8px] tracking-[0.2em] uppercase">Temporal Atlas</span>
            <Smartphone size={10} />
          </div>
        </div>
      </aside>
    </div>
  );
}
