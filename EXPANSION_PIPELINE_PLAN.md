# Content Expansion Pipeline Plan

> Pre-generate high-quality expanded content using Opus 4.5 with extended thinking, evaluate for quality, and store for instant injection in EXPAND mode.

## Overview

**Current state:** EXPAND mode calls Claude 3.5 Haiku in real-time (~8s latency), generating 40-60% longer content.

**Target state:** EXPAND mode instantly injects pre-generated 5x expansions (0ms latency), with multiple versions per chunk for variety.

**Model upgrade:** Haiku (real-time) → Opus 4.5 with thinking (pre-generation)

---

## Phase 1: Content Inventory

### 1.1 Scan Strategy

Content sources to scan:

| Source | Path | Content Type |
|--------|------|--------------|
| Portfolio pages | `content/portfolio/{slug}/index.mdx` | MDX prose |
| Project pages | `content/projects/{slug}/index.mdx` | MDX prose |
| Home page | `app/page.tsx` | JSX with prose |
| About sections | Various components | JSX with prose |

### 1.2 Chunk Discovery Approach

I'll create a **build-time scanner** that:

1. **For MDX files:** Parse with `gray-matter`, extract markdown content, then use a markdown parser to identify:
   - Paragraphs (text blocks)
   - Headings (h1-h6)
   - List items
   - Blockquotes

2. **For JSX/TSX files:** Use regex patterns to extract prose content from:
   - `<p>` elements
   - `<h1>` through `<h6>` elements
   - `<li>` elements
   - `<blockquote>` elements

3. **Generate stable chunk IDs:** Format: `{page}-{element}-{hash}`
   - Example: `portfolio-chime-p-a1b2c3d4`
   - Hash based on content ensures stability across regenerations

### 1.3 Manifest Structure

```
content/expanded/manifest.json
```

```json
{
  "generatedAt": "2025-01-21T...",
  "model": "claude-opus-4-5-20251101",
  "thinkingEnabled": true,
  "expansionTarget": "5x",
  "totalChunks": 0,
  "totalVersions": 0,
  "chunks": []
}
```

### 1.4 Estimated Scope

Based on the 5 portfolio + 5 project MDX files, plus home page content:

| Source | Est. Chunks |
|--------|-------------|
| Portfolio (5 case studies) | ~60-80 |
| Projects (5 items) | ~40-50 |
| Home page | ~10-15 |
| **Total** | **~110-145 chunks** |

At 5 versions per chunk: **~550-725 expansions to generate**

---

## Phase 2: Expansion Generation

### 2.1 Model Configuration

```typescript
const EXPANSION_MODEL = 'claude-opus-4-5-20251101';

const config = {
  model: EXPANSION_MODEL,
  max_tokens: 16000,
  thinking: {
    type: 'enabled',
    budget_tokens: 10000  // Allow substantial thinking for quality
  }
};
```

### 2.2 Version Differentiation

Each chunk gets 5 versions with different expansion strategies:

| Version | Strategy | Prompt Modifier |
|---------|----------|-----------------|
| V1 | Examples & illustrations | "Heavy on concrete examples, case studies, and illustrative scenarios" |
| V2 | Context & background | "Heavy on historical context, background information, and foundational concepts" |
| V3 | Tangents & connections | "Heavy on tangential observations, cross-domain connections, and related ideas" |
| V4 | Qualifications & nuance | "Heavy on caveats, edge cases, nuanced distinctions, and balanced perspectives" |
| V5 | Maximum verbosity | "Combine all approaches for maximum elaboration while maintaining coherence" |

### 2.3 Expansion Prompt Template

```
You are expanding content for an adversarial portfolio website. When users scroll too fast, we inject expanded content to make pages longer and harder to finish quickly.

ORIGINAL CONTENT:
{content}

METRICS:
- Original word count: {wordCount}
- Target word count: ~{wordCount * 5} (approximately 5x expansion)

EXPANSION STRATEGY FOR THIS VERSION:
{strategyDescription}

REQUIREMENTS:
1. Expand to approximately 5x the original length
2. Maintain factual accuracy — do not invent false claims about the author or their work
3. Preserve the original voice: warm, precise, systems-oriented, professional
4. The expansion should feel like a natural (if verbose) extension, not padding or filler
5. For headings: Keep the original heading, then add a substantial introductory paragraph below

TECHNIQUES TO USE:
- Elaborating sentences that expand on existing points
- Concrete examples and illustrations
- Contextual background information
- Tangential but relevant observations
- Qualifying statements and nuanced caveats
- Extended descriptions with sensory or emotional detail

Return ONLY the expanded content. No explanations, no meta-commentary.
```

