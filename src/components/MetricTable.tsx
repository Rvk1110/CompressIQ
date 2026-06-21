import { HuffmanResult, LzwResult } from '../types';
import { ArrowUpRight, Check, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface MetricTableProps {
  originalSize: number;
  huffman: HuffmanResult;
  lzw: LzwResult;
}

export default function MetricTable({ originalSize, huffman, lzw }: MetricTableProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Determine better values
  const betterSize = huffman.compressedSizeBytes === lzw.compressedSizeBytes 
    ? 'Tie' 
    : huffman.compressedSizeBytes < lzw.compressedSizeBytes ? 'Huffman' : 'LZW';

  const betterRatio = huffman.ratio === lzw.ratio 
    ? 'Tie' 
    : huffman.ratio > lzw.ratio ? 'Huffman' : 'LZW';

  const betterTime = Math.abs(huffman.executionTimeMs - lzw.executionTimeMs) < 0.005
    ? 'Tie'
    : huffman.executionTimeMs < lzw.executionTimeMs ? 'Huffman' : 'LZW';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-semibold block">
            Comparative Grid Matrix
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1 font-sans">
            Detailed Performance Metrics
          </h2>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/25 text-[11px] font-mono text-emerald-400 font-medium">
          <Award className="w-3.5 h-3.5" />
          <span>Optimal values highlighted in neon green</span>
        </div>
      </div>

      {/* Modern SaaS Table Style */}
      <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-slate-950/40 backdrop-blur-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.01]">
              <th className="p-4.5 text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                Performance Metric
              </th>
              <th className="p-4.5 text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                Huffman Coding
              </th>
              <th className="p-4.5 text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">
                LZW Algorithm
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            
            {/* Original size row */}
            <tr className="hover:bg-white/[0.01] transition-colors">
              <td className="p-4.5 text-sm font-medium text-slate-300">
                Original Payload Size
              </td>
              <td className="p-4.5 text-sm font-mono text-slate-400 font-medium">
                {formatBytes(originalSize)} <span className="text-xs text-slate-600">({originalSize} B)</span>
              </td>
              <td className="p-4.5 text-sm font-mono text-slate-400 font-medium">
                {formatBytes(originalSize)} <span className="text-xs text-slate-600">({originalSize} B)</span>
              </td>
            </tr>

            {/* Compressed footprint row */}
            <tr className="hover:bg-white/[0.01] transition-colors">
              <td className="p-4.5 text-sm font-medium text-slate-300">
                Compressed Footprint
              </td>
              <td className={`p-4.5 text-sm font-mono transition-all font-medium ${betterSize === 'Huffman' ? 'text-emerald-400' : 'text-slate-400'}`}>
                <div className="flex items-center gap-2">
                  <span>{formatBytes(huffman.compressedSizeBytes)} <span className="text-xs">({huffman.compressedSizeBytes} B)</span></span>
                  {betterSize === 'Huffman' && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase font-bold tracking-wider">Best</span>}
                </div>
              </td>
              <td className={`p-4.5 text-sm font-mono transition-all font-medium ${betterSize === 'LZW' ? 'text-emerald-400' : 'text-slate-400'}`}>
                <div className="flex items-center gap-2">
                  <span>{formatBytes(lzw.compressedSizeBytes)} <span className="text-xs">({lzw.compressedSizeBytes} B)</span></span>
                  {betterSize === 'LZW' && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase font-bold tracking-wider">Best</span>}
                </div>
              </td>
            </tr>

            {/* Ratio row */}
            <tr className="hover:bg-white/[0.01] transition-colors">
              <td className="p-4.5 text-sm font-medium text-slate-300">
                Compression Ratio
              </td>
              <td className={`p-4.5 text-sm font-mono transition-all font-bold ${betterRatio === 'Huffman' ? 'text-emerald-400' : 'text-slate-400'}`}>
                <div className="flex items-center gap-2">
                  <span>{huffman.ratio}x</span>
                  {betterRatio === 'Huffman' && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase font-semibold">Best</span>}
                </div>
              </td>
              <td className={`p-4.5 text-sm font-mono transition-all font-bold ${betterRatio === 'LZW' ? 'text-emerald-400' : 'text-slate-400'}`}>
                <div className="flex items-center gap-2">
                  <span>{lzw.ratio}x</span>
                  {betterRatio === 'LZW' && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase font-semibold">Best</span>}
                </div>
              </td>
            </tr>

            {/* Execution time row */}
            <tr className="hover:bg-white/[0.01] transition-colors">
              <td className="p-4.5 text-sm font-medium text-slate-300">
                Execution Time
              </td>
              <td className={`p-4.5 text-sm font-mono transition-all font-semibold ${betterTime === 'Huffman' ? 'text-emerald-400' : 'text-slate-400'}`}>
                <div className="flex items-center gap-2">
                  <span>{huffman.executionTimeMs} ms</span>
                  {betterTime === 'Huffman' && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase font-semibold">Fastest</span>}
                </div>
              </td>
              <td className={`p-4.5 text-sm font-mono transition-all font-semibold ${betterTime === 'LZW' ? 'text-emerald-400' : 'text-slate-400'}`}>
                <div className="flex items-center gap-2">
                  <span>{lzw.executionTimeMs} ms</span>
                  {betterTime === 'LZW' && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase font-semibold">Fastest</span>}
                </div>
              </td>
            </tr>

            {/* Complexity row */}
            <tr className="hover:bg-white/[0.01] transition-colors">
              <td className="p-4.5 text-sm font-medium text-slate-300">
                Asymptotic Time Complexity
              </td>
              <td className="p-4.5 text-sm font-mono text-cyan-400 font-bold">
                O(n log n)
              </td>
              <td className="p-4.5 text-sm font-mono text-purple-400 font-bold">
                O(n)
              </td>
            </tr>

            {/* Space efficiency percentage */}
            <tr className="hover:bg-white/[0.01] transition-colors">
              <td className="p-4.5 text-sm font-medium text-slate-300">
                Data Volume Space Savings
              </td>
              <td className={`p-4.5 text-sm font-mono transition-all font-bold ${betterRatio === 'Huffman' ? 'text-emerald-400' : 'text-slate-400'}`}>
                {huffman.spaceSavedPercent}%
              </td>
              <td className={`p-4.5 text-sm font-mono transition-all font-bold ${betterRatio === 'LZW' ? 'text-emerald-400' : 'text-slate-400'}`}>
                {lzw.spaceSavedPercent}%
              </td>
            </tr>

            {/* Structure dependency model */}
            <tr className="hover:bg-white/[0.01] transition-colors">
              <td className="p-4.5 text-sm font-medium text-slate-300">
                Algorithmic Design Engine
              </td>
              <td className="p-4.5 text-xs text-slate-400 font-mono">
                STATISTICAL PROBABILITY & BIT MAPPING
              </td>
              <td className="p-4.5 text-xs text-slate-400 font-mono">
                ADAPTIVE SLIDING PREFIX DICTIONARY INDEXING
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
}
