export interface FileMeta {
  name: string;
  type: string;
  sizeBytes: number;
  charCount: number;
  timestamp: string;
}

export interface HuffmanResult {
  compressedSizeBytes: number;
  ratio: number;
  spaceSavedPercent: number;
  executionTimeMs: number;
  codeMap: Record<string, string>;
  encodedPreview: string; // binary string preview
  treeNodeCount: number;
  complexity: string;
}

export interface LzwResult {
  compressedSizeBytes: number;
  ratio: number;
  spaceSavedPercent: number;
  executionTimeMs: number;
  dictionarySize: number;
  encodedPreview: string; // comma-separated integer codes preview
  codes: number[];
  complexity: string;
}

export interface ComparisonMetrics {
  originalSizeBytes: number;
  huffman: HuffmanResult;
  lzw: LzwResult;
}

export interface AIRecommendation {
  bestRatioAlgorithm: 'Huffman' | 'LZW' | 'Tie';
  fastestAlgorithm: 'Huffman' | 'LZW' | 'Tie';
  suggestedAlgorithm: 'Huffman' | 'LZW';
  explanation: string;
}

export type ThemeType = 'dark';
