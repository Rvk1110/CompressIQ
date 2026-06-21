import { HuffmanResult, LzwResult, AIRecommendation } from '../types';

// Node classification for Huffman Tree representation
export interface HuffmanNode {
  char: string | null;
  freq: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;
}

/**
 * Builds the Huffman coding tree and returns the root node.
 */
export function buildHuffmanTree(text: string): HuffmanNode | null {
  if (!text) return null;

  // 1. Calculate character frequencies
  const frequencies: Record<string, number> = {};
  for (const char of text) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }

  // 2. Initialize leaves list
  const nodes: HuffmanNode[] = Object.entries(frequencies).map(([char, freq]) => ({
    char,
    freq,
    left: null,
    right: null,
  }));

  if (nodes.length === 0) return null;
  if (nodes.length === 1) {
    // Single character edge case
    return {
      char: null,
      freq: nodes[0].freq,
      left: nodes[0],
      right: null,
    };
  }

  // 3. Iteratively merge nodes of lowest frequency
  while (nodes.length > 1) {
    // Keep nodes sorted in descending order of frequency so we can pop from the end
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

/**
 * Traverses Huffman Tree to build character-to-binary-path mapping.
 */
export function generateCodes(node: HuffmanNode | null, prefix = '', codes: Record<string, string> = {}): Record<string, string> {
  if (!node) return codes;

  // If leaf node, assign prefix code
  if (node.char !== null) {
    codes[node.char] = prefix || '0'; // If it's the root leaf node (single character string)
  } else {
    if (node.left) generateCodes(node.left, prefix + '0', codes);
    if (node.right) generateCodes(node.right, prefix + '1', codes);
  }

  return codes;
}

/**
 * Runs Huffman compression algorithm.
 * Automatically benchmarks performance using multi-iteration loop to ensure non-zero milliseconds on small payloads.
 */
export function runHuffmanCompression(text: string): HuffmanResult {
  if (!text) {
    return {
      compressedSizeBytes: 0,
      ratio: 1.0,
      spaceSavedPercent: 0,
      executionTimeMs: 0,
      codeMap: {},
      encodedPreview: '',
      treeNodeCount: 0,
      complexity: 'O(n log n)',
    };
  }

  // Let's determine the number of benchmark iterations to run based on size
  const iterations = text.length < 500 ? 500 : text.length < 5000 ? 100 : 5;
  
  let codeMap: Record<string, string> = {};
  let encodedBinary = '';
  let treeSize = 0;

  // Count nodes recursively
  const countNodes = (n: HuffmanNode | null): number => {
    if (!n) return 0;
    return 1 + countNodes(n.left) + countNodes(n.right);
  };

  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    const root = buildHuffmanTree(text);
    codeMap = generateCodes(root);
    if (i === 0) {
      treeSize = countNodes(root);
    }
  }
  const end = performance.now();
  // Compute average duration of single iteration
  const executionTimeMs = Number(((end - start) / iterations).toFixed(4));

  // Generate binary output string
  const binaryBuilder: string[] = [];
  for (const char of text) {
    binaryBuilder.push(codeMap[char] || '');
  }
  encodedBinary = binaryBuilder.join('');

  // Sizing details
  const totalBits = encodedBinary.length;
  // A realistic compressed size must include bits for content + metadata codebook overhead
  // Header: 1 byte for count of dictionary entries, then 2 bytes per unique char (1 char byte, 1 byte code length/code representations)
  const uniqueCharsCount = Object.keys(codeMap).length;
  const headerOverheadBytes = uniqueCharsCount * 2 + 1;
  const bitstreamBytes = Math.ceil(totalBits / 8);
  const compressedSizeBytes = bitstreamBytes + headerOverheadBytes;

  const originalSizeBytes = text.length; // 1 byte per ASCII char
  const ratio = Number((originalSizeBytes / (compressedSizeBytes || 1)).toFixed(3));
  const spaceSavedPercent = originalSizeBytes > 0
    ? Number((((originalSizeBytes - compressedSizeBytes) / originalSizeBytes) * 100).toFixed(2))
    : 0;

  return {
    compressedSizeBytes,
    ratio,
    spaceSavedPercent: Math.max(0, spaceSavedPercent),
    executionTimeMs,
    codeMap,
    encodedPreview: encodedBinary.length > 200 ? encodedBinary.substring(0, 200) + '...' : encodedBinary,
    treeNodeCount: treeSize,
    complexity: 'O(n log n)',
  };
}

/**
 * Runs LZW compression algorithm.
 * Dictionary-based, caps dictionary at standard 12-bit limit (4096 code points).
 */
