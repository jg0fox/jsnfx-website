#!/usr/bin/env npx tsx

/**
 * Expansion Generator for Content Pipeline
 *
 * Generates 5 expanded versions per chunk using Claude Opus 4.5 with extended thinking.
 * Evaluates each version and stores passing ones.
 *
 * Usage:
 *   npx tsx scripts/generate-expansions.ts [--resume] [--chunk=chunkId] [--limit=N]
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

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

interface EvalResult {
  adversarialEffectiveness: number;
  contentIntegrity: number;
  technicalQuality: number;
  notes: string;
}

// Config
const EXPANDED_DIR = path.join(process.cwd(), 'content', 'expanded');
const CHUNKS_DIR = path.join(EXPANDED_DIR, 'chunks');
const MANIFEST_PATH = path.join(EXPANDED_DIR, 'manifest.json');
const PROGRESS_PATH = path.join(EXPANDED_DIR, 'progress.json');

const GENERATION_MODEL = 'claude-opus-4-5-20251101';
const EVALUATION_MODEL = 'claude-3-5-haiku-20241022';

const PASS_THRESHOLD = 7.0;
const MAX_RETRIES = 2;
const BATCH_DELAY_MS = 1000; // Delay between chunks to avoid rate limits

// Expansion strategies
const STRATEGIES: Record<number, { name: string; description: string }> = {
  1: {
    name: 'examples',
    description: 'Heavy on concrete examples, case studies, and illustrative scenarios that demonstrate the point being made',
  },
  2: {
    name: 'context',
    description: 'Heavy on historical context, background information, foundational concepts, and the "why" behind statements',
  },
  3: {
    name: 'tangents',
    description: 'Heavy on tangential observations, cross-domain connections, related ideas, and interesting asides',
  },
  4: {
    name: 'nuance',
    description: 'Heavy on caveats, edge cases, nuanced distinctions, balanced perspectives, and acknowledging complexity',
  },
  5: {
    name: 'maximum',
    description: 'Combine all approaches — examples, context, tangents, and nuance — for maximum elaboration while maintaining coherence',
  },
};

// Initialize Anthropic client
const anthropic = new Anthropic();

/**
 * Count words in text
 */
function countWords(text: string): number {
  const cleaned = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).length;
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate expanded content using Opus with thinking
 */
