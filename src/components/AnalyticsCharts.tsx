import { HuffmanResult, LzwResult } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ResponsiveContainer, 
  Cell,
  Legend
} from 'recharts';
import { AreaChart, BarChart3, Timer, Layers3 } from 'lucide-react';
import { motion } from 'motion/react';

interface AnalyticsChartsProps {
  originalSize: number;
  huffman: HuffmanResult;
  lzw: LzwResult;
}

export default function AnalyticsCharts({ originalSize, huffman, lzw }: AnalyticsChartsProps) {
  
  // Data for Chart 1: Compression Ratio Comparison
  const ratioData = [
    { name: 'Huffman Coding', ratio: huffman.ratio, fillCode: '#06b6d4' },
    { name: 'LZW Algorithm', ratio: lzw.ratio, fillCode: '#a855f7' },
  ];

  // Data for Chart 2: Execution Time Comparison (ms)
  const timeData = [
    { name: 'Huffman Coding', timeMs: huffman.executionTimeMs, fillCode: '#06b6d4' },
    { name: 'LZW Algorithm', timeMs: lzw.executionTimeMs, fillCode: '#a855f7' },
  ];

  // Data for Chart 3: Original Size vs Compressed Size (bytes)
  const sizeData = [
    {
      name: 'Storage Size comparison',
      'Original Payload Size': originalSize,
      'Huffman Coding': huffman.compressedSizeBytes,
      'LZW Algorithm': lzw.compressedSizeBytes,
    }
  ];

  // Custom tooltips styling for dark SaaS theme
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/95 backdrop-blur-md border border-white/[0.08] px-4 py-3 rounded-xl shadow-2xl font-mono text-xs">
          <p className="text-slate-400 mb-1.5 font-bold uppercase tracking-wider">{label || 'Analytical Value'}</p>
          <div className="space-y-1">
            {payload.map((item: any, idx: number) => (
              <p key={idx} className="flex justify-between gap-6" style={{ color: item.color || item.fill }}>
                <span className="text-slate-400">{item.name}:</span>
                <span className="font-bold">
                  {typeof item.value === 'number' && item.value > 10
                    ? item.value.toLocaleString() + (item.unit || '')
                    : item.value + (item.unit || '')}
                </span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 py-6 select-none">
      
      {/* Section Title */}
      <div className="mb-8">
        <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-semibold block">
          Visual Diagnostic Charts
        </span>
        <h2 className="text-xl font-bold text-white tracking-tight mt-1 font-sans">
          Compression Metrics Visualizer
        </h2>
      </div>

      {/* Bento Grid layout for charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Chart 1: Compression Ratio Comparison */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="col-span-1 lg:col-span-4 glass-card rounded-3xl p-5 relative overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-4 border-b border-white/[0.04] pb-3">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider font-sans text-slate-300">
              Compression Ratio Comparison
            </h4>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratioData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} unit="x" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.01)' }} />
                <Bar dataKey="ratio" radius={[12, 12, 0, 0]} unit="x" name="Ratio Coefficient">
                  {ratioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fillCode} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] font-mono text-center text-slate-500 mt-2">
            Higher values indicate higher compression efficiency.
          </div>
        </motion.div>

        {/* Chart 2: Execution Time Comparison */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="col-span-1 lg:col-span-4 glass-card rounded-3xl p-5 relative overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-4 border-b border-white/[0.04] pb-3">
            <Timer className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider font-sans text-slate-300">
              Execution Time Comparison (ms)
            </h4>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData} margin={{ top: 20, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} unit="ms" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.01)' }} />
                <Bar dataKey="timeMs" radius={[12, 12, 0, 0]} unit=" ms" name="Duration">
                  {timeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fillCode} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] font-mono text-center text-slate-500 mt-2">
            Smaller execution times are optimal for real-time streams.
          </div>
        </motion.div>

        {/* Chart 3: Storage comparison Grouped Bar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="col-span-1 lg:col-span-4 glass-card rounded-3xl p-5 relative overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-4 border-b border-white/[0.04] pb-3">
            <Layers3 className="w-4 h-4 text-blue-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider font-sans text-slate-300">
              Original Size vs Compressed
            </h4>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sizeData} margin={{ top: 25, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="name" stroke="none" hide />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} unit="B" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'none' }} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle" 
                  iconSize={8}
                  wrapperStyle={{ fontSize: '9px', fontFamily: 'monospace', opacity: 0.7 }}
                />
                <Bar dataKey="Original Payload Size" fill="#475569" radius={[6, 6, 0, 0]} unit=" Bytes" />
                <Bar dataKey="Huffman Coding" fill="#06b6d4" radius={[6, 6, 0, 0]} unit=" Bytes" />
                <Bar dataKey="LZW Algorithm" fill="#a855f7" radius={[6, 6, 0, 0]} unit=" Bytes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] font-mono text-center text-slate-500 mt-2">
            Lower bytes denote footprint conservation.
          </div>
        </motion.div>

      </div>
    </div>
  );
}
