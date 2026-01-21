/**
 * POST /api/transform
 *
 * Transform content using Claude Haiku.
 * Supports EXPAND and REWRITE (L1, L2, L3) transformations.
 *
 * Includes quality gate:
 * 1. Heuristics - fast deterministic checks
 * 2. LLM gate - coherence check (if enabled)
 */

import { NextRequest, NextResponse } from 'next/server';
import { transformContent, isAnthropicConfigured } from '@/lib/transform';
import {
  gateTransformation,
  isQualityGateEnabled,
  isLLMGateEnabled,
} from '@/lib/qualityGate';
import type { TransformRequest, TransformResponse } from '@/types/transformation';

export const runtime = 'nodejs';
export const maxDuration = 30; // 30 second timeout

interface RequestBody extends TransformRequest {
  idleDuration?: number;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Check if API is configured
  if (!isAnthropicConfigured()) {
    return NextResponse.json(
      { error: 'Anthropic API not configured' },
      { status: 503 }
    );
  }

  try {
    const body: RequestBody = await request.json();

    // Validate request
    if (!body.sessionId || !body.chunkId || !body.content || !body.type) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, chunkId, content, type' },
        { status: 400 }
      );
    }

    if (body.type !== 'expand' && body.type !== 'rewrite') {
      return NextResponse.json(
        { error: 'Invalid type. Must be "expand" or "rewrite"' },
        { status: 400 }
      );
    }

    if (body.type === 'rewrite' && body.level && ![1, 2, 3].includes(body.level)) {
      return NextResponse.json(
        { error: 'Invalid rewrite level. Must be 1, 2, or 3' },
        { status: 400 }
      );
    }

    // Don't transform very short content
    if (body.content.trim().length < 20) {
      return NextResponse.json(
        { error: 'Content too short to transform' },
        { status: 400 }
      );
    }

    // Perform transformation
    const result: TransformResponse = await transformContent({
      sessionId: body.sessionId,
      chunkId: body.chunkId,
      content: body.content,
      type: body.type,
      level: body.level,
      idleDuration: body.idleDuration,
    });

    // Run quality gate if enabled
    if (isQualityGateEnabled() && result.transformedContent) {
      const gateResult = await gateTransformation(
        {
          originalContent: body.content,
          transformedContent: result.transformedContent,
          type: body.type,
          level: body.level,
        },
        { skipLLMGate: !isLLMGateEnabled() }
      );

      if (!gateResult.passed) {
        // Gate failed - return original content with failure info
        console.warn(
          `[Transform] Gate FAILED (${gateResult.tier}): ${gateResult.reason} | ` +
            `chunk: ${body.chunkId} | gate latency: ${gateResult.latency}ms`
        );

        return NextResponse.json({
          transformedContent: body.content, // Fallback to original
          latency: result.latency + gateResult.latency,
          gateFailed: true,
          gateReason: gateResult.reason,
          gateTier: gateResult.tier,
        });
      }

      // Gate passed - include gate latency in total
      console.log(
        `[Transform] ${body.type}${body.level ? ` L${body.level}` : ''} | ` +
          `chunk: ${body.chunkId} | transform: ${result.latency}ms | gate: ${gateResult.latency}ms`
      );

      return NextResponse.json({
        ...result,
        latency: result.latency + gateResult.latency,
        gatePassed: true,
      });
    }

    // Quality gate disabled - return as-is
    console.log(
      `[Transform] ${body.type}${body.level ? ` L${body.level}` : ''} | ` +
        `chunk: ${body.chunkId} | latency: ${result.latency}ms (gate disabled)`
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Transform] Error:', error);

    // Handle specific error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Handle Anthropic API errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid API configuration' },
          { status: 503 }
        );
      }

      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error during transformation' },
      { status: 500 }
    );
  }
}
