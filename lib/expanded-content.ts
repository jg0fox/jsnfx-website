/**
 * Expanded Content Utility
 *
 * Provides functions to load and retrieve pre-generated content expansions
 * for the EXPAND mode feature.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

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
}

interface ManifestChunk {
  chunkId: string;
  sourcePath: string;
  sourceType: 'mdx' | 'jsx';
  elementType: string;
  originalWordCount: number;
  originalHash: string;
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

// Paths
const EXPANDED_DIR = path.join(process.cwd(), 'content', 'expanded');
const CHUNKS_DIR = path.join(EXPANDED_DIR, 'chunks');
const MANIFEST_PATH = path.join(EXPANDED_DIR, 'manifest.json');

// Caches
let manifestCache: Manifest | null = null;
let hashIndex: Map<string, string> | null = null;
const expansionCache = new Map<string, ChunkExpansions>();

/**
 * Load the manifest (cached)
 */
function loadManifest(): Manifest | null {
  if (manifestCache) return manifestCache;

  try {
    if (fs.existsSync(MANIFEST_PATH)) {
      manifestCache = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
      return manifestCache;
    }
  } catch (error) {
    console.error('[ExpandedContent] Failed to load manifest:', error);
  }

  return null;
}

/**
 * Build hash index for fast lookups
 */
function buildHashIndex(): Map<string, string> {
  if (hashIndex) return hashIndex;

  hashIndex = new Map();
  const manifest = loadManifest();

  if (manifest) {
    for (const chunk of manifest.chunks) {
      hashIndex.set(chunk.originalHash, chunk.chunkId);
    }
  }

  return hashIndex;
}

/**
 * Generate hash from content (matches scanner logic)
 */
export function hashContent(content: string): string {
  const normalized = content
    .replace(/<[^>]*>/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
  return crypto.createHash('md5').update(normalized).digest('hex').slice(0, 8);
}

/**
 * Find chunk ID by content hash
 */
export function findChunkByHash(contentHash: string): string | null {
  const index = buildHashIndex();
  return index.get(contentHash) ?? null;
}

/**
 * Check if pre-generated expansion exists for content
 */
export function hasPreGeneratedExpansion(content: string): boolean {
  const hash = hashContent(content);
  return findChunkByHash(hash) !== null;
}

/**
 * Load all versions for a chunk
 */
export function loadChunkExpansions(chunkId: string): ChunkExpansions | null {
  // Check cache first
  if (expansionCache.has(chunkId)) {
    return expansionCache.get(chunkId)!;
  }

  const manifest = loadManifest();
  if (!manifest) return null;

  const chunkMeta = manifest.chunks.find(c => c.chunkId === chunkId);
  if (!chunkMeta) return null;

  const chunkDir = path.join(CHUNKS_DIR, chunkId);

  // Check if chunk directory exists
  if (!fs.existsSync(chunkDir)) return null;

  try {
    const originalPath = path.join(chunkDir, 'original.md');
    if (!fs.existsSync(originalPath)) return null;

    const original = fs.readFileSync(originalPath, 'utf-8');
    const versions: ExpansionVersion[] = [];

    // Load only passing versions
    for (const v of chunkMeta.versions) {
      if (v.evaluation.passed) {
        const versionPath = path.join(chunkDir, `v${v.version}.md`);
        if (fs.existsSync(versionPath)) {
          const content = fs.readFileSync(versionPath, 'utf-8');
          versions.push({
            version: v.version,
            content,
            wordCount: v.wordCount,
            evalScore: v.evaluation.average,
            strategy: v.strategy,
          });
        }
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
  } catch (error) {
    console.error(`[ExpandedContent] Failed to load chunk ${chunkId}:`, error);
    return null;
  }
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
  const manifest = loadManifest();
  if (!manifest) return null;

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

  if (!chunkId) return null;

  const expansion = getRandomExpansion(chunkId);
  if (!expansion) return null;

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
  const manifest = loadManifest();
  if (!manifest) return null;

  const chunksWithExpansions = manifest.chunks.filter(
    c => c.versions.some(v => v.evaluation.passed)
  ).length;

  const totalVersions = manifest.chunks.reduce(
    (sum, c) => sum + c.versions.filter(v => v.evaluation.passed).length,
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
  manifestCache = null;
  hashIndex = null;
  expansionCache.clear();
}
