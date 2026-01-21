/**
 * Transformation types for adversarial content system
 */

import type { RewriteLevel } from './behavior';

/**
 * Type of transformation applied to content
 */
export type TransformationType = 'expand' | 'rewrite';

/**
 * A chunk of content that can be transformed
 */
export interface ContentChunk {
  /** Unique identifier, e.g., "content-p-003" */
  id: string;
  /** Reference to the DOM element */
  element: HTMLElement;
  /** Original content (for reset reference) */
  baseContent: string;
  /** Current content (may be transformed) */
  currentContent: string;
  /** Number of times this chunk has been transformed */
  transformCount: number;
  /** Type of last transformation applied */
  lastTransformType: TransformationType | null;
  /** Level of last rewrite (if applicable) */
  lastRewriteLevel: RewriteLevel | null;
  /** Timestamp of last transformation */
  lastTransformTime: number | null;
  /** Whether this chunk is currently visible in viewport */
  isVisible: boolean;
  /** Word count of current content */
  wordCount: number;
}

/**
 * Request payload for transformation API
 */
export interface TransformRequest {
  /** Session identifier */
  sessionId: string;
  /** Chunk identifier */
  chunkId: string;
  /** Content to transform */
  content: string;
  /** Type of transformation */
  type: TransformationType;
  /** Rewrite level (required if type is 'rewrite') */
  level?: RewriteLevel;
}

/**
 * Response from transformation API
 */
export interface TransformResponse {
  /** Transformed content */
  transformedContent: string;
  /** Time taken for transformation in ms */
  latency: number;
}

/**
 * Result of a transformation operation
 */
export interface TransformResult {
  /** Whether transformation succeeded */
  success: boolean;
  /** Chunk that was transformed */
  chunkId: string;
  /** Type of transformation */
  type: TransformationType;
  /** Rewrite level (if applicable) */
  level?: RewriteLevel;
  /** Original content before transformation */
  originalContent: string;
  /** Content after transformation */
  transformedContent: string;
  /** Latency in milliseconds */
  latency: number;
  /** What triggered this transformation */
  trigger: string;
  /** Error message if transformation failed */
  error?: string;
  /** Timestamp of transformation */
  timestamp: number;
}

/**
 * Chunk state for tracking across transforms
 */
export interface ChunkState {
  /** Map of chunk IDs to their current state */
  chunks: Map<string, ContentChunk>;
  /** IDs of chunks currently visible in viewport */
  visibleChunkIds: Set<string>;
  /** Total number of transforms applied */
  totalTransforms: number;
  /** Timestamp of last transformation */
  lastTransformTime: number | null;
}

/**
 * Initial chunk state
 */
export const INITIAL_CHUNK_STATE: Omit<ChunkState, 'chunks' | 'visibleChunkIds'> & {
  chunks: Map<string, ContentChunk>;
  visibleChunkIds: Set<string>;
} = {
  chunks: new Map(),
  visibleChunkIds: new Set(),
  totalTransforms: 0,
  lastTransformTime: null,
};

/**
 * Configuration for viewport chunking
 */
export interface ChunkingConfig {
  /** Maximum words per chunk */
  maxWordsPerChunk: number;
  /** Minimum words to consider for grouping */
  minWordsForGroup: number;
  /** Element selectors to chunk */
  chunkSelectors: string[];
  /** Element selectors to exclude */
  excludeSelectors: string[];
}

/**
 * Default chunking configuration
 */
export const DEFAULT_CHUNKING_CONFIG: ChunkingConfig = {
  maxWordsPerChunk: 200,
  minWordsForGroup: 50,
  chunkSelectors: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote', 'figure'],
  excludeSelectors: ['nav', 'header', 'footer', 'code', 'pre', '[data-no-transform]'],
};

/**
 * Transform queue item for batching
 */
export interface QueuedTransform {
  chunkId: string;
  type: TransformationType;
  level?: RewriteLevel;
  priority: number;
  addedAt: number;
}
