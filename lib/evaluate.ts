/**
 * Evaluation library for adversarial content transformations
 *
 * Handles batch evaluation using Claude Sonnet and report generation.
 */

import Anthropic from '@anthropic-ai/sdk';
import type {
  EvaluationBatch,
  EvaluationReport,
  TransformationScore,
  BatchSummary,
} from '@/types/evaluation';

// Lazy initialization of Anthropic client
let anthropicClient: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('Missing ANTHROPIC_API_KEY environment variable');
    }
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

/**
 * Model to use for evaluations
 * Using Haiku for cost efficiency (Sonnet was using too many tokens)
 * Haiku is ~75% cheaper and still provides good evaluation quality
 */
const EVALUATION_MODEL = 'claude-3-5-haiku-20241022';

/**
 * System prompt for evaluation
 */
const EVALUATION_SYSTEM_PROMPT = `You are an evaluator for an experimental adversarial portfolio website. This site intentionally transforms content to obstruct users based on their behavior:

- FAST SCROLLERS get EXPANDED content (longer, harder to finish)
- IDLE READERS get REWRITTEN content (shifting, harder to focus)
  - Level 1 (5-30s idle): Subtle changes — reader doubts their memory
  - Level 2 (30-60s idle): Noticeable changes — clearly different but comprehensible
  - Level 3 (60s+ idle): Hostile changes — actively difficult to read

Your job is to evaluate ADVERSARIAL EFFECTIVENESS only. Quality and coherence are already checked by a real-time gate before content reaches users, so you can assume the content is technically sound.

Focus on: Did this transformation achieve its artistic/adversarial goal of obstructing the user in the intended way?`;

/**
 * Maximum characters for content in evaluations (to reduce tokens)
 */
const MAX_CONTENT_LENGTH = 500;

/**
 * Type-based sampling rates for tiered evaluation
 * Pre-generated expansions are skipped entirely (already evaluated at generation)
 * Rewrite L1 has lower stakes, L3 has highest stakes
 */
const TYPE_SAMPLE_RATES: Record<string, number> = {
  'expand_pregen': 0.0,   // Skip - already evaluated during generation
  'expand': 1.0,          // Always eval real-time expansions (rare fallback)
  'rewrite_l1': 0.3,      // Sample 30% of L1 (subtle changes, lower stakes)
  'rewrite_l2': 0.5,      // Sample 50% of L2
  'rewrite_l3': 1.0,      // Always eval L3 (hostile, highest stakes)
};

/**
 * Get the type key for sampling lookup
 */
function getTransformTypeKey(t: { type: string; level?: number; trigger?: string }): string {
  if (t.type === 'expand') {
    return t.trigger?.includes('pregen') ? 'expand_pregen' : 'expand';
  }
  return `rewrite_l${t.level || 1}`;
}

/**
 * Filter transformations based on type-specific sampling rates
 * Uses generics to preserve the full transformation record type
 */
function filterTransformationsBySampling<T extends { type: string; level?: number; trigger?: string }>(
  transformations: T[]
): T[] {
  return transformations.filter(t => {
    const typeKey = getTransformTypeKey(t);
    const sampleRate = TYPE_SAMPLE_RATES[typeKey] ?? 1.0;

    // Skip pre-generated expansions entirely
    if (sampleRate === 0) {
      return false;
    }

    // Apply sampling for other types
    return Math.random() < sampleRate;
  });
}

/**
 * Truncate content for evaluation to reduce token usage
 */
function truncateContent(content: string, maxLength: number = MAX_CONTENT_LENGTH): string {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength) + '... [truncated]';
}

/**
 * Prepare batch for evaluation by truncating content
 * Note: Filtering should be done BEFORE calling this function to avoid duplicate random sampling
 */
function prepareBatchForEvaluation(
  batch: EvaluationBatch,
  filteredTransformations: EvaluationBatch['transformations']
): object {
  // Use the pre-summarized behavior if available (new format)
  // Otherwise create a simple summary from legacy behaviorSequence
  let behaviorSummary;
  if (batch.behaviorSummary) {
    // Use the efficient pre-summarized format
    behaviorSummary = batch.behaviorSummary;
  } else if (batch.behaviorSequence) {
    // Legacy: create summary from raw events
    behaviorSummary = {
      totalEvents: batch.behaviorSequence.length,
      scrollEvents: batch.behaviorSequence.filter(e => e.event === 'scroll').length,
      modeChanges: batch.behaviorSequence.filter(e => e.event === 'mode_change').length,
      rewriteLevelChanges: batch.behaviorSequence.filter(e => e.event === 'rewrite_level_change').length,
    };
  } else {
    behaviorSummary = { totalEvents: 0 };
  }

  return {
    sessionId: batch.sessionId,
    batchId: batch.batchId,
    timestamp: batch.timestamp,
    // Only include essential visitor info
    visitor: {
      device: batch.visitor.device.type,
      browser: batch.visitor.device.browser,
    },
    // Use summarized behavior
    behaviorSummary,
    // Truncate transformation content (already filtered externally)
    transformations: filteredTransformations.map(t => ({
      chunkId: t.chunkId,
      type: t.type,
      level: t.level,
      trigger: t.trigger,
      latency: t.latency,
      originalContent: truncateContent(t.originalContent),
      transformedContent: truncateContent(t.transformedContent),
    })),
  };
}