### 2.4 Generation Script

Create: `scripts/generate-expansions.ts`

```typescript
// Pseudocode structure
async function generateExpansions() {
  const manifest = loadOrCreateManifest();
  const chunks = await scanAllContent();

  for (const chunk of chunks) {
    console.log(`Processing ${chunk.id} (${chunk.wordCount} words)...`);

    for (const version of [1, 2, 3, 4, 5]) {
      const strategy = STRATEGIES[version];

      // Generate with Opus thinking
      const expanded = await generateExpansion(chunk, strategy);

      // Evaluate
      const evaluation = await evaluateExpansion(chunk.content, expanded);

      if (evaluation.averageScore >= 7) {
        await saveExpansion(chunk.id, version, expanded, evaluation);
      } else {
        // Retry up to 2 times
        for (let retry = 0; retry < 2; retry++) {
          const retryExpanded = await generateExpansion(chunk, strategy);
          const retryEval = await evaluateExpansion(chunk.content, retryExpanded);
          if (retryEval.averageScore >= 7) {
            await saveExpansion(chunk.id, version, retryExpanded, retryEval);
            break;
          }
        }
      }
    }
  }

  await saveManifest(manifest);
}
```

### 2.5 Rate Limiting & Cost Management

- **Batch size:** Process 5 chunks at a time (25 API calls per batch)
- **Delay between batches:** 2 seconds to avoid rate limits
- **Checkpoint:** Save progress after each chunk to allow resumption
- **Estimated tokens per expansion:** ~2,000 input + ~10,000 thinking + ~2,000 output = ~14,000 tokens
- **Estimated total:** ~725 expansions × 14,000 tokens = ~10M tokens

---

## Phase 3: Evaluation

### 3.1 Evaluation Criteria

Using the existing rubric from `prompts/evaluation.md`, evaluate each expansion:

| Criterion | Weight | Pass Threshold |
|-----------|--------|----------------|
| Adversarial Effectiveness | 40% | >= 7 |
| Content Integrity | 40% | >= 7 |
| Technical Quality | 20% | >= 7 |

**Overall pass:** Weighted average >= 7.0

### 3.2 Evaluation Prompt

```
Evaluate this content expansion for an adversarial portfolio website.

ORIGINAL CONTENT ({originalWordCount} words):
{originalContent}

EXPANDED CONTENT ({expandedWordCount} words):
{expandedContent}

EXPANSION RATIO: {ratio}x

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

Respond in JSON:
{
  "adversarialEffectiveness": <1-10>,
  "contentIntegrity": <1-10>,
  "technicalQuality": <1-10>,
  "notes": "Brief assessment"
}
```

### 3.3 Evaluation Model

Use **Claude 3.5 Haiku** for evaluation (cost-efficient, still accurate for rubric scoring).

---

## Phase 4: Storage Structure

### 4.1 Directory Layout

```
content/
└── expanded/
    ├── manifest.json
    └── chunks/
        ├── portfolio-chime-p-a1b2c3d4/
        │   ├── original.md
        │   ├── v1.md
        │   ├── v2.md
        │   ├── v3.md
        │   ├── v4.md
        │   ├── v5.md
        │   └── eval.json
        ├── portfolio-chime-h2-b2c3d4e5/
        │   └── ...
        └── ...
```

### 4.2 Manifest Entry Structure

```json
{
  "chunkId": "portfolio-chime-p-a1b2c3d4",
  "sourcePath": "content/portfolio/chime/index.mdx",
  "sourceType": "mdx",
  "elementType": "p",
  "originalWordCount": 45,
  "originalHash": "a1b2c3d4",
  "versions": [
    {
      "version": 1,
      "strategy": "examples",
      "wordCount": 228,
      "expansionRatio": 5.07,
      "evaluation": {
        "adversarialEffectiveness": 8,
        "contentIntegrity": 9,
        "technicalQuality": 8,
        "average": 8.33,
        "passed": true
      },
      "generatedAt": "2025-01-21T...",
      "retryCount": 0
    }
  ]
}
```