export function runLzwCompression(text: string): LzwResult {
  if (!text) {
    return {
      compressedSizeBytes: 0,
      ratio: 1.0,
      spaceSavedPercent: 0,
      executionTimeMs: 0,
      dictionarySize: 256,
      encodedPreview: '',
      codes: [],
      complexity: 'O(n)',
    };
  }

  const iterations = text.length < 500 ? 500 : text.length < 5000 ? 100 : 5;
  let finalCodes: number[] = [];
  let finalDictSize = 256;

  const start = performance.now();
  for (let iter = 0; iter < iterations; iter++) {
    // Setup dictionary for ASCII
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
        // Cap dictionary at 12-bit (4096 entries)
        if (dictSize < 4096) {
          dictionary[wc] = dictSize++;
        }
        w = c;
      }
    }

    if (w !== '') {
      codes.push(dictionary[w]);
    }

    if (iter === 0) {
      finalCodes = codes;
      finalDictSize = dictSize;
    }
  }
  const end = performance.now();
  const executionTimeMs = Number(((end - start) / iterations).toFixed(4));

  // Sizing calculation: LZW 12-bit codes packed into bytes (each code takes 12 bits)
  const totalBits = finalCodes.length * 12;
  const compressedSizeBytes = Math.ceil(totalBits / 8);

  const originalSizeBytes = text.length;
  const ratio = Number((originalSizeBytes / (compressedSizeBytes || 1)).toFixed(3));
  const spaceSavedPercent = originalSizeBytes > 0
    ? Number((((originalSizeBytes - compressedSizeBytes) / originalSizeBytes) * 100).toFixed(2))
    : 0;

  return {
    compressedSizeBytes,
    ratio,
    spaceSavedPercent: Math.max(0, spaceSavedPercent),
    executionTimeMs,
    dictionarySize: finalDictSize,
    encodedPreview: finalCodes.slice(0, 40).join(', ') + (finalCodes.length > 40 ? ', ...' : ''),
    codes: finalCodes,
    complexity: 'O(n)',
  };
}

/**
 * Generates dynamic comparative recommendation analysis text based on compression results.
 */
export function generateAIRecommendation(
  originalSize: number,
  huffman: HuffmanResult,
  lzw: LzwResult,
  text: string
): AIRecommendation {
  if (originalSize === 0) {
    return {
      bestRatioAlgorithm: 'Tie',
      fastestAlgorithm: 'Tie',
      suggestedAlgorithm: 'Huffman',
      explanation: 'No content was provided. Please upload or input text to analyze.',
    };
  }

  // 1. Determine best compression ratio
  let bestRatioAlgorithm: 'Huffman' | 'LZW' | 'Tie' = 'Tie';
  if (huffman.ratio > lzw.ratio) {
    bestRatioAlgorithm = 'Huffman';
  } else if (lzw.ratio > huffman.ratio) {
    bestRatioAlgorithm = 'LZW';
  }

  // 2. Determine fastest execution time
  let fastestAlgorithm: 'Huffman' | 'LZW' | 'Tie' = 'Tie';
  // Check within 0.005ms margin to treat as a tie
  if (Math.abs(huffman.executionTimeMs - lzw.executionTimeMs) < 0.005) {
    fastestAlgorithm = 'Tie';
  } else if (huffman.executionTimeMs < lzw.executionTimeMs) {
    fastestAlgorithm = 'Huffman';
  } else {
    fastestAlgorithm = 'LZW';
  }

  // 3. Suggested algorithm selection
  // In real-world transmission systems, a hybrid coefficient of compression ratio (70%) and speed (30%) is used.
  // Or simply, we recommend the one with better payload saving for cold-storage/assets, and speed for latency-critical.
  const suggestedAlgorithm: 'Huffman' | 'LZW' = huffman.ratio >= lzw.ratio ? 'Huffman' : 'LZW';

  // 4. Draft elegant description detailing characters, redundancies, and structures
  const entropy = calculateEntropy(text);
  const redundancies = originalSize - huffman.compressedSizeBytes;
  const isHighlyRepetitive = lzw.ratio > 1.25 && text.length > 100;

  let explanation = '';
  if (suggestedAlgorithm === 'LZW') {
    explanation = `LZW is highly recommended here, yielding a ${lzw.ratio}x compression ratio and reclaiming ${lzw.spaceSavedPercent}% of space. `;
    if (isHighlyRepetitive) {
      explanation += `The file exhibits substantial repetitive sequence patterns (entropy of ${entropy.toFixed(2)} bpc) which enables the LZW dynamic dictionary to rapidly build multi-character token representations. `;
    } else {
      explanation += `Despite low redundancy, the sequential index structures of LZW out-perform Huffman's character-isolated probability codebooks. `;
    }
    explanation += `While Huffman is highly structured, LZW requires only ${finalCodesCount(text)} O(1) lookups to decode.`;
  } else {
    explanation = `Huffman Coding is the optimal choice for this payload, delivering a ${huffman.ratio}x ratio. `;
    explanation += `With an input entropy of ${entropy.toFixed(2)} bits per character, the letter frequencies are highly concentrated rather than uniformly distributed. `;
    explanation += `Since there are few recurring structural sequences for LZW to build dictionary tokens from, Huffman's variable-length bit codings map small binary sequences directly to higher-frequency symbols, maximizing custom bit economy.`;
  }

  return {
    bestRatioAlgorithm,
    fastestAlgorithm,
    suggestedAlgorithm,
    explanation,
  };
}

// Support function for analytical AI panel
function calculateEntropy(str: string): number {
  if (!str) return 0;
  const freqs: Record<string, number> = {};
  for (const c of str) {
    freqs[c] = (freqs[c] || 0) + 1;
  }
  let entropy = 0;
  const len = str.length;
  for (const count of Object.values(freqs)) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

function finalCodesCount(text: string): number {
  const dictionary: Record<string, number> = {};
  for (let i = 0; i < 256; i++) {
    dictionary[String.fromCharCode(i)] = i;
  }
  let dictSize = 256;
  let w = '';
  let count = 0;
  for (const c of text) {
    const wc = w + c;
    if (dictionary[wc] !== undefined) {
      w = wc;
    } else {
      count++;
      if (dictSize < 4096) {
        dictionary[wc] = dictSize++;
      }
      w = c;
    }
  }
  if (w !== '') count++;
  return count;
}
