/**
 * POST /api/evaluate
 *
 * Evaluate a batch of transformations using Claude Sonnet.
 * Stores the evaluation report in Redis.
 */

import { NextRequest, NextResponse } from 'next/server';
import { evaluateBatch, isEvaluationConfigured } from '@/lib/evaluate';
import { storeReport, isRedisConfigured } from '@/lib/redis';
import type { EvaluationBatch, EvaluateRequest } from '@/types/evaluation';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 second timeout for evaluation

/**
 * Extract visitor IP and location from request headers
 * Works with Vercel's built-in geo headers and standard forwarding headers
 */
function getVisitorInfoFromRequest(request: NextRequest): {
  ip: string;
  location: { city: string; region: string; country: string };
} {
  // Get IP address from headers (Vercel, Cloudflare, or standard proxy headers)
  const ip =
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';

  // Get geolocation from Vercel's built-in geo headers
  const city = request.headers.get('x-vercel-ip-city') || 'Unknown';
  const region = request.headers.get('x-vercel-ip-country-region') || 'Unknown';
  const country = request.headers.get('x-vercel-ip-country') || 'Unknown';

  return {
    ip,
    location: {
      city: decodeURIComponent(city), // Vercel URL-encodes city names
      region,
      country,
    },
  };
}

/**
 * Evaluation sampling rate (0.0 - 1.0)
 * Set EVAL_SAMPLE_RATE env var to override (e.g., "0.15" for 15%)
 * Default: 15% - provides statistical insight while cutting 85% of eval costs
 */
const EVAL_SAMPLE_RATE = parseFloat(process.env.EVAL_SAMPLE_RATE || '0.15');

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Check if evaluation is enabled (defaults to true if not set)
  const evaluationEnabled = process.env.ENABLE_EVALUATION !== 'false';

  if (!evaluationEnabled) {
    // Return success without actually evaluating (saves tokens)
    console.log('[Evaluate] Evaluation disabled via ENABLE_EVALUATION=false');
    return NextResponse.json({
      report: {
        batchId: 'disabled',
        sessionId: 'disabled',
        evaluatedAt: new Date().toISOString(),
        transformationScores: [],
        batchSummary: {
          averageScore: 0,
          passed: true,
          totalTransformations: 0,
          failedTransformations: 0,
          notes: 'Evaluation disabled via environment variable',
        },
        originalBatch: null,
      },
    });
  }

  // Sampling: Only evaluate a percentage of batches to reduce costs
  if (Math.random() > EVAL_SAMPLE_RATE) {
    console.log(`[Evaluate] Skipped (sampling at ${EVAL_SAMPLE_RATE * 100}% rate)`);
    return NextResponse.json({
      report: {
        batchId: 'sampled-skip',
        sessionId: 'sampled-skip',
        evaluatedAt: new Date().toISOString(),
        transformationScores: [],
        batchSummary: {
          averageScore: 0,
          passed: true,
          totalTransformations: 0,
          failedTransformations: 0,
          notes: `Skipped evaluation (sampling at ${EVAL_SAMPLE_RATE * 100}% rate)`,
        },
        originalBatch: null,
        sampled: false,
      },
    });
  }

  // Check if API is configured
  if (!isEvaluationConfigured()) {
    return NextResponse.json(
      { error: 'Anthropic API not configured' },
      { status: 503 }
    );
  }

  try {
    const body: EvaluateRequest = await request.json();

    // Validate request
    if (!body.batch) {
      return NextResponse.json(
        { error: 'Missing required field: batch' },
        { status: 400 }
      );
    }

    const batch: EvaluationBatch = body.batch;

    if (!batch.sessionId || !batch.batchId) {
      return NextResponse.json(
        { error: 'Batch must include sessionId and batchId' },
        { status: 400 }
      );
    }

    // Enrich batch with server-side visitor info (IP and geolocation)
    const serverVisitorInfo = getVisitorInfoFromRequest(request);
    batch.visitor = {
      ...batch.visitor,
      ip: serverVisitorInfo.ip,
      location: serverVisitorInfo.location,
    };

    // Perform evaluation
    const report = await evaluateBatch(batch);

    // Store report in Redis if configured
    if (isRedisConfigured()) {
      try {
        await storeReport(report.batchId, report);
        console.log(`[Evaluate] Report stored: ${report.batchId}`);
      } catch (redisError) {
        console.error('[Evaluate] Failed to store report in Redis:', redisError);
        // Continue anyway - evaluation succeeded even if storage failed
      }
    } else {
      console.log('[Evaluate] Redis not configured, report not stored');
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error('[Evaluate] Error:', error);

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
      { error: 'Internal server error during evaluation' },
      { status: 500 }
    );
  }
}
