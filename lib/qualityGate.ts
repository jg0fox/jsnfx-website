/**
 * Quality Gate for Adversarial Transformations
 *
 * Two-tier gate system:
 * 1. Heuristics (<10ms) - Fast deterministic checks
 * 2. LLM Gate (~300ms) - Coherence check via Haiku
 *
 * Handles "is this broken?" so batch eval can focus on "is this effective?"
 */

import Anthropic from '@anthropic-ai/sdk';

// Types
export interface GateResult {
  passed: boolean;
  tier: 'heuristics' | 'llm' | null;
  reason: string | null;
  latency: number;
}

export interface GateInput {
  originalContent: string;
  transformedContent: string;
  type: 'expand' | 'rewrite';
  level?: 1 | 2 | 3;
}

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

// ==========================================
// Tier 1: Heuristic Checks (<10ms)
// ==========================================

interface HeuristicResult {
  passed: boolean;
  reason: string | null;
}

/**
 * Check if HTML structure is valid (basic check)
 */
function checkHTMLStructure(content: string): HeuristicResult {
  // Check for unclosed tags (simple heuristic)
  const openTags = (content.match(/<[a-z][^>]*(?<!\/)\s*>/gi) || []).length;
  const closeTags = (content.match(/<\/[a-z][^>]*>/gi) || []).length;
  const selfClosing = (content.match(/<[a-z][^>]*\/\s*>/gi) || []).length;

  // Allow some tolerance for self-closing and void elements
  const diff = Math.abs(openTags - closeTags - selfClosing);
  if (diff > 3) {
    return { passed: false, reason: 'HTML structure appears malformed (unbalanced tags)' };
  }

  return { passed: true, reason: null };
}

/**
 * Check for excessive repetition (same phrase 3+ times)
 */
function checkRepetition(content: string): HeuristicResult {
  // Strip HTML and normalize whitespace
  const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();

  // Look for repeated phrases (4+ words)
  const words = text.split(' ');
  const phraseLength = 4;
  const phraseCounts = new Map<string, number>();

  for (let i = 0; i <= words.length - phraseLength; i++) {
    const phrase = words.slice(i, i + phraseLength).join(' ');
    phraseCounts.set(phrase, (phraseCounts.get(phrase) || 0) + 1);
  }

  for (const [phrase, count] of phraseCounts) {
    if (count >= 3) {
      return { passed: false, reason: `Excessive repetition detected: "${phrase}" appears ${count} times` };
    }
  }

  return { passed: true, reason: null };
}

/**
 * Check for empty or whitespace-only output
 */
function checkNotEmpty(content: string): HeuristicResult {
  const text = content.replace(/<[^>]*>/g, '').trim();

  if (text.length === 0) {
    return { passed: false, reason: 'Output is empty or whitespace-only' };
  }

  if (text.length < 10) {
    return { passed: false, reason: 'Output is suspiciously short' };
  }

  return { passed: true, reason: null };
}

/**
 * Check length ratio bounds
 */
function checkLengthRatio(original: string, transformed: string, type: 'expand' | 'rewrite'): HeuristicResult {
  const originalLength = original.replace(/<[^>]*>/g, '').trim().length;
  const transformedLength = transformed.replace(/<[^>]*>/g, '').trim().length;

  if (originalLength === 0) {
    return { passed: true, reason: null }; // Can't calculate ratio
  }

  const ratio = transformedLength / originalLength;

  if (type === 'expand') {
    // Expansion should be 1.2x-4.0x (giving some tolerance)
    if (ratio < 1.2) {
      return { passed: false, reason: `Expansion ratio too low: ${ratio.toFixed(2)}x (expected 1.2x-4.0x)` };
    }
    if (ratio > 4.0) {
      return { passed: false, reason: `Expansion ratio too high: ${ratio.toFixed(2)}x (expected 1.2x-4.0x)` };
    }
  } else {
    // Rewrite should stay close to original length: 0.5x-1.4x
    // Tighter bounds prevent hostile rewrites from bloating
    if (ratio < 0.5) {
      return { passed: false, reason: `Rewrite too short: ${ratio.toFixed(2)}x original (expected 0.5x-1.4x)` };
    }
    if (ratio > 1.4) {
      return { passed: false, reason: `Rewrite too long: ${ratio.toFixed(2)}x original (expected 0.5x-1.4x)` };
    }
  }

  return { passed: true, reason: null };
}

/**
 * Check for common AI malfunction patterns
 */