async function generateExpansion(
  originalContent: string,
  wordCount: number,
  strategy: { name: string; description: string },
  elementType: string
): Promise<string> {
  const targetWords = wordCount * 5;

  const headingInstruction = elementType.startsWith('h')
    ? '\n\nIMPORTANT: This is a heading. Keep the original heading text, then add a substantial introductory paragraph (4-6 sentences) below it that sets up the section.'
    : '';

  const prompt = `You are expanding content for an adversarial portfolio website. When users scroll too fast, we inject expanded content to make pages longer and harder to finish quickly.

ORIGINAL CONTENT:
${originalContent}

METRICS:
- Original word count: ${wordCount}
- Target word count: ~${targetWords} (approximately 5x expansion)

EXPANSION STRATEGY FOR THIS VERSION:
${strategy.description}

REQUIREMENTS:
1. Expand to approximately 5x the original length
2. Maintain factual accuracy — do not invent false claims about the author or their work
3. Preserve the original voice: warm, precise, systems-oriented, professional
4. The expansion should feel like a natural (if verbose) extension, not padding or filler
5. Keep any existing structure (if there are line breaks or formatting, preserve the pattern)${headingInstruction}

TECHNIQUES TO USE:
- Elaborating sentences that expand on existing points
- Concrete examples and illustrations
- Contextual background information
- Tangential but relevant observations
- Qualifying statements and nuanced caveats
- Extended descriptions with sensory or emotional detail

Return ONLY the expanded content. No explanations, no meta-commentary, no markdown code fences.`;

  const response = await anthropic.messages.create({
    model: GENERATION_MODEL,
    max_tokens: 16000,
    thinking: {
      type: 'enabled',
      budget_tokens: 8000,
    },
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  // Extract text from response (skip thinking blocks)
  let expandedContent = '';
  for (const block of response.content) {
    if (block.type === 'text') {
      expandedContent += block.text;
    }
  }

  return expandedContent.trim();
}

/**
 * Evaluate an expanded version using Haiku
 */
async function evaluateExpansion(
  originalContent: string,
  expandedContent: string,
  originalWordCount: number
): Promise<EvalResult> {
  const expandedWordCount = countWords(expandedContent);
  const ratio = (expandedWordCount / originalWordCount).toFixed(1);

  const prompt = `Evaluate this content expansion for an adversarial portfolio website.

ORIGINAL CONTENT (${originalWordCount} words):
${originalContent}

EXPANDED CONTENT (${expandedWordCount} words):
${expandedContent}

EXPANSION RATIO: ${ratio}x

Score each criterion 1-10:

1. ADVERSARIAL EFFECTIVENESS
   - Is it meaningfully longer (~5x target)?
   - Would it genuinely slow down a skimmer?
   - Does the added content require engagement to process?

2. CONTENT INTEGRITY
   - Is the core meaning preserved?
   - Are there any hallucinated facts or false claims?
   - Does it maintain the author's voice and tone?

3. TECHNICAL QUALITY
   - Is it grammatically correct?
   - Is the structure coherent?
   - Does it flow naturally?

Respond ONLY with valid JSON (no markdown, no explanation):
{"adversarialEffectiveness": <1-10>, "contentIntegrity": <1-10>, "technicalQuality": <1-10>, "notes": "Brief assessment"}`;

  const response = await anthropic.messages.create({
    model: EVALUATION_MODEL,
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  // Parse JSON response
  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Failed to parse evaluation response:', text);
  }

  // Return failing scores if parsing fails
  return {
    adversarialEffectiveness: 0,
    contentIntegrity: 0,
    technicalQuality: 0,
    notes: 'Failed to parse evaluation response',
  };
}

/**
 * Load or create progress tracking
 */
function loadProgress(): Set<string> {
  if (fs.existsSync(PROGRESS_PATH)) {
    const data = JSON.parse(fs.readFileSync(PROGRESS_PATH, 'utf-8'));
    return new Set(data.completedChunks || []);
  }
  return new Set();
}

/**
 * Save progress
 */
function saveProgress(completedChunks: Set<string>): void {
  fs.writeFileSync(
    PROGRESS_PATH,
    JSON.stringify({ completedChunks: Array.from(completedChunks) }, null, 2)
  );
}

/**
 * Load manifest
 */
function loadManifest(): Manifest {
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
}

/**
 * Save manifest
 */
function saveManifest(manifest: Manifest): void {
  // Update totalVersions count
  manifest.totalVersions = manifest.chunks.reduce(
    (sum, chunk) => sum + chunk.versions.filter(v => v.evaluation.passed).length,
    0
  );
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

/**
 * Process a single chunk
 */
async function processChunk(
  chunk: ManifestChunk,
  manifest: Manifest
): Promise<void> {
  const chunkDir = path.join(CHUNKS_DIR, chunk.chunkId);
  const originalContent = fs.readFileSync(path.join(chunkDir, 'original.md'), 'utf-8');

  console.log(`\n  Processing chunk: ${chunk.chunkId}`);
  console.log(`    Original: ${chunk.originalWordCount} words, type: ${chunk.elementType}`);

  for (let version = 1; version <= 5; version++) {
    // Skip if version already exists and passed
    const existingVersion = chunk.versions.find(v => v.version === version);
    if (existingVersion?.evaluation.passed) {
      console.log(`    Version ${version}: Already passed (${existingVersion.evaluation.average.toFixed(1)})`);
      continue;
    }

    const strategy = STRATEGIES[version];
    console.log(`    Version ${version} (${strategy.name}): Generating...`);

    let retryCount = 0;
    let passed = false;

    while (!passed && retryCount <= MAX_RETRIES) {
      try {
        // Generate expansion
        const expandedContent = await generateExpansion(
          originalContent,
          chunk.originalWordCount,
          strategy,
          chunk.elementType
        );

        const expandedWordCount = countWords(expandedContent);
        const ratio = expandedWordCount / chunk.originalWordCount;

        console.log(`      Generated: ${expandedWordCount} words (${ratio.toFixed(1)}x)`);

        // Evaluate
        console.log(`      Evaluating...`);
        const evaluation = await evaluateExpansion(
          originalContent,
          expandedContent,
          chunk.originalWordCount
        );

        const avgScore =
          (evaluation.adversarialEffectiveness * 0.4 +
            evaluation.contentIntegrity * 0.4 +
            evaluation.technicalQuality * 0.2);

        passed = avgScore >= PASS_THRESHOLD;

        console.log(
          `      Scores: AE=${evaluation.adversarialEffectiveness}, CI=${evaluation.contentIntegrity}, TQ=${evaluation.technicalQuality}, Avg=${avgScore.toFixed(1)} → ${passed ? 'PASS' : 'FAIL'}`
        );

        // Save the expansion
        const versionPath = path.join(chunkDir, `v${version}.md`);
        fs.writeFileSync(versionPath, expandedContent);

        // Update manifest
        const versionData: ManifestVersion = {
          version,
          strategy: strategy.name,
          wordCount: expandedWordCount,
          expansionRatio: parseFloat(ratio.toFixed(2)),
          evaluation: {
            adversarialEffectiveness: evaluation.adversarialEffectiveness,
            contentIntegrity: evaluation.contentIntegrity,
            technicalQuality: evaluation.technicalQuality,
            average: parseFloat(avgScore.toFixed(2)),
            passed,
          },
          generatedAt: new Date().toISOString(),
          retryCount,
        };

        // Update or add version in chunk
        const existingIdx = chunk.versions.findIndex(v => v.version === version);
        if (existingIdx >= 0) {
          chunk.versions[existingIdx] = versionData;
        } else {
          chunk.versions.push(versionData);
        }

        if (!passed) {
          retryCount++;
          if (retryCount <= MAX_RETRIES) {
            console.log(`      Retrying (${retryCount}/${MAX_RETRIES})...`);
            await sleep(500);
          }
        }
      } catch (error) {
        console.error(`      Error: ${error}`);
        retryCount++;
        if (retryCount <= MAX_RETRIES) {
          console.log(`      Retrying after error (${retryCount}/${MAX_RETRIES})...`);
          await sleep(2000);
        }
      }
    }

    // Small delay between versions
    await sleep(300);
  }

  // Save eval.json for this chunk
  const evalPath = path.join(chunkDir, 'eval.json');
  fs.writeFileSync(
    evalPath,
    JSON.stringify(
      {
        chunkId: chunk.chunkId,
        evaluatedAt: new Date().toISOString(),
        versions: chunk.versions,
      },
      null,
      2
    )
  );
}

/**
 * Main function
 */
async function main() {
  console.log('Content Expansion Pipeline - Generator');
  console.log('======================================\n');

  // Parse args
  const args = process.argv.slice(2);
  const resumeMode = args.includes('--resume');
  const limitArg = args.find(a => a.startsWith('--limit='));
  const chunkArg = args.find(a => a.startsWith('--chunk='));

  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : Infinity;
  const specificChunk = chunkArg ? chunkArg.split('=')[1] : null;

  // Load manifest and progress
  const manifest = loadManifest();
  const completedChunks = resumeMode ? loadProgress() : new Set<string>();

  console.log(`Total chunks in manifest: ${manifest.totalChunks}`);
  console.log(`Already completed: ${completedChunks.size}`);
  console.log(`Resume mode: ${resumeMode}`);
  if (limit < Infinity) console.log(`Limit: ${limit} chunks`);
  if (specificChunk) console.log(`Specific chunk: ${specificChunk}`);

  // Filter chunks to process
  let chunksToProcess = manifest.chunks.filter(chunk => {
    if (specificChunk) return chunk.chunkId === specificChunk;
    if (resumeMode && completedChunks.has(chunk.chunkId)) return false;
    return true;
  });

  if (limit < Infinity) {
    chunksToProcess = chunksToProcess.slice(0, limit);
  }

  console.log(`\nChunks to process: ${chunksToProcess.length}`);

  if (chunksToProcess.length === 0) {
    console.log('Nothing to process!');
    return;
  }

  // Process chunks
  let processed = 0;
  const startTime = Date.now();

  for (const chunk of chunksToProcess) {
    try {
      await processChunk(chunk, manifest);
      completedChunks.add(chunk.chunkId);
      processed++;

      // Save progress after each chunk
      saveProgress(completedChunks);
      saveManifest(manifest);

      // Progress update
      const elapsed = (Date.now() - startTime) / 1000;
      const rate = processed / elapsed;
      const remaining = chunksToProcess.length - processed;
      const eta = remaining / rate;

      console.log(
        `\n  Progress: ${processed}/${chunksToProcess.length} (${((processed / chunksToProcess.length) * 100).toFixed(1)}%)`
      );
      console.log(`  Elapsed: ${elapsed.toFixed(0)}s, ETA: ${eta.toFixed(0)}s`);

      // Delay between chunks
      if (processed < chunksToProcess.length) {
        await sleep(BATCH_DELAY_MS);
      }
    } catch (error) {
      console.error(`\nFailed to process chunk ${chunk.chunkId}:`, error);
      // Continue with next chunk
    }
  }

  // Final summary
  console.log('\n======================================');
  console.log('Generation Complete!\n');

  const totalVersions = manifest.chunks.reduce(
    (sum, chunk) => sum + chunk.versions.filter(v => v.evaluation.passed).length,
    0
  );

  console.log(`Chunks processed: ${processed}`);
  console.log(`Total passing versions: ${totalVersions}`);
  console.log(`Average versions per chunk: ${(totalVersions / manifest.totalChunks).toFixed(1)}`);

  // Save final manifest
  saveManifest(manifest);
  console.log(`\nManifest updated: ${MANIFEST_PATH}`);
}

main().catch(console.error);
