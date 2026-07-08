import { CompressionResult } from '../types';
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
import { BarChart3, Timer, Layers3 } from 'lucide-react';
import { motion } from 'motion/react';

interface AnalyticsChartsProps {
  originalSize: number;
  rankedMethods: CompressionResult[];
}

export default function AnalyticsCharts({ originalSize, rankedMethods }: AnalyticsChartsProps) {
  
  // Chart 1: Footprint comparison (Bytes) - sorted by algorithm name or rank
  const footprintData = rankedMethods.map(m => ({
    name: m.algorithmName.replace(' Coding', ''),
    'Compressed Size (Bytes)': m.compressedSizeBytes,
    isBest: m.algorithmName === rankedMethods[0].algorithmName,
    fillCode: m.algorithmName === rankedMethods[0].algorithmName ? '#10b981' : '#3b82f6'
  }));

  // Chart 2: Ratio Comparison (x)
  const ratioData = [...rankedMethods].sort((a, b) => b.ratio - a.ratio).map(m => ({
    name: m.algorithmName.replace(' Coding', ''),
    'Ratio': m.ratio,
    fillCode: m.algorithmName === rankedMethods[0].algorithmName ? '#10b981' : '#a855f7'
  }));

  // Chart 3: Processing Time (ms)
  const latencyData = [...rankedMethods].sort((a, b) => a.executionTimeMs - b.executionTimeMs).map(m => ({
    name: m.algorithmName.replace(' Coding', ''),
    'Latency (ms)': m.executionTimeMs,
    fillCode: '#06b6d4'
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 px-4 py-3 rounded-xl shadow-2xl font-mono text-xs">
          <p className="text-slate-400 mb-1.5 font-bold uppercase tracking-wider">{label || 'Value'}</p>
          <div className="space-y-1">
            {payload.map((item: any, idx: number) => (
              <p key={idx} className="flex justify-between gap-6" style={{ color: item.color || item.fill }}>
                <span className="text-slate-400">{item.name}:</span>
                <span className="font-bold">
                  {item.value.toLocaleString()}
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
        
        {/* Chart 1: Compression Footprint comparison */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="col-span-1 lg:col-span-4 glass-card rounded-3xl p-5 relative overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-4 border-b border-white/[0.04] pb-3">
            <Layers3 className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider font-sans text-slate-300">
              Compressed Footprint (Bytes)
            </h4>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={footprintData} margin={{ top: 20, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" stroke="rgba(15,23,42,0.5)" fontSize={8} tickLine={false} />
                <YAxis stroke="rgba(15,23,42,0.5)" fontSize={9} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Bar dataKey="Compressed Size (Bytes)" radius={[6, 6, 0, 0]}>
                  {footprintData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fillCode} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] font-mono text-center text-slate-500 mt-2">
            Lower bytes denote footprint conservation. (Green = Best Choice)
          </div>
        </motion.div>

        {/* Chart 2: Ratio Comparison */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="col-span-1 lg:col-span-4 glass-card rounded-3xl p-5 relative overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-4 border-b border-white/[0.04] pb-3">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider font-sans text-slate-300">
              Compression Ratio Comparison
            </h4>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratioData} margin={{ top: 20, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" stroke="rgba(15,23,42,0.5)" fontSize={8} tickLine={false} />
                <YAxis stroke="rgba(15,23,42,0.5)" fontSize={9} tickLine={false} unit="x" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Bar dataKey="Ratio" radius={[6, 6, 0, 0]}>
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

        {/* Chart 3: Latency Comparison */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="col-span-1 lg:col-span-4 glass-card rounded-3xl p-5 relative overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-4 border-b border-white/[0.04] pb-3">
            <Timer className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider font-sans text-slate-300">
              Execution Time Comparison (ms)
            </h4>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latencyData} margin={{ top: 25, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" stroke="rgba(15,23,42,0.5)" fontSize={8} tickLine={false} />
                <YAxis stroke="rgba(15,23,42,0.5)" fontSize={9} tickLine={false} unit="ms" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Bar dataKey="Latency (ms)" radius={[6, 6, 0, 0]}>
                  {latencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fillCode} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] font-mono text-center text-slate-500 mt-2">
            Lower execution times are optimal for real-time applications.
          </div>
        </motion.div>

      </div>
    </div>
  );
}