function checkAIMalfunctionPatterns(content: string): HeuristicResult {
  const text = content.toLowerCase();

  // Check for common AI artifacts
  const malfunctionPatterns = [
    /as an ai/i,
    /i cannot/i,
    /i'm sorry/i,
    /i apologize/i,
    /here's the/i,
    /here is the/i,
    /\[insert/i,
    /\[placeholder/i,
    /lorem ipsum/i,
    /certainly!/i,
    /absolutely!/i,
  ];

  for (const pattern of malfunctionPatterns) {
    if (pattern.test(text)) {
      return { passed: false, reason: `AI malfunction pattern detected: ${pattern.toString()}` };
    }
  }

  return { passed: true, reason: null };
}

/**
 * Run all heuristic checks
 */
export function runHeuristicGate(input: GateInput): HeuristicResult {
  const checks = [
    () => checkNotEmpty(input.transformedContent),
    () => checkHTMLStructure(input.transformedContent),
    () => checkRepetition(input.transformedContent),
    () => checkLengthRatio(input.originalContent, input.transformedContent, input.type),
    () => checkAIMalfunctionPatterns(input.transformedContent),
  ];

  for (const check of checks) {
    const result = check();
    if (!result.passed) {
      return result;
    }
  }

  return { passed: true, reason: null };
}

// ==========================================
// Tier 2: LLM Gate (~300ms)
// ==========================================

const LLM_GATE_MODEL = 'claude-3-5-haiku-20241022';

const LLM_GATE_PROMPT = `You are a quality gate for transformed content on a portfolio website.

The content was intentionally transformed as part of an adversarial UX experiment.
Your job is to check if the transformation maintains connection to the original meaning.

Respond with exactly one word: PASS or FAIL

FAIL if:
- The text is gibberish, word salad, or nonsensical jargon
- The transformed text has NO connection to the original meaning
- It uses invented/fake technical terms not in the original
- It reads like AI hallucination (random academic-sounding nonsense)
- The core facts/meaning from the original are completely lost

PASS if:
- The original meaning is still recoverable (even if obscured)
- The same facts/concepts from the original are present
- Grammar is functional
- It uses real English words

---

Original:
{original}

Transformed ({type}, level {level}):
{transformed}

Verdict:`;

/**
 * Run LLM-based coherence check
 */
export async function runLLMGate(input: GateInput): Promise<HeuristicResult> {
  try {
    const client = getAnthropicClient();

    // Truncate content to save tokens (first 800 chars each)
    const originalTruncated = input.originalContent.slice(0, 800);
    const transformedTruncated = input.transformedContent.slice(0, 800);

    const prompt = LLM_GATE_PROMPT
      .replace('{original}', originalTruncated)
      .replace('{type}', input.type.toUpperCase())
      .replace('{level}', input.level?.toString() || 'N/A')
      .replace('{transformed}', transformedTruncated);

    const response = await client.messages.create({
      model: LLM_GATE_MODEL,
      max_tokens: 10,
      messages: [{ role: 'user', content: prompt }],
    });

    const textContent = response.content.find((block) => block.type === 'text');
    const verdict = textContent?.type === 'text' ? textContent.text.trim().toUpperCase() : '';

    if (verdict === 'PASS') {
      return { passed: true, reason: null };
    } else if (verdict === 'FAIL') {
      return { passed: false, reason: 'LLM gate determined content is incoherent' };
    } else {
      // Unexpected response - fail safe
      console.warn('[QualityGate] Unexpected LLM response:', verdict);
      return { passed: false, reason: `Unexpected LLM gate response: ${verdict}` };
    }
  } catch (error) {
    // On error, fail open (allow content through) but log
    console.error('[QualityGate] LLM gate error:', error);
    return { passed: true, reason: null }; // Fail open
  }
}

// ==========================================
// Combined Gate
// ==========================================

/**
 * Run the full quality gate (heuristics, then LLM if enabled)
 */
export async function gateTransformation(
  input: GateInput,
  options: { skipLLMGate?: boolean } = {}
): Promise<GateResult> {
  const startTime = Date.now();

  // Tier 1: Heuristics
  const heuristicResult = runHeuristicGate(input);

  if (!heuristicResult.passed) {
    return {
      passed: false,
      tier: 'heuristics',
      reason: heuristicResult.reason,
      latency: Date.now() - startTime,
    };
  }

  // Tier 2: LLM Gate (if enabled)
  if (!options.skipLLMGate) {
    const llmResult = await runLLMGate(input);

    if (!llmResult.passed) {
      return {
        passed: false,
        tier: 'llm',
        reason: llmResult.reason,
        latency: Date.now() - startTime,
      };
    }
  }

  return {
    passed: true,
    tier: null,
    reason: null,
    latency: Date.now() - startTime,
  };
}

/**
 * Check if quality gate is enabled
 */
export function isQualityGateEnabled(): boolean {
  return process.env.ENABLE_QUALITY_GATE !== 'false';
}

/**
 * Check if LLM gate specifically is enabled
 * Default: ENABLED (set ENABLE_LLM_GATE=false to disable)
 */
export function isLLMGateEnabled(): boolean {
  return process.env.ENABLE_LLM_GATE !== 'false';
}
