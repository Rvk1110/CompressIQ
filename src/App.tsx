import { useState, useEffect } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import AlgorithmCard from './components/AlgorithmCard';
import MetricTable from './components/MetricTable';
import AnalyticsCharts from './components/AnalyticsCharts';
import RecommendationPanel from './components/RecommendationPanel';
import KpiMetrics from './components/KpiMetrics';
import Footer from './components/Footer';

import { runOptimizationPipeline } from './utils/compressor';
import { FileMeta, HuffmanResult, LzwResult, OptimizationRecommendation } from './types';
import { motion, AnimatePresence } from 'motion/react';

// ... (remaining setup stays exactly identical)
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

  // Let the dashboard start in a clean initial state awaiting user selection/upload
  useEffect(() => {
    // No automatic run on mount to start with a clean dashboard
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 bg-grid-mesh relative overflow-hidden">
      
      {/* 1. Header Segment */}
      <Header />

      {/* 2. Upload / Input Zone */}
      <UploadSection 
        onAnalyze={handleStartAnalysis} 
        isProcessing={isProcessing} 
        activeFileMeta={activeFileMeta}
        onClear={() => {
          setActiveFileMeta(null);
          setOptimizationResult(null);
        }}
        onWorkflowComplete={handleWorkflowComplete}
      />

      {/* 3. Dynamic Interactive State Panels */}
      <AnimatePresence mode="wait">
        {!isProcessing && activeFileMeta && optimizationResult && huffmanResult && lzwResult && (
          <motion.main
            key="dashboard-viewport"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-12 pb-16"
          >
            <div className="space-y-10">
              
              {/* Section 1: Best overall optimization recommendation details */}
              <RecommendationPanel 
                optimization={optimizationResult} 
                originalSize={activeFileMeta.sizeBytes} 
              />

              {/* Section 2: Ranked metrics leaderboard table */}
              <MetricTable 
                originalSize={activeFileMeta.sizeBytes} 
                rankedMethods={optimizationResult.rankedMethods} 
              />

              {/* Section 3: Visual Analytics (charts) */}
              <AnalyticsCharts 
                originalSize={activeFileMeta.sizeBytes} 
                rankedMethods={optimizationResult.rankedMethods} 
              />

              {/* Section 4: Side-by-Side Algorithm Cards (remains for detail check) */}
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

              {/* Section 5: Performance Summary Summary KPIs */}
              <KpiMetrics 
                originalSize={activeFileMeta.sizeBytes} 
                bestMethod={optimizationResult.bestMethod} 
              />

            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* 4. Footer & Conclusion Panel */}
      <Footer />

    </div>
  );
}