/**
 * Compact evaluation prompt - much shorter, saves ~60% tokens
 * Used when we just need a quick adversarial effectiveness score
 */
const COMPACT_EVAL_PROMPT = `Score adversarial effectiveness 1-10 for each transformation.
EXPAND: Did it meaningfully increase length and create obstruction?
REWRITE L1: Are changes subtle enough to cause doubt?
REWRITE L2: Noticeable but comprehensible changes?
REWRITE L3: Actively difficult to read?

BATCH:
{batch}

JSON response (no markdown):
{"scores":[{"chunkId":"...","score":N,"note":"brief"}],"avg":N}`;

/**
 * Build the evaluation prompt
 * Note: filteredTransformations should be pre-filtered to avoid duplicate random sampling
 */
function buildEvaluationPrompt(
  batch: EvaluationBatch,
  filteredTransformations: EvaluationBatch['transformations'],
  compact: boolean = false
): string {
  // Prepare batch with truncated content (filtering already done)
  const preparedBatch = prepareBatchForEvaluation(batch, filteredTransformations);

  // Use compact prompt for quick evaluations
  if (compact) {
    return COMPACT_EVAL_PROMPT.replace('{batch}', JSON.stringify(preparedBatch, null, 2));
  }

  return `Evaluate this batch of adversarial transformations.

EVALUATION FOCUS: Adversarial Effectiveness Only
(Quality/coherence already verified by real-time gate)

For each transformation, score ADVERSARIAL EFFECTIVENESS (1-10):

EXPAND transformations:
- Did it meaningfully increase length (40-60% longer)?
- Does the expansion create genuine obstruction for fast scrollers?
- Are the additions relevant but time-consuming to read?

REWRITE L1 (Subtle) transformations:
- Are changes subtle enough that a reader might doubt their memory?
- Would someone re-reading feel uncertain if text changed?
- Is the "gaslighting" effect achieved?

REWRITE L2 (Noticeable) transformations:
- Are changes clearly noticeable but still comprehensible?
- Does it disrupt focus without being obviously broken?
- Would a reader feel confused but not suspicious of malfunction?

REWRITE L3 (Hostile) transformations:
- Does content actively resist easy comprehension?
- Is the hostility intentional and artistic, not accidental?
- Does it feel deliberately difficult, not just broken?

SCORING GUIDE:
- 9-10: Fully achieves adversarial intent
- 7-8: Achieves intent with minor missed opportunities
- 5-6: Partial success, could be stronger
- 3-4: Weak effect, too subtle or too obvious
- 1-2: Fails to obstruct or feels broken

NOTES GUIDANCE:
Do NOT echo the scoring guide (avoid words like "exceptional", "perfectly", "good obstruction").
Instead, describe SPECIFIC observations:
- What specific changes were made? (e.g., "Added 3 elaborative clauses about process details")
- What effect would this have on the reader? (e.g., "Reader must parse nested subclauses to extract meaning")
- What worked or didn't? (e.g., "Synonym swap from 'use' to 'utilize' too subtle to notice")

BATCH DATA:
${JSON.stringify(preparedBatch, null, 2)}

RESPOND IN THIS EXACT JSON FORMAT (no markdown, just raw JSON):
{
  "transformationScores": [
    {
      "chunkId": "chunk-id-here",
      "adversarialEffectiveness": <1-10>,
      "notes": "Specific observation about what changed and its effect on the reader"
    }
  ],
  "batchSummary": {
    "averageScore": <average of all adversarialEffectiveness scores>,
    "passed": <true if averageScore >= 6>,
    "totalTransformations": <count>,
    "failedTransformations": <count with score < 6>,
    "notes": "Pattern observed across transformations (not just score summary)"
  }
}`;
}

/**
 * Parse the evaluation response from Claude
 * Handles both full format and compact format responses
 * Also handles cases where Claude includes explanatory text around the JSON
 */
