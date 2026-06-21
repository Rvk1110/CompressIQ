import { FileMeta } from '../types';
import { File, HardDrive, Hash, Clock, FileType, CheckSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface FileMetaCardProps {
  meta: FileMeta;
}

export default function FileMetaCard({ meta }: FileMetaCardProps) {
  // Compute line count and word count on client side for premium metadata depth
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card glass-card-hover rounded-3xl p-6 relative overflow-hidden"
    >

      {/* Title block */}
      <div className="flex items-center gap-3 border-b border-white/[0.05] pb-4 mb-5">
        <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <File className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">
            Source Dataset File Info
          </span>
          <h3 className="text-sm font-bold text-slate-200 line-clamp-1">
            {meta.name}
          </h3>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* File Name */}
        <div className="bg-white/[0.01] border border-white/[0.03] p-3 rounded-2xl flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-slate-900 border border-white/[0.05] text-slate-400">
            <FileType className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Format</p>
            <p className="text-xs font-bold text-slate-200">
              {meta.type === 'text/csv' ? 'COMMA DOCUMENT (.csv)' : 'TEXT FORMAT (.txt)'}
            </p>
          </div>
        </div>

        {/* Size */}
        <div className="bg-white/[0.01] border border-white/[0.03] p-3 rounded-2xl flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-slate-900 border border-white/[0.05] text-slate-400">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Original Footprint</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-bold text-slate-200">
                {formatBytes(meta.sizeBytes)}
              </span>
              <span className="text-[9px] font-mono text-slate-400">
                ({meta.sizeBytes.toLocaleString()} bytes)
              </span>
            </div>
          </div>
        </div>

        {/* Character Count */}
        <div className="bg-white/[0.01] border border-white/[0.03] p-3 rounded-2xl flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-slate-900 border border-white/[0.05] text-slate-400">
            <Hash className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Symbols Parsed</p>
            <p className="text-xs font-bold text-slate-200">
              {meta.charCount.toLocaleString()} UTF-8 chars
            </p>
          </div>
        </div>

        {/* Timestamp */}
        <div className="bg-white/[0.01] border border-white/[0.03] p-3 rounded-2xl flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-slate-900 border border-white/[0.05] text-slate-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Timestamp</p>
            <p className="text-xs font-bold text-slate-200 font-sans truncate">
              {meta.timestamp}
            </p>
          </div>
        </div>

      </div>

      {/* Decorative footer indicators */}
      <div className="mt-5 pt-3.5 border-t border-white/[0.04] flex justify-between items-center text-[9px] font-mono text-slate-500">
        <span className="flex items-center gap-1">
          <CheckSquare className="w-3 h-3 text-cyan-400" /> MEMORY BUFFER: EXTR_OK
        </span>
        <span>CHUNK_SIZE: {meta.sizeBytes} B</span>
      </div>
    </motion.div>
  );
}
