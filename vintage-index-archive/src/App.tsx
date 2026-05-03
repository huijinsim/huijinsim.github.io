/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronDown, Folder, Search, Info, Archive, BookOpen, Clock } from 'lucide-react';

interface IndexItem {
  id: string;
  category: string;
  code: string;
  number: string;
  title: string;
  description: string;
  details: string[];
}

const INDEX_DATA: IndexItem[] = [
  {
    id: '1',
    category: 'General',
    code: 'Gem',
    number: '165',
    title: 'Correspondence Storage',
    description: 'Guidelines and protocols for the systematic archiving of physical and digital correspondence.',
    details: [
      'Standardized filing procedures',
      'Retention schedules for various document types',
      'Cross-referencing methodology',
      'Security protocols for sensitive data'
    ]
  },
  {
    id: '2',
    category: 'General',
    code: 'Gei',
    number: '164',
    title: 'Personnel Records',
    description: 'Comprehensive documentation regarding staff history, performance evaluations, and training.',
    details: [
      'Employee onboarding checklists',
      'Performance review cycles',
      'Professional development tracking',
      'Confidentiality agreements'
    ]
  },
  {
    id: '3',
    category: 'General',
    code: 'Ge',
    number: '163',
    title: 'Financial Ledger',
    description: 'Detailed accounts of departmental expenditures, budget allocations, and fiscal reports.',
    details: [
      'Quarterly budget summaries',
      'Expense reimbursement policies',
      'Vendor contract management',
      'Audit preparation guidelines'
    ]
  },
  {
    id: '4',
    category: 'General',
    code: 'Gar',
    number: '162',
    title: 'Inventory Control',
    description: 'Management of physical assets, equipment maintenance logs, and procurement records.',
    details: [
      'Asset tagging system',
      'Maintenance schedule for office equipment',
      'Procurement request workflow',
      'Disposal of obsolete assets'
    ]
  },
  {
    id: '5',
    category: 'General',
    code: 'G',
    number: '161',
    title: 'Operations Manual',
    description: 'Core operational procedures and standard operating guidelines for daily activities.',
    details: [
      'Daily opening and closing procedures',
      'Emergency response protocols',
      'Communication hierarchy',
      'Facility management contacts'
    ]
  }
];

export default function App() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-12 border-b-2 border-[#2d2d2d] pb-6 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest opacity-60 mb-1">
            <Archive size={14} />
            <span>Archive System v2.14</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-typewriter tracking-tighter">SPEED INDEX</h1>
        </div>
        <div className="text-right font-mono text-xs uppercase tracking-tighter opacity-70">
          <p>Correspondence Storage</p>
          <p>Ref: Ch. 2 / Page 27</p>
        </div>
      </header>

      {/* Search Bar (Visual only for aesthetic) */}
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none opacity-40">
          <Search size={18} />
        </div>
        <input 
          type="text" 
          placeholder="SEARCH ARCHIVE..." 
          className="w-full bg-transparent border-2 border-[#2d2d2d] py-3 pl-10 pr-4 font-typewriter text-lg focus:outline-none focus:bg-white/30 transition-colors placeholder:opacity-30"
        />
      </div>

      {/* Index Stack */}
      <div className="space-y-[-2px]">
        {INDEX_DATA.map((item, index) => (
          <IndexCard 
            key={item.id}
            item={item}
            isExpanded={expandedId === item.id}
            onToggle={() => toggleExpand(item.id)}
            zIndex={INDEX_DATA.length - index}
          />
        ))}
      </div>

      {/* Footer Info */}
      <footer className="mt-16 pt-8 border-t border-[#2d2d2d]/20 flex flex-col md:flex-row justify-between gap-6 text-[#2d2d2d]/60 font-mono text-[10px] uppercase tracking-widest">
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <Clock size={12} />
            <span>Last Updated: 12 APR 1965</span>
          </div>
          <div className="flex items-center gap-2">
            <Info size={12} />
            <span>Classification: Restricted</span>
          </div>
        </div>
        <p>© 1965 General Storage Corp. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

interface IndexCardProps {
  key?: string | number;
  item: IndexItem;
  isExpanded: boolean;
  onToggle: () => void;
  zIndex: number;
}

function IndexCard({ 
  item, 
  isExpanded, 
  onToggle,
  zIndex 
}: IndexCardProps) {
  return (
    <div 
      className="relative group"
      style={{ zIndex }}
    >
      {/* The Tab */}
      <button
        onClick={onToggle}
        className={`
          relative flex items-end h-10 transition-all duration-300 w-full text-left
          ${isExpanded ? 'mb-0' : 'hover:-translate-y-1'}
        `}
      >
        {/* Tab Shape */}
        <div className={`
          relative h-full px-6 flex items-center gap-4 border-2 border-b-0 border-[#2d2d2d] rounded-t-lg bg-[#e8e6dc]
          shadow-[2px_-2px_0px_rgba(45,45,45,0.1)]
          ${isExpanded ? 'bg-white' : 'group-hover:bg-[#fcfbf7]'}
        `}>
          <span className="font-typewriter text-lg font-bold min-w-[3rem] text-left">{item.code}</span>
          <span className="font-mono text-sm opacity-60 border-l border-[#2d2d2d]/20 pl-4">{item.number}</span>
          <span className="font-typewriter text-sm ml-4 hidden sm:inline">{item.title}</span>
        </div>
        
        {/* Decorative Line to the right of the tab */}
        <div className="flex-grow border-b-2 border-[#2d2d2d] h-full mb-[-2px] ml-[-2px] relative z-[-1]"></div>
      </button>

      {/* The Card Body */}
      <motion.div
        initial={false}
        animate={{ 
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
          marginTop: isExpanded ? 0 : -2
        }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="overflow-hidden border-2 border-[#2d2d2d] bg-white shadow-[4px_4px_0px_rgba(45,45,45,0.1)] rounded-b-lg rounded-tr-lg"
      >
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-grow space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-typewriter mb-2">{item.title}</h2>
                  <p className="text-sm font-mono uppercase tracking-wider opacity-50 mb-4">
                    Category: {item.category} / Index: {item.code}-{item.number}
                  </p>
                </div>
                <div className="p-3 bg-[#f2f0e9] border border-[#2d2d2d]/10 rounded">
                  <BookOpen className="opacity-40" size={24} />
                </div>
              </div>
              
              <p className="text-lg leading-relaxed font-sans text-[#444]">
                {item.description}
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                {item.details.map((detail, i) => (
                  <div key={i} className="flex items-start gap-3 group/item">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2d2d2d] opacity-30 group-hover/item:opacity-100 transition-opacity" />
                    <span className="text-sm font-sans opacity-80">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Sidebar info on expanded card */}
            <div className="md:w-48 flex-shrink-0 border-t md:border-t-0 md:border-l border-[#2d2d2d]/10 pt-6 md:pt-0 md:pl-8 space-y-6">
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-widest opacity-40 mb-2">Access Level</h4>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-xs font-mono">LEVEL 4</span>
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-widest opacity-40 mb-2">Last Audit</h4>
                <p className="text-xs font-mono">MAR 1965</p>
              </div>
              <button className="w-full py-2 border border-[#2d2d2d] text-[10px] font-mono uppercase tracking-widest hover:bg-[#2d2d2d] hover:text-white transition-colors">
                Request Access
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Visual spacer for closed cards to maintain the "stacked" look */}
      {!isExpanded && (
        <div className="h-1 border-b-2 border-[#2d2d2d] opacity-20 mx-2" />
      )}
    </div>
  );
}