function parseEvaluationResponse(response: string, compact: boolean = false): {
  transformationScores: TransformationScore[];
  batchSummary: BatchSummary;
} {
  // Try to extract JSON from the response
  let jsonStr = response.trim();

  // Handle markdown code blocks if present
  if (jsonStr.includes('```')) {
    const match = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      jsonStr = match[1].trim();
    }
  }

  // First, try to parse the entire response as JSON
  let parsed: Record<string, unknown> | null = null;

  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    // If direct parse fails, try to extract JSON object from the response
    // Claude sometimes includes explanatory text before/after the JSON
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch {
        // Will be handled by the null check below
      }
    }
  }

  // If we couldn't parse the JSON, return failure
  if (!parsed) {
    console.error('[Evaluate] Failed to parse response - no valid JSON found');
    console.error('[Evaluate] Raw response:', response);

    return {
      transformationScores: [],
      batchSummary: {
        averageScore: 0,
        passed: false,
        totalTransformations: 0,
        failedTransformations: 0,
        notes: 'Failed to parse evaluation response from Claude',
      },
    };
  }

  // Handle compact format: {"scores":[{"chunkId":"...","score":N,"note":"brief"}],"avg":N}
  if (compact && Array.isArray(parsed.scores)) {
    const scores: TransformationScore[] = (parsed.scores as Array<{ chunkId: string; score: number; note?: string }>).map((s) => ({
      chunkId: s.chunkId,
      adversarialEffectiveness: s.score,
      notes: s.note || '',
    }));

    const avg = (typeof parsed.avg === 'number' ? parsed.avg : null) ??
      (scores.length > 0 ? scores.reduce((sum, s) => sum + s.adversarialEffectiveness, 0) / scores.length : 0);
    const failedCount = scores.filter(s => s.adversarialEffectiveness < 6).length;

    return {
      transformationScores: scores,
      batchSummary: {
        averageScore: avg,
        passed: avg >= 6,
        totalTransformations: scores.length,
        failedTransformations: failedCount,
        notes: `Compact eval: ${scores.length} scored, avg ${avg.toFixed(1)}`,
      },
    };
  }

  // Handle full format
  return {
    transformationScores: (parsed.transformationScores as TransformationScore[]) || [],
    batchSummary: (parsed.batchSummary as BatchSummary) || {
      averageScore: 0,
      passed: false,
      totalTransformations: 0,
      failedTransformations: 0,
      notes: 'Failed to parse evaluation response',
    },
  };
}

/**
 * Use compact evaluation prompt by default for cost savings
 * Set EVAL_COMPACT=false to use verbose prompts
 */
const USE_COMPACT_EVAL = process.env.EVAL_COMPACT !== 'false';

/**
 * Evaluate a batch of transformations
 */
export async function evaluateBatch(
  batch: EvaluationBatch
): Promise<EvaluationReport> {
  // If no transformations, return empty report
  if (batch.transformations.length === 0) {
    return {
      batchId: batch.batchId,
      sessionId: batch.sessionId,
      evaluatedAt: new Date().toISOString(),
      transformationScores: [],
      batchSummary: {
        averageScore: 0,
        passed: true, // Empty batch passes by default
        totalTransformations: 0,
        failedTransformations: 0,
        notes: 'No transformations to evaluate',
      },
      originalBatch: batch,
    };
  }

  // Filter ONCE at the start to avoid duplicate random sampling
  const filteredTransformations = filterTransformationsBySampling(batch.transformations);
  const skippedCount = batch.transformations.length - filteredTransformations.length;

  if (skippedCount > 0) {
    console.log(`[Evaluate] Filtered ${skippedCount}/${batch.transformations.length} transformations (type-based sampling)`);
  }

  if (filteredTransformations.length === 0) {
    console.log(`[Evaluate] All ${batch.transformations.length} transformations filtered out (type-based sampling)`);
    return {
      batchId: batch.batchId,
      sessionId: batch.sessionId,
      evaluatedAt: new Date().toISOString(),
      transformationScores: [],
      batchSummary: {
        averageScore: 0,
        passed: true,
        totalTransformations: 0,
        failedTransformations: 0,
        notes: `All ${batch.transformations.length} transformations skipped (pre-generated or sampled out)`,
      },
      originalBatch: batch,
    };
  }

  const client = getAnthropicClient();
  const useCompact = USE_COMPACT_EVAL;

  const response = await client.messages.create({
    model: EVALUATION_MODEL,
    max_tokens: useCompact ? 1024 : 4096, // Smaller limit for compact
    system: useCompact ? '' : EVALUATION_SYSTEM_PROMPT, // Skip system prompt for compact
    messages: [
      {
        role: 'user',
        content: buildEvaluationPrompt(batch, filteredTransformations, useCompact),
      },
    ],
  });

  // Extract text from response
  const textContent = response.content.find((block) => block.type === 'text');
  const responseText = textContent?.type === 'text' ? textContent.text : '';

  // Parse the evaluation (pass compact flag for correct parsing)
  const { transformationScores, batchSummary } = parseEvaluationResponse(responseText, useCompact);

  // Log evaluation result
  console.log(
    `[Evaluate] Batch ${batch.batchId}: ${batchSummary.passed ? 'PASSED' : 'FAILED'} ` +
      `(avg: ${batchSummary.averageScore.toFixed(2)}, ${batchSummary.totalTransformations} transforms)`
  );

  // Create a clean version of the batch for storage (no raw behavior events)
  const cleanBatch: EvaluationBatch = {
    ...batch,
    behaviorSequence: undefined, // Remove raw events to save storage
  };

  return {
    batchId: batch.batchId,
    sessionId: batch.sessionId,
    evaluatedAt: new Date().toISOString(),
    transformationScores,
    batchSummary,
    originalBatch: cleanBatch,
  };
}

/**
 * Get score for a single transformation
 * (Now just returns adversarialEffectiveness since quality is handled by real-time gate)
 */
export function calculateTransformationAverage(score: TransformationScore): number {
  return score.adversarialEffectiveness;
}

/**
 * Check if Anthropic API is configured
 */
export function isEvaluationConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}
