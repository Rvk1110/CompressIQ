import { AIRecommendation } from '../types';
import { Trophy, Shuffle, Compass } from 'lucide-react';
import { motion } from 'motion/react';

interface RecommendationPanelProps {
  recommendation: AIRecommendation;
}

export default function RecommendationPanel({ recommendation }: RecommendationPanelProps) {
  const isHuffmanBest = recommendation.suggestedAlgorithm === 'Huffman';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 select-none">
      
      {/* Title */}
      <div className="mb-6">
        <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-semibold block">
          Algorithmic Decision Matrix
        </span>
        <h2 className="text-xl font-bold text-white tracking-tight mt-1 font-sans">
          Recommended Algorithm & Strategy Analysis
        </h2>
      </div>

      {/* Recommended Algorithm glowing glassmorphism container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl p-6 sm:p-10 bg-slate-900/60 border border-white/[0.08] backdrop-blur-md overflow-hidden"
      >

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 relative z-10">
          
          {/* Main Badge Block */}
          <div className="space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-medium shadow-md">
              <Trophy className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
              <span>Recommended Algorithm</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-white leading-none">
              {recommendation.suggestedAlgorithm === 'Huffman' ? (
                <span className="text-cyan-400">
                  Huffman Encoder
                </span>
              ) : (
                <span className="text-purple-400">
                  LZW Dictionary
                </span>
              )}
            </h1>

            <p className="text-sm text-slate-300 max-w-xl leading-relaxed mt-4">
              {recommendation.explanation}
            </p>
          </div>

          {/* Quick Scorecard Info Grid */}
          <div className="grid grid-cols-2 gap-4 w-full lg:w-96">
            
            {/* Best Ratio Scorecard Row */}
            <div className="bg-slate-950/70 border border-white/[0.05] p-4 rounded-2xl shadow-inner flex flex-col justify-between">
              <div>
                <div className="bg-cyan-500/10 text-cyan-400 p-1.5 rounded-lg border border-cyan-500/20 w-fit">
                  <Trophy className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono block mt-2.5">
                  Best Ratio Score
                </span>
              </div>
              <div className="text-sm font-bold text-slate-200 mt-2 font-sans flex items-baseline gap-1">
                <span>{recommendation.bestRatioAlgorithm}</span>
                <span className="text-[9px] text-emerald-400 font-mono font-normal">WINNER</span>
              </div>
            </div>

            {/* Fastest Scorecard Row */}
            <div className="bg-slate-950/70 border border-white/[0.05] p-4 rounded-2xl shadow-inner flex flex-col justify-between">
              <div>
                <div className="bg-purple-500/10 text-purple-400 p-1.5 rounded-lg border border-purple-500/20 w-fit">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono block mt-2.5">
                  Execution Leader
                </span>
              </div>
              <div className="text-sm font-bold text-slate-200 mt-2 font-sans flex items-baseline gap-1">
                <span>{recommendation.fastestAlgorithm}</span>
                <span className="text-[9px] text-emerald-400 font-mono font-normal">WINNER</span>
              </div>
            </div>

          </div>

        </div>

        {/* Action Suggestion box */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-2">
            <Shuffle className="w-4 h-4 text-purple-400 animate-spin" />
            <span>Optimal transmission payload achieved via {recommendation.suggestedAlgorithm} dynamic compression.</span>
          </span>
          <span className="text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/25 w-fit">
            RECOMMENDATION_ENGINE_SUCCESS
          </span>
        </div>

      </motion.div>
    </div>
  );
}