### 4.3 eval.json Structure

```json
{
  "chunkId": "portfolio-chime-p-a1b2c3d4",
  "evaluatedAt": "2025-01-21T...",
  "versions": [
    {
      "version": 1,
      "scores": {
        "adversarialEffectiveness": 8,
        "contentIntegrity": 9,
        "technicalQuality": 8
      },
      "average": 8.33,
      "passed": true,
      "notes": "Strong expansion with relevant examples..."
    }
  ]
}
```

---

## Phase 5: Injection Utility

### 5.1 Create `lib/expanded-content.ts`

```typescript
import manifest from '@/content/expanded/manifest.json';
import { readFileSync } from 'fs';
import { join } from 'path';

interface ExpansionVersion {
  version: number;
  content: string;
  wordCount: number;
  evalScore: number;
}

interface ChunkExpansions {
  chunkId: string;
  originalContent: string;
  originalWordCount: number;
  versions: ExpansionVersion[];
}

// Cache loaded expansions
const expansionCache = new Map<string, ChunkExpansions>();

/**
 * Load all versions for a chunk
 */
export function loadChunkExpansions(chunkId: string): ChunkExpansions | null {
  if (expansionCache.has(chunkId)) {
    return expansionCache.get(chunkId)!;
  }

  const chunkMeta = manifest.chunks.find(c => c.chunkId === chunkId);
  if (!chunkMeta) return null;

  const chunkDir = join(process.cwd(), 'content/expanded/chunks', chunkId);

  const original = readFileSync(join(chunkDir, 'original.md'), 'utf-8');
  const versions: ExpansionVersion[] = [];

  for (const v of chunkMeta.versions) {
    if (v.passed) {
      const content = readFileSync(join(chunkDir, `v${v.version}.md`), 'utf-8');
      versions.push({
        version: v.version,
        content,
        wordCount: v.wordCount,
        evalScore: v.evaluation.average
      });
    }
  }

  const expansions = {
    chunkId,
    originalContent: original,
    originalWordCount: chunkMeta.originalWordCount,
    versions
  };

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
    version: version.version
  };
}

/**
 * Get a specific version
 */
export function getExpandedContent(chunkId: string, version: number): string | null {
  const expansions = loadChunkExpansions(chunkId);
  if (!expansions) return null;

  const v = expansions.versions.find(v => v.version === version);
  return v?.content ?? null;
}

/**
 * Get expansion statistics for a chunk
 */
export function getExpansionStats(chunkId: string): {
  versions: number;
  avgScore: number;
  avgExpansionRatio: number;
} | null {
  const expansions = loadChunkExpansions(chunkId);
  if (!expansions || expansions.versions.length === 0) return null;

  const avgScore = expansions.versions.reduce((sum, v) => sum + v.evalScore, 0) / expansions.versions.length;
  const avgRatio = expansions.versions.reduce((sum, v) => sum + (v.wordCount / expansions.originalWordCount), 0) / expansions.versions.length;

  return {
    versions: expansions.versions.length,
    avgScore,
    avgExpansionRatio: avgRatio
  };
}

/**
 * Check if pre-generated expansion exists for content
 */
export function hasPreGeneratedExpansion(contentHash: string): boolean {
  return manifest.chunks.some(c => c.originalHash === contentHash);
}

/**
 * Find chunk by content hash (for runtime matching)
 */
export function findChunkByHash(contentHash: string): string | null {
  const chunk = manifest.chunks.find(c => c.originalHash === contentHash);
  return chunk?.chunkId ?? null;
}
```

### 5.2 Runtime Content Matching

The tricky part: matching runtime content to pre-generated chunks.

**Strategy:** Hash-based matching
1. At generation time, store a hash of the original content
2. At runtime, hash the chunk's `baseContent`
3. Look up the hash in the manifest to find pre-generated versions

