import { Github, Cpu, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/[0.06] bg-slate-950/40 py-12 relative overflow-hidden select-none">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        


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
            <span>by CompressIQ Contributors</span>
          </div>

        </div>

      </div>
    </footer>
  );
}
