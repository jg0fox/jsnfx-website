/**
 * Text diffing utilities for morphing animations
 *
 * Provides word-level and character-level comparison for
 * animating text transitions smoothly.
 */

export type DiffType = 'unchanged' | 'changed' | 'added' | 'removed';

export interface WordDiff {
  type: DiffType;
  oldWord: string;
  newWord: string;
  index: number;
}

export interface CharDiff {
  type: DiffType;
  oldChar: string;
  newChar: string;
  index: number;
}

/**
 * Split text into words while preserving whitespace information
 */
export function tokenize(text: string): string[] {
  // Split on word boundaries but keep the tokens
  return text.split(/(\s+)/).filter((token) => token.length > 0);
}

/**
 * Compute word-level diff between two texts
 * Uses a simple LCS-based approach for reasonable performance
 */
export function diffWords(oldText: string, newText: string): WordDiff[] {
  const oldTokens = tokenize(oldText);
  const newTokens = tokenize(newText);

  // Build LCS table
  const lcs = computeLCS(oldTokens, newTokens);

  // Backtrack to build diff
  const diffs: WordDiff[] = [];
  let i = oldTokens.length;
  let j = newTokens.length;
  let index = 0;

  const tempDiffs: WordDiff[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldTokens[i - 1] === newTokens[j - 1]) {
      // Unchanged
      tempDiffs.unshift({
        type: 'unchanged',
        oldWord: oldTokens[i - 1],
        newWord: newTokens[j - 1],
        index: 0,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
      // Added in new
      tempDiffs.unshift({
        type: 'added',
        oldWord: '',
        newWord: newTokens[j - 1],
        index: 0,
      });
      j--;
    } else if (i > 0) {
      // Removed from old
      tempDiffs.unshift({
        type: 'removed',
        oldWord: oldTokens[i - 1],
        newWord: '',
        index: 0,
      });
      i--;
    }
  }

  // Assign indices and merge adjacent changes into "changed"
  for (let k = 0; k < tempDiffs.length; k++) {
    tempDiffs[k].index = index++;

    // Try to merge adjacent removed+added into changed
    if (
      tempDiffs[k].type === 'removed' &&
      k + 1 < tempDiffs.length &&
      tempDiffs[k + 1].type === 'added'
    ) {
      diffs.push({
        type: 'changed',
        oldWord: tempDiffs[k].oldWord,
        newWord: tempDiffs[k + 1].newWord,
        index: tempDiffs[k].index,
      });
      k++; // Skip the next one
      index--; // Adjust index since we merged
    } else {
      diffs.push(tempDiffs[k]);
    }
  }

  return diffs;
}

/**
 * Compute character-level diff between two words
 */
export function diffChars(oldWord: string, newWord: string): CharDiff[] {
  const diffs: CharDiff[] = [];
  const maxLen = Math.max(oldWord.length, newWord.length);

  for (let i = 0; i < maxLen; i++) {
    const oldChar = oldWord[i] || '';
    const newChar = newWord[i] || '';

    if (oldChar === newChar) {
      diffs.push({ type: 'unchanged', oldChar, newChar, index: i });
    } else if (oldChar && newChar) {
      diffs.push({ type: 'changed', oldChar, newChar, index: i });
    } else if (newChar) {
      diffs.push({ type: 'added', oldChar: '', newChar, index: i });
    } else {
      diffs.push({ type: 'removed', oldChar, newChar: '', index: i });
    }
  }

  return diffs;
}

/**
 * Compute LCS table for two arrays
 */
function computeLCS(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const table: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        table[i][j] = table[i - 1][j - 1] + 1;
      } else {
        table[i][j] = Math.max(table[i - 1][j], table[i][j - 1]);
      }
    }
  }

  return table;
}

/**
 * Generate random character for scramble effect
 */
export function randomChar(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return chars[Math.floor(Math.random() * chars.length)];
}

/**
 * Generate scramble sequence for a character transition
 * Returns array of characters to display in sequence
 */
export function scrambleSequence(
  fromChar: string,
  toChar: string,
  steps: number = 4
): string[] {
  const sequence: string[] = [];

  // Start with original (or empty)
  if (fromChar) {
    sequence.push(fromChar);
  }

  // Add scramble steps
  for (let i = 0; i < steps; i++) {
    sequence.push(randomChar());
  }

  // End with target
  sequence.push(toChar);

  return sequence;
}

/**
 * Calculate animation delay for a word based on position
 * Creates a ripple effect through the text
 */
export function calculateDelay(
  wordIndex: number,
  totalWords: number,
  baseDuration: number = 50
): number {
  // Stagger based on position, with some randomness
  const positionDelay = wordIndex * baseDuration;
  const jitter = Math.random() * (baseDuration / 2);
  return positionDelay + jitter;
}

/**
 * Get animation parameters based on transformation mode
 */
export interface AnimationConfig {
  /** Duration of character scramble in ms */
  scrambleDuration: number;
  /** Number of scramble steps per character */
  scrambleSteps: number;
  /** Base delay between words in ms */
  staggerDelay: number;
  /** Whether to use chaotic timing */
  chaotic: boolean;
  /** Overall animation intensity (0-1) */
  intensity: number;
}

export function getAnimationConfig(
  mode: 'expand' | 'rewrite',
  level?: 1 | 2 | 3
): AnimationConfig {
  if (mode === 'expand') {
    return {
      scrambleDuration: 300,
      scrambleSteps: 3,
      staggerDelay: 30,
      chaotic: false,
      intensity: 0.5,
    };
  }

  // Rewrite modes
  switch (level) {
    case 1:
      return {
        scrambleDuration: 200,
        scrambleSteps: 2,
        staggerDelay: 40,
        chaotic: false,
        intensity: 0.3,
      };
    case 2:
      return {
        scrambleDuration: 250,
        scrambleSteps: 4,
        staggerDelay: 35,
        chaotic: false,
        intensity: 0.6,
      };
    case 3:
      return {
        scrambleDuration: 400,
        scrambleSteps: 8,
        staggerDelay: 20,
        chaotic: true,
        intensity: 1.0,
      };
    default:
      return {
        scrambleDuration: 250,
        scrambleSteps: 4,
        staggerDelay: 35,
        chaotic: false,
        intensity: 0.5,
      };
  }
}
