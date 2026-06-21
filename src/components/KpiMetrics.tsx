import { useEffect, useState } from 'react';
import { CompressionResult } from '../types';
import { Percent, Flame, Layers2, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface KpiMetricsProps {
  originalSize: number;
  bestMethod: CompressionResult;
}

export default function KpiMetrics({ originalSize, bestMethod }: KpiMetricsProps) {
  // Best results representation
  const targetSavedPercent = bestMethod.spaceSavedPercent;
  const targetRatio = bestMethod.ratio;
  const totalSavedBytes = originalSize - bestMethod.compressedSizeBytes;
  const targetEfficiency = Number(((1 - (bestMethod.compressedSizeBytes / (originalSize || 1))) * 100).toFixed(2));
  const targetTime = bestMethod.executionTimeMs;

  // Animated counters state
  const [efficiency, setEfficiency] = useState(0);
  const [savedPercent, setSavedPercent] = useState(0);
  const [ratio, setRatio] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000; // ms
    const startTimeStamp = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTimeStamp;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress);

      setEfficiency(Number((targetEfficiency * easeProgress).toFixed(2)));
      setSavedPercent(Number((targetSavedPercent * easeProgress).toFixed(2)));
      setRatio(Number((1 + (targetRatio - 1) * easeProgress).toFixed(2)));
      setTime(Number((targetTime * easeProgress).toFixed(3)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setEfficiency(targetEfficiency);
        setSavedPercent(targetSavedPercent);
        setRatio(targetRatio);
        setTime(targetTime);
      }
    };

    requestAnimationFrame(animate);
  }, [targetEfficiency, targetSavedPercent, targetRatio, targetTime]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 py-4 select-none">
      
      {/* Title */}
      <div className="mb-6">
        <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-semibold block">
          Key Performance Indicators
        </span>
        <h2 className="text-xl font-bold text-white tracking-tight mt-1 font-sans">
          Pipeline Performance Summary
        </h2>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Compression Efficiency */}
        <div className="glass-card bg-slate-900/40 p-5 rounded-2xl border border-white/[0.04] relative group hover:border-white/[0.1] transition-all">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">
              Optimal Efficiency
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-sans mt-2">
            {efficiency}%
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-mono leading-none">
            Bandwidth saving scale
          </p>
        </div>

        {/* KPI 2: Space Saved */}
        <div className="glass-card bg-slate-900/40 p-5 rounded-2xl border border-white/[0.04] relative group hover:border-white/[0.1] transition-all">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">
              Bytes Saved
            </span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Layers2 className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-black font-sans mt-2 ${savedPercent >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
            {savedPercent}%
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-mono leading-none">
            {totalSavedBytes >= 0 ? `Reclaimed ${totalSavedBytes.toLocaleString()} bytes` : `Expanded by ${Math.abs(totalSavedBytes).toLocaleString()} bytes`}
          </p>
        </div>

        {/* KPI 3: Max Compression Ratio */}
        <div className="glass-card bg-slate-900/40 p-5 rounded-2xl border border-white/[0.04] relative group hover:border-white/[0.1] transition-all">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">
              Peak Compression
            </span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Flame className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-400 font-sans mt-2">
            {ratio}x
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-mono leading-none">
            Max ratio threshold
          </p>
        </div>

        {/* KPI 4: Processing Time */}
        <div className="glass-card bg-slate-900/40 p-5 rounded-2xl border border-white/[0.04] relative group hover:border-white/[0.1] transition-all">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">
              Optimal Latency
            </span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-sans mt-2">
            {time} ms
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-mono leading-none">
            Selected algorithm speed
          </p>
        </div>

      </div>
    </div>
  );
}
