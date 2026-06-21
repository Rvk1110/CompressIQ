import { useState, useEffect } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import WorkflowProgress from './components/WorkflowProgress';
import FileMetaCard from './components/FileMetaCard';
import AlgorithmCard from './components/AlgorithmCard';
import MetricTable from './components/MetricTable';
import AnalyticsCharts from './components/AnalyticsCharts';
import RecommendationPanel from './components/RecommendationPanel';
import KpiMetrics from './components/KpiMetrics';
import Footer from './components/Footer';

import { runOptimizationPipeline } from './utils/compressor';
import { FileMeta, HuffmanResult, LzwResult, OptimizationRecommendation } from './types';
import { motion, AnimatePresence } from 'motion/react';

// Initial default payload corresponding to PRESETS[0]
const INITIAL_CONTENT = Array(120).fill(
  `[2026-06-20T21:32:17] INFO: Router connection active port 3000.\n` +
  `[2026-06-20T21:32:18] DEBUG: Received request GET /api/health.\n` +
  `[2026-06-20T21:32:19] SUCCESS: 200 OK query execution complete.\n` +
  `[2026-06-20T21:32:19] WARN: DB replication latency exceeds 15ms.\n`
).join('\n');

export default function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeFileMeta, setActiveFileMeta] = useState<FileMeta | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationRecommendation | null>(null);

  // Temporary staging buffer during workflow loading sequence
  const [pendingPayload, setPendingPayload] = useState<{ name: string; content: string; type: string } | null>(null);

  // Parse and set default logs analysis on mount so dashboard doesn't start empty
  useEffect(() => {
    runAnalysisPipeline('preset_repetitive_logs.txt', INITIAL_CONTENT, 'text/plain');
  }, []);

  const runAnalysisPipeline = (name: string, content: string, type: string) => {
    const originalSizeBytes = content.length;
    
    // 1. Run optimization pipeline for all lossless methods
    const optResult = runOptimizationPipeline(content, name, type);

    // 2. Update state structures
    setOptimizationResult(optResult);
    
    setActiveFileMeta({
      name,
      type,
      sizeBytes: originalSizeBytes,
      charCount: content.length,
      timestamp: new Date().toLocaleTimeString(undefined, { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }) + ' UTC'
    });
  };

  const handleStartAnalysis = (payload: { name: string; content: string; type: string }) => {
    setPendingPayload(payload);
    setIsProcessing(true);
  };

  const handleWorkflowComplete = () => {
    if (pendingPayload) {
      runAnalysisPipeline(pendingPayload.name, pendingPayload.content, pendingPayload.type);
    }
    setIsProcessing(false);
    setPendingPayload(null);
  };

  const huffmanResult = optimizationResult?.rankedMethods.find(m => m.algorithmName === 'Huffman Coding') as HuffmanResult;
  const lzwResult = optimizationResult?.rankedMethods.find(m => m.algorithmName === 'LZW') as LzwResult;

  return (
    <div className="min-h-screen bg-[#050508] text-slate-100 bg-grid-mesh relative overflow-hidden">
      
      {/* 1. Header Segment */}
      <Header />

      {/* 2. Upload / Input Zone */}
      <UploadSection onAnalyze={handleStartAnalysis} isProcessing={isProcessing} />

      {/* 3. Dynamic Interactive State Panels */}
      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div
            key="loading-viewport"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <WorkflowProgress onComplete={handleWorkflowComplete} />
          </motion.div>
        ) : (
          <motion.main
            key="dashboard-viewport"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-12 pb-16"
          >
            {activeFileMeta && optimizationResult && huffmanResult && lzwResult && (
              <div className="space-y-10">
                
                {/* Section 1: File Info segment */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                  <div className="mb-6">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-semibold block">
                      Dataset Scope Metadata
                    </span>
                    <h2 className="text-xl font-bold text-white tracking-tight mt-1 font-sans">
                      Active Document Footprint
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="col-span-1 lg:col-span-2">
                      <FileMetaCard meta={activeFileMeta} />
                    </div>
                    {/* Embedded secondary info card for aesthetics */}
                    <div className="glass-card bg-slate-900/10 border border-white/[0.04] rounded-3xl p-6 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500 font-bold">
                          SYSTEM PERFORMANCE FACTOR
                        </span>
                        <h4 className="text-sm font-semibold text-slate-200 mt-2 font-sans leading-relaxed">
                          Intelligent Multithreaded Sandbox Benchmarks
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                          Each compression cycle is measured in high-resolution, isolating the cost of memory allocation, dictionary indexing, and bit parsing tree traversal.
                        </p>
                      </div>
                      <div className="text-[10px] font-mono text-purple-400 mt-4 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>Ready for custom uploads</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Best overall optimization recommendation details */}
                <RecommendationPanel 
                  optimization={optimizationResult} 
                  originalSize={activeFileMeta.sizeBytes} 
                />

                {/* Section 3: Ranked metrics leaderboard table */}
                <MetricTable 
                  originalSize={activeFileMeta.sizeBytes} 
                  rankedMethods={optimizationResult.rankedMethods} 
                />

                {/* Section 4: Visual Analytics (charts) */}
                <AnalyticsCharts 
                  originalSize={activeFileMeta.sizeBytes} 
                  rankedMethods={optimizationResult.rankedMethods} 
                />

                {/* Section 5: Side-by-Side Algorithm Cards (remains for detail check) */}
                <div className="space-y-3">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-semibold block">
                      Algorithm Details
                    </span>
                    <h2 className="text-xl font-bold text-white tracking-tight mt-1 font-sans">
                      Parallel Codestream Evaluation
                    </h2>
                  </div>
                  <AlgorithmCard huffman={huffmanResult} lzw={lzwResult} />
                </div>

                {/* Section 6: Performance Summary Summary KPIs */}
                <KpiMetrics 
                  originalSize={activeFileMeta.sizeBytes} 
                  bestMethod={optimizationResult.bestMethod} 
                />



              </div>
            )}
          </motion.main>
        )}
      </AnimatePresence>

      {/* 4. Footer & Conclusion Panel */}
      <Footer />

    </div>
  );
}
