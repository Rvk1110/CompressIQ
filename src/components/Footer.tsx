import { Github, Cpu, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/[0.06] bg-slate-950/40 py-12 relative overflow-hidden select-none">
      
      {/* Absolute faint light ray */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section 8: Conclusion Panel */}
        <div id="conclusion-panel" className="glass-card bg-white/[0.01] border border-cyan-500/10 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto text-center space-y-4">
          <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/20">
            Section 8: Analytical Conclusion
          </span>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl mx-auto">
            The system performs compression using both Huffman and LZW algorithms, compares their performance based on compression ratio and execution time, and recommends the most suitable compression technique for the given input.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-white/[0.04] text-[11px] font-mono text-slate-500 gap-4">
          
          {/* Copyright row */}
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>© 2026 CompressIQ Analytics Suite. All rights reserved.</span>
          </div>

          {/* Credits */}
          <div className="flex items-center gap-1.5">
            <span>Delivered with meticulous care</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-pulse" />
            <span>by rvksaikarthik922</span>
          </div>

        </div>

      </div>
    </footer>
  );
}
