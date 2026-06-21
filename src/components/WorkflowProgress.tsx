import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, Check, ArrowRight } from 'lucide-react';

interface WorkflowProgressProps {
  onComplete: () => void;
}

const STAGES = [
  { label: 'Upload File', sub: 'Parsing input character bounds & file metadata' },
  { label: 'Applying Huffman Coding', sub: 'Building weighted frequency tree & probability codebook' },
  { label: 'Calculating Compression Ratio', sub: 'Comparing bit budgets against native byte representation' },
  { label: 'Applying LZW Compression', sub: 'Initializing 256 basic ASCII tokens & filling dictionary bounds' },
  { label: 'Measuring Execution Time', sub: 'Averaging benchmark loops via performance.now()' },
  { label: 'Generating Comparative Analysis', sub: 'Fusing metrics into AI dynamic recommendations' },
];

export default function WorkflowProgress({ onComplete }: WorkflowProgressProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Total execution simulated time is around 1.8s
    // 300ms per stage interval
    const intervalTime = 300;
    
    // Animate stage index
    const stageTimer = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev >= STAGES.length - 1) {
          clearInterval(stageTimer);
          return prev;
        }
        return prev + 1;
      });
    }, intervalTime);

    // Animate fluid progress bar
    const progressInterval = 1800 / 100; // 18ms per percent
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          // Small buffer before rendering dashboards
          setTimeout(() => {
            onComplete();
          }, 350);
          return 100;
        }
        return prev + 1;
      });
    }, progressInterval);

    return () => {
      clearInterval(stageTimer);
      clearInterval(progressTimer);
    };
  }, [onComplete]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card glow-premium rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Global loader icon spinner */}
        <div className="flex justify-center mb-6">
          <div className="relative p-5 bg-white/[0.02] border border-white/[0.05] rounded-full">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
            <div className="absolute inset-0 rounded-full border border-purple-500/30 animate-ping opacity-70" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-white tracking-wide font-sans">
          Executing Compression Pipeline
        </h3>
        <p className="text-xs text-slate-400 mt-2 font-mono">
          Stage {Math.min(currentStage + 1, STAGES.length)} of {STAGES.length}: {STAGES[currentStage]?.label}
        </p>

        {/* Big Premium fluid progress bar */}
        <div className="w-full h-2 bg-slate-950 rounded-full my-8 relative overflow-hidden border border-white/[0.05]">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full transition-all duration-100" 
            style={{ width: `${progress}%` }} 
          />
          {/* Subtle slide sheen */}
          <div className="absolute space-y-0 inset-0 bg-white/20 -translate-x-full animate-pulse-slow" />
        </div>

        {/* Pipeline sequence */}
        <div className="text-left space-y-4 max-w-lg mx-auto bg-slate-950/40 p-5 rounded-2xl border border-white/[0.04]">
          {STAGES.map((stage, i) => {
            const isCompleted = currentStage > i;
            const isCurrent = currentStage === i;
            const isPending = currentStage < i;

            return (
              <div 
                key={i} 
                className={`flex items-start gap-4 transition-all duration-300 ${
                  isCurrent ? 'opacity-100 scale-[1.01]' : isCompleted ? 'opacity-70' : 'opacity-30'
                }`}
              >
                {/* State Node Icon */}
                <div className="mt-0.5">
                  {isCompleted ? (
                    <div className="p-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : isCurrent ? (
                    <div className="p-1 rounded-full bg-cyan-500/15 border border-cyan-500/50 text-cyan-400">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    </div>
                  ) : (
                    <div className="p-1 rounded-full bg-slate-800 border border-white/[0.05] text-slate-500">
                      <div className="w-3.5 h-3.5 rounded-full bg-transparent" />
                    </div>
                  )}
                </div>

                {/* Info titles */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold font-sans ${isCurrent ? 'text-cyan-300' : isCompleted ? 'text-slate-300' : 'text-slate-500'}`}>
                      {stage.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[9px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 animate-pulse">
                        active
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-1">
                    {stage.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Percentage Floating */}
        <div className="mt-6 flex justify-between items-center text-[11px] font-mono text-slate-500 max-w-lg mx-auto px-1">
          <span>PIPELINE_INIT</span>
          <span className="text-cyan-400 font-bold">{progress}% COMPLETE</span>
          <span>COMPRESS_SUCCESS</span>
        </div>

      </motion.div>
    </div>
  );
}
