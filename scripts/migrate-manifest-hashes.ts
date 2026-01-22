#!/usr/bin/env npx ts-node

/**
 * Manifest Hash Migration
 *
 * Updates the manifest.json hashes to use the new normalized hash function
 * that strips both HTML and Markdown syntax for consistent matching.
 *
 * Run: npx ts-node scripts/migrate-manifest-hashes.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const MANIFEST_PATH = path.join(process.cwd(), 'content/expanded/manifest.json');

/**
 * Generate hash from content (new algorithm)
 * Normalizes both HTML and Markdown syntax
 */
function hashContent(content: string): string {
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

async function main() {
  console.log('Manifest Hash Migration');
  console.log('=======================\n');

  // Read manifest
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error('Manifest not found:', MANIFEST_PATH);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  console.log(`Found ${manifest.chunks.length} chunks in manifest\n`);

  let updatedCount = 0;
  let unchangedCount = 0;

  for (const chunk of manifest.chunks) {
    // Get original content (embedded in manifest)
    const originalContent = chunk.originalContent;
    if (!originalContent) {
      console.warn(`  Chunk ${chunk.chunkId} has no originalContent, skipping`);
      continue;
    }

    // Compute new hash
    const oldHash = chunk.originalHash;
    const newHash = hashContent(originalContent);

    if (oldHash !== newHash) {
      console.log(`  ${chunk.chunkId}: ${oldHash} → ${newHash}`);
      chunk.originalHash = newHash;
      updatedCount++;
    } else {
      unchangedCount++;
    }
  }

  // Update manifest metadata
  manifest.hashMigrationAt = new Date().toISOString();
  manifest.hashAlgorithm = 'md5-normalized-v2';

  // Write updated manifest
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log('\n=======================');
  console.log(`Updated: ${updatedCount} chunks`);
  console.log(`Unchanged: ${unchangedCount} chunks`);
  console.log(`\nManifest saved to: ${MANIFEST_PATH}`);
}

main().catch(console.error);
