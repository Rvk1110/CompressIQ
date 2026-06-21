import { HuffmanResult, LzwResult, CompressionResult, OptimizationRecommendation } from '../types';

export interface HuffmanNode {
  char: string | null;
  freq: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;
}

export function buildHuffmanTree(text: string): HuffmanNode | null {
  if (!text) return null;

  const frequencies: Record<string, number> = {};
  for (const char of text) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }

  const nodes: HuffmanNode[] = Object.entries(frequencies).map(([char, freq]) => ({
    char,
    freq,
    left: null,
    right: null,
  }));

  if (nodes.length === 0) return null;
  if (nodes.length === 1) {
    return {
      char: null,
      freq: nodes[0].freq,
      left: nodes[0],
      right: null,
    };
  }

  while (nodes.length > 1) {
    nodes.sort((a, b) => b.freq - a.freq);
    const left = nodes.pop()!;
    const right = nodes.pop()!;

    const parent: HuffmanNode = {
      char: null,
      freq: left.freq + right.freq,
      left,
      right,
    };
    nodes.push(parent);
  }

  return nodes[0];
}

export function generateCodes(node: HuffmanNode | null, prefix = '', codes: Record<string, string> = {}): Record<string, string> {
  if (!node) return codes;
  if (node.char !== null) {
    codes[node.char] = prefix || '0';
  } else {
    if (node.left) generateCodes(node.left, prefix + '0', codes);
    if (node.right) generateCodes(node.right, prefix + '1', codes);
  }
  return codes;
}

export function runHuffmanCompression(text: string): HuffmanResult {
  const start = performance.now();
  if (!text) {
    return {
      algorithmName: 'Huffman Coding',
      compressedSizeBytes: 0,
      ratio: 1.0,
      spaceSavedPercent: 0,
      executionTimeMs: 0,
      codeMap: {},
      encodedPreview: '',
      treeNodeCount: 0,
      complexity: 'O(n log n)',
      isHybrid: false,
      rawData: '',
    };
  }

  const root = buildHuffmanTree(text);
  const codeMap = generateCodes(root);
  
  let treeSize = 0;
  const countNodes = (n: HuffmanNode | null): number => {
    if (!n) return 0;
    return 1 + countNodes(n.left) + countNodes(n.right);
  };
  treeSize = countNodes(root);

  const binaryBuilder: string[] = [];
  for (const char of text) {
    binaryBuilder.push(codeMap[char] || '');
  }
  const encodedBinary = binaryBuilder.join('');

  const totalBits = encodedBinary.length;
  const uniqueCharsCount = Object.keys(codeMap).length;
  const headerOverheadBytes = uniqueCharsCount * 2 + 1;
  const bitstreamBytes = Math.ceil(totalBits / 8);
  const compressedSizeBytes = bitstreamBytes + headerOverheadBytes;
  const originalSizeBytes = text.length;

  const ratio = originalSizeBytes > 0 && compressedSizeBytes > 0
    ? Number((originalSizeBytes / compressedSizeBytes).toFixed(3))
    : 1.0;
  const spaceSavedPercent = originalSizeBytes > 0 && compressedSizeBytes > 0
    ? Number((((originalSizeBytes - compressedSizeBytes) / originalSizeBytes) * 100).toFixed(2))
    : 0;

  const end = performance.now();

  return {
    algorithmName: 'Huffman Coding',
    compressedSizeBytes,
    ratio,
    spaceSavedPercent,
    executionTimeMs: Number((end - start).toFixed(4)),
    codeMap,
    encodedPreview: encodedBinary.length > 200 ? encodedBinary.substring(0, 200) + '...' : encodedBinary,
    treeNodeCount: treeSize,
    complexity: 'O(n log n)',
    isHybrid: false,
    rawData: encodedBinary,
  };
}

export function runLzwCompression(text: string): LzwResult {
  const start = performance.now();
  if (!text) {
    return {
      algorithmName: 'LZW',
      compressedSizeBytes: 0,
      ratio: 1.0,
      spaceSavedPercent: 0,
      executionTimeMs: 0,
      dictionarySize: 256,
      encodedPreview: '',
      codes: [],
      complexity: 'O(n)',
      isHybrid: false,
      rawData: '',
    };
  }

  const dictionary: Record<string, number> = {};
  for (let i = 0; i < 256; i++) {
    dictionary[String.fromCharCode(i)] = i;
  }

  let dictSize = 256;
  let w = '';
  const codes: number[] = [];

  for (const c of text) {
    const wc = w + c;
    if (dictionary[wc] !== undefined) {
      w = wc;
    } else {
      codes.push(dictionary[w]);
      if (dictSize < 4096) {
        dictionary[wc] = dictSize++;
      }
      w = c;
    }
  }

  if (w !== '') {
    codes.push(dictionary[w]);
  }

  const totalBits = codes.length * 12;
  const compressedSizeBytes = Math.ceil(totalBits / 8);
  const originalSizeBytes = text.length;

  const ratio = originalSizeBytes > 0 && compressedSizeBytes > 0
    ? Number((originalSizeBytes / compressedSizeBytes).toFixed(3))
    : 1.0;
  const spaceSavedPercent = originalSizeBytes > 0 && compressedSizeBytes > 0
    ? Number((((originalSizeBytes - compressedSizeBytes) / originalSizeBytes) * 100).toFixed(2))
    : 0;

  // Package codes into raw binary string
  let rawData = '';
  for (let i = 0; i < codes.length; i++) {
    rawData += String.fromCharCode(codes[i] >> 8, codes[i] & 0xFF);
  }

  const end = performance.now();

  return {
    algorithmName: 'LZW',
    compressedSizeBytes,
    ratio,
    spaceSavedPercent,
    executionTimeMs: Number((end - start).toFixed(4)),
    dictionarySize: dictSize,
    encodedPreview: codes.slice(0, 40).join(', ') + (codes.length > 40 ? ', ...' : ''),
    codes,
    complexity: 'O(n)',
    isHybrid: false,
    rawData,
  };
}

export function runOptimizationPipeline(
  text: string,
  fileName: string,
  fileType: string
): OptimizationRecommendation {
  const results: CompressionResult[] = [];

  // Run only Huffman and LZW pipelines
  results.push(runHuffmanCompression(text));
  results.push(runLzwCompression(text));

  // Sort by compressedSizeBytes ascending to find the best (lowest size)
  const rankedMethods = [...results].sort((a, b) => a.compressedSizeBytes - b.compressedSizeBytes);
  const bestMethod = rankedMethods[0];

  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const isAlreadyCompressed = ext === 'png' || ext === 'jpg' || ext === 'jpeg' || fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'application/pdf';

  let explanation = '';
  if (isAlreadyCompressed) {
    explanation = `The uploaded image/document format (${ext.toUpperCase()}) is already compressed. Lossless pipelines like Huffman or LZW cannot reduce the file size further and will cause data expansion due to the codebook/dictionary overhead. `;
  }

  if (bestMethod.compressedSizeBytes >= text.length) {
    explanation += "File is already highly compressed. Further lossless compression is not beneficial.";
  } else {
    explanation += `The optimal choice is ${bestMethod.algorithmName}, achieving a compression ratio of ${bestMethod.ratio}x and saving ${bestMethod.spaceSavedPercent}% space.`;
  }

  return {
    bestMethod,
    rankedMethods,
    isAlreadyCompressed,
    explanation,
  };
}
