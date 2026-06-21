import { OptimizationRecommendation } from '../types';
import { Trophy, Copy, Check, Download, AlertTriangle, Cpu, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface RecommendationPanelProps {
  optimization: OptimizationRecommendation;
  originalSize: number;
}

export default function RecommendationPanel({ optimization, originalSize }: RecommendationPanelProps) {
  const { bestMethod, explanation } = optimization;
  const [copied, setCopied] = useState(false);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(bestMethod.rawData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isInefficient = bestMethod.compressedSizeBytes >= originalSize;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 select-none">
      
      {/* Title */}
      <div className="mb-6">
        <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-semibold block">
          Lossless Optimization Strategy
        </span>
        <h2 className="text-xl font-bold text-white tracking-tight mt-1 font-sans">
          Optimal Compression Pipeline
        </h2>
      </div>

      {/* Recommended Algorithm glowing glassmorphism container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className={`relative rounded-3xl p-6 sm:p-10 border backdrop-blur-md overflow-hidden ${
          isInefficient 
            ? 'bg-rose-950/20 border-rose-500/30' 
            : 'bg-slate-900/60 border-white/[0.08]'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-8 relative z-10">
          
          {/* Main Badge Block */}
          <div className="space-y-4 flex-1 text-center lg:text-left">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium shadow-md ${
              isInefficient ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              <Trophy className={`w-3.5 h-3.5 ${isInefficient ? 'text-rose-300' : 'text-emerald-300 animate-pulse'}`} />
              <span>🏆 Best Compression Method</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-white leading-none">
              {bestMethod.algorithmName}
            </h1>

            <p className="text-sm text-slate-300 max-w-xl leading-relaxed mt-4">
              {explanation}
            </p>

            {isInefficient && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-2xl text-xs font-mono flex items-start gap-3 mt-4 text-left">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-rose-200">File is already highly compressed</h5>
                  <p className="mt-1 leading-relaxed text-[11px]">
                    Further lossless compression is not beneficial. All tested pipelines resulted in file expansion due to metadata and encoding dictionary overheads.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Scorecard Info Grid */}
          <div className="grid grid-cols-2 gap-4 w-full lg:w-96 shrink-0">
            
            {/* Original Size Card */}
            <div className="bg-slate-950/70 border border-white/[0.05] p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                📦 Original Size
              </span>
              <div className="text-base font-bold text-slate-200 mt-2 font-sans">
                {formatBytes(originalSize)}
                <span className="text-[9px] text-slate-500 block font-mono">{originalSize.toLocaleString()} bytes</span>
              </div>
            </div>

            {/* Compressed Size Card */}
            <div className="bg-slate-950/70 border border-white/[0.05] p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                📉 Final Compressed Size
              </span>
              <div className={`text-base font-bold mt-2 font-sans ${isInefficient ? 'text-rose-400' : 'text-emerald-400'}`}>
                {formatBytes(bestMethod.compressedSizeBytes)}
                <span className="text-[9px] text-slate-500 block font-mono">{bestMethod.compressedSizeBytes.toLocaleString()} bytes</span>
              </div>
            </div>

            {/* Ratio Card */}
            <div className="bg-slate-950/70 border border-white/[0.05] p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                📊 Compression Ratio
              </span>
              <div className={`text-base font-bold mt-2 font-mono ${bestMethod.ratio >= 1.0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {bestMethod.ratio}x
              </div>
            </div>

            {/* Space Saved Card */}
            <div className="bg-slate-950/70 border border-white/[0.05] p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                💾 Space Saved (%)
              </span>
              <div className={`text-base font-bold mt-2 font-mono ${bestMethod.spaceSavedPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {bestMethod.spaceSavedPercent}%
              </div>
            </div>

            {/* Time Card */}
            <div className="bg-slate-950/70 border border-white/[0.05] p-4 rounded-2xl flex flex-col justify-between col-span-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                ⚡ Execution Time
              </span>
              <div className="text-base font-bold text-slate-200 mt-2 font-mono flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>{bestMethod.executionTimeMs} ms</span>
              </div>
            </div>

          </div>

        </div>

        {/* Binary Output Action Console */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Actual Compressed Stream Output ({bestMethod.algorithmName})</span>
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 bg-slate-950 border border-white/[0.08] hover:border-white/[0.2] hover:bg-slate-900 rounded-lg text-[10px] font-mono text-slate-300 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'COPIED!' : 'COPY BUFFER'}</span>
              </button>
            </div>
          </div>
          <div className="w-full bg-slate-950/80 border border-white/[0.08] p-4 rounded-2xl text-[10px] font-mono text-slate-400 overflow-x-auto select-text max-h-32 whitespace-pre-wrap leading-relaxed">
            {bestMethod.rawData || "[Payload Empty]"}
          </div>
        </div>

      </motion.div>
    </div>
  );
}
