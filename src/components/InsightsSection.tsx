import { useState } from 'react';
import { ChevronDown, ChevronUp, Network, Database, Layers, CircleCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function InsightsSection() {
  const [huffmanOpen, setHuffmanOpen] = useState(false);
  const [lzwOpen, setLzwOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 py-4 select-none">
      
      {/* Title block */}
      <div className="mb-6">
        <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-semibold block">
          Algorithmic Mechanism Explanations
        </span>
        <h2 className="text-xl font-bold text-white tracking-tight mt-1 font-sans">
          Deep Dive Algorithmic Mechanics
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Huffman Coding Insight Block */}
        <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 border border-cyan-500/10">
          <button
            id="toggle-huffman-insights-btn"
            onClick={() => setHuffmanOpen(!huffmanOpen)}
            className="w-full text-left p-6 flex justify-between items-center bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Network className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-none">
                  Huffman Codebook Logic
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 uppercase font-mono tracking-wide">
                  Probability-Weighted Bit Trees
                </p>
              </div>
            </div>

            <div className="p-1 rounded-lg bg-slate-900 border border-white/[0.05] text-slate-400">
              {huffmanOpen ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          <AnimatePresence>
            {huffmanOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 pb-6 border-t border-white/[0.04] bg-slate-950/20 text-xs text-slate-300 space-y-4"
              >
                <div className="mt-4 space-y-2">
                  <p className="leading-relaxed">
                    Huffman Coding is a loss-less entropy encoding algorithm. It operates by analyzing symbol occurrence ratios (probabilities) inside data packages to construct premium variable-length codestream trees where higher-frequency symbols occupy shorter pathways.
                  </p>
                  <p className="leading-relaxed">
                    This method makes use of binary structural traversals to ensure that no symbol code forms a prefix for another (Self-Prefix property), ensuring conflict-free, sequential decoding.
                  </p>
                </div>

                <div className="p-3 bg-cyan-950/20 rounded-xl border border-cyan-500/10 space-y-1.5 font-mono text-[10.5px]">
                  <span className="text-cyan-400 font-bold block uppercase tracking-wider">Use-Case Alignment:</span>
                  <p className="text-slate-300 leading-relaxed">
                    Suitable for plain multilingual textbooks, text records and character assets where some symbols map significantly higher weights (e.g. English letter 'e', 'a' vs 'q', 'z').
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Logical Complexity Details:</span>
                  <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
                    <div className="bg-slate-900/60 p-2 rounded-lg border border-white/[0.03]">
                      <span className="text-slate-500 block">TIME BOUNDS</span>
                      <span className="text-cyan-400 font-bold">O(N log K)</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-lg border border-white/[0.03]">
                      <span className="text-slate-500 block">SPACE BOUNDS</span>
                      <span className="text-cyan-400 font-bold">O(K) lookup tables</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. LZW Coding Insight Block */}
        <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 border border-purple-500/10">
          <button
            id="toggle-lzw-insights-btn"
            onClick={() => setLzwOpen(!lzwOpen)}
            className="w-full text-left p-6 flex justify-between items-center bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Database className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-none">
                  LZW Dynamic Dictionary Logic
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 uppercase font-mono tracking-wide">
                  Adaptive Sequence Mappings
                </p>
              </div>
            </div>

            <div className="p-1 rounded-lg bg-slate-900 border border-white/[0.05] text-slate-400">
              {lzwOpen ? <ChevronUp className="w-4 h-4 text-purple-400" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          <AnimatePresence>
            {lzwOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 pb-6 border-t border-white/[0.04] bg-slate-950/20 text-xs text-slate-300 space-y-4"
              >
                <div className="mt-4 space-y-2">
                  <p className="leading-relaxed">
                    LZW (Lempel-Ziv-Welch) is an adaptive dictionary-based compression algorithm. Unlike Huffman, it does not require a prior probability profile or custom frequency counts. It reads streams sequentially, compiling recurring sequences into a dictionary array.
                  </p>
                  <p className="leading-relaxed">
                    By converting longer phrases into single integer token keys on-the-fly, high-redundancy streams map rapidly into tightly constrained bits with massive compression ratios.
                  </p>
                </div>

                <div className="p-3 bg-purple-950/20 rounded-xl border border-purple-500/10 space-y-1.5 font-mono text-[10.5px]">
                  <span className="text-purple-400 font-bold block uppercase tracking-wider">Use-Case Alignment:</span>
                  <p className="text-slate-300 leading-relaxed">
                    Extremely suitable for structured datasets (CSV table grids, server log sheets, repeated text, genomic chains or program files) with recurrences of word clusters and formatting tags.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Logical Complexity Details:</span>
                  <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
                    <div className="bg-slate-900/60 p-2 rounded-lg border border-white/[0.03]">
                      <span className="text-slate-500 block">TIME BOUNDS</span>
                      <span className="text-purple-400 font-bold">O(N) sequential</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-lg border border-white/[0.03]">
                      <span className="text-slate-500 block">SPACE BOUNDS</span>
                      <span className="text-purple-400 font-bold">O(M) dynamic dictionary</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
