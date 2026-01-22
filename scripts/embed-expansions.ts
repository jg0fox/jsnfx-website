#!/usr/bin/env npx tsx

/**
 * Embed Expansions into Manifest
 *
 * Reads all chunk files and embeds the content directly into manifest.json
 * This ensures the expanded content is bundled with the serverless function.
 *
 * Usage:
 *   npx tsx scripts/embed-expansions.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const EXPANDED_DIR = path.join(process.cwd(), 'content', 'expanded');
const CHUNKS_DIR = path.join(EXPANDED_DIR, 'chunks');
const MANIFEST_PATH = path.join(EXPANDED_DIR, 'manifest.json');

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
  content?: string; // Embedded content
}

interface ManifestChunk {
  chunkId: string;
  sourcePath: string;
  sourceType: 'mdx' | 'jsx';
  elementType: string;
  originalWordCount: number;
  originalHash: string;
  originalContent?: string; // Embedded original
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

async function main() {
  console.log('Embedding expansions into manifest...\n');

  // Load manifest
  const manifest: Manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));

  let embeddedChunks = 0;
  let embeddedVersions = 0;
  let skippedChunks = 0;

  for (const chunk of manifest.chunks) {
    const chunkDir = path.join(CHUNKS_DIR, chunk.chunkId);

    // Check if chunk directory exists
    if (!fs.existsSync(chunkDir)) {
      skippedChunks++;
      continue;
    }

    // Embed original content
    const originalPath = path.join(chunkDir, 'original.md');
    if (fs.existsSync(originalPath)) {
      chunk.originalContent = fs.readFileSync(originalPath, 'utf-8');
    }

    // Embed version content (only passing versions)
    for (const version of chunk.versions) {
      if (version.evaluation.passed) {
        const versionPath = path.join(chunkDir, `v${version.version}.md`);
        if (fs.existsSync(versionPath)) {
          version.content = fs.readFileSync(versionPath, 'utf-8');
          embeddedVersions++;
        }
      }
    }

    embeddedChunks++;
  }

  // Update timestamp
  manifest.generatedAt = new Date().toISOString();

  // Save updated manifest
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log(`Embedded ${embeddedChunks} chunks with ${embeddedVersions} versions`);
  console.log(`Skipped ${skippedChunks} chunks (no directory)`);
  console.log(`\nManifest updated: ${MANIFEST_PATH}`);

  // Report size
  const stats = fs.statSync(MANIFEST_PATH);
  console.log(`Manifest size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
}

main().catch(console.error);
