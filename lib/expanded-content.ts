/**
 * Expanded Content Utility
 *
 * Provides functions to load and retrieve pre-generated content expansions
 * for the EXPAND mode feature.
 *
 * Content is embedded directly in the manifest for serverless compatibility.
 */

import * as crypto from 'crypto';

// Import manifest as a module (bundled at build time)
import manifestData from '@/content/expanded/manifest.json';

// Types
interface ManifestVersion {
  version: number;
  strategy: string;
  wordCount: number;
  expansionRatio: number;
  evaluation: {
    adversarialEffectiveness: number;
    contentIntegrity: number;
    technicalQuality: number;
    average: number;
    passed: boolean;
  };
  generatedAt: string;
  retryCount: number;
  content?: string;
}

interface ManifestChunk {
  chunkId: string;
  sourcePath: string;
  sourceType: 'mdx' | 'jsx';
  elementType: string;
  originalWordCount: number;
  originalHash: string;
  originalContent?: string;
  context?: string;
  versions: ManifestVersion[];
}

interface Manifest {
  generatedAt: string;
  model: string;
  thinkingEnabled: boolean;
  expansionTarget: string;
  totalChunks: number;
  totalVersions: number;
  chunks: ManifestChunk[];
}

export interface ExpansionVersion {
  version: number;
  content: string;
  wordCount: number;
  evalScore: number;
  strategy: string;
}

export interface ChunkExpansions {
  chunkId: string;
  originalContent: string;
  originalWordCount: number;
  versions: ExpansionVersion[];
}

export interface ExpansionStats {
  versions: number;
  avgScore: number;
  avgExpansionRatio: number;
}

// Cast manifest to proper type
const manifest = manifestData as unknown as Manifest;

// Build hash index for fast lookups
const hashIndex = new Map<string, string>();
for (const chunk of manifest.chunks) {
  hashIndex.set(chunk.originalHash, chunk.chunkId);
}

// Cache for loaded expansions
const expansionCache = new Map<string, ChunkExpansions>();

/**
 * Generate hash from content (matches scanner logic)
 * Normalizes both HTML and Markdown syntax to produce consistent hashes
 */
