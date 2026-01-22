/**
 * Transform library for adversarial content transformations
 *
 * Handles prompt construction and API calls to Claude for
 * EXPAND and REWRITE transformations.
 */

import Anthropic from '@anthropic-ai/sdk';
import type { TransformRequest, TransformResponse } from '@/types/transformation';

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
 * Model to use for transformations
 * Using Haiku for speed and cost efficiency
 */
const TRANSFORM_MODEL = 'claude-3-5-haiku-20241022';

/**
 * System prompts for each transformation type
 */
const SYSTEM_PROMPTS = {
  expand: `You are an adversarial content transformer for an experimental portfolio website. Your role is to expand content when the user is scrolling quickly, making it harder for them to skim.

IMPORTANT CONSTRAINTS:
- Maintain factual accuracy — do not invent false information
- Preserve the original author's voice and tone
- Keep the same structural format (paragraphs, lists, etc.)
- Preserve any HTML tags present in the content
- Return ONLY the expanded content, no explanations or meta-commentary`,

  rewrite: `You are an adversarial content transformer for an experimental portfolio website. Your role is to rewrite content when the user pauses to read, creating shifts in the text that affect their reading experience.

IMPORTANT CONSTRAINTS:
- Preserve any HTML tags present in the content
- Return ONLY the rewritten content, no explanations or meta-commentary`,
};

/**
 * User prompts for each transformation type and level
 */
function getExpandPrompt(content: string): string {
  return `The user is scrolling quickly through this content, trying to skim. Expand this content by 40-60% to make it harder to finish.

EXPANSION TECHNIQUES:
- Add elaborating sentences that expand on existing points
- Include tangential but related observations
- Add examples that weren't there before
- Insert qualifying statements and caveats
- Extend descriptions with more detail

ORIGINAL CONTENT:
${content}

Return only the expanded content. Preserve any HTML structure.`;
}

function getRewriteL1Prompt(content: string, duration: number): string {
  return `The user has been idle for ${duration}ms, reading this content carefully. Make subtle changes that will make them question their perception.

SUBTLE REWRITE TECHNIQUES:
- Swap words for close synonyms (big → large, show → display)
- Slightly rephrase sentences while keeping exact meaning
- Change word order minimally where grammatically equivalent
- Swap contractions (don't → do not, it's → it is)
- Change punctuation subtly (em-dash → comma, semicolon → period)

DO NOT:
- Change any facts or meaning
- Add or remove information
- Make changes obvious enough to be certain
- Alter technical terms or proper nouns

ORIGINAL CONTENT:
${content}

Return only the subtly rewritten content. The meaning must be identical.`;
}

function getRewriteL2Prompt(content: string, duration: number): string {
  return `The user has been idle for ${duration}ms. Make noticeable changes to this content. They should clearly see it's different but still understand it.

NOTICEABLE REWRITE TECHNIQUES:
- Restructure sentences significantly
- Change framing and emphasis
- Shift tone slightly (more formal, more casual, more direct)
- Reorder information within paragraphs
- Replace phrases with equivalent but different expressions
- Change passive to active voice or vice versa

PRESERVE:
- Core meaning and main points
- Factual accuracy
- Technical terms and proper nouns
- Overall comprehensibility

ORIGINAL CONTENT:
${content}

Return only the noticeably rewritten content. Core meaning must be preserved.`;
}

function getRewriteL3Prompt(content: string, duration: number): string {
  return `The user has been idle for ${duration}ms. Make this content difficult to read while PRESERVING the core meaning.

HOSTILE REWRITE TECHNIQUES:
- Use passive voice and nominalizations
- Add parenthetical asides that interrupt flow
- Use formal/archaic word choices (but real words, not invented)
- Create convoluted sentence structures
- Add qualifying clauses that obscure the point

CRITICAL CONSTRAINTS:
- MUST preserve the actual meaning and facts from the original
- MUST use real English words (no invented jargon)
- MUST be roughly the same length as original (not longer)
- The reader should be able to extract the original meaning with effort
- Do NOT generate abstract nonsense or word salad

ORIGINAL CONTENT:
${content}

Return only the hostile rewritten content. Keep it the same length.`;
}

/**
 * Build the appropriate prompt based on transformation type
 */
function buildPrompt(
  type: 'expand' | 'rewrite',
  content: string,
  level?: 1 | 2 | 3,
  idleDuration?: number
): { system: string; user: string } {
  if (type === 'expand') {
    return {
      system: SYSTEM_PROMPTS.expand,
      user: getExpandPrompt(content),
    };
  }

  // Rewrite prompts based on level
  const duration = idleDuration || 5000;

  switch (level) {
    case 1:
      return {
        system: SYSTEM_PROMPTS.rewrite,
        user: getRewriteL1Prompt(content, duration),
      };
    case 2:
      return {
        system: SYSTEM_PROMPTS.rewrite,
        user: getRewriteL2Prompt(content, duration),
      };
    case 3:
      return {
        system: SYSTEM_PROMPTS.rewrite,
        user: getRewriteL3Prompt(content, duration),
      };
    default:
      return {
        system: SYSTEM_PROMPTS.rewrite,
        user: getRewriteL1Prompt(content, duration),
      };
  }
}

/**
 * Transform content using Claude API
 */
export async function transformContent(
  request: TransformRequest & { idleDuration?: number }
): Promise<TransformResponse> {
  const startTime = Date.now();

  const { system, user } = buildPrompt(
    request.type,
    request.content,
    request.level,
    request.idleDuration
  );

  const client = getAnthropicClient();

  const response = await client.messages.create({
    model: TRANSFORM_MODEL,
    max_tokens: 2048,
    system,
    messages: [
      {
        role: 'user',
        content: user,
      },
    ],
  });

  const latency = Date.now() - startTime;

  // Extract text from response
  const textContent = response.content.find((block) => block.type === 'text');
  const transformedContent = textContent?.type === 'text' ? textContent.text : '';

  return {
    transformedContent: transformedContent.trim(),
    latency,
  };
}

/**
 * Check if Anthropic API is configured
 */
export function isAnthropicConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}
