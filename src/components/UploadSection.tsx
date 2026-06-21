import React, { useState, useRef } from 'react';
import { Upload, FileText, Sparkles, Check, ChevronRight, HelpCircle, Terminal, TableProperties, BookOpen, Binary, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UploadSectionProps {
  onAnalyze: (payload: { name: string; content: string; type: string }) => void;
  isProcessing: boolean;
}

const PRESETS = [
  {
    key: 'repetitive_logs',
    name: 'SaaS Server Logs',
    desc: 'Deep repetitive sequences (LZW will shine!)',
    icon: Terminal,
    content: Array(120).fill(
      `[2026-06-20T21:32:17] INFO: Router connection active port 3000.\n` +
      `[2026-06-20T21:32:18] DEBUG: Received request GET /api/health.\n` +
      `[2026-06-20T21:32:19] SUCCESS: 200 OK query execution complete.\n` +
      `[2026-06-20T21:32:19] WARN: DB replication latency exceeds 15ms.\n`
    ).join('\n'),
    type: 'text/plain',
  },
  {
    key: 'csv_data',
    name: 'Structured CSV Matrix',
    desc: 'Dense tabular records with repeating schema structural boundaries',
    icon: TableProperties,
    content: `id,first_name,last_name,email,gender,department,salary,status\n` +
      Array(60).fill(null).map((_, i) => (
        `${i + 1},Karthik,RV,rvksaikarthik922@gmail.com,Male,Engineering,145000,Active\n` +
        `${i + 2},Jane,Miller,jane@company-domain.corp,Female,Product,132000,Suspended\n` +
        `${i + 3},Devon,Spacey,devon@company-domain.corp,Male,Design,110000,Active\n` +
        `${i + 4},Sarah,Connor,sarah@company-domain.corp,Female,Operations,98000,Active`
      )).join('\n'),
    type: 'text/csv',
  },
  {
    key: 'classical_prose',
    name: 'English Literature Prose',
    desc: 'Rich language entropy with uneven alphabetical distributions (Huffman focus)',
    icon: BookOpen,
    content: 
      `To be, or not to be, that is the question:\n` +
      `Whether 'tis nobler in the mind to suffer\n` +
      `The slings and arrows of outrageous fortune,\n` +
      `Or to take arms against a sea of troubles\n` +
      `And by opposing end them. To die—to sleep,\n` +
      `No more; and by a sleep to say we end\n` +
      `The heart-ache and the thousand natural shocks\n` +
      `That flesh is heir to: 'tis a consummation\n` +
      `Devoutly to be wish'd. To die, to sleep;\n` +
      `To sleep, perchance to dream—ay, there's the rub:\n` +
      `For in that sleep of death what dreams may come,\n` +
      `When we have shuffled off this mortal coil,\n` +
      `Must give us pause. There's the respect\n` +
      `That makes calamity of so long life.\n` +
      `For who would bear the whips and scorns of time,\n` +
      `The oppressor's wrong, the proud man's contumely,\n` +
      `The pangs of dispriz'd love, the law's delay,\n` +
      `The insolence of office, and the spurns\n` +
      `That patient merit of the unworthy takes,\n` +
      `When he himself might his quietus make\n` +
      `With a bare bodkin? Who would fardels bear,\n` +
      `To grunt and sweat under a weary life,\n` +
      `But that the dread of something after death,\n` +
      `The undiscover'd country, from whose bourn\n` +
      `No traveller returns, puzzles the will,\n` +
      `And makes us rather bear those ills we have\n` +
      `Than fly to others that we know not of?\n` +
      `Thus conscience does make cowards of us all;\n` +
      `And thus the native hue of resolution\n` +
      `Is sicklied o'er with the pale cast of thought,\n` +
      `And enterprises of great pith and moment\n` +
      `With this regard their currents turn awry,\n` +
      `And lose the name of action.`,
    type: 'text/plain',
  },
  {
    key: 'dna_sequence',
    name: 'Genomic DNA Codon',
    desc: 'Highly restricted alphabet (A, T, C, G) with uniform probability distributions',
    icon: Binary,
    content: Array(100).fill('ATCGGACTTAGCTACGATCGGCTAGCTAGCTAGCGGGGTTAACCGGTT').join(''),
    type: 'text/plain',
  }
];

export default function UploadSection({ onAnalyze, isProcessing }: UploadSectionProps) {
  const [dragActive, setDragActive] = useState(false);
  const [textMode, setTextMode] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [activePreset, setActivePreset] = useState<string>('repetitive_logs');
  const [warningMessage, setWarningMessage] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processTextLoad = (rawText: string, name: string, type: string) => {
    setWarningMessage('');
    if (!rawText.trim()) {
      setWarningMessage('Payload is empty. Please enter printable alphanumeric symbols.');
      return;
    }
    // Safeguard memory bounds for heavy client workloads
    if (rawText.length > 500000) {
      setWarningMessage('File exceeds 500KB. It has been truncated to avoid rendering latency.');
      rawText = rawText.substring(0, 500000);
    }
    setCustomText(rawText);
    setFileName(name);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension === 'txt' || extension === 'csv' || file.type === 'text/plain' || file.type === 'text/csv') {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          processTextLoad(result, file.name, file.type || 'text/plain');
          setTextMode(true);
          setActivePreset('');
        };
        reader.readAsText(file);
      } else {
        setWarningMessage('Formats restricted strictly to .txt and .csv character documents.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        processTextLoad(result, file.name, file.type || 'text/plain');
        setTextMode(true);
        setActivePreset('');
      };
      reader.readAsText(file);
    }
  };

  const selectPreset = (preset: typeof PRESETS[number]) => {
    setWarningMessage('');
    setCustomText(preset.content);
    setFileName(`preset_${preset.key}.${preset.type === 'text/csv' ? 'csv' : 'txt'}`);
    setActivePreset(preset.key);
    setTextMode(false);
  };

  const handleTriggerAnalysis = () => {
    let finalPayloadContent = '';
    let finalPayloadName = '';
    let finalPayloadType = 'text/plain';

    if (textMode || !activePreset) {
      if (!customText.trim()) {
        setWarningMessage('Please type or upload some text to proceed.');
        return;
      }
      finalPayloadContent = customText;
      finalPayloadName = fileName || 'custom_clipboard_input.txt';
      finalPayloadType = finalPayloadName.endsWith('.csv') ? 'text/csv' : 'text/plain';
    } else {
      const selected = PRESETS.find(p => p.key === activePreset);
      if (selected) {
        finalPayloadContent = selected.content;
        finalPayloadName = `preset_${selected.key}.${selected.type === 'text/csv' ? 'csv' : 'txt'}`;
        finalPayloadType = selected.type;
      }
    }

    onAnalyze({
      name: finalPayloadName,
      content: finalPayloadContent,
      type: finalPayloadType
    });
  };

  // Run the default log analysis immediately on load
  React.useEffect(() => {
    const defaultPreset = PRESETS[0];
    setCustomText(defaultPreset.content);
    setFileName(`preset_${defaultPreset.key}.txt`);
  }, []);

  return (
    <div id="compress-iq-upload-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Drag zone & Custom editor */}
        <div className="col-span-1 lg:col-span-7 space-y-6">
          <div 
            className={`relative rounded-3xl p-6 sm:p-8 border-2 border-dashed transition-all duration-300 ${
              dragActive 
                ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_30px_-5px_rgba(34,211,238,0.2)]' 
                : 'border-white/10 bg-white/5 backdrop-blur-md'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {/* Input Element */}
            <input 
              id="file-upload-input"
              ref={fileInputRef}
              type="file" 
              accept=".txt,.csv" 
              className="hidden" 
              onChange={handleFileChange}
            />

            <div className="flex flex-col items-center text-center">
              <div className="p-4 rounded-full bg-slate-900/80 border border-white/[0.05] shadow-inner mb-4 text-cyan-400">
                <Upload className="w-8 h-8 animate-pulse text-cyan-400" />
              </div>

              <h4 className="text-lg font-semibold text-white">
                Drag & Drop custom analysis files here
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Supports standard <span className="text-cyan-400">.txt (Text)</span> and <span className="text-cyan-400">.csv (Comma-Separated Grid)</span> character maps. Large documents will be scaled.
              </p>

              <div className="flex flex-wrap gap-3 items-center justify-center mt-6">
                <button
                  id="browse-files-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 border border-white/[0.08] text-xs font-medium hover:bg-slate-700 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Browse File Path
                </button>
                <span className="text-xs text-slate-500 font-mono">OR</span>
                <button
                  id="toggle-custom-input-mode"
                  onClick={() => {
                    setTextMode(true);
                    setActivePreset('');
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    textMode 
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_-5px_rgba(6,182,212,0.3)]' 
                      : 'bg-transparent text-slate-400 border-white/[0.05] hover:text-slate-200 hover:bg-white/[0.02]'
                  }`}
                >
                  Direct Symbol Console
                </button>
              </div>
            </div>
          </div>

          {/* Warning state info */}
          <AnimatePresence>
            {warningMessage && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-xs font-mono flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Warning: {warningMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Textarea Editor Option */}
          {textMode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-3xl p-5 space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-medium text-slate-300 uppercase tracking-wider font-mono">
                    {fileName || 'Dynamic Input Console'}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  {customText.length.toLocaleString()} symbols
                </div>
              </div>

              <textarea
                id="custom-text-analyzer-box"
                value={customText}
                onChange={(e) => {
                  setCustomText(e.target.value);
                  setFileName('custom_clipboard_input.txt');
                  setActivePreset('');
                }}
                placeholder="Type or paste high frequency text, source code files, custom CSV tables or symbols..."
                rows={7}
                className="w-full bg-slate-950/60 text-slate-200 text-xs font-mono p-4 rounded-xl border border-white/[0.05] focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all resize-y"
              />
            </motion.div>
          )}
        </div>

        {/* Right Side: Preset templates & Action button */}
        <div className="col-span-1 lg:col-span-5 h-full flex flex-col justify-between space-y-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-5 flex-1 select-none">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-slate-200">
                Choose Sample Analytics Payload
              </h3>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              No custom files? Instantly load beautiful preset scenarios engineered to showcase differences in pattern entropy and structural code speeds.
            </p>

            <div className="space-y-3 pt-2">
              {PRESETS.map((preset) => {
                const isSelected = activePreset === preset.key;
                return (
                  <button
                    id={`preset-loader-btn-${preset.key}`}
                    key={preset.key}
                    onClick={() => selectPreset(preset)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 relative group flex items-start gap-4 cursor-pointer ${
                      isSelected
                        ? 'bg-purple-500/10 border-purple-500/30 text-white shadow-[0_0_20px_-8px_rgba(168,85,247,0.4)]'
                        : 'bg-white/5 border-white/10 backdrop-blur-md text-slate-400 hover:bg-white/10 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    <preset.icon className={`w-5 h-5 mt-0.5 shrink-0 ${isSelected ? 'text-purple-400' : 'text-slate-400 group-hover:text-slate-300 transition-colors'}`} />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-purple-300' : 'text-slate-300'}`}>
                          {preset.name}
                        </span>
                        {isSelected && (
                          <span className="p-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/25">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 leading-snug">
                        {preset.desc}
                      </p>
                    </div>

                    {!isSelected && (
                      <ChevronRight className="w-4 h-4 ml-auto text-slate-600 group-hover:text-slate-400 transition-colors self-center" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Compare Trigger button with absolute premium glass vibe */}
          <div className="pt-2">
            <button
              id="compress-and-compare-btn"
              disabled={isProcessing}
              onClick={handleTriggerAnalysis}
              className={`w-full py-4.5 px-6 rounded-2xl relative overflow-hidden group font-sans font-bold text-sm tracking-wide text-white shadow-lg shadow-cyan-500/10 cursor-pointer active:scale-98 transition-all ${
                isProcessing 
                  ? 'opacity-80 pointer-events-none' 
                  : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600'
              }`}
            >
              {/* Inner glow mask */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="w-5 h-5 text-cyan-300 fill-cyan-400/20 animate-pulse shrink-0" />
                <span className="font-sans">COMPRESS & ANALYZE PERFORMANCE</span>
              </div>
              
              {/* Absolute glowing line */}
              <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-cyan-400 via-transparent to-purple-400 animate-pulse" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
