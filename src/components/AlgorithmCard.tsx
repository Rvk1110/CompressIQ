import { HuffmanResult, LzwResult } from '../types';
import { Network, Database, Info, Binary, TableProperties, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AlgorithmCardProps {
  huffman: HuffmanResult;
  lzw: LzwResult;
}

export default function AlgorithmCard({ huffman, lzw }: AlgorithmCardProps) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 space-y-6">
      
      {/* Centered Collapsible Technical Details Trigger */}
      <div className="flex justify-center pb-2">
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="px-6 py-2.5 rounded-xl bg-slate-900 border border-white/[0.08] hover:border-cyan-500/40 text-xs font-mono tracking-wider uppercase font-bold text-slate-300 hover:text-cyan-400 transition-all cursor-pointer shadow-md flex items-center gap-2"
        >
          {showTechnicalDetails ? (
            <>
              <ChevronUp className="w-4 h-4 text-cyan-400 animate-bounce" />
              <span>Hide Technical Details</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 text-cyan-400" />
              <span>Show Technical Details</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 1. Huffman Coding Card - Blue & Cyan */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card-blue rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between group select-none glow-cyan"
        >
          <div>
            {/* Header row */}
            <div className="flex justify-between items-start gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-inner">
                  <Network className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-wide">
                    Huffman Encoder
                  </h3>
                  <p className="text-[11px] text-cyan-400 font-mono font-medium tracking-wide uppercase">
                    Probability & Frequency-Based
                  </p>
                </div>
              </div>

              <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 shadow-sm">
                Frequency-Based
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Constructs variable-length codebooks by grouping characters in a priority tree based on individual frequencies. Highly optimal for assets with uneven, high symbol distributions.
            </p>

            {/* Core metrics stack inside the card */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              
              <div className="bg-slate-950/60 border border-white/[0.04] p-3.5 rounded-2xl">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">
                  Compressed Footprint
                </span>
                <span className="text-lg font-black text-white block mt-1 font-sans">
                  {formatBytes(huffman.compressedSizeBytes)}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {huffman.compressedSizeBytes.toLocaleString()} bytes
                </span>
              </div>

              <div className="bg-slate-950/60 border border-white/[0.04] p-3.5 rounded-2xl">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">
                  Compression Ratio
                </span>
                <span className={`text-lg font-black block mt-1 font-mono ${huffman.ratio >= 1 ? 'text-cyan-400' : 'text-rose-400'}`}>
                  {huffman.ratio}x
                </span>
                {huffman.spaceSavedPercent >= 0 ? (
                  <span className="text-[10px] font-mono text-emerald-400">
                    {huffman.spaceSavedPercent}% Space Saved
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-rose-400 font-bold">
                    {Math.abs(huffman.spaceSavedPercent)}% Expansion (Inefficient)
                  </span>
                )}
              </div>

              <div className="bg-slate-950/60 border border-white/[0.04] p-3.5 rounded-2xl">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">
                  Execution Time
                </span>
                <span className="text-lg font-black text-white block mt-1 font-mono">
                  {huffman.executionTimeMs} ms
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  High-precision
                </span>
              </div>

              <div className="bg-slate-950/60 border border-white/[0.04] p-3.5 rounded-2xl">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">
                  Algorithmic Complexity
                </span>
                <span className="text-lg font-black text-blue-400 block mt-1 font-mono">
                  {huffman.complexity}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {huffman.treeNodeCount} Active Nodes
                </span>
              </div>

            </div>

            {/* Encoded Preview Segment - Collapsible */}
            <AnimatePresence>
              {showTechnicalDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-950/80 rounded-2xl border border-white/[0.06] p-4.5 relative group/preview overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      <Binary className="w-3.5 h-3.5 text-cyan-500" />
                      Bitstream Encoding Preview
                    </div>
                  </div>
                  
                  <p className="text-[11.5px] font-mono text-slate-300 break-all leading-relaxed select-text select-all font-medium whitespace-pre-wrap max-h-24 overflow-y-auto pr-1">
                    {huffman.encodedPreview || 'No bitstream generated. Please execute pipeline.'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dynamic codebook status footnote */}
          <div className="mt-5 pt-3.5 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1">
              <Info className="w-3 h-3 text-cyan-400" /> Huffman entropy calculated successfully
            </span>
            <span>ENTRIES: {Object.keys(huffman.codeMap).length} LEAVES</span>
          </div>

        </motion.div>

        {/* 2. LZW Coding Card - Purple & Pink */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card-purple rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between group select-none glow-purple"
        >
          <div>
            {/* Header row */}
            <div className="flex justify-between items-start gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-inner">
                  <Database className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-wide">
                    LZW Dictionary
                  </h3>
                  <p className="text-[11px] text-purple-400 font-mono font-medium tracking-wide uppercase">
                    Prefix & Dictionary-Based
                  </p>
                </div>
              </div>

              <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/25 shadow-sm">
                Dictionary-Based
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Builds an adaptive dictionary map matching repetitive sequence patterns. Highly optimal for sources that contain many duplicate phrases, matrices, or repeated log formats.
            </p>

            {/* Core metrics stack inside the card */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              
              <div className="bg-slate-950/60 border border-white/[0.04] p-3.5 rounded-2xl">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">
                  Compressed Footprint
                </span>
                <span className="text-lg font-black text-white block mt-1 font-sans">
                  {formatBytes(lzw.compressedSizeBytes)}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {lzw.compressedSizeBytes.toLocaleString()} bytes
                </span>
              </div>

              <div className="bg-slate-950/60 border border-white/[0.04] p-3.5 rounded-2xl">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">
                  Compression Ratio
                </span>
                <span className={`text-lg font-black block mt-1 font-mono ${lzw.ratio >= 1 ? 'text-purple-400' : 'text-rose-400'}`}>
                  {lzw.ratio}x
                </span>
                {lzw.spaceSavedPercent >= 0 ? (
                  <span className="text-[10px] font-mono text-emerald-400">
                    {lzw.spaceSavedPercent}% Space Saved
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-rose-400 font-bold">
                    {Math.abs(lzw.spaceSavedPercent)}% Expansion (Inefficient)
                  </span>
                )}
              </div>

              <div className="bg-slate-950/60 border border-white/[0.04] p-3.5 rounded-2xl">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">
                  Execution Time
                </span>
                <span className="text-lg font-black text-white block mt-1 font-mono">
                  {lzw.executionTimeMs} ms
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  High-precision
                </span>
              </div>

              <div className="bg-slate-950/60 border border-white/[0.04] p-3.5 rounded-2xl">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">
                  Algorithmic Complexity
                </span>
                <span className="text-lg font-black text-pink-400 block mt-1 font-mono">
                  {lzw.complexity}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {lzw.dictionarySize} Active Glyphs
                </span>
              </div>

            </div>

            {/* Encoded Preview Segment - Collapsible */}
            <AnimatePresence>
              {showTechnicalDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-950/80 rounded-2xl border border-white/[0.06] p-4.5 relative group/preview overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      <TableProperties className="w-3.5 h-3.5 text-purple-500" />
                      Index Token Array Preview
                    </div>
                  </div>
                  
                  <p className="text-[11.5px] font-mono text-slate-300 break-all leading-relaxed select-text select-all font-medium whitespace-pre-wrap max-h-24 overflow-y-auto pr-1">
                    {lzw.encodedPreview || 'No dictionary tokens generated. Please execute pipeline.'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dynamic dictionary status footnote */}
          <div className="mt-5 pt-3.5 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1">
              <Info className="w-3 h-3 text-purple-400" /> Adaptive sliding prefix dictionary mapped
            </span>
            <span>ENTRIES: {lzw.codes.length} TOKENS</span>
          </div>

        </motion.div>

      </div>
    </div>
  );
}
