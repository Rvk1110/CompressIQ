import { CompressionResult } from '../types';
import { Award, ArrowUpRight, Check, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface MetricTableProps {
  originalSize: number;
  rankedMethods: CompressionResult[];
}

export default function MetricTable({ originalSize, rankedMethods }: MetricTableProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-semibold block">
            Comparative Grid Matrix
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1 font-sans">
            Ranked Lossless Leaderboard
          </h2>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/25 text-[11px] font-mono text-emerald-400 font-medium">
          <Award className="w-3.5 h-3.5" />
          <span>Ranked from Best (smallest size) to Worst</span>
        </div>
      </div>

      {/* Modern SaaS Table Style */}
      <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-slate-950/40 backdrop-blur-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.01]">
              <th className="p-4.5 text-xs font-mono uppercase tracking-widest text-slate-400 font-bold w-16 text-center">
                Rank
              </th>
              <th className="p-4.5 text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                Compression Pipeline
              </th>
              <th className="p-4.5 text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                Footprint Size
              </th>
              <th className="p-4.5 text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">
                Ratio
              </th>
              <th className="p-4.5 text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                Space Saved (%)
              </th>
              <th className="p-4.5 text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                Latency
              </th>
              <th className="p-4.5 text-xs font-mono uppercase tracking-widest text-slate-400 font-bold text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {rankedMethods.map((method, index) => {
              const isBest = index === 0;
              const isExpansion = method.compressedSizeBytes >= originalSize;

              let rankBadge = '';
              if (index === 0) rankBadge = '🥇';
              else if (index === 1) rankBadge = '🥈';
              else if (index === 2) rankBadge = '🥉';
              else rankBadge = `${index + 1}th`;

              return (
                <tr 
                  key={method.algorithmName} 
                  className={`transition-colors hover:bg-white/[0.01] ${isBest ? 'bg-emerald-500/[0.02]' : ''}`}
                >
                  <td className="p-4.5 text-sm font-mono font-bold text-center text-slate-300">
                    {rankBadge}
                  </td>
                  <td className="p-4.5 text-sm font-medium text-slate-200">
                    <span className="flex items-center gap-2">
                      {method.algorithmName}
                      {method.isHybrid && (
                        <span className="text-[9px] uppercase tracking-wider font-semibold font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded-full">
                          hybrid
                        </span>
                      )}
                    </span>
                  </td>
                  <td className={`p-4.5 text-sm font-mono font-medium ${isExpansion ? 'text-rose-400' : 'text-slate-200'}`}>
                    {formatBytes(method.compressedSizeBytes)}
                    <span className="text-[10px] text-slate-500 ml-1.5 font-normal">({method.compressedSizeBytes} B)</span>
                  </td>
                  <td className={`p-4.5 text-sm font-mono font-bold ${isExpansion ? 'text-rose-400' : 'text-cyan-400'}`}>
                    {method.ratio}x
                  </td>
                  <td className={`p-4.5 text-sm font-mono font-bold ${isExpansion ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {method.spaceSavedPercent}%
                  </td>
                  <td className="p-4.5 text-sm font-mono text-slate-400">
                    {method.executionTimeMs} ms
                  </td>
                  <td className="p-4.5 text-right">
                    {isBest && !isExpansion ? (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2.5 py-0.75 rounded-full">
                        <Check className="w-3 h-3" /> Best Choice
                      </span>
                    ) : isExpansion ? (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold bg-rose-500/10 text-rose-400 border border-rose-500/25 px-2.5 py-0.75 rounded-full">
                        <AlertCircle className="w-3 h-3" /> Expansion
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold bg-slate-800 text-slate-400 border border-white/[0.04] px-2.5 py-0.75 rounded-full">
                        Efficient
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
