export interface FileMeta {
  name: string;
  type: string;
  sizeBytes: number;
  charCount: number;
  timestamp: string;
}

export interface CompressionResult {
  algorithmName: string;
  compressedSizeBytes: number;
  ratio: number;
  spaceSavedPercent: number;
  executionTimeMs: number;
  encodedPreview: string;
  complexity: string;
  isHybrid: boolean;
  rawData: string;
}

export interface HuffmanResult extends CompressionResult {
  codeMap: Record<string, string>;
  treeNodeCount: number;
}

export interface LzwResult extends CompressionResult {
  dictionarySize: number;
  codes: number[];
}

export interface OptimizationRecommendation {
  bestMethod: CompressionResult;
  rankedMethods: CompressionResult[];
  isAlreadyCompressed: boolean;
  explanation: string;
}

export type ThemeType = 'dark';