```typescript
// In ContentTransformer, when EXPAND mode triggers:
import { createHash } from 'crypto';
import { findChunkByHash, getRandomExpansion } from '@/lib/expanded-content';

function hashContent(content: string): string {
  // Normalize: strip HTML, lowercase, remove extra whitespace
  const normalized = content
    .replace(/<[^>]*>/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
  return createHash('md5').update(normalized).digest('hex').slice(0, 8);
}

async function applyExpansion(chunk: ContentChunk): Promise<void> {
  const contentHash = hashContent(chunk.baseContent);
  const chunkId = findChunkByHash(contentHash);

  if (chunkId) {
    // Use pre-generated expansion (instant!)
    const expansion = getRandomExpansion(chunkId);
    if (expansion) {
      updateChunkContent(chunk, expansion.content);
      recordTransformation(chunk, 'expand', {
        preGenerated: true,
        version: expansion.version
      });
      return;
    }
  }

  // Fallback: real-time generation with Haiku
  await applyRealTimeExpansion(chunk);
}
```

---

## Phase 6: ContentTransformer Updates

### 6.1 Changes to `components/adversarial/ContentTransformer.tsx`

```typescript
// Add import
import { findChunkByHash, getRandomExpansion } from '@/lib/expanded-content';

// Modify applyTransformation function
const applyTransformation = useCallback(async (
  chunk: ContentChunk,
  type: 'expand' | 'rewrite',
  level?: RewriteLevel
) => {
  if (type === 'expand') {
    // Try pre-generated first
    const contentHash = hashContent(chunk.baseContent);
    const preGenChunkId = findChunkByHash(contentHash);

    if (preGenChunkId) {
      const expansion = getRandomExpansion(preGenChunkId);
      if (expansion) {
        // Instant injection!
        applyContentUpdate(chunk, expansion.content, {
          type: 'expand',
          preGenerated: true,
          version: expansion.version,
          latency: 0
        });
        return;
      }
    }
  }

  // Fallback to real-time API call
  await applyRealTimeTransformation(chunk, type, level);
}, []);
```

### 6.2 Evaluation Reporting Updates

Track whether expansion was pre-generated in batch reports:

```typescript
interface TransformationRecord {
  chunkId: string;
  type: 'expand' | 'rewrite';
  level?: RewriteLevel;
  preGenerated?: boolean;      // NEW
  preGenVersion?: number;      // NEW
  latency: number;
  originalContent: string;
  transformedContent: string;
}
```

---

## Implementation Order

1. **Create scanner script** (`scripts/scan-content.ts`)
   - Scan MDX files and JSX components
   - Generate initial manifest with chunk inventory
   - Output: `content/expanded/manifest.json` (chunks only, no versions yet)

2. **Create generation script** (`scripts/generate-expansions.ts`)
   - Read manifest
   - Generate 5 versions per chunk with Opus thinking
   - Evaluate each version
   - Save to `content/expanded/chunks/`
   - Update manifest with version metadata

3. **Create injection utility** (`lib/expanded-content.ts`)
   - Load manifest and expansions
   - Provide lookup functions

4. **Update ContentTransformer**
   - Add pre-generated expansion lookup
   - Fallback to real-time for unmatched content

5. **Test & validate**
   - Verify instant injection works
   - Check evaluation reports show pre-generated flag
   - Confirm variety across page loads

---

## Cost Estimate

| Item | Count | Tokens/Item | Total Tokens |
|------|-------|-------------|--------------|
| Expansions (Opus thinking) | 725 | ~14,000 | ~10.1M |
| Evaluations (Haiku) | 725 | ~2,000 | ~1.5M |
| Retries (~20% fail rate) | 145 | ~14,000 | ~2.0M |
| **Total** | | | **~13.6M tokens** |

At Opus rates (~$15/M input, ~$75/M output) and Haiku rates (~$0.25/M input, ~$1.25/M output):
- Opus: ~$150-200
- Haiku: ~$5-10
- **Estimated total: ~$160-210**

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Content drift (MDX changes) | Re-run scanner periodically; hash-based matching handles minor changes |
| Expansion quality varies | 5 versions per chunk; only store passing versions; fallback to real-time |
| Storage size | ~725 × 5KB avg = ~3.6MB total (negligible) |
| Runtime matching failures | Fallback to Haiku real-time generation |
| Generation script crashes | Checkpoint after each chunk; resumable |

---

## Approval Checklist

Before proceeding, please confirm:

- [ ] Estimated cost (~$160-210) is acceptable
- [ ] 5x expansion target is correct (vs current 40-60%)
- [ ] Storage in `content/expanded/` is acceptable location
- [ ] Opus 4.5 with thinking is the desired model
- [ ] Any content sources I should exclude?
- [ ] Any specific chunks to prioritize or skip?

---

**Ready to proceed upon approval.**
