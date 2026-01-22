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
 * Truncate content for evaluation to reduce token usage
 */
function truncateContent(content: string, maxLength: number = MAX_CONTENT_LENGTH): string {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength) + '... [truncated]';
}

/**
 * Prepare batch for evaluation by truncating content
 */
function prepareBatchForEvaluation(batch: EvaluationBatch): object {
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
    // Truncate transformation content
    transformations: batch.transformations.map(t => ({
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
 * Build the evaluation prompt
 */
function buildEvaluationPrompt(batch: EvaluationBatch): string {
  // Prepare batch with truncated content
  const preparedBatch = prepareBatchForEvaluation(batch);

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
 */
function parseEvaluationResponse(response: string): {
  transformationScores: TransformationScore[];
  batchSummary: BatchSummary;
} {
  // Try to extract JSON from the response
  let jsonStr = response.trim();

  // Handle markdown code blocks if present
  if (jsonStr.startsWith('```')) {
    const match = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      jsonStr = match[1].trim();
    }
  }

  try {
    const parsed = JSON.parse(jsonStr);
    return {
      transformationScores: parsed.transformationScores || [],
      batchSummary: parsed.batchSummary || {
        averageScore: 0,
        passed: false,
        totalTransformations: 0,
        failedTransformations: 0,
        notes: 'Failed to parse evaluation response',
      },
    };
  } catch (error) {
    console.error('[Evaluate] Failed to parse response:', error);
    console.error('[Evaluate] Raw response:', response);

    // Return a failure result
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
}

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

  const client = getAnthropicClient();

  const response = await client.messages.create({
    model: EVALUATION_MODEL,
    max_tokens: 4096,
    system: EVALUATION_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: buildEvaluationPrompt(batch),
      },
    ],
  });

  // Extract text from response
  const textContent = response.content.find((block) => block.type === 'text');
  const responseText = textContent?.type === 'text' ? textContent.text : '';

  // Parse the evaluation
  const { transformationScores, batchSummary } = parseEvaluationResponse(responseText);

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
