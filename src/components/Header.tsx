import { Cpu, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export default function Header() {
  return (
    <header className="relative w-full pt-10 pb-6 border-b border-white/[0.06] overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Logo & Brand Meta */}
          <div className="flex items-center gap-4">
            <motion.div 
              initial={{ rotate: -15, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="relative p-3 rounded-2xl bg-cyan-600 text-white shadow-lg"
            >
              <Cpu className="w-8 h-8" />
              <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse-slow" />
            </motion.div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold tracking-tight text-white font-sans">
                  Compress<span className="text-cyan-400">IQ</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/25">
                  v1.2.0
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Data Compression Ratio Analyzer
              </p>
            </div>
          </div>

          {/* Real-time Status indicators instead of mock logs */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/[0.05]">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-slate-400">HUFFMAN ANALYZER:</span>
              <span className="text-cyan-400 font-semibold">ONLINE</span>
            </div>
            
            <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/[0.05]">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-slate-400">LZW ANALYZER:</span>
              <span className="text-purple-400 font-semibold">READY</span>
            </div>
          </div>

        </div>

        {/* Hero Copy */}
        <div className="mt-12 text-center md:text-left max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight font-sans"
          >
            Compress<span className="text-cyan-400 font-sans">IQ</span>
          </motion.h1>
          
          <motion.h3 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl md:text-2xl font-bold text-slate-200 mt-3 font-sans"
          >
            Data Compression Ratio Analyzer
          </motion.h3>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-base md:text-lg mt-3 leading-relaxed"
          >
            Analyze and compare Huffman and LZW compression performance based on compression ratio, execution time, and efficiency. Upload custom datasets, explore algorithmic behaviors, and evaluate which engine is best suited for your data.
          </motion.p>
        </div>
      </div>
    </header>
  );
}