export function hashContent(content: string): string {
  const normalized = content
    // Strip HTML tags
    .replace(/<[^>]*>/g, '')
    // Strip markdown formatting (bold, italic, etc.)
    .replace(/\*\*([^*]+)\*\*/g, '$1')  // **bold**
    .replace(/\*([^*]+)\*/g, '$1')       // *italic*
    .replace(/__([^_]+)__/g, '$1')       // __bold__
    .replace(/_([^_]+)_/g, '$1')         // _italic_
    .replace(/`([^`]+)`/g, '$1')         // `code`
    .replace(/~~([^~]+)~~/g, '$1')       // ~~strikethrough~~
    // Strip markdown links [text](url) → text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Strip markdown images ![alt](url) → alt
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Strip heading markers
    .replace(/^#{1,6}\s+/gm, '')
    // Strip list markers
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // Lowercase and normalize whitespace
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
  return crypto.createHash('md5').update(normalized).digest('hex').slice(0, 8);
}

/**
 * Find chunk ID by content hash
 */
export function findChunkByHash(contentHash: string): string | null {
  return hashIndex.get(contentHash) ?? null;
}

/**
 * Check if pre-generated expansion exists for content
 */
export function hasPreGeneratedExpansion(content: string): boolean {
  const hash = hashContent(content);
  return findChunkByHash(hash) !== null;
}

/**
 * Load all versions for a chunk (from embedded manifest)
 */
export function loadChunkExpansions(chunkId: string): ChunkExpansions | null {
  // Check cache first
  if (expansionCache.has(chunkId)) {
    return expansionCache.get(chunkId)!;
  }

  const chunkMeta = manifest.chunks.find(c => c.chunkId === chunkId);
  if (!chunkMeta) return null;

  // Get original content from embedded manifest
  const original = chunkMeta.originalContent;
  if (!original) return null;

  // Get passing versions with embedded content
  const versions: ExpansionVersion[] = [];
  for (const v of chunkMeta.versions) {
    if (v.evaluation.passed && v.content) {
      versions.push({
        version: v.version,
        content: v.content,
        wordCount: v.wordCount,
        evalScore: v.evaluation.average,
        strategy: v.strategy,
      });
    }
  }

  if (versions.length === 0) return null;

  const expansions: ChunkExpansions = {
    chunkId,
    originalContent: original,
    originalWordCount: chunkMeta.originalWordCount,
    versions,
  };

  // Cache it
  expansionCache.set(chunkId, expansions);
  return expansions;
}

/**
 * Get a random expanded version for a chunk
 */
export function getRandomExpansion(chunkId: string): { content: string; version: number } | null {
  const expansions = loadChunkExpansions(chunkId);
  if (!expansions || expansions.versions.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * expansions.versions.length);
  const version = expansions.versions[randomIndex];

  return {
    content: version.content,
    version: version.version,
  };
}

/**
 * Get a specific version
 */
export function getExpandedContent(chunkId: string, version: number): string | null {
  const expansions = loadChunkExpansions(chunkId);
  if (!expansions) return null;

  const v = expansions.versions.find(ver => ver.version === version);
  return v?.content ?? null;
}

/**
 * Get expansion statistics for a chunk
 */
export function getExpansionStats(chunkId: string): ExpansionStats | null {
  const chunkMeta = manifest.chunks.find(c => c.chunkId === chunkId);
  if (!chunkMeta) return null;

  const passingVersions = chunkMeta.versions.filter(v => v.evaluation.passed);
  if (passingVersions.length === 0) return null;

  const avgScore = passingVersions.reduce((sum, v) => sum + v.evaluation.average, 0) / passingVersions.length;
  const avgRatio = passingVersions.reduce((sum, v) => sum + v.expansionRatio, 0) / passingVersions.length;

  return {
    versions: passingVersions.length,
    avgScore,
    avgExpansionRatio: avgRatio,
  };
}

/**
 * Get expansion by content (convenience function)
 * Returns a random expansion for content that matches
 */
export function getExpansionForContent(content: string): { content: string; version: number; chunkId: string } | null {
  const hash = hashContent(content);
  const chunkId = findChunkByHash(hash);

  if (!chunkId) {
    // Debug logging for hash mismatches - helps diagnose why pre-generated content isn't found
    console.log('[PREGEN-MISS]', {
      hash,
      contentLength: content.length,
      contentPreview: content.slice(0, 100).replace(/\n/g, ' '),
      availableHashes: Array.from(hashIndex.keys()).slice(0, 5), // Show first 5 available hashes
    });
    return null;
  }

  const expansion = getRandomExpansion(chunkId);
  if (!expansion) {
    console.log('[PREGEN-EMPTY]', { chunkId, hash });
    return null;
  }

  console.log('[PREGEN-HIT]', { chunkId, hash, version: expansion.version });

  return {
    ...expansion,
    chunkId,
  };
}

/**
 * Get total stats across all chunks
 */
export function getTotalStats(): {
  totalChunks: number;
  chunksWithExpansions: number;
  totalVersions: number;
  avgVersionsPerChunk: number;
} | null {
  const chunksWithExpansions = manifest.chunks.filter(
    c => c.versions.some(v => v.evaluation.passed && v.content)
  ).length;

  const totalVersions = manifest.chunks.reduce(
    (sum, c) => sum + c.versions.filter(v => v.evaluation.passed && v.content).length,
    0
  );

  return {
    totalChunks: manifest.totalChunks,
    chunksWithExpansions,
    totalVersions,
    avgVersionsPerChunk: chunksWithExpansions > 0 ? totalVersions / chunksWithExpansions : 0,
  };
}

/**
 * Clear caches (useful for development/testing)
 */
export function clearCaches(): void {
  expansionCache.clear();
}
